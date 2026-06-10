import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/message_model.dart';
import '../models/user_model.dart';
import 'auth_provider.dart';
import 'post_provider.dart';

String getChatId(String uid1, String uid2) {
  final sorted = [uid1, uid2]..sort();
  return '${sorted[0]}_${sorted[1]}';
}

// 目前用戶的所有聊天室
final chatRoomsProvider = StreamProvider<List<ChatRoom>>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value([]);
  return ref
      .read(firestoreProvider)
      .collection('messages')
      .where('participants', arrayContains: user.uid)
      .orderBy('lastMessageTime', descending: true)
      .snapshots()
      .map((s) => s.docs
          .map(ChatRoom.fromDoc)
          .where((r) => !r.hiddenFor.contains(user.uid))
          .toList());
});

// 單一聊天室 (for burn mode / room metadata)
final chatRoomProvider =
    StreamProvider.family<ChatRoom?, String>((ref, chatId) {
  return ref
      .read(firestoreProvider)
      .collection('messages')
      .doc(chatId)
      .snapshots()
      .map((d) => d.exists ? ChatRoom.fromDoc(d) : null);
});

// 單一聊天室的訊息（cleanupOldMessages 負責實際刪除 14 天前的資料）
final chatMessagesProvider =
    StreamProvider.family<List<MessageModel>, String>((ref, chatId) {
  return ref
      .read(firestoreProvider)
      .collection('messages')
      .doc(chatId)
      .collection('chat')
      .orderBy('createdAt', descending: false)
      .snapshots()
      .map((s) => s.docs.map(MessageModel.fromDoc).toList());
});

// 未讀訊息總數
final unreadMessagesCountProvider = Provider<int>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return 0;
  final rooms = ref.watch(chatRoomsProvider).valueOrNull ?? [];
  return rooms.fold<int>(
      0, (total, r) => total + (r.unreadCount[user.uid] ?? 0));
});

// 對方是否有回追（決定訊息限制）
final partnerFollowsMeProvider =
    StreamProvider.family<bool, String>((ref, partnerUid) {
  final currentUid = ref.read(currentUserProvider)?.uid;
  if (currentUid == null) return Stream.value(false);
  return ref
      .read(firestoreProvider)
      .collection('users')
      .doc(currentUid)
      .collection('followers')
      .doc(partnerUid)
      .snapshots()
      .map((d) => d.exists);
});

// ── Repository ───────────────────────────────────────
class MessageRepository {
  final FirebaseFirestore _db;
  MessageRepository(this._db);

  Future<void> sendMessage({
    required String currentUid,
    required String targetUid,
    required String content,
    String? imageUrl,
  }) async {
    final chatId = getChatId(currentUid, targetUid);
    final roomRef = _db.collection('messages').doc(chatId);
    final msgRef = roomRef.collection('chat').doc();

    await _db.runTransaction((tx) async {
      final roomDoc = await tx.get(roomRef);
      final burnMode =
          (roomDoc.data()?['burnMode'] as num?)?.toInt() ?? 0;

      final msgData = <String, dynamic>{
        'senderId': currentUid,
        'content': content,
        'imageUrl': imageUrl,
        'isRead': false,
        'isRecalled': false,
        'isEdited': false,
        'createdAt': FieldValue.serverTimestamp(),
      };

      // Timer burn modes: set burnAt at send time
      if (burnMode > 1) {
        msgData['burnAt'] = Timestamp.fromDate(
          DateTime.now().add(Duration(seconds: burnMode)),
        );
      }

      tx.set(msgRef, msgData);

      if (!roomDoc.exists) {
        tx.set(roomRef, {
          'participants': [currentUid, targetUid],
          'lastMessage': imageUrl != null ? '📷 圖片' : content,
          'lastMessageTime': FieldValue.serverTimestamp(),
          'unreadCount': {targetUid: 1, currentUid: 0},
          'burnMode': 0,
          'hiddenFor': [],
        });
      } else {
        final unread =
            Map<String, int>.from(roomDoc.data()?['unreadCount'] ?? {});
        unread[targetUid] = (unread[targetUid] ?? 0) + 1;
        tx.update(roomRef, {
          'lastMessage': imageUrl != null ? '📷 圖片' : content,
          'lastMessageTime': FieldValue.serverTimestamp(),
          'unreadCount': unread,
          'hiddenFor': [],
        });
      }
    });
  }

  Future<void> editMessage(
      String chatId, String msgId, String newContent) async {
    await _db
        .collection('messages')
        .doc(chatId)
        .collection('chat')
        .doc(msgId)
        .update({'content': newContent, 'isEdited': true});
  }

  Future<void> recallMessage(String chatId, String msgId) async {
    final roomRef = _db.collection('messages').doc(chatId);
    final msgRef = roomRef.collection('chat').doc(msgId);

    // Mark as recalled first
    await msgRef.update(
        {'isRecalled': true, 'content': '', 'imageUrl': null});

    // Find the latest non-recalled message to restore room preview
    final recentSnap = await roomRef
        .collection('chat')
        .orderBy('createdAt', descending: true)
        .limit(20)
        .get();

    final lastVisible = recentSnap.docs
        .where((d) =>
            d.id != msgId && !(d.data()['isRecalled'] as bool? ?? false))
        .toList();

    if (lastVisible.isEmpty) {
      await roomRef.update({'lastMessage': ''});
    } else {
      final data = lastVisible.first.data();
      final content = data['imageUrl'] != null
          ? '📷 圖片'
          : (data['content'] as String? ?? '');
      await roomRef.update({
        'lastMessage': content,
        'lastMessageTime': data['createdAt'],
      });
    }
  }

  Future<void> deleteMessage(String chatId, String msgId) async {
    await _db
        .collection('messages')
        .doc(chatId)
        .collection('chat')
        .doc(msgId)
        .delete();
  }

  Future<void> setBurnMode(String chatId, int burnMode) async {
    await _db
        .collection('messages')
        .doc(chatId)
        .update({'burnMode': burnMode});
  }

  Future<void> deleteAllMessages(String chatId) async {
    final snap = await _db
        .collection('messages')
        .doc(chatId)
        .collection('chat')
        .get();
    if (snap.docs.isEmpty) return;
    final batch = _db.batch();
    for (final doc in snap.docs) {
      batch.delete(doc.reference);
    }
    await batch.commit();
    await _db.collection('messages').doc(chatId).update({
      'lastMessage': '',
      'lastMessageTime': FieldValue.serverTimestamp(),
    });
  }

  Future<void> markAsRead(String chatId, String uid) async {
    final roomRef = _db.collection('messages').doc(chatId);
    await roomRef.update({'unreadCount.$uid': 0});

    final unreadMsgs = await roomRef
        .collection('chat')
        .where('isRead', isEqualTo: false)
        .get();

    final toMark = unreadMsgs.docs
        .where((doc) => doc.data()['senderId'] != uid)
        .toList();

    if (toMark.isEmpty) return;
    final batch = _db.batch();
    for (final doc in toMark) {
      batch.update(doc.reference, {'isRead': true});
    }
    await batch.commit();
  }

  /// Deletes messages older than 14 days. Call on chat open (fire-and-forget).
  Future<void> cleanupOldMessages(String chatId) async {
    final cutoff = Timestamp.fromDate(
      DateTime.now().subtract(const Duration(days: 14)),
    );
    final old = await _db
        .collection('messages')
        .doc(chatId)
        .collection('chat')
        .where('createdAt', isLessThan: cutoff)
        .get();
    if (old.docs.isEmpty) return;
    final batch = _db.batch();
    for (final doc in old.docs) {
      batch.delete(doc.reference);
    }
    await batch.commit();
  }

  /// Hides the conversation for [currentUid] only — messages are kept intact
  /// and will reappear for both parties if a new message is sent.
  Future<void> deleteConversation(
      String chatId, String currentUid) async {
    await _db.collection('messages').doc(chatId).update({
      'hiddenFor': FieldValue.arrayUnion([currentUid]),
    });
  }

  Future<UserModel?> getChatPartner(
      String chatId, String currentUid) async {
    final doc =
        await _db.collection('messages').doc(chatId).get();
    if (!doc.exists) return null;
    final participants =
        List<String>.from(doc.data()?['participants'] ?? []);
    final partnerId = participants.firstWhere(
        (id) => id != currentUid,
        orElse: () => '');
    if (partnerId.isEmpty) return null;
    final userDoc =
        await _db.collection('users').doc(partnerId).get();
    return userDoc.exists ? UserModel.fromDoc(userDoc) : null;
  }
}

final messageRepositoryProvider = Provider<MessageRepository>(
    (ref) => MessageRepository(ref.read(firestoreProvider)));
