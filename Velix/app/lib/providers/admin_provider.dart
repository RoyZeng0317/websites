import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/post_model.dart';
import '../models/user_model.dart';
import 'auth_provider.dart';

final firestoreProvider =
    Provider<FirebaseFirestore>((_) => FirebaseFirestore.instance);

final adminStatsProvider = FutureProvider<Map<String, int>>((ref) async {
  final db = ref.read(firestoreProvider);
  final usersSnap = await db.collection('users').count().get();
  final postsSnap = await db.collection('posts').count().get();
  return {
    'users': usersSnap.count ?? 0,
    'posts': postsSnap.count ?? 0,
  };
});

final adminUsersProvider = FutureProvider<List<UserModel>>((ref) async {
  final db = ref.read(firestoreProvider);
  final snap = await db
      .collection('users')
      .orderBy('createdAt', descending: true)
      .limit(100)
      .get();
  return snap.docs.map(UserModel.fromDoc).toList();
});

final adminPostsProvider = FutureProvider<List<PostModel>>((ref) async {
  final db = ref.read(firestoreProvider);
  final snap = await db
      .collection('posts')
      .orderBy('createdAt', descending: true)
      .limit(100)
      .get();
  return snap.docs.map(PostModel.fromDoc).toList();
});

final isAdminProvider = Provider<bool>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return false;
  return _adminUids.contains(user.uid);
});

const _adminUids = <String>{
  // 請把你的 UID 加在這裡
};
