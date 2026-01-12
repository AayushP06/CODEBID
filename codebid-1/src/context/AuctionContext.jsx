import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { api } from "../api";
import { createSocket } from "../socket";

// --- STATE SHAPE (keeps your existing view usage) ---
const initialState = {
  appStatus: "WAITING", // WAITING, READY, AUCTION, COMPLETED, CODING, FINISHED
  user: null,           // { id, name, wallet, score, purchasedProblems }
  auction: {
    currentProblem: null,
    highestBid: 0,
    highestTeamId: null,
    highestBidderName: null,
    timeLeft: null,     // endsIn seconds from backend
  },
  messages: [],
};

// --- ACTIONS ---
const ACTIONS = {
  HYDRATE_EVENT: "HYDRATE_EVENT",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  ADD_MESSAGE: "ADD_MESSAGE",
  UPDATE_WALLET: "UPDATE_WALLET",
};

// --- REDUCER ---
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.HYDRATE_EVENT: {
      const s = action.payload; // backend /event/state response
      return {
        ...state,
        appStatus: s.state ?? state.appStatus,
        auction: {
          ...state.auction,
          currentProblem: s.currentProblem ?? null,
          highestBid: typeof s.highestBid === "number" ? s.highestBid : state.auction.highestBid,
          highestTeamId: s.highestTeamId ?? state.auction.highestTeamId,
          highestBidderName: s.highestBidderName ?? state.auction.highestBidderName,
          timeLeft: typeof s.endsIn === "number" ? s.endsIn : state.auction.timeLeft,
        },
      };
    }

    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          wallet: action.payload.coins,
          score: action.payload.score ?? 0,
          purchasedProblems: action.payload.purchasedProblems ?? [],
        },
      };

    case ACTIONS.UPDATE_WALLET:
      return state.user
        ? { ...state, user: { ...state.user, wallet: action.payload } }
        : state;

    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, { id: Date.now(), ...action.payload }],
      };

    case ACTIONS.LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
}

// --- CONTEXT ---
const AuctionContext = createContext(null);

export function AuctionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const socketRef = useRef(null);

  async function loadEventState() {
    const s = await api("/event/state");
    dispatch({ type: ACTIONS.HYDRATE_EVENT, payload: s });
    return s;
  }

  function connectSocket() {
    // already connected
    if (socketRef.current) return socketRef.current;

    const s = createSocket();
    socketRef.current = s;

    s.on("connect", () => {
      s.emit("JOIN_AUCTION");
      // refresh after reconnect so UI is always correct
      loadEventState().catch(() => { });
    });

    // Live highest bid updates for everyone
    s.on("BID_UPDATED", (data) => {
      dispatch({
        type: ACTIONS.HYDRATE_EVENT,
        payload: {
          state: "AUCTION",
          highestBid: data.amount,
          highestTeamId: data.teamId,
          highestBidderName: data.teamName,
          currentProblem: data.problem ?? state.auction.currentProblem,
          endsIn: data.endsIn, // optional if backend sends
        },
      });

      // Add message to activity log
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: {
          text: `💰 ${data.teamName} bid ${data.amount} coins`,
          type: "info",
          timestamp: data.timestamp
        },
      });
    });

    // Backend can broadcast full state when problem changes
    s.on("PROBLEM_STARTED", (payload) => {
      dispatch({ type: ACTIONS.HYDRATE_EVENT, payload });
    });

    s.on("STATE_CHANGED", (payload) => {
      dispatch({ type: ACTIONS.HYDRATE_EVENT, payload });
    });

    s.on("AUCTION_ENDED", (payload) => {
      // winner announcement message (optional)
      if (payload?.winnerTeamName) {
        dispatch({
          type: ACTIONS.ADD_MESSAGE,
          payload: { text: `Problem won by ${payload.winnerTeamName} for ${payload.amount} coins`, type: "success" },
        });
      }
      // refresh state after auction ends
      loadEventState().catch(() => { });
    });

    s.on("disconnect", () => {
      // keep UI as-is; it will rehydrate on reconnect
    });

    return s;
  }

  // Auto-restore session on refresh if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        // get team info
        const me = await api("/auth/me");
        dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: me.team });

        // connect socket + load event state
        connectSocket();
        await loadEventState();
      } catch {
        localStorage.removeItem("token");
      }
    })();

    // cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- API exposed to your views ---

  async function login(teamName) {
    try {
      console.log("Starting login process for:", teamName);
      console.log("API Base URL:", import.meta.env.VITE_API_BASE || "http://localhost:4000");

      // backend creates/returns team + token
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ name: teamName }),
      });

      console.log("Login API response:", data);
      localStorage.setItem("token", data.token);

      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: data.team });

      // now that token exists, connect socket & fetch state
      connectSocket();
      await loadEventState();

      console.log("Login process completed successfully");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    dispatch({ type: ACTIONS.LOGOUT });
  }

  function placeBid(amount) {
    const s = socketRef.current || connectSocket();
    const problemId = state.auction.currentProblem?.id;

    if (!problemId) return;

    s.emit("PLACE_BID", { problemId, amount: Number(amount) }, (resp) => {
      if (!resp?.ok) {
        dispatch({ type: ACTIONS.ADD_MESSAGE, payload: { text: resp?.error || "Bid failed", type: "alert" } });
      }
    });
  }

  // Admin endpoints (only if you implement them in backend)
  async function adminStartAuction(timerSeconds = 60) {
    await api("/admin/start-auction", {
      method: "POST",
      body: JSON.stringify({ timer: timerSeconds })
    });
    await loadEventState();
  }

  async function adminStartCoding() {
    await api("/admin/start-coding", { method: "POST" });
    await loadEventState();
  }

  const value = useMemo(
    () => ({
      state,
      login,
      logout,
      placeBid,
      adminStartAuction,
      adminStartCoding,
      loadEventState,
    }),
    [state]
  );

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
}

export function useAuction() {
  const ctx = useContext(AuctionContext);
  if (!ctx) throw new Error("useAuction must be used within AuctionProvider");
  return ctx;
}
