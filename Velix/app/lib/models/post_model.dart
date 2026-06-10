import 'package:cloud_firestore/cloud_firestore.dart';

class PostModel {
  final String id;
  final String authorId;
  final String authorName;
  final String authorUsername;
  final String authorPhotoUrl;
  final String content;
  final String? imageUrl;
  final String? gifUrl;
  final String? videoUrl;
  final String? locationName;
  final String? musicTitle;
  final String? musicArtist;
  final String? musicCoverUrl;
  final String category;
  final List<String> hashtags;
  final int likesCount;
  final int commentsCount;
  final int viewsCount;
  final int repostsCount;
  final DateTime createdAt;

  PostModel({
    required this.id,
    required this.authorId,
    required this.authorName,
    required this.authorUsername,
    required this.authorPhotoUrl,
    required this.content,
    this.imageUrl,
    this.gifUrl,
    this.videoUrl,
    this.locationName,
    this.musicTitle,
    this.musicArtist,
    this.musicCoverUrl,
    this.category = '一般生活',
    this.hashtags = const [],
    required this.likesCount,
    required this.commentsCount,
    this.viewsCount = 0,
    this.repostsCount = 0,
    required this.createdAt,
  });

  factory PostModel.fromDoc(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PostModel(
      id: doc.id,
      authorId: data['authorId'] ?? '',
      authorName: data['authorName'] ?? '',
      authorUsername: data['authorUsername'] ?? '',
      authorPhotoUrl: data['authorPhotoUrl'] ?? '',
      content: data['content'] ?? '',
      imageUrl: data['imageUrl'],
      gifUrl: data['gifUrl'],
      videoUrl: data['videoUrl'],
      locationName: data['locationName'],
      musicTitle: data['musicTitle'],
      musicArtist: data['musicArtist'],
      musicCoverUrl: data['musicCoverUrl'],
      category: data['category'] ?? '一般生活',
      hashtags: List<String>.from(data['hashtags'] ?? []),
      likesCount: data['likesCount'] ?? 0,
      commentsCount: data['commentsCount'] ?? 0,
      viewsCount: data['viewsCount'] ?? 0,
      repostsCount: data['repostsCount'] ?? 0,
      createdAt: data['createdAt'] != null
          ? (data['createdAt'] as Timestamp).toDate()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() => {
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
        'category': category,
        'hashtags': hashtags,
        'likesCount': likesCount,
        'commentsCount': commentsCount,
        'viewsCount': viewsCount,
        'repostsCount': repostsCount,
        'createdAt': FieldValue.serverTimestamp(),
      };
}
