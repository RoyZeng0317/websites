import 'package:cloud_firestore/cloud_firestore.dart';

class MessageModel {
  final String id;
  final String senderId;
  final String content;
  final String? imageUrl;
  final bool isRead;
  final bool isRecalled;
  final bool isEdited;
  final DateTime? burnAt;
  final DateTime createdAt;

  MessageModel({
    required this.id,
    required this.senderId,
    required this.content,
    this.imageUrl,
    required this.isRead,
    this.isRecalled = false,
    this.isEdited = false,
    this.burnAt,
    required this.createdAt,
  });

  factory MessageModel.fromDoc(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return MessageModel(
      id: doc.id,
      senderId: data['senderId'] ?? '',
      content: data['content'] ?? '',
      imageUrl: data['imageUrl'],
      isRead: data['isRead'] ?? false,
      isRecalled: data['isRecalled'] ?? false,
      isEdited: data['isEdited'] ?? false,
      burnAt: data['burnAt'] != null
          ? (data['burnAt'] as Timestamp).toDate()
          : null,
      createdAt: data['createdAt'] != null
          ? (data['createdAt'] as Timestamp).toDate()
          : DateTime.now(),
    );
  }
}

class ChatRoom {
  final String id;
  final List<String> participants;
  final String lastMessage;
  final DateTime lastMessageTime;
  final Map<String, int> unreadCount;
  final int burnMode; // 0=off, 1=leave, 60=1min, 180=3min, 300=5min
  final List<String> hiddenFor; // UIDs who deleted this conversation client-side

  ChatRoom({
    required this.id,
    required this.participants,
    required this.lastMessage,
    required this.lastMessageTime,
    required this.unreadCount,
    this.burnMode = 0,
    this.hiddenFor = const [],
  });

  factory ChatRoom.fromDoc(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    final rawUnread = data['unreadCount'] as Map<String, dynamic>? ?? {};
    return ChatRoom(
      id: doc.id,
      participants: List<String>.from(data['participants'] ?? []),
      lastMessage: data['lastMessage'] ?? '',
      lastMessageTime: data['lastMessageTime'] != null
          ? (data['lastMessageTime'] as Timestamp).toDate()
          : DateTime.now(),
      unreadCount: rawUnread.map((k, v) => MapEntry(k, (v as num).toInt())),
      burnMode: (data['burnMode'] as num?)?.toInt() ?? 0,
      hiddenFor: List<String>.from(data['hiddenFor'] ?? []),
    );
  }
}
