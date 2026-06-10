import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/message_model.dart';
import '../providers/auth_provider.dart';
import '../providers/message_provider.dart';
import '../providers/user_provider.dart';
import '../theme/app_theme.dart';
import 'chat_screen.dart';
import 'package:timeago/timeago.dart' as timeago;

class InboxScreen extends ConsumerWidget {
  const InboxScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final roomsAsync = ref.watch(chatRoomsProvider);
    final currentUid = ref.read(currentUserProvider)?.uid ?? '';

    return Scaffold(
      appBar: AppBar(title: const Text('訊息')),
      body: roomsAsync.when(
        data: (rooms) => rooms.isEmpty
            ? const Center(
                child: Text('還沒有任何訊息',
                    style:
                        TextStyle(color: AppTheme.textSecondary)))
            : ListView.builder(
                itemCount: rooms.length,
                itemBuilder: (ctx, i) => _ChatRoomTile(
                  room: rooms[i],
                  currentUid: currentUid,
                ),
              ),
        loading: () =>
            const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.cloud_off,
                    color: AppTheme.textSecondary, size: 40),
                const SizedBox(height: 12),
                Text(
                  e.toString().contains('failed-precondition')
                      ? 'Firestore 索引建立中，請稍後幾分鐘再試'
                      : '載入失敗：$e',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                      color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ChatRoomTile extends ConsumerWidget {
  final ChatRoom room;
  final String currentUid;
  const _ChatRoomTile(
      {required this.room, required this.currentUid});

  Future<void> _doDelete(
      BuildContext context, WidgetRef ref) async {
    // Show loading dialog while deleting
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const AlertDialog(
        backgroundColor: AppTheme.surface,
        content: Padding(
          padding: EdgeInsets.symmetric(vertical: 8),
          child: Row(
            children: [
              CircularProgressIndicator(),
              SizedBox(width: 16),
              Text('刪除中...'),
            ],
          ),
        ),
      ),
    );

    try {
      await ref
          .read(messageRepositoryProvider)
          .deleteConversation(room.id, currentUid);
      if (context.mounted) Navigator.of(context).pop(); // close loading
    } catch (e) {
      if (context.mounted) {
        Navigator.of(context).pop(); // close loading
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('刪除失敗：$e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _confirmDelete(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('刪除對話'),
        content: const Text('確定要刪除此對話紀錄嗎？此動作無法復原。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消',
                style:
                    TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white),
            onPressed: () {
              Navigator.pop(ctx); // close confirm dialog
              _doDelete(context, ref);
            },
            child: const Text('刪除'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final partnerId = room.participants.firstWhere(
        (id) => id != currentUid,
        orElse: () => '');
    final partnerAsync = ref.watch(userDataProvider(partnerId));
    final unread = room.unreadCount[currentUid] ?? 0;

    return partnerAsync.when(
      data: (partner) {
        if (partner == null) return const SizedBox.shrink();
        return ListTile(
          contentPadding: const EdgeInsets.symmetric(
              horizontal: 16, vertical: 4),
          leading: CircleAvatar(
            radius: 24,
            backgroundImage: partner.photoUrl.isNotEmpty
                ? NetworkImage(partner.photoUrl)
                : null,
            backgroundColor: Colors.grey[800],
            child: partner.photoUrl.isEmpty
                ? Text(partner.displayName.isNotEmpty
                    ? partner.displayName[0].toUpperCase()
                    : '?')
                : null,
          ),
          title: Text(partner.displayName,
              style: TextStyle(
                  fontWeight: unread > 0
                      ? FontWeight.bold
                      : FontWeight.normal)),
          subtitle: Text(
            room.lastMessage,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                color: unread > 0
                    ? AppTheme.textPrimary
                    : AppTheme.textSecondary),
          ),
          trailing: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                timeago.format(room.lastMessageTime,
                    locale: 'zh'),
                style: TextStyle(
                    fontSize: 12,
                    color: unread > 0
                        ? AppTheme.accent
                        : AppTheme.textSecondary),
              ),
              if (unread > 0) ...[
                const SizedBox(height: 4),
                Container(
                  width: 20,
                  height: 20,
                  decoration: const BoxDecoration(
                      color: AppTheme.accent,
                      shape: BoxShape.circle),
                  child: Center(
                    child: Text('$unread',
                        style: const TextStyle(
                            fontSize: 11,
                            color: Colors.white,
                            fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ],
          ),
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ChatScreen(
                  chatId: room.id, partner: partner),
            ),
          ),
          onLongPress: () => _confirmDelete(context, ref),
        );
      },
      loading: () => const SizedBox(height: 72),
      error: (_, _) => const SizedBox.shrink(),
    );
  }
}
