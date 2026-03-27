# Batch add YouTube videos to dataset
# Cleaned list of unique video IDs

$videoIds = @(
    "pTFZFxd4hOI", "XvFmUE-36Kc", "o-ym035R1eY", "e_EmVia6A-k", "msBFQ1K5tWg",
    "dowm_hbEc94", "ZndmducAG98", "Iv6tz2AqjBI", "sZDu14KkpjE", "SidErDxyWWA",
    "wl2qP3kb9hE", "YA_OSShMUuo"
)

$baseUrl = "http://localhost:5000/dataset/collect/video"
$successCount = 0
$failCount = 0
$duplicateCount = 0

Write-Host "Starting batch video collection..." -ForegroundColor Cyan
Write-Host "Total videos to process: $($videoIds.Count)" -ForegroundColor Cyan
Write-Host ""

foreach ($videoId in $videoIds) {
    try {
        Write-Host "Processing: $videoId..." -NoNewline
        $response = Invoke-WebRequest -Uri "$baseUrl/$videoId" -Method POST -UseBasicParsing
        $result = $response.Content | ConvertFrom-Json
        
        if ($result.message -like "*already exists*") {
            Write-Host " DUPLICATE" -ForegroundColor Yellow
            $duplicateCount++
        } else {
            Write-Host " SUCCESS" -ForegroundColor Green
            $successCount++
        }
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Start-Sleep -Milliseconds 500  # Small delay to avoid rate limiting
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Successfully added: $successCount" -ForegroundColor Green
Write-Host "Duplicates skipped: $duplicateCount" -ForegroundColor Yellow
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Total processed: $($videoIds.Count)" -ForegroundColor Cyan
