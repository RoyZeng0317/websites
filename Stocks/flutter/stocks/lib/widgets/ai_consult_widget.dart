import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

final _apiService = ApiService();

class Message {
  final String role;
  final String content;
  Message({required this.role, required this.content});
}

const _quickActions = [
  '這檔股票目前評價合理嗎？',
  '近期有什麼值得注意的風險？',
  '產業前景如何？',
  '財務狀況是否穩健？',
];

class AiConsultWidget extends ConsumerStatefulWidget {
  final String symbol;
  const AiConsultWidget({super.key, required this.symbol});

  @override
  ConsumerState<AiConsultWidget> createState() => _AiConsultWidgetState();
}

class _AiConsultWidgetState extends ConsumerState<AiConsultWidget> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  final _messages = <Message>[];
  bool _loading = false;
  bool _showQuick = true;

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _ask(String question) async {
    if (question.trim().isEmpty || _loading) return;
    setState(() {
      _messages.add(Message(role: 'user', content: question));
      _loading = true;
      _showQuick = false;
    });
    _controller.clear();
    _scrollToBottom();

    try {
      final answer = await _apiService.consultAi(widget.symbol, question);
      setState(() {
        _messages.add(Message(role: 'assistant', content: answer));
      });
    } catch (e) {
      setState(() {
        _messages.add(Message(
            role: 'assistant', content: '查詢失敗，請稍後再試。'));
      });
    } finally {
      setState(() => _loading = false);
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 標題
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: const [
                Icon(Icons.smart_toy_outlined,
                    color: AppTheme.primary, size: 20),
                SizedBox(width: 8),
                Text(
                  'AI 智能諮詢',
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          const Divider(color: AppTheme.border, height: 1),

          // 訊息區
          SizedBox(
            height: 300,
            child: _messages.isEmpty
                ? _buildEmpty()
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length + (_loading ? 1 : 0),
                    itemBuilder: (context, i) {
                      if (i == _messages.length) {
                        return _buildTyping();
                      }
                      return _buildMessage(_messages[i]);
                    },
                  ),
          ),

          // 快速提問
          if (_showQuick && _messages.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _quickActions
                    .map((q) => GestureDetector(
                          onTap: () => _ask(q),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceVariant,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppTheme.border),
                            ),
                            child: Text(
                              q,
                              style: const TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 12),
                            ),
                          ),
                        ))
                    .toList(),
              ),
            ),

          if (!_showQuick && _messages.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(left: 16, bottom: 8),
              child: GestureDetector(
                onTap: () => setState(() => _showQuick = true),
                child: const Text(
                  '＋ 顯示快速提問',
                  style: TextStyle(color: AppTheme.primary, fontSize: 12),
                ),
              ),
            ),

          // 輸入列
          Container(
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: AppTheme.border)),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    style: const TextStyle(
                        color: AppTheme.textPrimary, fontSize: 14),
                    decoration: const InputDecoration(
                      hintText: '輸入問題...',
                      hintStyle: TextStyle(color: AppTheme.textMuted),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(
                          horizontal: 12, vertical: 10),
                    ),
                    onSubmitted: _ask,
                    enabled: !_loading,
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: _loading
                      ? null
                      : () => _ask(_controller.text),
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: _loading
                          ? AppTheme.surfaceVariant
                          : AppTheme.primary.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      Icons.send,
                      size: 18,
                      color:
                          _loading ? AppTheme.textMuted : AppTheme.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmpty() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.smart_toy_outlined,
              size: 40, color: AppTheme.textMuted),
          SizedBox(height: 12),
          Text(
            '想問什麼？輸入問題或點擊快速提問',
            style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildTyping() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.surfaceVariant,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AppTheme.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage(Message msg) {
    final isUser = msg.role == 'user';
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isUser
                    ? AppTheme.primary.withOpacity(0.2)
                    : AppTheme.surfaceVariant,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 16),
                ),
              ),
              child: Text(
                msg.content,
                style: TextStyle(
                  color: isUser
                      ? AppTheme.primaryLight
                      : AppTheme.textSecondary,
                  fontSize: 13,
                  height: 1.6,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}