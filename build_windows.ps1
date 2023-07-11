$ROOT = Get-Location

function Clean {
    Remove-Item -Recurse -Force -ErrorAction Ignore "$ROOT/app/build/windows/"
}

function Build_Release {
    Set-Location "$ROOT/app"
    flutter clean
    flutter build windows --release
    Set-Location "$ROOT/app/build/windows/runner/Release"
    Compress-Archive -Path "./" -DestinationPath "./app.zip" -Force
    Move-Item -Path "$ROOT/app/build/windows/Runner/Release/app.zip" -Destination "$ROOT/platforms/cli-windows/app.zip" -Force
}

Clean
Build_Release