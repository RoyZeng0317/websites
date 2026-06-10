import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../models/message_model.dart';
import '../models/user_model.dart';
import '../providers/auth_provider.dart';
import '../providers/message_provider.dart';
import '../services/storage_service.dart';

class ChatScreen extends ConsumerStatefulWidget {
  final String chatId;
  final UserModel partner;

  const ChatScreen({super.key, required this.chatId, required this.partner});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _textController = TextEditingController();
  final _scrollController = ScrollController();
  bool _uploading = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final uid = ref.read(currentUserProvider)?.uid ?? '';
      if (uid.isEmpty) return;
      final repo = ref.read(messageRepositoryProvider);
      repo.markAsRead(widget.chatId, uid);
      repo.cleanupOldMessages(widget.chatId);
    });
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendText() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;
    final uid = ref.read(currentUserProvider)?.uid ?? '';
    _textController.clear();
    await ref.read(messageRepositoryProvider).sendMessage(
      currentUid: uid,
      targetUid: widget.partner.uid,
      content: text,
    );
  }

  Future<void> _pickAndSendImage() async {
    final file = await ref.read(storageServiceProvider).pickImage();
    if (file == null) return;
    setState(() => _uploading = true);
    try {
      final uid = ref.read(currentUserProvider)?.uid ?? '';
      final url =
          await ref.read(storageServiceProvider).uploadChatImage(uid, file);
      await ref.read(messageRepositoryProvider).sendMessage(
        currentUid: uid,
        targetUid: widget.partner.uid,
        content: '',
        imageUrl: url,
      );
    } catch (e) {
      _showSnack('圖片上傳失敗：$e');
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
  }

  void _showBurnTimerPicker(ChatRoom? room) {
    final current = room?.burnMode ?? 0;
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Text('訊息焚燒時間',
                  style: Theme.of(context).textTheme.titleMedium),
            ),
            _burnOption(
                0, current, '關閉焚燒', Icons.do_not_disturb_outlined, Colors.grey),
            _burnOption(1, current, '對方退出後', Icons.logout, Colors.orange),
            _burnOption(60, current, '1 分鐘後', Icons.timer_outlined, Colors.orange),
            _burnOption(
                180, current, '3 分鐘後', Icons.timer_outlined, Colors.deepOrange),
            _burnOption(300, current, '5 分鐘後', Icons.timer_outlined, Colors.red),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Widget _burnOption(
      int value, int current, String label, IconData icon, Color color) {
    final selected = current == value;
    return ListTile(
      leading: Icon(icon, color: selected ? color : Colors.grey),
      title: Text(
        label,
        style: TextStyle(
          color: selected ? color : null,
          fontWeight: selected ? FontWeight.bold : null,
        ),
      ),
      trailing: selected ? Icon(Icons.check, color: color) : null,
      onTap: () async {
        Navigator.pop(context);
        await ref
            .read(messageRepositoryProvider)
            .setBurnMode(widget.chatId, value);
      },
    );
  }

  void _showMessageOptions(MessageModel msg) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 8),
            if (msg.imageUrl == null)
              ListTile(
                leading: const Icon(Icons.edit_outlined),
                title: const Text('編輯訊息'),
                onTap: () {
                  Navigator.pop(context);
                  _showEditDialog(msg);
                },
              ),
            ListTile(
              leading: const Icon(Icons.undo, color: Colors.red),
              title: const Text('收回訊息', style: TextStyle(color: Colors.red)),
              onTap: () {
                Navigator.pop(context);
                _confirmRecall(msg);
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Future<void> _showEditDialog(MessageModel msg) async {
    final controller = TextEditingController(text: msg.content);
    final result = await showDialog<String>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('編輯訊息'),
        content: TextField(
          controller: controller,
          maxLines: null,
          autofocus: true,
          decoration: const InputDecoration(border: OutlineInputBorder()),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context), child: const Text('取消')),
          FilledButton(
            onPressed: () => Navigator.pop(context, controller.text.trim()),
            style: FilledButton.styleFrom(backgroundColor: Colors.orange),
            child: const Text('儲存'),
          ),
        ],
      ),
    );
    if (result != null && result.isNotEmpty && result != msg.content) {
      await ref
          .read(messageRepositoryProvider)
          .editMessage(widget.chatId, msg.id, result);
    }
  }

  Future<void> _confirmRecall(MessageModel msg) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('收回訊息'),
        content: const Text('收回後雙方都將看不到此訊息內容。'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('取消')),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('收回'),
          ),
        ],
      ),
    );
    if (confirmed == true) {
      await ref
          .read(messageRepositoryProvider)
          .recallMessage(widget.chatId, msg.id);
    }
  }

  void _showSnack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  String _burnModeLabel(int mode) {
    switch (mode) {
      case 1:
        return '對方退出後';
      case 60:
        return '1 分鐘後';
      case 180:
        return '3 分鐘後';
      case 300:
        return '5 分鐘後';
      default:
        return '';
    }
  }

  Widget _buildMessage(MessageModel msg, String currentUid) {
    final isMe = msg.senderId == currentUid;

    if (msg.isRecalled) {
      return Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 2, horizontal: 8),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            isMe ? '您收回了一則訊息' : '對方收回了一則訊息',
            style: const TextStyle(
              fontStyle: FontStyle.italic,
              color: Colors.grey,
              fontSize: 13,
            ),
          ),
        ),
      );
    }

    return GestureDetector(
      onLongPress: isMe ? () => _showMessageOptions(msg) : null,
      child: Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: EdgeInsets.only(
            top: 2,
            bottom: 2,
            left: isMe ? 64 : 8,
            right: isMe ? 8 : 64,
          ),
          padding: msg.imageUrl != null
              ? EdgeInsets.zero
              : const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: isMe ? Colors.orange : Colors.grey.shade200,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (msg.imageUrl != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    msg.imageUrl!,
                    width: 200,
                    fit: BoxFit.cover,
                    loadingBuilder: (_, child, progress) => progress == null
                        ? child
                        : SizedBox(
                            width: 200,
                            height: 150,
                            child: Center(
                              child: CircularProgressIndicator(
                                value: progress.expectedTotalBytes != null
                                    ? progress.cumulativeBytesLoaded /
                                        progress.expectedTotalBytes!
                                    : null,
                              ),
                            ),
                          ),
                  ),
                )
              else
                Text(
                  msg.content,
                  style:
                      TextStyle(color: isMe ? Colors.white : Colors.black87),
                ),
              if (msg.isEdited)
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Text(
                    '已編輯',
                    style: TextStyle(
                      fontSize: 10,
                      color: isMe ? Colors.white70 : Colors.grey,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ),
              Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Text(
                  DateFormat('HH:mm').format(msg.createdAt),
                  style: TextStyle(
                    fontSize: 10,
                    color: isMe ? Colors.white70 : Colors.grey,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final messagesAsync = ref.watch(chatMessagesProvider(widget.chatId));
    final roomAsync = ref.watch(chatRoomProvider(widget.chatId));
    final currentUid = ref.read(currentUserProvider)?.uid ?? '';
    final room = roomAsync.valueOrNull;
    final burnMode = room?.burnMode ?? 0;
    final hasBurn = burnMode != 0;

    messagesAsync.whenData((_) => _scrollToBottom());

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundImage: widget.partner.photoUrl.isNotEmpty
                  ? NetworkImage(widget.partner.photoUrl)
                  : null,
              backgroundColor: Colors.grey[700],
              child: widget.partner.photoUrl.isEmpty
                  ? Text(
                      widget.partner.displayName.isNotEmpty
                          ? widget.partner.displayName[0].toUpperCase()
                          : '?',
                      style: const TextStyle(fontSize: 14),
                    )
                  : null,
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.partner.displayName,
                    style: const TextStyle(fontSize: 16)),
                const Text('私訊',
                    style:
                        TextStyle(fontSize: 11, color: Colors.white70)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              Icons.local_fire_department,
              color: hasBurn ? Colors.orange : null,
            ),
            tooltip: '訊息焚燒',
            onPressed: () => _showBurnTimerPicker(room),
          ),
        ],
      ),
      body: Column(
        children: [
          if (hasBurn)
            Container(
              width: double.infinity,
              color: Colors.orange.shade50,
              padding:
                  const EdgeInsets.symmetric(vertical: 5, horizontal: 16),
              child: Row(
                children: [
                  Icon(Icons.local_fire_department,
                      size: 14, color: Colors.orange.shade700),
                  const SizedBox(width: 8),
                  Text(
                    '焚燒模式 — ${_burnModeLabel(burnMode)}自動銷毀',
                    style: TextStyle(
                        fontSize: 12, color: Colors.orange.shade800),
                  ),
                ],
              ),
            ),
          if (_uploading)
            LinearProgressIndicator(
                color: Colors.orange,
                backgroundColor: Colors.orange.shade50),
          Expanded(
            child: messagesAsync.when(
              data: (messages) => messages.isEmpty
                  ? const Center(
                      child: Text(
                        '尚無訊息',
                        style: TextStyle(color: Colors.grey),
                      ),
                    )
                  : ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 8),
                      itemCount: messages.length,
                      itemBuilder: (_, i) =>
                          _buildMessage(messages[i], currentUid),
                    ),
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('載入失敗：$e')),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              boxShadow: [
                BoxShadow(
                  offset: const Offset(0, -1),
                  blurRadius: 4,
                  color: Colors.black.withValues(alpha: 0.08),
                ),
              ],
            ),
            padding: EdgeInsets.only(
              left: 8,
              right: 8,
              top: 8,
              bottom: MediaQuery.of(context).padding.bottom + 8,
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.image_outlined, size: 22),
                  color: Colors.grey,
                  onPressed: _uploading ? null : _pickAndSendImage,
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: InputDecoration(
                      hintText: '輸入訊息...',
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 12),
                    ),
                    onSubmitted: (_) => _sendText(),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: Colors.orange,
                  child: IconButton(
                    icon:
                        const Icon(Icons.send, color: Colors.white, size: 20),
                    onPressed: _sendText,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
