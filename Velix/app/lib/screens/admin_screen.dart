import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../models/post_model.dart';
import '../models/user_model.dart';
import '../providers/admin_provider.dart';
import '../theme/app_theme.dart';

class AdminScreen extends ConsumerWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('管理後台'),
          centerTitle: true,
          elevation: 0,
          bottom: const TabBar(
            indicatorColor: AppTheme.accent,
            labelColor: AppTheme.accent,
            unselectedLabelColor: AppTheme.textSecondary,
            tabs: [
              Tab(text: '用戶', icon: Icon(Icons.people_outline, size: 18)),
              Tab(text: '貼文', icon: Icon(Icons.article_outlined, size: 18)),
              Tab(text: '統計', icon: Icon(Icons.bar_chart_outlined, size: 18)),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _UsersTab(),
            _PostsTab(),
            _StatsTab(),
          ],
        ),
      ),
    );
  }
}

// ── Users Tab ──────────────────────────────────────────
class _UsersTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final usersAsync = ref.watch(adminUsersProvider);
    return usersAsync.when(
      data: (users) => users.isEmpty
          ? const Center(child: Text('暫無用戶', style: TextStyle(color: AppTheme.textSecondary)))
          : ListView.separated(
              itemCount: users.length,
              separatorBuilder: (_, _) => const Divider(color: AppTheme.divider, height: 1),
              itemBuilder: (_, i) => _UserTile(user: users[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('載入失敗：$e')),
    );
  }
}

class _UserTile extends StatelessWidget {
  final UserModel user;
  const _UserTile({required this.user});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: CircleAvatar(
        radius: 18,
        backgroundImage: user.photoUrl.isNotEmpty ? NetworkImage(user.photoUrl) : null,
        backgroundColor: Colors.grey[800],
        child: user.photoUrl.isEmpty
            ? Text(user.displayName.isNotEmpty ? user.displayName[0].toUpperCase() : '?',
                style: const TextStyle(fontSize: 14))
            : null,
      ),
      title: Row(
        children: [
          Flexible(child: Text(user.displayName, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14))),
          if (user.isPrivate) ...[
            const SizedBox(width: 4),
            const Icon(Icons.lock, size: 12, color: AppTheme.textSecondary),
          ],
        ],
      ),
      subtitle: Text('@${user.username}  ·  貼文 ${user.postsCount}  粉絲 ${user.followersCount}',
          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
      trailing: Text(user.uid.substring(0, 8),
          style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
    );
  }
}

// ── Posts Tab ──────────────────────────────────────────
class _PostsTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsAsync = ref.watch(adminPostsProvider);
    return postsAsync.when(
      data: (posts) => posts.isEmpty
          ? const Center(child: Text('暫無貼文', style: TextStyle(color: AppTheme.textSecondary)))
          : ListView.separated(
              itemCount: posts.length,
              separatorBuilder: (_, _) => const Divider(color: AppTheme.divider, height: 1),
              itemBuilder: (_, i) => _PostTile(post: posts[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('載入失敗：$e')),
    );
  }
}

class _PostTile extends StatelessWidget {
  final PostModel post;
  const _PostTile({required this.post});

  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
      childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      leading: CircleAvatar(
        radius: 16,
        backgroundImage: post.authorPhotoUrl.isNotEmpty ? NetworkImage(post.authorPhotoUrl) : null,
        backgroundColor: Colors.grey[800],
        child: post.authorPhotoUrl.isEmpty
            ? Text(post.authorName.isNotEmpty ? post.authorName[0].toUpperCase() : '?',
                style: const TextStyle(fontSize: 12))
            : null,
      ),
      title: Row(
        children: [
          Flexible(child: Text(post.authorName, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14))),
          const SizedBox(width: 4),
          Text('· ${timeago.format(post.createdAt)}',
              style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
        ],
      ),
      subtitle: Text(
        post.content.length > 80 ? '${post.content.substring(0, 80)}...' : post.content,
        style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
      ),
      children: [
        _InfoRow(label: 'ID', value: post.id),
        _InfoRow(label: '作者 ID', value: post.authorId),
        _InfoRow(label: '分類', value: post.category),
        _InfoRow(label: 'Hashtags', value: post.hashtags.isEmpty ? '無' : post.hashtags.join(', ')),
        _InfoRow(label: '❤️ ${post.likesCount}', value: '💬 ${post.commentsCount}  👁 ${post.viewsCount}  🔄 ${post.repostsCount}'),
        if (post.imageUrl != null) _InfoRow(label: '圖片', value: post.imageUrl!),
        if (post.videoUrl != null) _InfoRow(label: '影片', value: post.videoUrl!),
        if (post.locationName != null) _InfoRow(label: '地點', value: post.locationName!),
        const SizedBox(height: 8),
        SelectableText(post.content, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
          ),
          Expanded(
            child: SelectableText(value,
                style: const TextStyle(fontSize: 11, color: AppTheme.textPrimary)),
          ),
        ],
      ),
    );
  }
}

// ── Stats Tab ──────────────────────────────────────────
class _StatsTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(adminStatsProvider);
    return statsAsync.when(
      data: (stats) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _StatCard(icon: Icons.people, label: '用戶總數', count: stats['users'] ?? 0),
            const SizedBox(height: 16),
            _StatCard(icon: Icons.article, label: '貼文總數', count: stats['posts'] ?? 0),
          ],
        ),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('載入失敗：$e')),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final int count;
  const _StatCard({required this.icon, required this.label, required this.count});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Row(
        children: [
          Icon(icon, size: 32, color: AppTheme.accent),
          const SizedBox(width: 20),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('$count', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
              Text(label, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary)),
            ],
          ),
        ],
      ),
    );
  }
}
