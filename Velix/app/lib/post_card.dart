import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'models/post_model.dart';
import 'providers/auth_provider.dart';
import 'providers/post_provider.dart';
import 'hashtag_helper.dart';
import 'theme/app_theme.dart';
import 'widgets/comment_sheet.dart';

// ── 格式化數字 ─────────────────────────────────────────
String _fmt(int n) {
  if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
  if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
  return '$n';
}

class PostCard extends ConsumerStatefulWidget {
  final PostModel post;
  final void Function(String tag)? onHashtagTap;

  const PostCard({super.key, required this.post, this.onHashtagTap});

  @override
  ConsumerState<PostCard> createState() => _PostCardState();
}

class _PostCardState extends ConsumerState<PostCard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = ref.read(currentUserProvider);
      if (user == null) return;
      ref.read(postRepositoryProvider).incrementViews(widget.post, user.uid);
    });
  }

  void _showShareSheet(bool isReposted) {
    final post = widget.post;
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 10, bottom: 8),
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.divider,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            ListTile(
              leading: Icon(
                isReposted ? Icons.repeat_on : Icons.repeat,
                color: isReposted ? AppTheme.accent : AppTheme.textPrimary,
              ),
              title: Text(
                isReposted ? '取消轉發' : '轉發到 Velix',
                style: TextStyle(
                  color: isReposted
                      ? AppTheme.accent
                      : AppTheme.textPrimary,
                ),
              ),
              onTap: () async {
                Navigator.pop(ctx);
                final user = ref.read(currentUserProvider);
                if (user == null) return;
                await ref.read(postRepositoryProvider).toggleRepost(
                      post.id,
                      user.uid,
                      isReposted,
                      widget.post,
                    );
              },
            ),
            ListTile(
              leading: const Icon(Icons.link, color: AppTheme.textPrimary),
              title: const Text('複製連結',
                  style: TextStyle(color: AppTheme.textPrimary)),
              onTap: () {
                Navigator.pop(ctx);
                final link =
                    'https://velix-socialize.web.app/post/${post.id}';
                Clipboard.setData(ClipboardData(text: link));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('連結已複製')),
                );
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final post = widget.post;
    final user = ref.watch(authStateProvider).valueOrNull;
    final isOwner = user?.uid == post.authorId;
    final isLikedAsync = ref.watch(isLikedProvider(post.id));
    final isRepostedAsync = ref.watch(isRepostedProvider(post.id));
    final isBookmarkedAsync = ref.watch(isBookmarkedProvider(post.id));

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        border:
            Border(bottom: BorderSide(color: AppTheme.divider, width: 0.5)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 頭像
          CircleAvatar(
            radius: 20,
            backgroundImage: post.authorPhotoUrl.isNotEmpty
                ? NetworkImage(post.authorPhotoUrl)
                : null,
            backgroundColor: Colors.grey[800],
            child: post.authorPhotoUrl.isEmpty
                ? Text(
                    post.authorName.isNotEmpty
                        ? post.authorName[0].toUpperCase()
                        : '?',
                  )
                : null,
          ),
          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 作者行
                Row(
                  children: [
                    Flexible(
                      child: Text(post.authorName,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 15)),
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text('@${post.authorUsername}',
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              color: AppTheme.textSecondary, fontSize: 13)),
                    ),
                    const SizedBox(width: 4),
                    const Text('·',
                        style: TextStyle(color: AppTheme.textSecondary)),
                    const SizedBox(width: 4),
                    Text(timeago.format(post.createdAt),
                        style: const TextStyle(
                            color: AppTheme.textSecondary, fontSize: 12)),
                    const Spacer(),
                    if (isOwner) _PostMenu(post: post),
                  ],
                ),

                // 類別 chip
                if (post.category.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.divider),
                    ),
                    child: Text(
                      post.category,
                      style: const TextStyle(
                          fontSize: 11,
                          color: AppTheme.textSecondary),
                    ),
                  ),
                ],
                const SizedBox(height: 6),

                // 內文
                RichText(
                  text: HashtagHelper.buildHashtagText(
                    post.content,
                    baseStyle: const TextStyle(
                        fontSize: 15,
                        color: AppTheme.textPrimary,
                        height: 1.4),
                    hashtagStyle: const TextStyle(
                        fontSize: 15,
                        color: AppTheme.accent,
                        height: 1.4),
                    onTapHashtag: (tag) => widget.onHashtagTap?.call(tag),
                  ),
                ),

                // 音樂標籤
                if (post.musicTitle != null) ...[
                  const SizedBox(height: 10),
                  _MusicTag(
                      title: post.musicTitle!,
                      artist: post.musicArtist ?? '',
                      coverUrl: post.musicCoverUrl),
                ],

                // 圖片
                if (post.imageUrl != null) ...[
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(post.imageUrl!,
                        fit: BoxFit.cover, width: double.infinity),
                  ),
                ],

                // GIF
                if (post.gifUrl != null) ...[
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(post.gifUrl!,
                        fit: BoxFit.cover, width: double.infinity),
                  ),
                ],

                // 影片（顯示佔位符）
                if (post.videoUrl != null) ...[
                  const SizedBox(height: 10),
                  Container(
                    height: 160,
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(
                      child: Icon(Icons.play_circle_outline,
                          color: Colors.white70, size: 48),
                    ),
                  ),
                ],

                // 位置
                if (post.locationName != null) ...[
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined,
                          size: 12, color: AppTheme.textSecondary),
                      const SizedBox(width: 3),
                      Text(post.locationName!,
                          style: const TextStyle(
                              fontSize: 12,
                              color: AppTheme.textSecondary)),
                    ],
                  ),
                ],

                const SizedBox(height: 12),

                // ── 互動列 ──
                Row(
                  children: [
                    // 留言
                    _ActionBtn(
                      icon: Icons.chat_bubble_outline,
                      count: post.commentsCount,
                      onTap: () => showCommentSheet(context, post),
                    ),
                    const SizedBox(width: 24),

                    // 轉發
                    isRepostedAsync.when(
                      data: (reposted) => _ActionBtn(
                        icon: reposted ? Icons.repeat_on : Icons.repeat,
                        count: post.repostsCount,
                        color: reposted ? AppTheme.accent : null,
                        onTap: () => _showShareSheet(reposted),
                      ),
                      loading: () => _ActionBtn(
                          icon: Icons.repeat, count: post.repostsCount),
                      error: (_, err) => _ActionBtn(
                          icon: Icons.repeat, count: post.repostsCount),
                    ),
                    const SizedBox(width: 24),

                    // 按讚
                    isLikedAsync.when(
                      data: (liked) => _ActionBtn(
                        icon: liked ? Icons.favorite : Icons.favorite_border,
                        count: post.likesCount,
                        color: liked ? Colors.red : null,
                        onTap: user == null
                            ? null
                            : () => ref
                                .read(postRepositoryProvider)
                                .toggleLike(post.id, user.uid, liked, post),
                      ),
                      loading: () => _ActionBtn(
                          icon: Icons.favorite_border,
                          count: post.likesCount),
                      error: (_, err) => _ActionBtn(
                          icon: Icons.favorite_border,
                          count: post.likesCount),
                    ),

                    const Spacer(),

                    // 瀏覽數
                    Row(
                      children: [
                        const Icon(Icons.visibility_outlined,
                            size: 13, color: AppTheme.textSecondary),
                        const SizedBox(width: 3),
                        Text(_fmt(post.viewsCount),
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppTheme.textSecondary)),
                      ],
                    ),
                    const SizedBox(width: 12),

                    // 收藏
                    isBookmarkedAsync.when(
                      data: (bookmarked) => GestureDetector(
                        onTap: user == null
                            ? null
                            : () => ref
                                .read(postRepositoryProvider)
                                .toggleBookmark(
                                    post.id, user.uid, bookmarked, widget.post),
                        child: Icon(
                          bookmarked
                              ? Icons.bookmark
                              : Icons.bookmark_border,
                          size: 16,
                          color: bookmarked
                              ? AppTheme.accent
                              : AppTheme.textSecondary,
                        ),
                      ),
                      loading: () => const Icon(Icons.bookmark_border,
                          size: 16, color: AppTheme.textSecondary),
                      error: (_, err) => const Icon(Icons.bookmark_border,
                          size: 16, color: AppTheme.textSecondary),
                    ),
                    const SizedBox(width: 12),

                    // 分享按鈕
                    isRepostedAsync.when(
                      data: (reposted) => GestureDetector(
                        onTap: () => _showShareSheet(reposted),
                        child: const Icon(Icons.ios_share_outlined,
                            size: 16, color: AppTheme.textSecondary),
                      ),
                      loading: () => const Icon(Icons.ios_share_outlined,
                          size: 16, color: AppTheme.textSecondary),
                      error: (_, err) => const Icon(Icons.ios_share_outlined,
                          size: 16, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── 音樂標籤 ──────────────────────────────────────────
class _MusicTag extends StatelessWidget {
  final String title;
  final String artist;
  final String? coverUrl;
  const _MusicTag(
      {required this.title, required this.artist, this.coverUrl});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: coverUrl != null
                ? Image.network(coverUrl!,
                    width: 40, height: 40, fit: BoxFit.cover)
                : Container(
                    width: 40,
                    height: 40,
                    color: Colors.grey[800],
                    child: const Icon(Icons.music_note,
                        color: AppTheme.accent, size: 20),
                  ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: AppTheme.textPrimary)),
                if (artist.isNotEmpty)
                  Text(artist,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.textSecondary)),
              ],
            ),
          ),
          const Icon(Icons.music_note, size: 16, color: AppTheme.accent),
        ],
      ),
    );
  }
}

// ── 三點選單 ───────────────────────────────────────────
class _PostMenu extends ConsumerWidget {
  final PostModel post;
  const _PostMenu({required this.post});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.more_horiz,
          size: 18, color: AppTheme.textSecondary),
      color: AppTheme.surface,
      onSelected: (value) async {
        if (value == 'edit') _showEditDialog(context, ref);
        if (value == 'delete') _showDeleteDialog(context, ref);
      },
      itemBuilder: (_) => [
        const PopupMenuItem(
          value: 'edit',
          child: Row(children: [
            Icon(Icons.edit_outlined,
                size: 18, color: AppTheme.textPrimary),
            SizedBox(width: 8),
            Text('編輯', style: TextStyle(color: AppTheme.textPrimary)),
          ]),
        ),
        const PopupMenuItem(
          value: 'delete',
          child: Row(children: [
            Icon(Icons.delete_outline, size: 18, color: Colors.red),
            SizedBox(width: 8),
            Text('刪除', style: TextStyle(color: Colors.red)),
          ]),
        ),
      ],
    );
  }

  void _showEditDialog(BuildContext context, WidgetRef ref) {
    final ctrl = TextEditingController(text: post.content);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('編輯貼文'),
        content: TextField(
          controller: ctrl,
          maxLines: null,
          decoration: const InputDecoration(border: InputBorder.none),
          style: const TextStyle(fontSize: 16),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消',
                style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () async {
              final c = ctrl.text.trim();
              if (c.isEmpty) return;
              await ref.read(postRepositoryProvider).editPost(post.id, c);
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text('儲存'),
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('刪除貼文'),
        content: const Text('確定要刪除這則貼文嗎？此操作無法復原。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消',
                style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            style:
                ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              await ref
                  .read(postRepositoryProvider)
                  .deletePost(post.id, post.authorId);
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text('刪除'),
          ),
        ],
      ),
    );
  }
}

// ── 互動按鈕 ──────────────────────────────────────────
class _ActionBtn extends StatelessWidget {
  final IconData icon;
  final int? count;
  final Color? color;
  final VoidCallback? onTap;

  const _ActionBtn({
    required this.icon,
    this.count,
    this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon, size: 18, color: color ?? AppTheme.textSecondary),
          if (count != null) ...[
            const SizedBox(width: 4),
            Text(_fmt(count!),
                style: const TextStyle(
                    color: AppTheme.textSecondary, fontSize: 13)),
          ],
        ],
      ),
    );
  }
}
