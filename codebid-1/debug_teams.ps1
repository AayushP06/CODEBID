$baseUrl = "http://localhost:4000"

# 1. Login as Admin
echo "Logging in as Admin..."
$adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{name="admin"} | ConvertTo-Json) -ContentType "application/json"
$adminToken = $adminLoginResponse.token
echo "Admin Token: $adminToken"

# 2. Fetch Teams (Initial State)
echo "Fetching Teams (Initial)..."
try {
    $teams = Invoke-RestMethod -Uri "$baseUrl/admin/teams" -Method Get -Headers @{Authorization="Bearer $adminToken"}
    echo "Teams found: $($teams.Count)"
    echo $teams
} catch {
    echo "Error fetching teams: $_"
}

# 3. Register a Dummy Team
echo "Registering Dummy Team..."
$dummyTeam = @{
    teamName = "TestTeam1"
    fullName = "Test User"
    registrationNumber = "REG123"
    branch = "CSE"
    email = "test@example.com"
    phone = "1234567890"
    yearOfStudy = "3"
}
try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body ($dummyTeam | ConvertTo-Json) -ContentType "application/json"
    echo "Registered Team: $($regResponse.team.name)"
} catch {
    echo "Error registering team: $_"
}

# 4. Fetch Teams Again
echo "Fetching Teams (After Registration)..."
try {
    $teams2 = Invoke-RestMethod -Uri "$baseUrl/admin/teams" -Method Get -Headers @{Authorization="Bearer $adminToken"}
    $nonAdminTeams = $teams2 | Where-Object { -not $_.is_admin }
    echo "Non-Admin Teams found: $($nonAdminTeams.Count)"
    echo $teams2
} catch {
    echo "Error fetching teams 2: $_"
}
