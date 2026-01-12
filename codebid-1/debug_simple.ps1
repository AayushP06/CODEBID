$baseUrl = "http://localhost:4000"

# Login Admin
$adminTok = (Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{name="admin"} | ConvertTo-Json) -ContentType "application/json").token

# Register Team
try {
    Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body (@{teamName="DebugTeam"; fullName="Debug"; registrationNumber="DBG001"; branch="CS"; email="d@d.com"; phone="000"; yearOfStudy="1"} | ConvertTo-Json) -ContentType "application/json" | Out-Null
} catch {
    # Ignore if already exists
}

# Fetch
$teams = Invoke-RestMethod -Uri "$baseUrl/admin/teams" -Method Get -Headers @{Authorization="Bearer $adminTok"}
$count = ($teams | Where-Object { -not $_.is_admin }).Count

Write-Host "NON_ADMIN_COUNT: $count"
