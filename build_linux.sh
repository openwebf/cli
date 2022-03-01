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
    mv $ROOT/app/build/linux/x64/release/bundle $ROOT/build/linux/release
  else
    echo "Only x86_64 support from now on, maybe someone can add more archs."
    exit 1
  fi
}

build_debug() {
  cd $ROOT/app
  flutter clean
  flutter build linux --debug
  ARCH=$(arch)
  if [[ "$ARCH" == "x86_64" ]]; then
    mkdir -p $ROOT/build/linux/debug/
    mv $ROOT/app/build/linux/x64/debug/bundle $ROOT/build/linux/debug
  else
    echo "Only x86_64 support from now on, maybe someone can add more archs."
    exit 1
  fi
}

clean
build_debug
build_release

