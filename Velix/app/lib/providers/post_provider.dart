import 'dart:async';
import 'dart:math' as math;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/comment_model.dart';
import '../models/draft_model.dart';
import '../models/notification_model.dart';
import '../models/post_model.dart';
import '../models/user_model.dart';
import 'auth_provider.dart';

final firestoreProvider =
    Provider<FirebaseFirestore>((_) => FirebaseFirestore.instance);

// ── Feed ──────────────────────────────────────────────
final feedProvider = StreamProvider<List<PostModel>>((ref) {
  return ref
      .read(firestoreProvider)
      .collection('posts')
      .orderBy('createdAt', descending: true)
      .limit(60)
      .snapshots()
      .map((s) => s.docs.map(PostModel.fromDoc).toList());
});

final followingFeedProvider = StreamProvider<List<PostModel>>((ref) async* {
  final user = ref.watch(currentUserProvider);
  if (user == null) { yield []; return; }
  final db = ref.read(firestoreProvider);
  final followingSnap =
      await db.collection('users').doc(user.uid).collection('following').get();
  final ids = followingSnap.docs.map((d) => d.id).toList()..add(user.uid);
  if (ids.isEmpty) { yield []; return; }
  yield* db
      .collection('posts')
      .where('authorId', whereIn: ids.take(10).toList())
      .orderBy('createdAt', descending: true)
      .limit(60)
      .snapshots()
      .map((s) => s.docs.map(PostModel.fromDoc).toList());
});

// ── Personalized (Interest-Based) Feed ─────────────────
final personalizedFeedProvider = FutureProvider<List<PostModel>>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return [];
  final db = ref.read(firestoreProvider);

  final interactionsSnap = await db
      .collection('users')
      .doc(user.uid)
      .collection('interactions')
      .orderBy('createdAt', descending: true)
      .limit(200)
      .get();

  final tagScores = <String, double>{};
  final catScores = <String, double>{};
  final seenPostIds = <String>{};

  const weights = <String, double>{
    'like': 3.0,
    'bookmark': 2.5,
    'repost': 2.0,
    'view': 0.5,
  };

  for (final doc in interactionsSnap.docs) {
    final d = doc.data();
    final w = weights[d['type'] as String? ?? 'view'] ?? 0.5;
    for (final tag in List<String>.from(d['hashtags'] ?? [])) {
      tagScores[tag] = (tagScores[tag] ?? 0) + w;
    }
    final cat = d['category'] as String?;
    if (cat != null && cat.isNotEmpty) {
      catScores[cat] = (catScores[cat] ?? 0) + w;
    }
    seenPostIds.add(d['postId'] as String);
  }

  final postsSnap = await db
      .collection('posts')
      .orderBy('createdAt', descending: true)
      .limit(100)
      .get();

  final now = DateTime.now();
  final scored = <_ScoredPost>[];

  for (final doc in postsSnap.docs) {
    final post = PostModel.fromDoc(doc);
    double score = 0;

    for (final tag in post.hashtags) {
      score += tagScores[tag] ?? 0;
    }
    score += (catScores[post.category] ?? 0) * 2;

    final ageHours = now.difference(post.createdAt).inHours;
    if (ageHours < 72) {
      score += (72 - ageHours) / 72 * 5;
    }
    score += math.log((post.likesCount + 1).toDouble()) * 2;

    if (seenPostIds.contains(post.id)) {
      score *= 0.3;
    }

    scored.add(_ScoredPost(post, score));
  }

  scored.sort((a, b) => b.score.compareTo(a.score));
  return scored.map((s) => s.post).toList();
});

class _ScoredPost {
  final PostModel post;
  final double score;
  const _ScoredPost(this.post, this.score);
}

final userPostsProvider =
    StreamProvider.family<List<PostModel>, String>((ref, uid) {
  return ref
      .read(firestoreProvider)
      .collection('posts')
      .where('authorId', isEqualTo: uid)
      .orderBy('createdAt', descending: true)
      .snapshots()
      .map((s) => s.docs.map(PostModel.fromDoc).toList());
});

final singlePostProvider =
    StreamProvider.family<PostModel?, String>((ref, postId) {
  return ref
      .read(firestoreProvider)
      .collection('posts')
      .doc(postId)
      .snapshots()
      .map((d) => d.exists ? PostModel.fromDoc(d) : null);
});

// 用 Stream 使按讚狀態即時更新
final isLikedProvider =
    StreamProvider.family<bool, String>((ref, postId) {
  final user = ref.read(currentUserProvider);
  if (user == null) return Stream.value(false);
  return ref
      .read(firestoreProvider)
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(user.uid)
      .snapshots()
      .map((d) => d.exists);
});

final isRepostedProvider =
    StreamProvider.family<bool, String>((ref, postId) {
  final user = ref.read(currentUserProvider);
  if (user == null) return Stream.value(false);
  return ref
      .read(firestoreProvider)
      .collection('posts')
      .doc(postId)
      .collection('reposts')
      .doc(user.uid)
      .snapshots()
      .map((d) => d.exists);
});

final isFollowingProvider =
    StreamProvider.family<bool, String>((ref, targetUid) {
  final user = ref.read(currentUserProvider);
  if (user == null) return Stream.value(false);
  return ref
      .read(firestoreProvider)
      .collection('users')
      .doc(user.uid)
      .collection('following')
      .doc(targetUid)
      .snapshots()
      .map((d) => d.exists);
});

final isFollowRequestPendingProvider =
    StreamProvider.family<bool, String>((ref, targetUid) {
  final user = ref.read(currentUserProvider);
  if (user == null) return Stream.value(false);
  return ref
      .read(firestoreProvider)
      .collection('users')
      .doc(targetUid)
      .collection('followRequests')
      .doc(user.uid)
      .snapshots()
      .map((d) => d.exists);
});

final isBookmarkedProvider =
    StreamProvider.family<bool, String>((ref, postId) {
  final user = ref.read(currentUserProvider);
  if (user == null) return Stream.value(false);
  return ref
      .read(firestoreProvider)
      .collection('users')
      .doc(user.uid)
      .collection('bookmarks')
      .doc(postId)
      .snapshots()
      .map((d) => d.exists);
});

// 粉絲列表
final followersListProvider =
    StreamProvider.family<List<UserModel>, String>((ref, uid) {
  final db = ref.read(firestoreProvider);
  return db
      .collection('users')
      .doc(uid)
      .collection('followers')
      .orderBy('followedAt', descending: true)
      .snapshots()
      .asyncMap((snap) async {
    if (snap.docs.isEmpty) return <UserModel>[];
    final ids = snap.docs.map((d) => d.id).toList();
    final users = <UserModel>[];
    for (var i = 0; i < ids.length; i += 10) {
      final chunk = ids.sublist(i, math.min(i + 10, ids.length));
      final q = await db
          .collection('users')
          .where(FieldPath.documentId, whereIn: chunk)
          .get();
      users.addAll(q.docs.map(UserModel.fromDoc));
    }
    return users;
  });
});

// 追蹤中列表
final followingListProvider =
    StreamProvider.family<List<UserModel>, String>((ref, uid) {
  final db = ref.read(firestoreProvider);
  return db
      .collection('users')
      .doc(uid)
      .collection('following')
      .orderBy('followedAt', descending: true)
      .snapshots()
      .asyncMap((snap) async {
    if (snap.docs.isEmpty) return <UserModel>[];
    final ids = snap.docs.map((d) => d.id).toList();
    final users = <UserModel>[];
    for (var i = 0; i < ids.length; i += 10) {
      final chunk = ids.sublist(i, math.min(i + 10, ids.length));
      final q = await db
          .collection('users')
          .where(FieldPath.documentId, whereIn: chunk)
          .get();
      users.addAll(q.docs.map(UserModel.fromDoc));
    }
    return users;
  });
});

// session 內已瀏覽過的貼文（避免重複計算）
final _sessionViewed = <String>{};

final commentsProvider =
    StreamProvider.family<List<CommentModel>, String>((ref, postId) {
  return ref
      .read(firestoreProvider)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt', descending: false)
      .snapshots()
      .map((s) => s.docs.map(CommentModel.fromDoc).toList());
});

// hashtag 搜尋
final hashtagPostsProvider =
    StreamProvider.family<List<PostModel>, String>((ref, tag) {
  return ref
      .read(firestoreProvider)
      .collection('posts')
      .where('hashtags', arrayContains: tag.toLowerCase())
      .orderBy('createdAt', descending: true)
      .limit(40)
      .snapshots()
      .map((s) => s.docs.map(PostModel.fromDoc).toList());
});

// ── Drafts ───────────────────────────────────────────
final userDraftsProvider =
    StreamProvider.family<List<DraftModel>, String>((ref, uid) {
  if (uid.isEmpty) return Stream.value([]);
  return ref
      .read(firestoreProvider)
      .collection('users')
      .doc(uid)
      .collection('drafts')
      .orderBy('updatedAt', descending: true)
      .snapshots()
      .map((s) => s.docs.map(DraftModel.fromDoc).toList());
});

// ── Repository ───────────────────────────────────────
class PostRepository {
  final FirebaseFirestore _db;
  PostRepository(this._db);

  Future<String> saveDraft({
    required String uid,
    String? draftId,
    required String content,
    String? imageUrl,
    String? gifUrl,
    String? videoUrl,
    String? locationName,
    String? musicTitle,
    String? musicArtist,
    String category = '一般生活',
  }) async {
    final colRef = _db.collection('users').doc(uid).collection('drafts');
    final ref = draftId != null ? colRef.doc(draftId) : colRef.doc();
    await ref.set(DraftModel(
      id: ref.id,
      content: content,
      imageUrl: imageUrl,
      gifUrl: gifUrl,
      videoUrl: videoUrl,
      locationName: locationName,
      musicTitle: musicTitle,
      musicArtist: musicArtist,
      category: category,
      updatedAt: DateTime.now(),
    ).toMap());
    return ref.id;
  }

  Future<void> followUser({
    required String currentUid,
    required String currentUserName,
    required String currentUserPhoto,
    required String targetUid,
    required bool targetIsPrivate,
  }) async {
    if (targetIsPrivate) {
      // 私密帳戶：送追蹤請求
      final requestRef = _db
          .collection('users')
          .doc(targetUid)
          .collection('followRequests')
          .doc(currentUid);
      final notifRef = _db
          .collection('users')
          .doc(targetUid)
          .collection('notifications')
          .doc();
      await _db.runTransaction((tx) async {
        tx.set(requestRef, {
          'uid': currentUid,
          'displayName': currentUserName,
          'photoUrl': currentUserPhoto,
          'requestedAt': FieldValue.serverTimestamp(),
        });
        tx.set(notifRef, {
          'toUserId': targetUid,
          'fromUserId': currentUid,
          'fromUserName': currentUserName,
          'fromUserPhoto': currentUserPhoto,
          'type': NotificationType.followRequest.name,
          'postId': '',
          'postContent': '',
          'isRead': false,
          'createdAt': FieldValue.serverTimestamp(),
        });
      });
    } else {
      // 公開帳戶：直接追蹤
      final followingRef = _db
          .collection('users')
          .doc(currentUid)
          .collection('following')
          .doc(targetUid);
      final followerRef = _db
          .collection('users')
          .doc(targetUid)
          .collection('followers')
          .doc(currentUid);
      final notifRef = _db
          .collection('users')
          .doc(targetUid)
          .collection('notifications')
          .doc();
      await _db.runTransaction((tx) async {
        tx.set(followingRef,
            {'followedAt': FieldValue.serverTimestamp()});
        tx.set(followerRef,
            {'followedAt': FieldValue.serverTimestamp()});
        tx.update(_db.collection('users').doc(currentUid),
            {'followingCount': FieldValue.increment(1)});
        tx.update(_db.collection('users').doc(targetUid),
            {'followersCount': FieldValue.increment(1)});
        tx.set(notifRef, {
          'toUserId': targetUid,
          'fromUserId': currentUid,
          'fromUserName': currentUserName,
          'fromUserPhoto': currentUserPhoto,
          'type': NotificationType.follow.name,
          'postId': '',
          'postContent': '',
          'isRead': false,
          'createdAt': FieldValue.serverTimestamp(),
        });
      });
    }
  }

  Future<void> unfollowUser(String currentUid, String targetUid) async {
    final followingRef = _db
        .collection('users')
        .doc(currentUid)
        .collection('following')
        .doc(targetUid);
    final followerRef = _db
        .collection('users')
        .doc(targetUid)
        .collection('followers')
        .doc(currentUid);
    await _db.runTransaction((tx) async {
      tx.delete(followingRef);
      tx.delete(followerRef);
      tx.update(_db.collection('users').doc(currentUid),
          {'followingCount': FieldValue.increment(-1)});
      tx.update(_db.collection('users').doc(targetUid),
          {'followersCount': FieldValue.increment(-1)});
    });
  }

  // 私密帳戶：取消追蹤請求
  Future<void> cancelFollowRequest(
      String currentUid, String targetUid) async {
    await _db
        .collection('users')
        .doc(targetUid)
        .collection('followRequests')
        .doc(currentUid)
        .delete();
  }

  // 帳戶擁有者：批准追蹤請求
  Future<void> approveFollowRequest(
      String ownerUid, String requestorUid) async {
    final requestRef = _db
        .collection('users')
        .doc(ownerUid)
        .collection('followRequests')
        .doc(requestorUid);
    final followingRef = _db
        .collection('users')
        .doc(requestorUid)
        .collection('following')
        .doc(ownerUid);
    final followerRef = _db
        .collection('users')
        .doc(ownerUid)
        .collection('followers')
        .doc(requestorUid);
    await _db.runTransaction((tx) async {
      tx.delete(requestRef);
      tx.set(followingRef,
          {'followedAt': FieldValue.serverTimestamp()});
      tx.set(followerRef,
          {'followedAt': FieldValue.serverTimestamp()});
      tx.update(_db.collection('users').doc(requestorUid),
          {'followingCount': FieldValue.increment(1)});
      tx.update(_db.collection('users').doc(ownerUid),
          {'followersCount': FieldValue.increment(1)});
    });
  }

  // 帳戶擁有者：拒絕追蹤請求
  Future<void> rejectFollowRequest(
      String ownerUid, String requestorUid) async {
    await _db
        .collection('users')
        .doc(ownerUid)
        .collection('followRequests')
        .doc(requestorUid)
        .delete();
  }

  // 標記單一通知已讀
  Future<void> markNotificationRead(
      String uid, String notifId) async {
    await _db
        .collection('users')
        .doc(uid)
        .collection('notifications')
        .doc(notifId)
        .update({'isRead': true});
  }

  // 全部通知標為已讀
  Future<void> markAllNotificationsRead(String uid) async {
    final batch = _db.batch();
    final snap = await _db
        .collection('users')
        .doc(uid)
        .collection('notifications')
        .where('isRead', isEqualTo: false)
        .get();
    for (final doc in snap.docs) {
      batch.update(doc.reference, {'isRead': true});
    }
    await batch.commit();
  }

  Future<void> toggleBookmark(
      String postId, String uid, bool isBookmarked, PostModel post) async {
    final ref = _db
        .collection('users')
        .doc(uid)
        .collection('bookmarks')
        .doc(postId);
    if (isBookmarked) {
      await ref.delete();
    } else {
      await ref.set(
          {'postId': postId, 'savedAt': FieldValue.serverTimestamp()});
      unawaited(_recordInteraction(
        uid: uid,
        postId: postId,
        type: 'bookmark',
        hashtags: post.hashtags,
        category: post.category,
      ));
    }
  }

  Stream<List<PostModel>> userBookmarksStream(String uid) {
    return _db
        .collection('users')
        .doc(uid)
        .collection('bookmarks')
        .orderBy('savedAt', descending: true)
        .snapshots()
        .asyncMap((snap) async {
      if (snap.docs.isEmpty) return [];
      final ids = snap.docs.map((d) => d.id).toList();
      final posts = <PostModel>[];
      for (var i = 0; i < ids.length; i += 10) {
        final chunk = ids.sublist(i, math.min(i + 10, ids.length));
        final q = await _db
            .collection('posts')
            .where(FieldPath.documentId, whereIn: chunk)
            .get();
        posts.addAll(q.docs.map(PostModel.fromDoc));
      }
      return posts;
    });
  }

  Future<void> deleteDraft(String uid, String draftId) async {
    await _db
        .collection('users')
        .doc(uid)
        .collection('drafts')
        .doc(draftId)
        .delete();
  }

  Future<void> incrementViews(PostModel post, String uid) async {
    if (_sessionViewed.contains(post.id)) return;
    _sessionViewed.add(post.id);
    await _db
        .collection('posts')
        .doc(post.id)
        .update({'viewsCount': FieldValue.increment(1)});
    unawaited(_recordInteraction(
      uid: uid,
      postId: post.id,
      type: 'view',
      hashtags: post.hashtags,
      category: post.category,
    ));
  }

  Future<void> _recordInteraction({
    required String uid,
    required String postId,
    required String type,
    required List<String> hashtags,
    required String category,
  }) async {
    await _db
        .collection('users')
        .doc(uid)
        .collection('interactions')
        .add({
      'postId': postId,
      'type': type,
      'hashtags': hashtags,
      'category': category,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  Future<void> toggleRepost(
      String postId, String uid, bool isReposted, PostModel post) async {
    final postRef = _db.collection('posts').doc(postId);
    final repostRef = postRef.collection('reposts').doc(uid);
    // 同時寫入 users/{uid}/reposts/{postId} 讓個人主頁可查詢
    final userRepostRef = _db
        .collection('users')
        .doc(uid)
        .collection('reposts')
        .doc(postId);

    await _db.runTransaction((tx) async {
      if (isReposted) {
        tx.delete(repostRef);
        tx.delete(userRepostRef);
        tx.update(postRef, {'repostsCount': FieldValue.increment(-1)});
      } else {
        tx.set(repostRef,
            {'uid': uid, 'createdAt': FieldValue.serverTimestamp()});
        tx.set(userRepostRef,
            {'postId': postId, 'repostedAt': FieldValue.serverTimestamp()});
        tx.update(postRef, {'repostsCount': FieldValue.increment(1)});
      }
    });
    if (!isReposted) {
      unawaited(_recordInteraction(
        uid: uid,
        postId: postId,
        type: 'repost',
        hashtags: post.hashtags,
        category: post.category,
      ));
    }
  }

  // 取得某用戶轉發過的貼文
  Stream<List<PostModel>> userRepostsStream(String uid) {
    return _db
        .collection('users')
        .doc(uid)
        .collection('reposts')
        .orderBy('repostedAt', descending: true)
        .snapshots()
        .asyncMap((snap) async {
      if (snap.docs.isEmpty) return [];
      final ids = snap.docs.map((d) => d.id).toList();
      final posts = <PostModel>[];
      for (var i = 0; i < ids.length; i += 10) {
        final chunk = ids.sublist(i, math.min(i + 10, ids.length));
        final q = await _db
            .collection('posts')
            .where(FieldPath.documentId, whereIn: chunk)
            .get();
        posts.addAll(q.docs.map(PostModel.fromDoc));
      }
      return posts;
    });
  }

  Future<void> createPost({
    required String authorId,
    required String authorName,
    required String authorUsername,
    required String authorPhotoUrl,
    required String content,
    String? imageUrl,
    String? gifUrl,
    String? videoUrl,
    String? locationName,
    String? musicTitle,
    String? musicArtist,
    String? musicCoverUrl,
    String category = '一般生活',
    String? draftId,
  }) async {
    final postRef = _db.collection('posts').doc();
    final userRef = _db.collection('users').doc(authorId);

    // 抽取 hashtag 存成 array 方便搜尋
    final regex = RegExp(r'#(\w+)', unicode: true);
    final hashtags = regex
        .allMatches(content)
        .map((m) => m.group(1)!.toLowerCase())
        .toSet()
        .toList();

    await _db.runTransaction((tx) async {
      tx.set(postRef, {
        'authorId': authorId,
        'authorName': authorName,
        'authorUsername': authorUsername,
        'authorPhotoUrl': authorPhotoUrl,
        'content': content,
        'imageUrl': imageUrl,
        'gifUrl': gifUrl,
        'videoUrl': videoUrl,
        'locationName': locationName,
        'musicTitle': musicTitle,
        'musicArtist': musicArtist,
        'musicCoverUrl': musicCoverUrl,
        'hashtags': hashtags,
        'category': category,
        'likesCount': 0,
        'commentsCount': 0,
        'viewsCount': 0,
        'repostsCount': 0,
        'createdAt': FieldValue.serverTimestamp(),
      });
      tx.update(userRef, {'postsCount': FieldValue.increment(1)});
      if (draftId != null) {
        final draftRef = _db
            .collection('users')
            .doc(authorId)
            .collection('drafts')
            .doc(draftId);
        tx.delete(draftRef);
      }
    });
  }

  Future<void> editPost(String postId, String newContent) async {
    final regex = RegExp(r'#(\w+)', unicode: true);
    final hashtags = regex
        .allMatches(newContent)
        .map((m) => m.group(1)!.toLowerCase())
        .toSet()
        .toList();
    await _db.collection('posts').doc(postId).update({
      'content': newContent,
      'hashtags': hashtags,
    });
  }

  Future<void> deletePost(String postId, String authorId) async {
    final postRef = _db.collection('posts').doc(postId);
    final userRef = _db.collection('users').doc(authorId);
    await _db.runTransaction((tx) async {
      tx.delete(postRef);
      tx.update(userRef, {'postsCount': FieldValue.increment(-1)});
    });
  }

  Future<void> toggleLike(
      String postId, String uid, bool isLiked, PostModel post) async {
    final postRef = _db.collection('posts').doc(postId);
    final likeRef = postRef.collection('likes').doc(uid);
    await _db.runTransaction((tx) async {
      if (isLiked) {
        tx.delete(likeRef);
        tx.update(postRef, {'likesCount': FieldValue.increment(-1)});
      } else {
        tx.set(likeRef,
            {'uid': uid, 'createdAt': FieldValue.serverTimestamp()});
        tx.update(postRef, {'likesCount': FieldValue.increment(1)});
        if (post.authorId != uid) {
          final notifRef = _db
              .collection('users')
              .doc(post.authorId)
              .collection('notifications')
              .doc();
          tx.set(notifRef, {
            'toUserId': post.authorId,
            'fromUserId': uid,
            'fromUserName': '',
            'fromUserPhoto': '',
            'type': NotificationType.like.name,
            'postId': postId,
            'postContent': post.content,
            'isRead': false,
            'createdAt': FieldValue.serverTimestamp(),
          });
        }
      }
    });
    if (!isLiked) {
      unawaited(_recordInteraction(
        uid: uid,
        postId: postId,
        type: 'like',
        hashtags: post.hashtags,
        category: post.category,
      ));
    }
  }

  Future<void> addComment({
    required String postId,
    required String authorId,
    required String authorName,
    required String authorUsername,
    required String authorPhotoUrl,
    required String content,
    required String postAuthorId,
    required String postContent,
  }) async {
    final postRef = _db.collection('posts').doc(postId);
    final commentRef = postRef.collection('comments').doc();
    await _db.runTransaction((tx) async {
      tx.set(commentRef, {
        'authorId': authorId,
        'authorName': authorName,
        'authorUsername': authorUsername,
        'authorPhotoUrl': authorPhotoUrl,
        'content': content,
        'createdAt': FieldValue.serverTimestamp(),
      });
      tx.update(postRef, {'commentsCount': FieldValue.increment(1)});
      if (postAuthorId != authorId) {
        final notifRef = _db
            .collection('users')
            .doc(postAuthorId)
            .collection('notifications')
            .doc();
        tx.set(notifRef, {
          'toUserId': postAuthorId,
          'fromUserId': authorId,
          'fromUserName': authorName,
          'fromUserPhoto': authorPhotoUrl,
          'type': NotificationType.comment.name,
          'postId': postId,
          'postContent': postContent,
          'isRead': false,
          'createdAt': FieldValue.serverTimestamp(),
        });
      }
    });
  }
}

final postRepositoryProvider = Provider<PostRepository>(
    (ref) => PostRepository(ref.read(firestoreProvider)));
