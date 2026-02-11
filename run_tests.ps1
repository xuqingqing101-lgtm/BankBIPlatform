$apiUrl = "http://localhost:8080/api/ai/analyze-data"

function Test-Query {
    param (
        [string]$Query,
        [string]$ExpectedKeyword,
        [string]$Type
    )

    $body = @{
        query = $Query
    } | ConvertTo-Json -Compress

    Write-Host "Sending [$Type]: $Query"

    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -ContentType "application/json; charset=utf-8" -Body $body -ErrorAction Stop
        
        $jsonSql = $null
        if ($response.data.sql) {
            $jsonSql = $response.data.sql
        }
        
        $respText = $response.data.response
        if (-not $respText) {
             $respText = $response.message
        }

        $passed = $false
        if ($response.success -and ($respText -match $ExpectedKeyword)) {
            $passed = $true
        }
        
        if ($passed) {
            Write-Host "PASS [$Type]: $Query" -ForegroundColor Green
        } else {
            Write-Host "FAIL [$Type]: $Query" -ForegroundColor Red
            Write-Host "   Response: $respText"
            Write-Host "   SQL: $jsonSql"
        }
    } catch {
        Write-Host "ERR  [$Type]: $Query" -ForegroundColor Red
        Write-Host "   Error: $_"
        # Print inner exception if available
        if ($_.Exception.Response) {
             $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
             $errBody = $reader.ReadToEnd()
             Write-Host "   Server Error Body: $errBody"
        }
    }
}

Write-Host "Starting AI Accuracy Tests..."
Write-Host "-----------------------------"

# 1. Basic Query
Test-Query -Query "Calculate total balance of all deposit accounts" -ExpectedKeyword "6.8|680" -Type "Basic"

# 2. Group By
Test-Query -Query "Calculate deposit balance group by branch" -ExpectedKeyword "Beijing|Shanghai|Guangdong|Zhejiang" -Type "Intermediate"

# 3. Filter
Test-Query -Query "Find loan contracts with amount greater than 5000000 and risk level Normal" -ExpectedKeyword "L001|L015" -Type "Advanced"

# 4. BETWEEN
Test-Query -Query "Find deposit accounts opened between 2023-01-01 and 2023-06-30" -ExpectedKeyword "D001" -Type "Advanced"

# 5. IN
Test-Query -Query "Find deposit accounts in Beijing Branch and Shanghai Branch" -ExpectedKeyword "Beijing|Shanghai" -Type "Advanced"

Write-Host "-----------------------------"
