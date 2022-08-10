#!/bin/bash

ROOT=$(pwd)

clean() {
  rm -rf $ROOT/build/linux
  rm -rf build
}

build_release() {
  cd $ROOT/app
  flutter clean
  flutter build linux --release
  ARCH=$(arch)
  if [[ "$ARCH" == "x86_64" ]]; then
    mkdir -p $ROOT/build/linux/release/
    mv $ROOT/app/build/linux/x64/release/bundle $ROOT/platforms/cli-linux/app
  else
    echo "Only x86_64 support from now on, maybe someone can add more archs."
    exit 1
  fi
}

clean
build_release

