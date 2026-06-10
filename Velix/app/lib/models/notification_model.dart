import 'package:cloud_firestore/cloud_firestore.dart';

enum NotificationType { like, comment, follow, followRequest }

class NotificationModel {
  final String id;
  final String toUserId;
  final String fromUserId;
  final String fromUserName;
  final String fromUserPhoto;
  final NotificationType type;
  final String postId;
  final String postContent;
  final bool isRead;
  final DateTime createdAt;

  NotificationModel({
    required this.id,
    required this.toUserId,
    required this.fromUserId,
    required this.fromUserName,
    required this.fromUserPhoto,
    required this.type,
    this.postId = '',
    this.postContent = '',
    required this.isRead,
    required this.createdAt,
  });

  factory NotificationModel.fromDoc(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return NotificationModel(
      id: doc.id,
      toUserId: data['toUserId'] ?? '',
      fromUserId: data['fromUserId'] ?? '',
      fromUserName: data['fromUserName'] ?? '',
      fromUserPhoto: data['fromUserPhoto'] ?? '',
      type: NotificationType.values.firstWhere(
        (e) => e.name == data['type'],
        orElse: () => NotificationType.like,
      ),
      postId: data['postId'] ?? '',
      postContent: data['postContent'] ?? '',
      isRead: data['isRead'] ?? false,
      createdAt: data['createdAt'] != null
          ? (data['createdAt'] as Timestamp).toDate()
          : DateTime.now(),
    );
  }
}
