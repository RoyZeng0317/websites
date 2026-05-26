import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class HoldingRecord {
  final String id;
  final String symbol;
  final double buyPrice;
  final double shares;
  final DateTime createdAt;

  HoldingRecord({
    required this.id,
    required this.symbol,
    required this.buyPrice,
    required this.shares,
    required this.createdAt,
  });

  double get cost => buyPrice * shares;

  double marketValue(double currentPrice) => currentPrice * shares;

  double profit(double currentPrice) => marketValue(currentPrice) - cost;

  double profitPercent(double currentPrice) =>
      buyPrice > 0 ? (currentPrice - buyPrice) / buyPrice * 100 : 0;

  Map<String, dynamic> toFirestore() => {
        'symbol': symbol,
        'buyPrice': buyPrice,
        'shares': shares,
        'createdAt': Timestamp.fromDate(createdAt),
      };

  factory HoldingRecord.fromFirestore(String id, Map<String, dynamic> data) {
    final ts = data['createdAt'];
    return HoldingRecord(
      id: id,
      symbol: data['symbol'] ?? '',
      buyPrice: (data['buyPrice'] ?? 0).toDouble(),
      shares: (data['shares'] ?? 0).toDouble(),
      createdAt: ts is Timestamp ? ts.toDate() : DateTime.now(),
    );
  }
}

class HoldingsService {
  static final _auth = FirebaseAuth.instance;
  static final _firestore = FirebaseFirestore.instance;

  static User? get user => _auth.currentUser;

  static String? get _uid => user?.uid;

  static CollectionReference _holdings() =>
      _firestore.collection('users').doc(_uid).collection('holdings');

  static Future<List<HoldingRecord>> getHoldings() async {
    if (_uid == null) return [];
    try {
      final snap = await _holdings().get();
      final docs = snap.docs
          .where((d) => d.id.isNotEmpty && (d.data() as Map)['symbol'] != null)
          .toList();
      final records = docs.map((d) => HoldingRecord.fromFirestore(
          d.id, d.data() as Map<String, dynamic>));
      final sorted = records.toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return sorted;
    } catch (_) {
      return [];
    }
  }

  static Future<void> addHolding(String symbol, double buyPrice, double shares) async {
    if (_uid == null) return;
    await _holdings().add({
      'symbol': symbol,
      'buyPrice': buyPrice,
      'shares': shares,
      'createdAt': Timestamp.now(),
    });
  }

  static Future<void> deleteHolding(String id) async {
    if (_uid == null) return;
    await _holdings().doc(id).delete();
  }

  static Stream<User?> authState() => _auth.authStateChanges();

  static Future<User?> signIn() async {
    final provider = GoogleAuthProvider();
    try {
      final result = await _auth.signInWithPopup(provider);
      return result.user;
    } catch (_) {
      return null;
    }
  }

  static Future<void> signOut() => _auth.signOut();
}
