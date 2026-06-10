import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class HashtagHelper {
  // 從內文抽取所有 hashtag
  static List<String> extractHashtags(String text) {
    final regex = RegExp(r'#(\w+)', unicode: true);
    return regex.allMatches(text).map((m) => m.group(1)!).toList();
  }

  // 把內文變成可點擊的 hashtag RichText
  static TextSpan buildHashtagText(
    String text, {
    required TextStyle baseStyle,
    required TextStyle hashtagStyle,
    required void Function(String tag) onTapHashtag,
  }) {
    final regex = RegExp(r'#(\w+)', unicode: true);
    final spans = <TextSpan>[];
    int lastEnd = 0;

    for (final match in regex.allMatches(text)) {
      if (match.start > lastEnd) {
        spans.add(TextSpan(
          text: text.substring(lastEnd, match.start),
          style: baseStyle,
        ));
      }
      final tag = match.group(1)!;
      spans.add(TextSpan(
        text: match.group(0),
        style: hashtagStyle,
        recognizer: TapGestureRecognizer()..onTap = () => onTapHashtag(tag),
      ));
      lastEnd = match.end;
    }

    if (lastEnd < text.length) {
      spans.add(TextSpan(
        text: text.substring(lastEnd),
        style: baseStyle,
      ));
    }

    return TextSpan(children: spans);
  }
}
