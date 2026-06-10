import 'package:cloud_firestore/cloud_firestore.dart';

class DraftModel {
  final String id;
  final String content;
  final String? imageUrl;
  final String? gifUrl;
  final String? videoUrl;
  final String? locationName;
  final String? musicTitle;
  final String? musicArtist;
  final String category;
  final DateTime updatedAt;

  DraftModel({
    required this.id,
    required this.content,
    this.imageUrl,
    this.gifUrl,
    this.videoUrl,
    this.locationName,
    this.musicTitle,
    this.musicArtist,
    this.category = '一般生活',
    required this.updatedAt,
  });

  factory DraftModel.fromDoc(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return DraftModel(
      id: doc.id,
      content: data['content'] ?? '',
      imageUrl: data['imageUrl'],
      gifUrl: data['gifUrl'],
      videoUrl: data['videoUrl'],
      locationName: data['locationName'],
      musicTitle: data['musicTitle'],
      musicArtist: data['musicArtist'],
      category: data['category'] ?? '一般生活',
      updatedAt:
          (data['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() => {
        'content': content,
        'imageUrl': imageUrl,
        'gifUrl': gifUrl,
        'videoUrl': videoUrl,
        'locationName': locationName,
        'musicTitle': musicTitle,
        'musicArtist': musicArtist,
        'category': category,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
