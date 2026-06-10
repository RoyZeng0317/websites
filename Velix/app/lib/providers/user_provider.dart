import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/notification_model.dart';
import '../models/user_model.dart';
import 'auth_provider.dart';
import 'post_provider.dart';

final userSearchProvider =
    FutureProvider.family<List<UserModel>, String>((ref, query) async {
  if (query.trim().isEmpty) return [];
  final q = query.trim().toLowerCase();
  final snap = await ref
      .read(firestoreProvider)
      .collection('users')
      .where('username', isGreaterThanOrEqualTo: q)
      .where('username', isLessThan: '$q')
      .limit(20)
      .get();
  return snap.docs.map(UserModel.fromDoc).toList();
});

final userDataProvider =
    FutureProvider.family<UserModel?, String>((ref, uid) async {
  if (uid.isEmpty) return null;
  final doc = await ref
      .read(firestoreProvider)
      .collection('users')
      .doc(uid)
      .get();
  return doc.exists ? UserModel.fromDoc(doc) : null;
});

final currentUserDataProvider = StreamProvider<UserModel?>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value(null);
  return ref
      .read(firestoreProvider)
      .collection('users')
      .doc(user.uid)
      .snapshots()
      .map((d) => d.exists ? UserModel.fromDoc(d) : null);
});

final notificationsProvider =
    StreamProvider<List<NotificationModel>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value([]);
  return ref
      .read(firestoreProvider)
      .collection('users')
      .doc(user.uid)
      .collection('notifications')
      .orderBy('createdAt', descending: true)
      .limit(50)
      .snapshots()
      .map((s) => s.docs.map(NotificationModel.fromDoc).toList());
});

final unreadNotificationsCountProvider = Provider<int>((ref) {
  final notifs = ref.watch(notificationsProvider).valueOrNull ?? [];
  return notifs.where((n) => !n.isRead).length;
});
