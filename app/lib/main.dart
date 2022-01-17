import 'package:flutter/material.dart';
import 'package:kraken_websocket/kraken_websocket.dart';
import 'package:kraken_video_player/kraken_video_player.dart';
import 'package:kraken_webview/kraken_webview.dart';
import 'package:kraken/kraken.dart';

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Kraken Browser',
        // theme: ThemeData.dark(),
        home: Kraken());
  }
}

void main() {
  KrakenWebView.initialize();
  KrakenWebsocket.initialize();
  KrakenVideoPlayer.initialize();
  runApp(MyApp());
}
