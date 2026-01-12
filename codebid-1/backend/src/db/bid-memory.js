// In-memory bid storage

const bids = [];
let nextBidId = 1;

export class BidMemory {
    static async create(eventId, teamId, amount) {
        const bid = {
            id: nextBidId++,
            event_id: eventId,
            team_id: teamId,
            amount,
            created_at: new Date()
        };
        bids.push(bid);
        return bid;
    }

    static async getByEvent(eventId) {
        return bids
            .filter(b => b.event_id === eventId)
            .sort((a, b) => b.created_at - a.created_at);
    }

    static async getHighestBid(eventId) {
        const eventBids = bids.filter(b => b.event_id === eventId);
        if (eventBids.length === 0) return null;
        return eventBids.reduce((max, bid) => bid.amount > max.amount ? bid : max);
    }
}
