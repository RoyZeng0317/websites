import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

// ── Social Link ───────────────────────────────────────

class SocialLink {
  final String platform; // instagram/threads/twitter/tiktok/youtube/custom
  final String value;    // username OR full URL for custom

  const SocialLink({required this.platform, required this.value});

  factory SocialLink.fromMap(Map<String, dynamic> m) =>
      SocialLink(platform: m['platform'] ?? 'custom', value: m['value'] ?? '');

  Map<String, dynamic> toMap() => {'platform': platform, 'value': value};

  String get url {
    switch (platform) {
      case 'instagram':
        return 'https://instagram.com/$value';
      case 'threads':
        return 'https://threads.net/@$value';
      case 'twitter':
        return 'https://x.com/$value';
      case 'tiktok':
        return 'https://tiktok.com/@$value';
      case 'youtube':
        return 'https://youtube.com/@$value';
      default:
        return value;
    }
  }

  String get label {
    switch (platform) {
      case 'instagram': return 'Instagram';
      case 'threads':   return 'Threads';
      case 'twitter':   return 'X (Twitter)';
      case 'tiktok':    return 'TikTok';
      case 'youtube':   return 'YouTube';
      default:          return '連結';
    }
  }

  String get displayText {
    switch (platform) {
      case 'instagram':
      case 'threads':
      case 'twitter':
      case 'tiktok':
      case 'youtube':
        return '@$value';
      default:
        // Show domain only for readability
        try {
          return Uri.parse(value).host;
        } catch (_) {
          return value;
        }
    }
  }

  IconData get icon {
    switch (platform) {
      case 'instagram': return Icons.camera_alt_outlined;
      case 'threads':   return Icons.alternate_email;
      case 'twitter':   return Icons.tag;
      case 'tiktok':    return Icons.music_note_outlined;
      case 'youtube':   return Icons.play_circle_outline;
      default:          return Icons.link;
    }
  }

  Color get color {
    switch (platform) {
      case 'instagram': return const Color(0xFFE1306C);
      case 'threads':   return Colors.white;
      case 'twitter':   return const Color(0xFF1DA1F2);
      case 'tiktok':    return const Color(0xFF69C9D0);
      case 'youtube':   return Colors.red;
      default:          return const Color(0xFF4FC3F7);
    }
  }
}

// ── Platform catalogue ────────────────────────────────

const kSocialPlatforms = [
  ('instagram', 'Instagram',   Icons.camera_alt_outlined,  Color(0xFFE1306C)),
  ('threads',   'Threads',     Icons.alternate_email,      Colors.white),
  ('twitter',   'X (Twitter)', Icons.tag,                  Color(0xFF1DA1F2)),
  ('tiktok',    'TikTok',      Icons.music_note_outlined,  Color(0xFF69C9D0)),
  ('youtube',   'YouTube',     Icons.play_circle_outline,  Colors.red),
  ('custom',    '自訂連結',    Icons.link,                 Color(0xFF4FC3F7)),
];

// ── UserModel ─────────────────────────────────────────

class UserModel {
  final String uid;
  final String username;
  final String displayName;
  final String photoUrl;
  final String bio;
  final int followersCount;
  final int followingCount;
  final int postsCount;
  final bool isPrivate;
  final List<SocialLink> socialLinks; // max 5

  UserModel({
    required this.uid,
    required this.username,
    required this.displayName,
    required this.photoUrl,
    required this.bio,
    required this.followersCount,
    required this.followingCount,
    required this.postsCount,
    this.isPrivate = false,
    this.socialLinks = const [],
  });

  factory UserModel.fromDoc(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;

    // New: socialLinks list
    final rawLinks = data['socialLinks'] as List<dynamic>? ?? [];
    List<SocialLink> links = rawLinks
        .whereType<Map<String, dynamic>>()
        .map(SocialLink.fromMap)
        .toList();

    // Backward compat: migrate old instagramUrl / threadsUrl fields
    if (links.isEmpty) {
      final ig = data['instagramUrl'] as String? ?? '';
      final th = data['threadsUrl'] as String? ?? '';
      if (ig.isNotEmpty) links.add(SocialLink(platform: 'instagram', value: ig));
      if (th.isNotEmpty) links.add(SocialLink(platform: 'threads', value: th));
    }

    return UserModel(
      uid: doc.id,
      username: data['username'] ?? '',
      displayName: data['displayName'] ?? '',
      photoUrl: data['photoUrl'] ?? '',
      bio: data['bio'] ?? '',
      followersCount: data['followersCount'] ?? 0,
      followingCount: data['followingCount'] ?? 0,
      postsCount: data['postsCount'] ?? 0,
      isPrivate: data['isPrivate'] ?? false,
      socialLinks: links,
    );
  }

  Map<String, dynamic> toMap() => {
        'uid': uid,
        'username': username,
        'displayName': displayName,
        'photoUrl': photoUrl,
        'bio': bio,
        'followersCount': followersCount,
        'followingCount': followingCount,
        'postsCount': postsCount,
        'isPrivate': isPrivate,
        'socialLinks': socialLinks.map((l) => l.toMap()).toList(),
        'createdAt': FieldValue.serverTimestamp(),
      };
}
