import 'dart:io';

import 'package:flutter/material.dart';
import 'package:kraken/devtools.dart';
import 'package:kraken_websocket/kraken_websocket.dart';
import 'package:kraken_video_player/kraken_video_player.dart';
import 'package:kraken_webview/kraken_webview.dart';
import 'package:kraken/kraken.dart';

const String BUNDLE_URL = 'KRAKEN_BUNDLE_URL';
const String BUNDLE_PATH = 'KRAKEN_BUNDLE_PATH';

String? getBundleURLFromEnv() {
  return Platform.environment[BUNDLE_URL];
}

String? getBundlePathFromEnv() {
  return Platform.environment[BUNDLE_PATH];
}

class MyApp extends StatelessWidget {
  MyApp() {
    _constructBundle();
  }

  KrakenBundle? _bundle;

  void _constructBundle() {
    String? bundleUrl = getBundleURLFromEnv();
    print('bundleUrl is $bundleUrl');
    if (bundleUrl != null) {
      _bundle = KrakenBundle.fromUrl(bundleUrl);
    }
    String? bundlePath = getBundlePathFromEnv();
    print('bundlePath is $bundlePath');
    if (bundlePath != null) {
      _bundle = KrakenBundle.fromUrl('file://$bundlePath');
    }

    if (_bundle == null) {
      print('Can not get bundle!');
      exit(1);
    }
  }

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kraken Browser',
      home: Kraken(
        devToolsService: ChromeDevToolsService(),
        bundle: _bundle,
        background: Color(0xFFFFFFFF)));
  }
}

void main() {
  KrakenWebView.initialize();
  KrakenWebsocket.initialize();
  KrakenVideoPlayer.initialize();
  runApp(MyApp());
}
