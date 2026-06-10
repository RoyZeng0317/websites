import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../models/user_model.dart';

final firebaseAuthProvider =
    Provider<FirebaseAuth>((_) => FirebaseAuth.instance);

final authStateProvider = StreamProvider<User?>((ref) {
  return ref.watch(firebaseAuthProvider).authStateChanges();
});

final currentUserProvider = Provider<User?>((ref) {
  return ref.watch(authStateProvider).valueOrNull;
});

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.read(firebaseAuthProvider));
});

class AuthService {
  final FirebaseAuth _auth;
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  // final GoogleSignIn _googleSignIn = GoogleSignIn(scopes: ['email']);
  final GoogleSignIn _googleSignIn = GoogleSignIn(    // ← 在 class 層級，不是在方法裡
    serverClientId: '961714047293-bp5uv8vq5g40dnmsnrnv7buo37k59sod.apps.googleusercontent.com',
  );
  AuthService(this._auth);

  Future<void> signIn({
    required String email,
    required String password,
  }) async {
    await _auth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
  }
  
  

  Future<String> signUp({
    required String email,
    required String password,
    required String displayName,
  }) async {
    final cred = await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
    await cred.user?.updateDisplayName(displayName);
    await _createUserDoc(
      uid: cred.user!.uid,
      displayName: displayName,
      photoUrl: '',
    );
    return cred.user!.uid;
  }

  Future<void> saveVerificationDocs(
      String uid, String selfieUrl, String idCardUrl) async {
    await _db.collection('verifications').doc(uid).set({
      'uid': uid,
      'selfieUrl': selfieUrl,
      'idCardUrl': idCardUrl,
      'status': 'pending',
      'submittedAt': FieldValue.serverTimestamp(),
    });
    await _db.collection('users').doc(uid).update({
      'verificationStatus': 'pending',
    });
  }

  

/// Returns `true` if this is a brand-new Google account (needs verification).
Future<bool> signInWithGoogle() async {
  final googleUser = await _googleSignIn.signIn();

  if (googleUser == null) throw Exception('已取消 Google 登入');

  final googleAuth = await googleUser.authentication;
  final credential = GoogleAuthProvider.credential(
    accessToken: googleAuth.accessToken,
    idToken: googleAuth.idToken,
  );

  final cred = await _auth.signInWithCredential(credential);

  // Firebase's isNewUser is true ONLY on the very first sign-in with this
  // Google account — reliable even if the Firestore doc already exists for
  // some reason (e.g. after account deletion / re-registration edge cases).
  final isNewUser = cred.additionalUserInfo?.isNewUser ?? false;

  final doc = await _db.collection('users').doc(cred.user!.uid).get();
  if (!doc.exists) {
    await _createUserDoc(
      uid: cred.user!.uid,
      displayName: cred.user!.displayName ?? 'Velix User',
      photoUrl: cred.user!.photoURL ?? '',
    );
  }

  return isNewUser;
}

Future<void> signOut() async {
  await _googleSignIn.signOut();
  await _auth.signOut();
}

Future<bool> isUsernameAvailable(
    String username, String currentUid) async {
  if (username.isEmpty) return false;
  final q = await _db
      .collection('users')
      .where('username', isEqualTo: username.toLowerCase())
      .limit(1)
      .get();
  if (q.docs.isEmpty) return true;
  return q.docs.first.id == currentUid;
}

Future<void> updateProfile({
  required String uid,
  required String displayName,
  required String bio,
  String? username,
  String? photoUrl,
  bool? isPrivate,
  List<SocialLink>? socialLinks,
}) async {
  final data = <String, dynamic>{
    'displayName': displayName,
    'bio': bio,
  };
  if (photoUrl != null) data['photoUrl'] = photoUrl;
  if (username != null && username.isNotEmpty) {
    data['username'] = username.toLowerCase();
  }
  if (isPrivate != null) data['isPrivate'] = isPrivate;
  if (socialLinks != null) {
    data['socialLinks'] = socialLinks.map((l) => l.toMap()).toList();
  }
  await _db.collection('users').doc(uid).update(data);
  if (displayName != _auth.currentUser?.displayName) {
    await _auth.currentUser?.updateDisplayName(displayName);
  }
}

  Future<void> _createUserDoc({
    required String uid,
    required String displayName,
    required String photoUrl,
  }) async {
    final username = displayName
            .toLowerCase()
            .replaceAll(RegExp(r'[^a-z0-9]'), '_') +
        uid.substring(0, 4);

    await _db.collection('users').doc(uid).set({
      'uid': uid,
      'username': username,
      'displayName': displayName,
      'photoUrl': photoUrl,
      'bio': '',
      'followersCount': 0,
      'followingCount': 0,
      'postsCount': 0,
      'instagramUrl': '',
      'threadsUrl': '',
      'createdAt': FieldValue.serverTimestamp(),
    });
  }
}