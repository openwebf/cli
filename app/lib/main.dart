import 'dart:io';

import 'package:flutter/material.dart';
import 'package:webf/devtools.dart';
import 'package:webf_websocket/webf_websocket.dart';
import 'package:webf/webf.dart';

const String BUNDLE_URL = 'WEBF_BUNDLE_URL';
const String BUNDLE_PATH = 'WEBF_BUNDLE_PATH';
const String REMOTE_DEBUGGER_PROXY = 'WEBF_REMOTE_DEBUGGER_PROXY';

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

  WebFBundle? _bundle;

  void _constructBundle() {
    String? bundleUrl = getBundleURLFromEnv();
    print('bundleUrl is $bundleUrl');
    if (bundleUrl != null) {
      _bundle = WebFBundle.fromUrl(bundleUrl);
    }
    String? bundlePath = getBundlePathFromEnv();
    print('bundlePath is $bundlePath');
    if (bundlePath != null) {
      _bundle = WebFBundle.fromUrl('file://$bundlePath');
    }

    if (_bundle == null) {
      print('Can not get bundle!');
      // exit(1);
    }
  }

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    DevToolsService devToolsService;
    if (Platform.environment.containsKey(REMOTE_DEBUGGER_PROXY)) {
      devToolsService =
          RemoteDevServerService(Platform.environment[REMOTE_DEBUGGER_PROXY]!);
      print('connect to remote debugger proxy: ${Platform.environment[REMOTE_DEBUGGER_PROXY]!}');
    } else {
      devToolsService = ChromeDevToolsService();
    }

    return MaterialApp(
        title: 'WebF Browser',
        home: WebF(
            devToolsService: devToolsService,
            bundle: _bundle,
            background: Color(0xFFFFFFFF)));
  }
}

void main() {
  WebFWebSocket.initialize();
  runApp(MyApp());
}
