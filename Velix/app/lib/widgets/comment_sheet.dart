import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../models/comment_model.dart';
import '../models/post_model.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';
import '../theme/app_theme.dart';

void showCommentSheet(BuildContext context, PostModel post) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: AppTheme.bg,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (ctx) => _CommentSheet(post: post),
  );
}

class _CommentSheet extends ConsumerStatefulWidget {
  final PostModel post;
  const _CommentSheet({required this.post});

  @override
  ConsumerState<_CommentSheet> createState() => _CommentSheetState();
}

class _CommentSheetState extends ConsumerState<_CommentSheet> {
  final _ctrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  bool _sending = false;

  Future<void> _send() async {
    final text = _ctrl.text.trim();
    if (text.isEmpty) return;

    final user = ref.read(currentUserProvider);
    if (user == null) return;

    final userData = await ref
        .read(firestoreProvider)
        .collection('users')
        .doc(user.uid)
        .get();
    final data = userData.data() ?? {};

    setState(() => _sending = true);
    try {
      _ctrl.clear();
      await ref.read(postRepositoryProvider).addComment(
            postId: widget.post.id,
            authorId: user.uid,
            authorName: data['displayName'] ?? user.displayName ?? '匿名',
            authorUsername: data['username'] ?? 'user',
            authorPhotoUrl: data['photoUrl'] ?? user.photoURL ?? '',
            content: text,
            postAuthorId: widget.post.authorId,
            postContent: widget.post.content,
          );
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scrollCtrl.hasClients) {
          _scrollCtrl.animateTo(
            _scrollCtrl.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final commentsAsync =
        ref.watch(commentsProvider(widget.post.id));

    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.75,
      minChildSize: 0.4,
      maxChildSize: 0.95,
      builder: (ctx, scrollCtrl) => Column(
        children: [
          // Handle bar
          Container(
            margin: const EdgeInsets.only(top: 10, bottom: 4),
            width: 36,
            height: 4,
            decoration: BoxDecoration(
              color: AppTheme.divider,
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                commentsAsync.when(
                  data: (list) => Text(
                    '留言 ${list.length}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  loading: () => const Text('留言',
                      style: TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 16)),
                  error: (_, err) => const Text('留言',
                      style: TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ],
            ),
          ),
          const Divider(color: AppTheme.divider, height: 1),

          // Comments list
          Expanded(
            child: commentsAsync.when(
              data: (comments) => comments.isEmpty
                  ? const Center(
                      child: Text('還沒有留言，來第一個留言吧！',
                          style: TextStyle(
                              color: AppTheme.textSecondary)),
                    )
                  : ListView.builder(
                      controller: _scrollCtrl,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      itemCount: comments.length,
                      itemBuilder: (_, i) => _CommentTile(
                        comment: comments[i],
                        postId: widget.post.id,
                      ),
                    ),
              loading: () =>
                  const Center(child: CircularProgressIndicator()),
              error: (e, _) =>
                  Center(child: Text('載入失敗：$e')),
            ),
          ),

          // Input bar
          Container(
            padding: EdgeInsets.fromLTRB(
                12, 8, 12, MediaQuery.of(context).viewInsets.bottom + 12),
            decoration: const BoxDecoration(
              color: AppTheme.bg,
              border: Border(top: BorderSide(color: AppTheme.divider)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _ctrl,
                    maxLines: null,
                    onSubmitted: (_) => _send(),
                    decoration: InputDecoration(
                      hintText: '留言…',
                      filled: true,
                      fillColor: AppTheme.surface,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppTheme.accent,
                  child: _sending
                      ? const Padding(
                          padding: EdgeInsets.all(10),
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : IconButton(
                          icon: const Icon(Icons.send,
                              color: Colors.white, size: 18),
                          onPressed: _send,
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }
}

class _CommentTile extends ConsumerWidget {
  final CommentModel comment;
  final String postId;
  const _CommentTile({required this.comment, required this.postId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUid = ref.read(currentUserProvider)?.uid;
    final isOwn = comment.authorId == currentUid;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 16,
            backgroundImage: comment.authorPhotoUrl.isNotEmpty
                ? NetworkImage(comment.authorPhotoUrl)
                : null,
            backgroundColor: Colors.grey[800],
            child: comment.authorPhotoUrl.isEmpty
                ? Text(
                    comment.authorName.isNotEmpty
                        ? comment.authorName[0].toUpperCase()
                        : '?',
                    style: const TextStyle(fontSize: 12))
                : null,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(comment.authorName,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13)),
                    const SizedBox(width: 6),
                    Text(
                      timeago.format(comment.createdAt,
                          locale: 'zh'),
                      style: const TextStyle(
                          fontSize: 11,
                          color: AppTheme.textSecondary),
                    ),
                    if (isOwn) ...[
                      const Spacer(),
                      GestureDetector(
                        onTap: () => _deleteComment(context, ref),
                        child: const Icon(Icons.delete_outline,
                            size: 14,
                            color: AppTheme.textSecondary),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 4),
                Text(comment.content,
                    style: const TextStyle(
                        fontSize: 14, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _deleteComment(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('刪除留言'),
        content: const Text('確定要刪除這則留言嗎？'),
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
              Navigator.pop(ctx);
              // delete comment from Firestore
              await ref
                  .read(firestoreProvider)
                  .collection('posts')
                  .doc(postId)
                  .collection('comments')
                  .doc(comment.id)
                  .delete();
              // 更新貼文留言數
              await ref
                  .read(firestoreProvider)
                  .collection('posts')
                  .doc(postId)
                  .update({'commentsCount': FieldValue.increment(-1)});
            },
            child: const Text('刪除'),
          ),
        ],
      ),
    );
  }
}
