import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../models/notification_model.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';
import '../providers/user_provider.dart';
import '../theme/app_theme.dart';
import 'user_profile_screen.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifsAsync = ref.watch(notificationsProvider);
    final currentUid =
        ref.read(currentUserProvider)?.uid ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('通知'),
        actions: [
          TextButton(
            onPressed: () => ref
                .read(postRepositoryProvider)
                .markAllNotificationsRead(currentUid),
            child: const Text('全部已讀',
                style: TextStyle(
                    color: AppTheme.accent, fontSize: 13)),
          ),
        ],
      ),
      body: notifsAsync.when(
        data: (notifs) => notifs.isEmpty
            ? const Center(
                child: Text('尚無通知',
                    style:
                        TextStyle(color: AppTheme.textSecondary)))
            : ListView.separated(
                itemCount: notifs.length,
                separatorBuilder: (_, i) =>
                    const Divider(color: AppTheme.divider, height: 1),
                itemBuilder: (ctx, i) => _NotifTile(
                  notif: notifs[i],
                  currentUid: currentUid,
                ),
              ),
        loading: () =>
            const Center(child: CircularProgressIndicator()),
        error: (e, _) =>
            Center(child: Text('載入失敗：$e')),
      ),
    );
  }
}

class _NotifTile extends ConsumerWidget {
  final NotificationModel notif;
  final String currentUid;
  const _NotifTile(
      {required this.notif, required this.currentUid});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isRequest =
        notif.type == NotificationType.followRequest;
    final bg = notif.isRead ? null : AppTheme.surface;

    return InkWell(
      onTap: () async {
        // 標記已讀
        if (!notif.isRead) {
          ref
              .read(postRepositoryProvider)
              .markNotificationRead(currentUid, notif.id);
        }
        // 抓取對方完整資料後導航
        final user = await ref
            .read(userDataProvider(notif.fromUserId).future);
        if (user != null && context.mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (_) => UserProfileScreen(user: user)),
          );
        }
      },
      child: Container(
      color: bg,
      child: Padding(
        padding: const EdgeInsets.symmetric(
            horizontal: 16, vertical: 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 頭像
            Stack(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundImage: notif.fromUserPhoto.isNotEmpty
                      ? NetworkImage(notif.fromUserPhoto)
                      : null,
                  backgroundColor: Colors.grey[800],
                  child: notif.fromUserPhoto.isEmpty
                      ? Text(
                          notif.fromUserName.isNotEmpty
                              ? notif.fromUserName[0]
                                  .toUpperCase()
                              : '?',
                        )
                      : null,
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      color: _iconColor(notif.type),
                      shape: BoxShape.circle,
                      border: Border.all(
                          color: AppTheme.bg, width: 1.5),
                    ),
                    child: Icon(_iconData(notif.type),
                        size: 10, color: Colors.white),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 12),

            // 內容
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  RichText(
                    text: TextSpan(
                      style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 14,
                          height: 1.4),
                      children: [
                        TextSpan(
                          text: notif.fromUserName,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold),
                        ),
                        TextSpan(text: ' ${_text(notif.type)}'),
                        if (notif.postContent.isNotEmpty)
                          TextSpan(
                            text:
                                '：「${notif.postContent.length > 30 ? '${notif.postContent.substring(0, 30)}…' : notif.postContent}」',
                            style: const TextStyle(
                                color: AppTheme.textSecondary),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    timeago.format(notif.createdAt, locale: 'zh'),
                    style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.textSecondary),
                  ),

                  // 追蹤請求 approve/reject
                  if (isRequest) ...[
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () async {
                              await ref
                                  .read(postRepositoryProvider)
                                  .approveFollowRequest(
                                      currentUid,
                                      notif.fromUserId);
                              await ref
                                  .read(postRepositoryProvider)
                                  .markNotificationRead(
                                      currentUid, notif.id);
                            },
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                  vertical: 6),
                              textStyle:
                                  const TextStyle(fontSize: 13),
                            ),
                            child: const Text('接受'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () async {
                              await ref
                                  .read(postRepositoryProvider)
                                  .rejectFollowRequest(
                                      currentUid,
                                      notif.fromUserId);
                              await ref
                                  .read(postRepositoryProvider)
                                  .markNotificationRead(
                                      currentUid, notif.id);
                            },
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                  vertical: 6),
                              side: const BorderSide(
                                  color: AppTheme.divider),
                              foregroundColor: AppTheme.textPrimary,
                              textStyle:
                                  const TextStyle(fontSize: 13),
                            ),
                            child: const Text('拒絕'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),

            // 未讀圓點
            if (!notif.isRead)
              Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.only(top: 4),
                decoration: const BoxDecoration(
                    color: AppTheme.accent, shape: BoxShape.circle),
              ),
          ],
        ),
      ),
      ),
    );
  }

  String _text(NotificationType type) {
    switch (type) {
      case NotificationType.like:
        return '對你的貼文按讚';
      case NotificationType.comment:
        return '留言了你的貼文';
      case NotificationType.follow:
        return '開始追蹤你';
      case NotificationType.followRequest:
        return '送出了追蹤請求';
    }
  }

  IconData _iconData(NotificationType type) {
    switch (type) {
      case NotificationType.like:
        return Icons.favorite;
      case NotificationType.comment:
        return Icons.chat_bubble;
      case NotificationType.follow:
        return Icons.person_add;
      case NotificationType.followRequest:
        return Icons.person_add_outlined;
    }
  }

  Color _iconColor(NotificationType type) {
    switch (type) {
      case NotificationType.like:
        return Colors.red;
      case NotificationType.comment:
        return Colors.blue;
      case NotificationType.follow:
        return AppTheme.accent;
      case NotificationType.followRequest:
        return Colors.orange;
    }
  }
}
