$ROOT = Get-Location

function Clean {
    Remove-Item -Recurse -Force -ErrorAction Ignore "$ROOT/build/windows/"
}

function Build_Release {
    Set-Location "$ROOT/app"
    flutter clean
    flutter build windows --release
    Set-Location "$ROOT/app/build/windows/Runner/Release"
    Compress-Archive -Path "./app.app" -DestinationPath "./app.tar.gz" -Force
    Move-Item -Path "$ROOT/app/build/windows/Runner/Release/app.tar.gz" -Destination "$ROOT/platforms/cli-windows/app.tar.gz" -Force
}

Clean
Build_Release