ROOT=$(pwd)

clean() {
    rm -rf $ROOT/build/darwin/debug/
    rm -rf $ROOT/build/darwin/release/
}

build_release() {
    cd $ROOT/app
    flutter clean
    flutter build macos --release
    cd $ROOT/app/build/macos/Build/Products/Release
    tar -zcvf ./app.tar.gz ./app.app
    mv $ROOT/app/build/macos/Build/Products/Release/app.tar.gz $ROOT/platforms/cli-macos/app.tar.gz
}

clean
build_release

