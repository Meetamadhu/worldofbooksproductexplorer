# World of Books Scraper Test Script
# Usage: .\test-scraper.ps1

$ApiUrl = "http://localhost:4001/api"

Write-Host "`n🌐 World of Books Scraper Test" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Function to trigger scrape
function Start-Scrape {
    param(
        [string]$TargetUrl,
        [string]$TargetType
    )
    
    Write-Host "🚀 Triggering $TargetType scrape for: $TargetUrl" -ForegroundColor Yellow
    
    $body = @{
        targetUrl = $TargetUrl
        targetType = $TargetType
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/scraper/trigger" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body
        
        Write-Host "✅ Scrape job created: $($response.id)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

# Function to check job status
function Get-JobStatus {
    param([string]$JobId)
    
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/scraper/job/$JobId"
        return $response
    }
    catch {
        Write-Host "❌ Error checking status: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

# Function to wait for job completion
function Wait-JobCompletion {
    param(
        [string]$JobId,
        [int]$MaxWaitSeconds = 120
    )
    
    $startTime = Get-Date
    $pollInterval = 2
    
    while (((Get-Date) - $startTime).TotalSeconds -lt $MaxWaitSeconds) {
        $status = Get-JobStatus -JobId $JobId
        Write-Host "⏳ Job $JobId status: $($status.status)" -ForegroundColor Yellow
        
        if ($status.status -eq "completed") {
            Write-Host "✅ Scraping completed successfully!" -ForegroundColor Green
            return $status
        }
        elseif ($status.status -eq "failed") {
            Write-Host "❌ Scraping failed: $($status.errorLog)" -ForegroundColor Red
            throw "Scraping failed: $($status.errorLog)"
        }
        
        Start-Sleep -Seconds $pollInterval
    }
    
    throw "Scraping timed out after $MaxWaitSeconds seconds"
}

# Main test
try {
    # Test 1: Scrape navigation
    Write-Host "`n📋 Test 1: Scraping Navigation..." -ForegroundColor Cyan
    $navJob = Start-Scrape -TargetUrl "https://www.worldofbooks.com" -TargetType "navigation"
    Wait-JobCompletion -JobId $navJob.id
    
    # Test 2: Get all jobs
    Write-Host "`n📊 Fetching all scrape jobs..." -ForegroundColor Cyan
    $allJobs = Invoke-RestMethod -Uri "$ApiUrl/scraper/jobs"
    Write-Host "Total jobs: $($allJobs.Count)" -ForegroundColor Green
    
    Write-Host "`nRecent jobs:" -ForegroundColor Cyan
    $allJobs | Select-Object -First 5 | ForEach-Object {
        $date = [DateTime]::Parse($_.createdAt).ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "  - $($_.targetType): $($_.status) ($date)" -ForegroundColor White
    }
    
    # Test 3: Check products
    Write-Host "`n📚 Checking scraped products..." -ForegroundColor Cyan
    $products = Invoke-RestMethod -Uri "$ApiUrl/products?limit=5"
    Write-Host "Found $($products.Count) products" -ForegroundColor Green
    
    if ($products.Count -gt 0) {
        Write-Host "`nSample products:" -ForegroundColor Cyan
        $products | ForEach-Object {
            Write-Host "  - $($_.title) by $($_.author) - £$($_.price)" -ForegroundColor White
        }
    }
    
    Write-Host "`n✨ All tests completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "`n❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
