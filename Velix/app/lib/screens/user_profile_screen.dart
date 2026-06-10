import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/user_model.dart';
import '../post_card.dart';
import '../providers/auth_provider.dart';
import '../providers/message_provider.dart';
import '../providers/post_provider.dart';
import '../providers/user_provider.dart';
import '../theme/app_theme.dart';
import 'chat_screen.dart';
import 'follow_list_screen.dart';

class UserProfileScreen extends ConsumerWidget {
  final UserModel user;
  const UserProfileScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUid = ref.read(currentUserProvider)?.uid ?? '';

    // 如果是自己，顯示提示
    if (user.uid == currentUid) {
      return Scaffold(
        appBar: AppBar(title: const Text('個人主頁')),
        body: const Center(
          child: Text('這是您自己的個人主頁',
              style: TextStyle(color: AppTheme.textSecondary)),
        ),
      );
    }

    final isFollowingAsync = ref.watch(isFollowingProvider(user.uid));
    final isPendingAsync =
        ref.watch(isFollowRequestPendingProvider(user.uid));
    final isFollowing = isFollowingAsync.valueOrNull ?? false;
    final isPending = isPendingAsync.valueOrNull ?? false;
    final currentUserData =
        ref.watch(currentUserDataProvider).valueOrNull;

    // 是否能看到貼文：公開帳戶 or 已追蹤私密帳戶
    final canViewPosts = !user.isPrivate || isFollowing;

    return Scaffold(
      appBar: AppBar(
        title: Text('@${user.username}'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // ── 個人資料頭部 ──
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundImage: user.photoUrl.isNotEmpty
                          ? NetworkImage(user.photoUrl)
                          : null,
                      backgroundColor: Colors.grey[800],
                      child: user.photoUrl.isEmpty
                          ? Text(
                              user.displayName.isNotEmpty
                                  ? user.displayName[0].toUpperCase()
                                  : '?',
                              style: const TextStyle(fontSize: 24))
                          : null,
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _Stat(label: '貼文', count: user.postsCount),
                          _Stat(
                            label: '粉絲',
                            count: user.followersCount,
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => FollowListScreen(
                                  uid: user.uid,
                                  type: FollowListType.followers,
                                ),
                              ),
                            ),
                          ),
                          _Stat(
                            label: '追蹤中',
                            count: user.followingCount,
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => FollowListScreen(
                                  uid: user.uid,
                                  type: FollowListType.following,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(user.displayName,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16)),
                      if (user.bio.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(user.bio,
                            style: const TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 13)),
                      ],
                      if (user.isPrivate) ...[
                        const SizedBox(height: 4),
                        Row(
                          children: const [
                            Icon(Icons.lock_outline,
                                size: 12,
                                color: AppTheme.textSecondary),
                            SizedBox(width: 4),
                            Text('私密帳戶',
                                style: TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.textSecondary)),
                          ],
                        ),
                      ],
                      if (user.socialLinks.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        _SocialLinksDisplay(links: user.socialLinks),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // ── 追蹤 & 訊息按鈕 ──
                Row(
                  children: [
                    Expanded(
                      child: _FollowButton(
                        isFollowing: isFollowing,
                        isPending: isPending,
                        onFollow: () async {
                          await ref
                              .read(postRepositoryProvider)
                              .followUser(
                                currentUid: currentUid,
                                currentUserName:
                                    currentUserData?.displayName ?? '',
                                currentUserPhoto:
                                    currentUserData?.photoUrl ?? '',
                                targetUid: user.uid,
                                targetIsPrivate: user.isPrivate,
                              );
                        },
                        onUnfollow: () async {
                          await ref
                              .read(postRepositoryProvider)
                              .unfollowUser(currentUid, user.uid);
                        },
                        onCancelRequest: () async {
                          await ref
                              .read(postRepositoryProvider)
                              .cancelFollowRequest(
                                  currentUid, user.uid);
                        },
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          final partner = ref
                              .read(userDataProvider(user.uid))
                              .valueOrNull;
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ChatScreen(
                                chatId:
                                    getChatId(currentUid, user.uid),
                                partner: partner ?? user,
                              ),
                            ),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(
                              color: AppTheme.divider),
                          foregroundColor: AppTheme.textPrimary,
                          padding:
                              const EdgeInsets.symmetric(vertical: 8),
                        ),
                        child: const Text('傳送訊息'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(color: AppTheme.divider, height: 1),

          // ── 貼文列表 ──
          Expanded(
            child: canViewPosts
                ? _PostsSection(uid: user.uid)
                : const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.lock_outline,
                            size: 48, color: AppTheme.textSecondary),
                        SizedBox(height: 12),
                        Text('此帳戶是私密帳戶',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16)),
                        SizedBox(height: 6),
                        Text('追蹤後即可查看貼文',
                            style: TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 13)),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}

class _SocialLinksDisplay extends StatelessWidget {
  final List<SocialLink> links;
  const _SocialLinksDisplay({required this.links});

  Future<void> _open(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 4,
      children: links
          .map((link) => GestureDetector(
                onTap: () => _open(link.url),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(link.icon, size: 14, color: link.color),
                    const SizedBox(width: 4),
                    Text(link.displayText,
                        style:
                            TextStyle(fontSize: 13, color: link.color)),
                  ],
                ),
              ))
          .toList(),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label;
  final int count;
  final VoidCallback? onTap;
  const _Stat({required this.label, required this.count, this.onTap});

  @override
  Widget build(BuildContext context) {
    final col = Column(
      children: [
        Text('$count',
            style: const TextStyle(
                fontSize: 17, fontWeight: FontWeight.bold)),
        Text(label,
            style: const TextStyle(
                fontSize: 12, color: AppTheme.textSecondary)),
      ],
    );
    if (onTap == null) return col;
    return GestureDetector(onTap: onTap, child: col);
  }
}

// ── 追蹤按鈕（三種狀態：追蹤/等待中/已追蹤）────────────
class _FollowButton extends StatelessWidget {
  final bool isFollowing;
  final bool isPending;
  final VoidCallback onFollow;
  final VoidCallback onUnfollow;
  final VoidCallback onCancelRequest;

  const _FollowButton({
    required this.isFollowing,
    required this.isPending,
    required this.onFollow,
    required this.onUnfollow,
    required this.onCancelRequest,
  });

  @override
  Widget build(BuildContext context) {
    if (isFollowing) {
      return ElevatedButton(
        onPressed: onUnfollow,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.surface,
          foregroundColor: AppTheme.textPrimary,
          side: const BorderSide(color: AppTheme.divider),
          padding: const EdgeInsets.symmetric(vertical: 8),
        ),
        child: const Text('已追蹤'),
      );
    }
    if (isPending) {
      return OutlinedButton(
        onPressed: onCancelRequest,
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: AppTheme.divider),
          foregroundColor: AppTheme.textSecondary,
          padding: const EdgeInsets.symmetric(vertical: 8),
        ),
        child: const Text('等待中'),
      );
    }
    return ElevatedButton(
      onPressed: onFollow,
      style: ElevatedButton.styleFrom(
        backgroundColor: AppTheme.accent,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 8),
      ),
      child: const Text('追蹤'),
    );
  }
}

class _PostsSection extends ConsumerWidget {
  final String uid;
  const _PostsSection({required this.uid});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsAsync = ref.watch(userPostsProvider(uid));
    return postsAsync.when(
      data: (posts) => posts.isEmpty
          ? const Center(
              child: Text('還沒有貼文',
                  style: TextStyle(color: AppTheme.textSecondary)))
          : ListView.builder(
              itemCount: posts.length,
              itemBuilder: (_, i) => PostCard(post: posts[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('載入失敗：$e')),
    );
  }
}
