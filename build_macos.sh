ROOT=$(pwd)

clean() {
    rm -rf $ROOT/build/darwin/debug/
    rm -rf $ROOT/build/darwin/release/
}

build_release() {
    cd $ROOT/app
    flutter clean
    flutter build macos --release
    mkdir -p $ROOT/build/darwin/release/app.app
    mv $ROOT/app/build/macos/Build/Products/Release/app.app $ROOT/build/darwin/release
}

build_debug() {
    cd $ROOT/app
    flutter clean
    flutter build macos --debug
    mkdir -p $ROOT/build/darwin/debug/app.app
    mv $ROOT/app/build/macos/Build/Products/Debug/app.app $ROOT/build/darwin/debug
}

clean
build_debug
build_release

