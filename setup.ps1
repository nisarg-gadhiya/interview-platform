# Quick Setup and Test Runner for AI Interview Agent (Windows/PowerShell)

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        AI INTERVIEW AGENT - SETUP & TEST RUNNER            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to show messages
function Show-Status {
    param([string]$message, [string]$status = "info")
    
    switch ($status) {
        "success" { Write-Host "✓ $message" -ForegroundColor Green }
        "error" { Write-Host "❌ $message" -ForegroundColor Red }
        "warning" { Write-Host "⚠️  $message" -ForegroundColor Yellow }
        "info" { Write-Host "ℹ️  $message" -ForegroundColor Cyan }
        default { Write-Host $message }
    }
}

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Show-Status "Node.js is not installed" "error"
    Write-Host "Please install from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Show-Status "Node.js installed" "success"

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Show-Status "npm is not installed" "error"
    exit 1
}
Show-Status "npm installed" "success"

Write-Host ""

# Navigate to server directory
$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Set-Location "$scriptPath\server"
Show-Status "Working directory: $(Get-Location)" "info"
Write-Host ""

# Install dependencies
Show-Status "Installing dependencies..." "warning"
npm install | Out-Null
if ($LASTEXITCODE -eq 0) {
    Show-Status "Dependencies installed" "success"
} else {
    Show-Status "Failed to install dependencies" "error"
    exit 1
}
Write-Host ""

# Check environment
Show-Status "Checking environment..." "warning"

if (-not (Test-Path ".env")) {
    Show-Status ".env file not found" "error"
    Write-Host "Please create .env file with:" -ForegroundColor Yellow
    Write-Host "  PORT=8000" -ForegroundColor Yellow
    Write-Host "  MONGODB_URL=<your-mongodb-url>" -ForegroundColor Yellow
    Write-Host "  JWT_SECRET=<your-secret>" -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content .env
if ($envContent -match "MONGODB_URL") {
    Show-Status "MONGODB_URL configured" "success"
} else {
    Show-Status "MONGODB_URL not configured in .env" "error"
    exit 1
}

if ($envContent -match "JWT_SECRET") {
    Show-Status "JWT_SECRET configured" "success"
} else {
    Show-Status "JWT_SECRET not configured in .env" "error"
    exit 1
}
Write-Host ""

# Menu
Write-Host "What would you like to do?" -ForegroundColor Cyan
Write-Host "1) Run local tests (quick validation)" -ForegroundColor White
Write-Host "2) Start server in development mode" -ForegroundColor White
Write-Host "3) Check system status" -ForegroundColor White
Write-Host "4) Test entire flow (local → server → integration)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter your choice (1-4)"

Write-Host ""

switch ($choice) {
    "1" {
        Show-Status "Running local tests..." "warning"
        Write-Host ""
        node tests/runTests.js
    }
    "2" {
        Show-Status "Starting server in development mode..." "warning"
        Write-Host ""
        Show-Status "Server will run at http://localhost:8000" "info"
        Show-Status "Frontend connects to http://localhost:5173" "info"
        Write-Host ""
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }
    "3" {
        Show-Status "Starting server and checking status..." "warning"
        $serverProcess = Start-Process -FilePath "node" -ArgumentList "index.js" -PassThru -NoNewWindow -RedirectStandardOutput $null -RedirectStandardError $null
        Start-Sleep -Seconds 2
        
        Write-Host ""
        Show-Status "Fetching system status..." "info"
        Write-Host ""
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8000/api/coding/debug/status" -Method GET
            $json = $response.Content | ConvertFrom-Json
            Write-Host "System Status:" -ForegroundColor Green
            Write-Host "  Total Problems: $($json.totalProblems)" -ForegroundColor White
            Write-Host "  Easy: $($json.difficulties.easy)" -ForegroundColor White
            Write-Host "  Medium: $($json.difficulties.medium)" -ForegroundColor White
            Write-Host "  Hard: $($json.difficulties.hard)" -ForegroundColor White
            Write-Host "  Ongoing Sessions: $($json.ongoingSessions)" -ForegroundColor White
        }
        catch {
            Show-Status "Could not reach server. Is it running?" "error"
        }
        
        Stop-Process -Id $serverProcess.Id -ErrorAction SilentlyContinue
    }
    "4" {
        Show-Status "Running complete test flow..." "warning"
        
        # Run local tests
        Write-Host ""
        Show-Status "Step 1: Running local tests..." "info"
        Write-Host ""
        node tests/runTests.js
        
        if ($LASTEXITCODE -ne 0) {
            Show-Status "Local tests failed. Aborting." "error"
            exit 1
        }
        
        # Start server
        Write-Host ""
        Show-Status "Step 2: Starting server..." "info"
        $serverProcess = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru -NoNewWindow -WorkingDirectory "." -RedirectStandardOutput "server.log" -RedirectStandardError "server.log"
        Start-Sleep -Seconds 3
        
        # Run integration tests
        Write-Host ""
        Show-Status "Step 3: Running integration tests..." "info"
        Write-Host ""
        
        try {
            # Since bash isn't available on all Windows, run curl commands directly
            $timestamp = Get-Date -Format "yyyyMMddHHmmss"
            $testEmail = "testuser$timestamp@example.com"
            $testName = "Test User $timestamp"
            
            # Test 1: Authentication
            Write-Host "Test 1: Google Authentication" -ForegroundColor Yellow
            $authBody = @{
                name = $testName
                email = $testEmail
            } | ConvertTo-Json
            
            $authResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/auth/google" -Method POST -ContentType "application/json" -Body $authBody
            $authData = $authResponse.Content | ConvertFrom-Json
            $token = $authData.token
            
            if ($token) {
                Show-Status "User authenticated" "success"
            } else {
                Show-Status "Authentication failed" "error"
            }
            
            # Test 2: Check status
            Write-Host ""
            Write-Host "Test 2: System Status" -ForegroundColor Yellow
            $statusResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/coding/debug/status" -Method GET
            $statusData = $statusResponse.Content | ConvertFrom-Json
            Show-Status "System ready - $($statusData.totalProblems) problems found" "success"
            
            # Test 3: Start session
            Write-Host ""
            Write-Host "Test 3: Start Coding Session" -ForegroundColor Yellow
            $headers = @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            }
            $sessionResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/coding/session/start" -Method POST -ContentType "application/json" -Headers $headers -Body "{}"
            $sessionData = $sessionResponse.Content | ConvertFrom-Json
            
            if ($sessionData.sessionId) {
                Show-Status "Session started - $($sessionData.problems.Count) problems" "success"
            }
            
            Write-Host ""
            Show-Status "Integration tests completed!" "success"
        }
        catch {
            Show-Status "Integration test failed: $_" "error"
        }
        finally {
            # Stop server
            Stop-Process -Id $serverProcess.Id -ErrorAction SilentlyContinue -Force
            Write-Host ""
            Show-Status "Server stopped" "info"
        }
    }
    default {
        Show-Status "Invalid choice" "error"
        exit 1
    }
}

Write-Host ""
Show-Status "Done!" "success"
