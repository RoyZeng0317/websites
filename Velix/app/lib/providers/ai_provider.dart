import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;

class AiMessage {
  final String role; // 'user' or 'assistant'
  final String content;
  AiMessage({required this.role, required this.content});

  Map<String, dynamic> toMap() => {'role': role, 'content': content};
}

class AiChatNotifier extends StateNotifier<List<AiMessage>> {
  AiChatNotifier() : super([]);

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  Future<void> sendMessage(String userMessage) async {
    if (userMessage.trim().isEmpty) return;

    state = [...state, AiMessage(role: 'user', content: userMessage)];
    _isLoading = true;

    try {
      final apiKey = dotenv.env['CLAUDE_API_KEY'] ?? '';
      final response = await http.post(
        Uri.parse('https://api.anthropic.com/v1/messages'),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: jsonEncode({
          'model': 'claude-haiku-4-5-20251001',
          'max_tokens': 1024,
          'system': '你是 Velix 平台的 AI 助手，用繁體中文回答，簡潔友善。',
          'messages': state.map((m) => m.toMap()).toList(),
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final reply = data['content'][0]['text'] as String;
        state = [...state, AiMessage(role: 'assistant', content: reply)];
      } else {
        state = [
          ...state,
          AiMessage(role: 'assistant', content: '發生錯誤，請稍後再試。')
        ];
      }
    } catch (e) {
      state = [
        ...state,
        AiMessage(role: 'assistant', content: '連線失敗：$e')
      ];
    } finally {
      _isLoading = false;
    }
  }

  void clearChat() => state = [];
}

final aiChatProvider =
    StateNotifierProvider<AiChatNotifier, List<AiMessage>>(
        (_) => AiChatNotifier());
