$apiUrl = "http://localhost:8080/api"

# 1. Upload Knowledge Document
function Upload-Doc {
    param ($FilePath, $UserId, $Roles)
    
    $uri = "$apiUrl/knowledge/upload"
    $form = @{
        file = Get-Item $FilePath
    }
    if ($Roles) {
        $form["roles"] = $Roles
    }
    
    # PowerShell Invoke-RestMethod with MultipartFormData is tricky in older versions.
    # Using curl for upload is often easier, but let's try to construct a simple test.
    # Since we are in a dev environment, I will use curl.exe if available or just skip complex multipart test in script if too hard.
    
    # Construct curl command
    $rolesArg = ""
    if ($Roles) {
        foreach ($r in $Roles) {
            $rolesArg += " -F roles=$r"
        }
    }
    
    $cmd = "curl.exe -X POST $uri -H ""X-User-Id: $UserId"" -F ""file=@$FilePath"" $rolesArg"
    Write-Host "Executing: $cmd"
    Invoke-Expression $cmd
}

# 2. Search Knowledge
function Search-Doc {
    param ($Query, $UserId)
    
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/knowledge/search?q=$Query" -Method Get -Headers @{"X-User-Id" = $UserId}
        if ($response.success) {
            Write-Host "User $UserId search '$Query' results: $($response.data.Count)"
            $response.data | ForEach-Object { Write-Host " - Found: $($_.title)" }
        } else {
            Write-Host "Search failed: $($response.message)"
        }
    } catch {
        Write-Host "Search error: $_"
    }
}

# 3. Upload Data
function Upload-Data {
    param ($FilePath, $UserId)
    
    $uri = "$apiUrl/data/upload"
    $cmd = "curl.exe -X POST $uri -H ""X-User-Id: $UserId"" -F ""file=@$FilePath"""
    Write-Host "Executing Data Upload: $cmd"
    Invoke-Expression $cmd
}

# 4. Analyze Data
function Analyze-Data {
    param ($Query, $UserId)
    
    $body = @{ query = $Query } | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/ai/analyze-data" -Method Post -Body $body -ContentType "application/json" -Headers @{"X-User-Id" = $UserId}
        if ($response.success) {
            Write-Host "User $UserId analyze '$Query':"
            Write-Host " - SQL: $($response.data.sql)"
            Write-Host " - Answer: $($response.data.response)"
        } else {
            Write-Host "Analyze failed: $($response.message)"
        }
    } catch {
        Write-Host "Analyze error: $_"
    }
}

# Create dummy files
"Confidential Admin Doc content about secrets." | Out-File "admin_doc.txt" -Encoding utf8
"Public Business Doc content about sales." | Out-File "business_doc.txt" -Encoding utf8
"id,name,amount`n1,Deal A,1000`n2,Deal B,2000" | Out-File "user2_data.csv" -Encoding utf8

Write-Host "=== Testing Knowledge Base Access ==="
# User 1 (Admin) uploads admin doc, restricted to ADMIN
Upload-Doc "admin_doc.txt" 1 @("ADMIN")

# User 1 (Admin) uploads business doc, restricted to BUSINESS
Upload-Doc "business_doc.txt" 1 @("BUSINESS")

# Search
Write-Host "`n-- User 1 (ADMIN) searching 'content' --"
Search-Doc "content" 1

Write-Host "`n-- User 2 (ANALYST) searching 'content' --"
Search-Doc "content" 2

Write-Host "`n-- User 3 (BUSINESS) searching 'content' --"
Search-Doc "content" 3

Write-Host "`n=== Testing Data Access ==="
# User 2 uploads data
Upload-Data "user2_data.csv" 2

# User 2 analyzes
Write-Host "`n-- User 2 analyzing 'sum amount' --"
Analyze-Data "Calculate total amount" 2

# User 3 analyzes (should fail or return empty/error if table not found)
Write-Host "`n-- User 3 analyzing 'sum amount' --"
Analyze-Data "Calculate total amount" 3
