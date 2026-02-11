$uploadUrl = "http://localhost:8080/api/data/upload"

function Upload-Csv {
    param (
        [string]$FilePath,
        [string]$TableName
    )

    $file = Get-Item $FilePath
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"

    $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $fileEnc = [System.Text.Encoding]::GetEncoding('UTF-8')
    $fileContent = $fileEnc.GetString($fileBytes)

    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$($file.Name)`"",
        "Content-Type: text/csv",
        "",
        $fileContent,
        "--$boundary",
        "Content-Disposition: form-data; name=`"tableName`"",
        "",
        $TableName,
        "--$boundary--"
    ) -join $LF

    try {
        Invoke-RestMethod -Uri $uploadUrl -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines
        Write-Host "Successfully uploaded $TableName"
    } catch {
        Write-Error "Failed to upload $TableName : $_"
    }
}

Upload-Csv -FilePath "test_data\deposit_accounts.csv" -TableName "deposit_accounts"
Upload-Csv -FilePath "test_data\loan_contracts.csv" -TableName "loan_contracts"
Upload-Csv -FilePath "test_data\customer_info.csv" -TableName "customer_info"
