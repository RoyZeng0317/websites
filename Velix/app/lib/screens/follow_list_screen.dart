import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';
import '../providers/user_provider.dart';
import '../theme/app_theme.dart';
import 'user_profile_screen.dart';

enum FollowListType { followers, following }

class FollowListScreen extends ConsumerWidget {
  final String uid;
  final FollowListType type;

  const FollowListScreen({
    super.key,
    required this.uid,
    required this.type,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final title = type == FollowListType.followers ? '粉絲' : '追蹤中';
    final listAsync = type == FollowListType.followers
        ? ref.watch(followersListProvider(uid))
        : ref.watch(followingListProvider(uid));
    final currentUid = ref.read(currentUserProvider)?.uid ?? '';

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        centerTitle: true,
      ),
      body: listAsync.when(
        data: (users) => users.isEmpty
            ? Center(
                child: Text(
                  type == FollowListType.followers ? '尚無粉絲' : '尚未追蹤任何人',
                  style:
                      const TextStyle(color: AppTheme.textSecondary),
                ),
              )
            : ListView.separated(
                itemCount: users.length,
                separatorBuilder: (_, i) =>
                    const Divider(color: AppTheme.divider, height: 1),
                itemBuilder: (ctx, i) => _UserRow(
                  user: users[i],
                  currentUid: currentUid,
                ),
              ),
        loading: () =>
            const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('載入失敗：$e')),
      ),
    );
  }
}

class _UserRow extends ConsumerWidget {
  final UserModel user;
  final String currentUid;
  const _UserRow({required this.user, required this.currentUid});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isSelf = user.uid == currentUid;
    final isFollowingAsync =
        ref.watch(isFollowingProvider(user.uid));
    final isFollowing = isFollowingAsync.valueOrNull ?? false;

    return ListTile(
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: CircleAvatar(
        radius: 24,
        backgroundImage: user.photoUrl.isNotEmpty
            ? NetworkImage(user.photoUrl)
            : null,
        backgroundColor: Colors.grey[800],
        child: user.photoUrl.isEmpty
            ? Text(
                user.displayName.isNotEmpty
                    ? user.displayName[0].toUpperCase()
                    : '?',
                style: const TextStyle(fontSize: 18),
              )
            : null,
      ),
      title: Text(
        user.displayName,
        style: const TextStyle(
            fontWeight: FontWeight.w600, fontSize: 15),
      ),
      subtitle: Text(
        '@${user.username}',
        style: const TextStyle(
            color: AppTheme.textSecondary, fontSize: 13),
      ),
      trailing: isSelf
          ? null
          : isFollowing
              ? OutlinedButton(
                  onPressed: () => ref
                      .read(postRepositoryProvider)
                      .unfollowUser(currentUid, user.uid),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 6),
                    side:
                        const BorderSide(color: AppTheme.divider),
                    foregroundColor: AppTheme.textPrimary,
                    textStyle: const TextStyle(fontSize: 13),
                  ),
                  child: const Text('已追蹤'),
                )
              : ElevatedButton(
                  onPressed: () async {
                    final me = ref
                        .read(currentUserDataProvider)
                        .valueOrNull;
                    await ref
                        .read(postRepositoryProvider)
                        .followUser(
                          currentUid: currentUid,
                          currentUserName:
                              me?.displayName ?? '',
                          currentUserPhoto:
                              me?.photoUrl ?? '',
                          targetUid: user.uid,
                          targetIsPrivate: user.isPrivate,
                        );
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 6),
                    backgroundColor: AppTheme.accent,
                    foregroundColor: Colors.white,
                    textStyle: const TextStyle(fontSize: 13),
                  ),
                  child: const Text('追蹤'),
                ),
      onTap: isSelf
          ? null
          : () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (_) =>
                        UserProfileScreen(user: user)),
              ),
    );
  }
}
