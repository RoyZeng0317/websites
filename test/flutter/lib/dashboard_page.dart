import 'dart:math';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});
  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  User? _user;
  List<Map<String, dynamic>> _scores = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _user = FirebaseAuth.instance.currentUser;
    if (_user != null) { _loadScores(); return; }
    FirebaseAuth.instance.authStateChanges().listen((u) {
      if (u != null && mounted) {
        setState(() => _user = u);
        _loadScores();
      }
    });
    setState(() => _loading = false);
  }

  Future<void> _signIn() async {
    try {
      final provider = GoogleAuthProvider();
      await FirebaseAuth.instance.signInWithRedirect(provider);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('登入失敗: $e')));
      }
    }
  }

  Future<void> _signOut() async {
    await FirebaseAuth.instance.signOut();
    setState(() { _user = null; _scores = []; _loading = false; });
  }

  Future<void> _loadScores() async {
    setState(() => _loading = true);
    try {
      final snap = await FirebaseFirestore.instance
          .collection('scores').where('uid', isEqualTo: _user!.uid)
          .orderBy('timestamp', descending: true).limit(50).get();
      _scores = snap.docs.map((d) => {...d.data(), 'id': d.id}).toList();
    } catch (_) {}
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('成績與分析', style: TextStyle(fontSize: 16)),
        backgroundColor: const Color(0xFF1E1E1E),
        actions: [
          if (_user != null)
            TextButton(onPressed: _signOut, child: const Text('登出', style: TextStyle(color: Colors.redAccent, fontSize: 13))),
        ],
      ),
      body: _user == null ? _buildLoginPrompt() : (_loading ? const Center(child: CircularProgressIndicator()) : _buildDashboard()),
    );
  }

  Widget _buildLoginPrompt() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.account_circle, size: 72, color: Colors.grey[600]),
            const SizedBox(height: 20),
            const Text('登入以記錄答題成績', style: TextStyle(fontSize: 16, color: Color(0xFF94A3B8))),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _signIn,
              icon: const Icon(Icons.login),
              label: const Text('使用 Google 登入'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF38BDF8), foregroundColor: const Color(0xFF0F172A),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDashboard() {
    List<Map<String, dynamic>> recent = _scores;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildUserCard(),
          const SizedBox(height: 16),
          if (recent.isNotEmpty) ...[
            _buildRadarSection(recent.first),
            const SizedBox(height: 16),
          ],
          Text('近期成績 (${recent.length})', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8))),
          const SizedBox(height: 8),
          if (recent.isEmpty)
            const Center(child: Padding(
              padding: EdgeInsets.all(32),
              child: Text('尚無成績記錄，完成考試後會自動儲存', style: TextStyle(color: Color(0xFF64748B))),
            ))
          else
            ...recent.map(_buildScoreCard),
        ],
      ),
    );
  }

  Widget _buildUserCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFF334155))),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundImage: _user!.photoURL != null ? NetworkImage(_user!.photoURL!) : null,
            child: _user!.photoURL == null ? const Icon(Icons.person) : null,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(_user!.displayName ?? '使用者', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFFF1F5F9))),
                Text(_user!.email ?? '', style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRadarSection(Map<String, dynamic> score) {
    final wiScoresRaw = score['wiScores'] as Map<String, dynamic>?;
    if (wiScoresRaw == null || wiScoresRaw.isEmpty) return const SizedBox.shrink();
    final entries = wiScoresRaw.entries.map((e) => MapEntry(int.parse(e.key), (e.value as num).toInt())).toList()
      ..sort((a, b) => a.key.compareTo(b.key));
    if (entries.isEmpty) return const SizedBox.shrink();
    final subjectName = score['subjectName'] as String? ?? '';
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFF334155))),
      child: Column(
        children: [
          Text('能力分布圖', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8))),
          const SizedBox(height: 4),
          Text('$subjectName | ${score['score']}/${score['total']} (${score['percentage']}%)',
            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          const SizedBox(height: 12),
          SizedBox(height: 260, child: RadarChart(data: entries.map((e) => e.value.toDouble()).toList(), labels: entries.map((e) => 'Wi${e.key}').toList())),
        ],
      ),
    );
  }

  Widget _buildScoreCard(Map<String, dynamic> s) {
    final ts = s['timestamp'] as Timestamp?;
    final dateStr = ts != null ? ts.toDate().toString().substring(0, 19) : '';
    final pct = s['percentage'] as int? ?? 0;
    final subj = s['subjectName'] as String? ?? '';
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFF334155))),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subj, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFFE0E0E0))),
                if (dateStr.isNotEmpty) Text(dateStr, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: pct >= 60 ? const Color(0xFF1A3A1A) : const Color(0xFF3A1A1A),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: pct >= 60 ? const Color(0xFF4CAF50) : const Color(0xFFF44336)),
            ),
            child: Text('$pct%', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: pct >= 60 ? const Color(0xFF4CAF50) : const Color(0xFFF44336))),
          ),
        ],
      ),
    );
  }
}

class RadarChart extends StatelessWidget {
  final List<double> data;
  final List<String> labels;
  const RadarChart({super.key, required this.data, required this.labels});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(double.infinity, 260),
      painter: _RadarPainter(data, labels, Theme.of(context).brightness),
    );
  }
}

class _RadarPainter extends CustomPainter {
  final List<double> data;
  final List<String> labels;
  final Brightness brightness;
  _RadarPainter(this.data, this.labels, this.brightness);

  @override
  void paint(Canvas canvas, Size size) {
    final n = data.length;
    if (n < 3) return;
    final cx = size.width / 2;
    final cy = size.height / 2;
    final r = min(cx, cy) - 30;
    final angleStep = 2 * pi / n;
    final maxVal = data.reduce(max);
    final scale = maxVal > 0 ? r / maxVal : r;

    final gridPaint = Paint()..color = const Color(0xFF334155).withValues(alpha: 0.15)..style = PaintingStyle.stroke..strokeWidth = 0.5;
    final fillPaint = Paint()..color = const Color(0xFF38BDF8).withValues(alpha: 0.15)..style = PaintingStyle.fill;
    final linePaint = Paint()..color = const Color(0xFF38BDF8)..style = PaintingStyle.stroke..strokeWidth = 2;
    final dotPaint = Paint()..color = const Color(0xFF38BDF8)..style = PaintingStyle.fill;
    final labelPaint = TextPainter(textDirection: TextDirection.ltr);

    final points = <Offset>[];
    for (var i = 0; i < n; i++) {
      final a = -pi / 2 + i * angleStep;
      points.add(Offset(cx + r * cos(a), cy + r * sin(a)));
    }

    for (var level = 1; level <= 4; level++) {
      final lr = r * level / 4;
      final path = Path();
      for (var i = 0; i < n; i++) {
        final a = -pi / 2 + i * angleStep;
        final x = cx + lr * cos(a);
        final y = cy + lr * sin(a);
        i == 0 ? path.moveTo(x, y) : path.lineTo(x, y);
      }
      path.close();
      canvas.drawPath(path, gridPaint);
    }

    for (var i = 0; i < n; i++) {
      canvas.drawLine(Offset(cx, cy), points[i], gridPaint);
    }

    final dataPath = Path();
    for (var i = 0; i < n; i++) {
      final a = -pi / 2 + i * angleStep;
      final v = data[i] * scale;
      final x = cx + v * cos(a);
      final y = cy + v * sin(a);
      i == 0 ? dataPath.moveTo(x, y) : dataPath.lineTo(x, y);
    }
    dataPath.close();
    canvas.drawPath(dataPath, fillPaint);
    canvas.drawPath(dataPath, linePaint);

    for (var i = 0; i < n; i++) {
      final a = -pi / 2 + i * angleStep;
      final v = data[i] * scale;
      final x = cx + v * cos(a);
      final y = cy + v * sin(a);
      canvas.drawCircle(Offset(x, y), 3, dotPaint);

      final lx = cx + (r + 20) * cos(a);
      final ly = cy + (r + 20) * sin(a);
      labelPaint.text = TextSpan(text: labels[i], style: TextStyle(color: const Color(0xFF94A3B8), fontSize: 10));
      labelPaint.layout();
      final tx = lx - labelPaint.width / 2;
      final ty = ly - labelPaint.height / 2;
      labelPaint.paint(canvas, Offset(tx, ty));
    }
  }

  @override
  bool shouldRepaint(covariant _RadarPainter old) => data != old.data;
}
