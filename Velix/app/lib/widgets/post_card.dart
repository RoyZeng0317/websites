import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../models/post_model.dart';
import '../providers/post_provider.dart';
import '../providers/auth_provider.dart';

class PostCard extends ConsumerWidget {
  final PostModel post;
  const PostCard({super.key, required this.post});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authStateProvider).valueOrNull;
    final isLikedAsync = ref.watch(isLikedProvider(post.id));

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Colors.white12, width: 0.5),
        ),
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
                ? Text(post.authorName.isNotEmpty ? post.authorName[0].toUpperCase() : '?')
                : null,
          ),
          const SizedBox(width: 12),

          // 內文
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 作者 + 時間
                Row(
                  children: [
                    Text(
                      post.authorName,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '@${post.authorUsername}',
                      style: TextStyle(color: Colors.grey[500], fontSize: 13),
                    ),
                    const Spacer(),
                    Text(
                      timeago.format(post.createdAt),
                      style: TextStyle(color: Colors.grey[500], fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: 6),

                // 貼文內容
                Text(post.content, style: const TextStyle(fontSize: 15, height: 1.4)),

                // 圖片（有的話）
                if (post.imageUrl != null) ...[
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(post.imageUrl!, fit: BoxFit.cover),
                  ),
                ],

                const SizedBox(height: 12),

                // 按讚 / 留言 按鈕
                Row(
                  children: [
                    // 留言（目前只顯示數字）
                    _ActionButton(
                      icon: Icons.chat_bubble_outline,
                      count: post.commentsCount,
                      onTap: () {},
                    ),
                    const SizedBox(width: 32),

                    // 按讚
                    isLikedAsync.when(
                      data: (isLiked) => _ActionButton(
                        icon: isLiked ? Icons.favorite : Icons.favorite_border,
                        count: post.likesCount,
                        color: isLiked ? Colors.red : null,
                        onTap: user == null
                            ? null
                            : () => ref
                                .read(postRepositoryProvider)
                                .toggleLike(post.id, user.uid, isLiked, post),
                      ),
                      loading: () => const _ActionButton(
                          icon: Icons.favorite_border, count: 0),
                      error: (_, _) => const _ActionButton(
                          icon: Icons.favorite_border, count: 0),
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

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final int count;
  final Color? color;
  final VoidCallback? onTap;

  const _ActionButton({
    required this.icon,
    required this.count,
    this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon, size: 18, color: color ?? Colors.grey[500]),
          const SizedBox(width: 4),
          Text(
            '$count',
            style: TextStyle(color: Colors.grey[500], fontSize: 13),
          ),
        ],
      ),
    );
  }
}