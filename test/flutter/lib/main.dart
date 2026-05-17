import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dashboard_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp(
      options: const FirebaseOptions(
        apiKey: 'AIzaSyAgoHsPRCkW7a0Sfw82bBPVlMFVAs5Udds',
        authDomain: 'test-exam-db65a.firebaseapp.com',
        projectId: 'test-exam-db65a',
        storageBucket: 'test-exam-db65a.firebasestorage.app',
        messagingSenderId: '914637875391',
        appId: '1:914637875391:web:230b7d38546b64f914fe0a',
        measurementId: 'G-3B2EJGSS1G',
      ),
    );
  } catch (_) {}
  runApp(const QuizApp());
}

class QuizApp extends StatelessWidget {
  const QuizApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '即測即評題庫網',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF38BDF8),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        cardColor: const Color(0xFF1E293B),
      ),
      home: const LandingPage(),
    );
  }
}

// ─── Models ────────────────────────────────────────────────────────────────
class Question {
  final int id;
  final String type;
  final String question;
  final List<String> options;
  final List<int> answer;
  final String? image;
  Question({required this.id, required this.type, required this.question, required this.options, required this.answer, this.image});
}

class SubjectCfg {
  final String name;
  final List<String> files;
  final Map<int, String> wiNames;
  final List<Map<String, int>> wiRanges;
  final int wiCount;
  const SubjectCfg({required this.name, required this.files, required this.wiNames, required this.wiRanges, required this.wiCount});
}

// ─── Constants ─────────────────────────────────────────────────────────────
const String imageBaseUrl = 'https://test-exam-db65a.web.app';

const subjectConfig = {
  '11700': SubjectCfg(
    name: '11700 數位電子乙級',
    files: ['assets/sql/11700_Single.sql', 'assets/sql/11700_Mutpile.sql'],
    wiNames: {1:'工作項目01：電機電子識圖',2:'工作項目02：零組件',3:'工作項目03：儀表與檢修測試',4:'工作項目04：電子工作法',5:'工作項目05：電子學與電子電路',6:'工作項目06：數位系統設計',7:'工作項目07：電腦與周邊設備',8:'工作項目08：程式語言',9:'工作項目09：網路技術與應用',10:'工作項目10：嵌入式系統'},
    wiRanges: [{'s':1,'e':28},{'s':29,'e':61},{'s':62,'e':131},{'s':132,'e':189},{'s':190,'e':311},{'s':312,'e':451},{'s':452,'e':580},{'s':581,'e':661},{'s':662,'e':703},{'s':704,'e':743}],
    wiCount: 10,
  ),
  '11800': SubjectCfg(
    name: '11800 電腦軟體應用乙級',
    files: ['assets/sql/11800_Single.sql'],
    wiNames: {1:'工作項目01：電腦概論',2:'工作項目02：應用軟體使用',3:'工作項目03：系統軟體使用',4:'工作項目04：資訊安全'},
    wiRanges: [{'s':1,'e':334},{'s':335,'e':388},{'s':389,'e':631},{'s':632,'e':748}],
    wiCount: 4,
  ),
  'common': SubjectCfg(
    name: '共同科目',
    files: ['assets/sql/90006_Common.sql','assets/sql/90007_Common.sql','assets/sql/90008_Common.sql','assets/sql/90009_Common.sql'],
    wiNames: {1:'90006 職業安全衛生',2:'90007 工作倫理與職業道德',3:'90008 環境保護',4:'90009 節能減碳'},
    wiRanges: [{'s':9000601,'e':90006100},{'s':9000701,'e':90007100},{'s':9000801,'e':90008100},{'s':9000901,'e':90009100}],
    wiCount: 4,
  ),
};

// ─── SQL Parser ────────────────────────────────────────────────────────────
List<String> splitOptions(String str) {
  final result = <String>[];
  int depth = 0;
  final buf = StringBuffer();
  for (final ch in str.runes) {
    if (ch == 0x28 || ch == 0xFF08) { depth++; }
    else if (ch == 0x29 || ch == 0xFF09) { depth--; }
    if (ch == 0x2C && depth == 0) { result.add(buf.toString().trim()); buf.clear(); }
    else { buf.writeCharCode(ch); }
  }
  if (buf.isNotEmpty) result.add(buf.toString().trim());
  return result;
}

List<Question> parseSQL(String t) {
  final r7 = RegExp(r"VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']*)'\s*\)");
  final r6 = RegExp(r"VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']*)'\s*\)");
  final r5 = RegExp(r"VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*\)");
  final questions = <Question>[];
  for (final line in t.split('\n')) {
    if (!line.contains('VALUES')) continue;
    var m = r7.firstMatch(line);
    var c = 7;
    if (m == null) { m = r6.firstMatch(line); c = 6; }
    if (m == null) { m = r5.firstMatch(line); c = 5; }
    if (m == null) continue;
    final id = int.parse(m.group(1)!);
    final type = m.group(2)!;
    final off = c == 7 ? 1 : 0;
    final question = m.group(3 + off)!;
    final options = splitOptions(m.group(4 + off)!);
    final answer = m.group(5 + off)!.split(',').map((x) => int.parse(x.trim())).toList();
    String? image;
    if (c >= 6) { final img = m.group(6 + off); if (img != null && img.isNotEmpty) { image = '../../' + img; } }
    questions.add(Question(id: id, type: type, question: question, options: options, answer: answer, image: image));
  }
  return questions;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
int getWI(int id, SubjectCfg cfg) {
  for (var i = 0; i < cfg.wiRanges.length; i++) {
    final r = cfg.wiRanges[i];
    if (id >= r['s']! && id <= r['e']!) return i + 1;
  }
  return 0;
}

String getQuestionImageUrl(Question q, int wi, String subjectId) {
  final baseDir = '$imageBaseUrl/backend/data/img/${subjectId}_img';
  if (q.image != null) { final img = q.image!.replaceFirst('../../', ''); return '$imageBaseUrl/$img'; }
  final m = RegExp(r'^(\d+)\.\s*\(').firstMatch(q.question);
  if (m != null) return '$baseDir/$wi-${m.group(1)}-x.jpg';
  return '$baseDir/$wi-${q.id}-x.jpg';
}

String getOptionImageUrl(Question q, int wi, int idx, String subjectId) {
  return '$imageBaseUrl/backend/data/img/${subjectId}_img/$wi-${q.id}-${idx + 1}.jpg';
}

List<Question> _shuffle(List<Question> list) {
  final r = Random();
  final copy = [...list];
  for (var i = copy.length - 1; i > 0; i--) {
    final j = r.nextInt(i + 1);
    final tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

// ─── RESPONSIVE HELPERS ────────────────────────────────────────────────────
double respFont(BuildContext c, double base) {
  final w = MediaQuery.of(c).size.width;
  if (w < 400) return base * 0.75;
  if (w < 600) return base * 0.85;
  if (w < 900) return base;
  return base * 1.1;
}

double respSize(BuildContext c, double base) {
  final w = MediaQuery.of(c).size.width;
  if (w < 400) return base * 0.8;
  if (w < 600) return base * 0.9;
  if (w < 900) return base;
  return base * 1.15;
}

bool isWide(BuildContext c) => MediaQuery.of(c).size.width >= 600;

// ─── LANDING PAGE ──────────────────────────────────────────────────────────
const categoryItems = [
  {'label': '資訊電子', 'items': ['資訊職類', '電子儀表種類']},
  {'label': '電機機械', 'items': ['電機職類', '金屬及機械加工職類', '機械及設備修護職類']},
  {'label': '勞安營造', 'items': ['勞工安全衛生操作職類', '營造職類']},
  {'label': '美容餐飲', 'items': ['美容美髮服飾職類', '餐飲食品相關職類']},
  {'label': '商業農業', 'items': ['商業服務印刷製版職類', '農業職類']},
  {'label': '化工配管', 'items': ['化工職類', '焊接配管職類']},
  {'label': '製圖職類', 'items': <String>[]},
  {'label': '其他職類', 'items': <String>[]},
];

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});
  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  bool _showComputerPanel = false;
  bool _showElectronicPanel = false;
  bool _showBClass = false;

  void _onSubItemTap(String subItem) {
    if (subItem == '資訊職類') setState(() => _showComputerPanel = !_showComputerPanel);
    if (subItem == '電子儀表種類') setState(() => _showElectronicPanel = !_showElectronicPanel);
  }

  void _toggleBClass() => setState(() => _showBClass = !_showBClass);

  void _openQuiz(String subjectId) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => QuizPage(subjectId: subjectId)));
  }

  void _openDashboard() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const DashboardPage()));
  }

  double get _spacing => respSize(context, 10);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E1E1E),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.bar_chart, color: Color(0xFF38BDF8)),
            tooltip: '成績與分析',
            onPressed: _openDashboard,
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              _buildTitle(context),
              SizedBox(height: _spacing),
              _buildToggleB(context),
              SizedBox(height: _spacing),
              _buildMenu(context),
              SizedBox(height: _spacing),
              _buildPanelSection(context),
              SizedBox(height: _spacing),
              _buildContact(context),
              SizedBox(height: _spacing),
              _buildFooter(context),
              SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTitle(BuildContext c) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: respSize(c, 30), horizontal: respSize(c, 16)),
      child: Text('即測即評題庫網',
        style: TextStyle(fontSize: respFont(c, 28), fontWeight: FontWeight.w700, color: const Color(0xFFF1F5F9), letterSpacing: 1.5)),
    );
  }

  Widget _buildToggleB(BuildContext c) {
    return Align(
      alignment: Alignment.centerRight,
      child: Padding(
        padding: EdgeInsets.only(right: respSize(c, 16), bottom: respSize(c, 8)),
        child: ElevatedButton(
          onPressed: _toggleBClass,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF38BDF8),
            foregroundColor: const Color(0xFF0F172A),
            padding: EdgeInsets.symmetric(horizontal: respSize(c, 16), vertical: respSize(c, 6)),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
          ),
          child: Text('切換乙級', style: TextStyle(fontSize: respFont(c, 14), fontWeight: FontWeight.w600)),
        ),
      ),
    );
  }

  Widget _buildMenu(BuildContext c) {
    final w = MediaQuery.of(c).size.width;
    return Container(
      margin: EdgeInsets.symmetric(horizontal: respSize(c, 12)),
      padding: EdgeInsets.symmetric(vertical: respSize(c, 12), horizontal: respSize(c, 8)),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(8),
      ),
      child: w < 480
          ? Column(children: categoryItems.map((cat) => _buildMenuItem(c, cat)).toList())
          : Wrap(
              spacing: respSize(c, 8), runSpacing: respSize(c, 8),
              alignment: WrapAlignment.center,
              children: categoryItems.map((cat) => _buildMenuItem(c, cat)).toList(),
            ),
    );
  }

  Widget _buildMenuItem(BuildContext c, Map<String, dynamic> cat) {
    final label = cat['label'] as String;
    final items = cat['items'] as List<String>;
    return PopupMenuButton<String>(
      onSelected: (v) => _onSubItemTap(v),
      offset: Offset(0, respSize(c, 36)),
      itemBuilder: (_) => items.isEmpty
          ? []
          : items.map((i) => PopupMenuItem(value: i, child: Text(i, style: TextStyle(fontSize: respFont(c, 13))))).toList(),
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: respSize(c, 14), vertical: respSize(c, 8)),
        decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(6)),
        child: Text(label, style: TextStyle(fontSize: respFont(c, 13), color: const Color(0xFFF1F5F9))),
      ),
    );
  }

  Widget _buildPanelSection(BuildContext c) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: respSize(c, 12), vertical: respSize(c, 8)),
      child: Column(
        children: [
          if (_showComputerPanel) _buildPanel(c, '丙級題庫', [
            _examLink(c, '電腦軟體應用', () => _openQuiz('11800')),
            _examLink(c, '電腦軟體設計', () {}),
            _examLink(c, '電腦硬體裝修', () {}),
          ]),
          if (_showElectronicPanel) _buildPanel(c, '丙級題庫', [
            _examLink(c, '工業電子丙級', () {}),
          ]),
          if (_showBClass) _buildPanel(c, '乙級題庫', [
            _examLink(c, '數位電子乙級', () => _openQuiz('11700')),
          ]),
        ],
      ),
    );
  }

  Widget _buildPanel(BuildContext c, String title, List<Widget> links) {
    return AnimatedSize(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeInOut,
      child: Container(
        width: double.infinity,
        margin: EdgeInsets.only(bottom: respSize(c, 12)),
        padding: EdgeInsets.all(respSize(c, 16)),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(title, style: TextStyle(fontSize: respFont(c, 15), fontWeight: FontWeight.w600, color: const Color(0xFF94A3B8))),
            SizedBox(height: respSize(c, 10)),
            Wrap(spacing: respSize(c, 10), runSpacing: respSize(c, 8), alignment: WrapAlignment.center, children: links),
          ],
        ),
      ),
    );
  }

  Widget _examLink(BuildContext c, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: respSize(c, 18), vertical: respSize(c, 10)),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Text(label, style: TextStyle(fontSize: respFont(c, 14), color: const Color(0xFFF1F5F9))),
      ),
    );
  }

  Widget _buildContact(BuildContext c) {
    return Column(
      children: [
        Text('聯絡我們', style: TextStyle(fontSize: respFont(c, 15), fontWeight: FontWeight.w600, color: const Color(0xFF94A3B8))),
        SizedBox(height: respSize(c, 6)),
        GestureDetector(
          onTap: () => launchUrl(Uri.parse('mailto:你的信箱@gmail.com?subject=即測即評題庫網建議')),
          child: Text('[聯絡信箱]', style: TextStyle(fontSize: respFont(c, 13), color: const Color(0xFF38BDF8))),
        ),
        SizedBox(height: respSize(c, 4)),
        Text('~~~有任何想要建議的都可以聯絡信箱告知我們~~~',
          style: TextStyle(fontSize: respFont(c, 12), color: const Color(0xFF64748B)),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildFooter(BuildContext c) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(respSize(c, 16)),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A).withValues(alpha: 0.4),
        border: Border(top: BorderSide(color: Colors.white.withValues(alpha: 0.05))),
      ),
      child: Text('© 2026 即測即評題庫網. All rights reserved.',
        textAlign: TextAlign.center,
        style: TextStyle(fontSize: respFont(c, 11), color: const Color(0xFF94A3B8))),
    );
  }
}

// ─── QUIZ PAGE ─────────────────────────────────────────────────────────────
class QuizPage extends StatefulWidget {
  final String subjectId;
  const QuizPage({super.key, required this.subjectId});
  @override
  State<QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  late String _currentSubject;
  List<Question> _allQuestions = [];
  List<Question> _filteredQuestions = [];
  bool _isLoading = true;
  int _currentIndex = 0;
  Map<int, List<int>> _answeredMap = {};
  Map<int, bool> _submittedMap = {};
  int _workItem = 0;
  String _questionType = 'all';
  bool _examMode = false;
  List<Question> _examQuestions = [];
  bool _examSubmitted = false;
  bool _examOverviewVisible = false;

  @override
  void initState() { super.initState(); _currentSubject = widget.subjectId; _loadSubject(); }

  SubjectCfg get _cfg => subjectConfig[_currentSubject]!;

  Future<void> _loadSubject() async {
    setState(() => _isLoading = true);
    try {
      final questions = <Question>[];
      for (final path in _cfg.files) {
        questions.addAll(parseSQL(await rootBundle.loadString(path)));
      }
      questions.sort((a, b) => a.id.compareTo(b.id));
      _allQuestions = questions;
      _answeredMap = {};
      _submittedMap = {};
      _currentIndex = 0;
      _examMode = false;
      _examQuestions = [];
      _examSubmitted = false;
      _applyFilter();
    } catch (e) {
      debugPrint('Failed to load subject: $e');
    }
    setState(() => _isLoading = false);
  }

  void _applyFilter() {
    setState(() {
      _filteredQuestions = _allQuestions.where((q) {
        if (_workItem != 0 && getWI(q.id, _cfg) != _workItem) return false;
        if (_questionType != 'all' && q.type != _questionType) return false;
        return true;
      }).toList();
      _currentIndex = 0;
    });
  }

  void _toggleMode() {
    setState(() {
      _examMode = !_examMode;
      _examSubmitted = false;
      _examOverviewVisible = false;
      _currentIndex = 0;
      if (_examMode) {
        _examQuestions = _shuffle(_allQuestions).take(min(80, _allQuestions.length)).toList();
        _answeredMap = {};
        _submittedMap = {};
      } else {
        _examQuestions = [];
        _applyFilter();
      }
    });
  }

  void _nextQuestion() { if (_currentIndex < _filteredQuestions.length - 1) setState(() => _currentIndex++); }
  void _prevQuestion() { if (_currentIndex > 0) setState(() => _currentIndex--); }

  void _toggleOpt(int qId, int idx, String type) {
    if (_submittedMap[qId] == true) return;
    setState(() {
      _answeredMap.putIfAbsent(qId, () => []);
      if (type == 'single') { _answeredMap[qId] = [idx]; }
      else { final p = _answeredMap[qId]!.indexOf(idx); p >= 0 ? _answeredMap[qId]!.removeAt(p) : _answeredMap[qId]!.add(idx); }
    });
  }

  void _submitAnswer(int qId) { final sel = _answeredMap[qId]; if (sel == null || sel.isEmpty) return; setState(() => _submittedMap[qId] = true); }

  void _examToggleOpt(int qId, int idx, String type) {
    if (_examSubmitted) return;
    setState(() {
      _answeredMap.putIfAbsent(qId, () => []);
      if (type == 'single') { _answeredMap[qId] = [idx]; }
      else { final p = _answeredMap[qId]!.indexOf(idx); p >= 0 ? _answeredMap[qId]!.removeAt(p) : _answeredMap[qId]!.add(idx); }
    });
  }

  void _submitExam() {
    final score = _examQuestions.where((qq) => _listEq(_answeredMap[qq.id] ?? [], qq.answer)).length;
    final total = _examQuestions.length;
    setState(() { _examSubmitted = true; _examOverviewVisible = false; _currentIndex = 0; });
    _saveScore(score, total);
  }

  Future<void> _saveScore(int score, int total) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;
    try {
      final wiScores = <int, int>{};
      for (final q in _examQuestions) {
        final wi = getWI(q.id, _cfg);
        final correct = _listEq(_answeredMap[q.id] ?? [], q.answer);
        wiScores[wi] = (wiScores[wi] ?? 0) + (correct ? 1 : 0);
      }
      await FirebaseFirestore.instance.collection('scores').add({
        'uid': user.uid,
        'email': user.email,
        'displayName': user.displayName,
        'subjectId': widget.subjectId,
        'subjectName': _cfg.name,
        'score': score,
        'total': total,
        'percentage': total > 0 ? (score / total * 100).round() : 0,
        'wiScores': wiScores.map((k, v) => MapEntry(k.toString(), v)),
        'timestamp': FieldValue.serverTimestamp(),
      });
    } catch (_) {}
  }
  void _goToExamQuestion(int idx) { if (idx >= 0 && idx < _examQuestions.length) setState(() => _currentIndex = idx); }

  bool _listEq(List<int> a, List<int> b) {
    if (a.length != b.length) return false;
    final sa = [...a]..sort(); final sb = [...b]..sort();
    for (var i = 0; i < sa.length; i++) { if (sa[i] != sb[i]) return false; }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_examMode ? '考試模式' : '${_cfg.name} - 逐題練習', style: TextStyle(fontSize: respFont(context, 15))),
        backgroundColor: const Color(0xFF1E1E1E),
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.pop(context)),
        actions: [
          if (!_isLoading)
            TextButton(
              onPressed: _toggleMode,
              child: Text(_examMode ? '練習模式' : '考試模式', style: TextStyle(color: _examMode ? Colors.redAccent : Colors.grey, fontSize: respFont(context, 12))),
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _buildBody(),
    );
  }

  Widget _buildBody() {
    return Column(
      children: [
        if (!_examMode) _buildFilters(),
        if (!_examMode) _buildProgressBar(),
        if (_examOverviewVisible && _examMode) _buildExamOverview(),
        Expanded(child: _buildContent()),
      ],
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      color: const Color(0xFF1A1A1A),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF2A2A2A),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFF444444)),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<int>(
                  value: _workItem,
                  isExpanded: true,
                  dropdownColor: const Color(0xFF2A2A2A),
                  style: TextStyle(fontSize: respFont(context, 11), color: const Color(0xFFE0E0E0)),
                  items: [
                    const DropdownMenuItem(value: 0, child: Text('全部工作項目', style: TextStyle(fontSize: 11))),
                    ..._cfg.wiNames.entries.map((e) => DropdownMenuItem(value: e.key, child: Text(e.value, style: TextStyle(fontSize: 11), overflow: TextOverflow.ellipsis))),
                  ],
                  onChanged: (v) { if (v != null) { _workItem = v; _applyFilter(); } },
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF2A2A2A),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFF444444)),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _questionType,
                  isExpanded: true,
                  dropdownColor: const Color(0xFF2A2A2A),
                  style: TextStyle(fontSize: respFont(context, 11), color: const Color(0xFFE0E0E0)),
                  items: [
                    const DropdownMenuItem(value: 'all', child: Text('全部題型', style: TextStyle(fontSize: 11))),
                    const DropdownMenuItem(value: 'single', child: Text('單選題', style: TextStyle(fontSize: 11))),
                    if (_currentSubject != 'common')
                      const DropdownMenuItem(value: 'multiple', child: Text('複選題', style: TextStyle(fontSize: 11))),
                  ],
                  onChanged: (v) { if (v != null) { _questionType = v; _applyFilter(); } },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    final total = _examMode ? _examQuestions.length : _filteredQuestions.length;
    final cur = _examMode ? _currentIndex + 1 : _currentIndex + 1;
    final pct = total > 0 ? cur / total : 0.0;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: Column(
        children: [
          Text('題號: $cur / $total', style: TextStyle(color: const Color(0xFF888888), fontSize: respFont(context, 12))),
          const SizedBox(height: 4),
          ClipRRect(borderRadius: BorderRadius.circular(2), child: LinearProgressIndicator(value: pct, minHeight: 4, backgroundColor: const Color(0xFF333333))),
        ],
      ),
    );
  }

  Widget _buildExamOverview() {
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFF1E1E1E), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFF333333))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('作答總覽', style: TextStyle(color: Color(0xFFE0E0E0), fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 6, runSpacing: 6,
            children: List.generate(_examQuestions.length, (i) {
              final q = _examQuestions[i];
              final sel = _answeredMap[q.id] ?? [];
              final hasAns = sel.isNotEmpty;
              Color bg;
              if (_examSubmitted) {
                final correct = _listEq(sel, q.answer);
                bg = hasAns ? (correct ? const Color(0xFF1A3A1A) : const Color(0xFF3A1A1A)) : const Color(0xFF3A1A1A);
              } else { bg = hasAns ? const Color(0xFF1A3A5C) : const Color(0xFF252525); }
              return GestureDetector(
                onTap: () => _goToExamQuestion(i),
                child: Container(
                  width: 36, height: 36, alignment: Alignment.center,
                  decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(4), border: Border.all(color: _currentIndex == i ? const Color(0xFF4CAF50) : const Color(0xFF444444))),
                  child: Text('${i + 1}', style: const TextStyle(fontSize: 12, color: Color(0xFF888888))),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    if (_examMode) return _buildExamContent();
    if (_filteredQuestions.isEmpty) return const Center(child: Text('無符合條件的題目', style: TextStyle(color: Color(0xFF888888))));
    return _buildQuestionContent(
      question: _filteredQuestions[_currentIndex],
      showSubmit: true,
      submitted: _submittedMap[_filteredQuestions[_currentIndex].id] ?? false,
      onToggleOpt: (qId, idx, type) => _toggleOpt(qId, idx, type),
      onSubmit: () => _submitAnswer(_filteredQuestions[_currentIndex].id),
      totalQuestions: _filteredQuestions.length,
      onNext: _nextQuestion,
      onPrev: _prevQuestion,
      isExam: false,
    );
  }

  Widget _buildExamContent() {
    if (_examQuestions.isEmpty) return const Center(child: Text('無題目', style: TextStyle(color: Color(0xFF888888))));
    final q = _examQuestions[_currentIndex];
    final answeredCount = _examQuestions.where((qq) => (_answeredMap[qq.id] ?? []).isNotEmpty).length;
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('作答: $answeredCount / ${_examQuestions.length}', style: TextStyle(color: const Color(0xFF888888), fontSize: respFont(context, 12))),
              const SizedBox(width: 12),
              Text(_examSubmitted ? '已提交' : '未提交', style: TextStyle(color: _examSubmitted ? const Color(0xFF4CAF50) : const Color(0xFF888888), fontSize: respFont(context, 12))),
            ],
          ),
        ),
        if (_examSubmitted) ...[
          const SizedBox(height: 4),
          Text('得分: ${(_examQuestions.where((qq) => _listEq(_answeredMap[qq.id] ?? [], qq.answer)).length / _examQuestions.length * 100).round()}分',
            style: TextStyle(color: const Color(0xFF4CAF50), fontWeight: FontWeight.bold, fontSize: respFont(context, 13))),
        ],
        Expanded(child: _buildQuestionContent(
          question: q, showSubmit: false, submitted: _examSubmitted,
          onToggleOpt: (qId, idx, type) => _examToggleOpt(qId, idx, type),
          onSubmit: () {}, totalQuestions: _examQuestions.length,
          onNext: () { if (_currentIndex < _examQuestions.length - 1) setState(() => _currentIndex++); },
          onPrev: () { if (_currentIndex > 0) setState(() => _currentIndex--); },
          isExam: true,
        )),
        if (!_examSubmitted)
          Padding(
            padding: const EdgeInsets.all(12),
            child: SizedBox(width: double.infinity, child: ElevatedButton(
              onPressed: _submitExam,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent, padding: const EdgeInsets.symmetric(vertical: 14)),
              child: const Text('提交答案', style: TextStyle(fontSize: 16, color: Colors.white)),
            )),
          ),
        if (_examSubmitted)
          Padding(
            padding: const EdgeInsets.all(4),
            child: TextButton(
              onPressed: () => setState(() => _examOverviewVisible = !_examOverviewVisible),
              child: Text(_examOverviewVisible ? '隱藏作答總覽' : '作答總覽'),
            ),
          ),
      ],
    );
  }

  Widget _buildQuestionContent({
    required Question question, required bool showSubmit, required bool submitted,
    required Function(int, int, String) onToggleOpt, required VoidCallback onSubmit,
    required int totalQuestions, required VoidCallback onNext, required VoidCallback onPrev, required bool isExam,
  }) {
    final wi = getWI(question.id, _cfg);
    final wiName = wi != 0 ? _cfg.wiNames[wi] : null;
    final sel = _answeredMap[question.id] ?? [];
    final done = submitted;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF1E1E1E), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFF333333))),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text('${_currentIndex + 1} / $totalQuestions', style: TextStyle(color: const Color(0xFF1976D2), fontSize: respFont(context, 12))),
                    if (question.type == 'multiple') Text(' (複選)', style: TextStyle(color: const Color(0xFF1976D2), fontSize: respFont(context, 12))),
                    if (wiName != null)
                      Padding(padding: const EdgeInsets.only(left: 8), child: Text(wiName, style: TextStyle(color: const Color(0xFF888888), fontSize: respFont(context, 11)))),
                  ],
                ),
                const SizedBox(height: 12),
                _buildQuestionText(question, wi),
                if (question.image != null || RegExp(r'^\d+\.\s*\(').hasMatch(question.question)) const SizedBox(height: 10),
                if (question.image != null || RegExp(r'^\d+\.\s*\(').hasMatch(question.question))
                  SizedBox(width: double.infinity, child: ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: Image.network(getQuestionImageUrl(question, wi, _currentSubject), width: double.infinity, height: 300, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const SizedBox.shrink()),
                  )),
                const SizedBox(height: 16),
                ...List.generate(question.options.length, (i) {
                  final opt = question.options[i];
                  final label = String.fromCharCode(65 + i);
                  final selected = sel.contains(i);
                  Color borderColor; Color bgColor;
                  if (done) {
                    if (question.answer.contains(i)) { borderColor = const Color(0xFF4CAF50); bgColor = const Color(0xFF1A3A1A); }
                    else if (selected) { borderColor = const Color(0xFFF44336); bgColor = const Color(0xFF3A1A1A); }
                    else { borderColor = const Color(0xFF333333); bgColor = const Color(0xFF252525); }
                  } else if (selected) { borderColor = const Color(0xFF1976D2); bgColor = const Color(0xFF1A3A5C); }
                  else { borderColor = const Color(0xFF333333); bgColor = const Color(0xFF252525); }
                  return GestureDetector(
                    onTap: done ? null : () => onToggleOpt(question.id, i, question.type),
                    child: Container(
                      width: double.infinity, margin: const EdgeInsets.only(bottom: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(6), border: Border.all(color: borderColor)),
                      child: Row(
                        children: [
                          SizedBox(width: 20, height: 20, child: question.type == 'multiple'
                              ? Checkbox(value: selected, onChanged: done ? null : (_) => onToggleOpt(question.id, i, question.type), visualDensity: VisualDensity.compact)
                              : Radio<int>(value: i, groupValue: i, onChanged: done ? null : (_) => onToggleOpt(question.id, i, question.type), visualDensity: VisualDensity.compact)),
                          const SizedBox(width: 8),
                          Expanded(child: Row(
                            children: [
                              Text('$label. ', style: const TextStyle(color: Color(0xFFCCCCCC))),
                              if (opt.isNotEmpty)
                                Expanded(child: Text(opt, style: const TextStyle(color: Color(0xFFCCCCCC)), softWrap: true)),
                              Image.network(getOptionImageUrl(question, wi, i, _currentSubject), width: 100, height: 100, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const SizedBox.shrink()),
                            ],
                          )),
                        ],
                      ),
                    ),
                  );
                }),
                if (showSubmit && !done)
                  Padding(padding: const EdgeInsets.only(top: 12), child: SizedBox(width: double.infinity, child: ElevatedButton(onPressed: sel.isEmpty ? null : onSubmit, child: const Text('提交答案')))),
                if (done) ...[
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity, padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: _listEq(sel, question.answer) ? const Color(0xFF1A3A1A) : const Color(0xFF3A1A1A),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: _listEq(sel, question.answer) ? const Color(0xFF4CAF50) : const Color(0xFFF44336)),
                    ),
                    child: Text(_listEq(sel, question.answer) ? '✓ 正確！' : '✗ 錯誤！\n正確答案：${question.answer.map((i) => String.fromCharCode(65 + i)).join(', ')}',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontWeight: FontWeight.bold, color: _listEq(sel, question.answer) ? const Color(0xFF4CAF50) : const Color(0xFFF44336)),
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (!isExam) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(child: ElevatedButton(onPressed: _currentIndex > 0 ? _prevQuestion : null, child: const Text('← 上一題'))),
                const SizedBox(width: 10),
                Expanded(child: ElevatedButton(onPressed: _currentIndex < totalQuestions - 1 ? _nextQuestion : null, child: const Text('下一題 →'))),
              ],
            ),
          ],
          if (isExam && !_examSubmitted) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(child: ElevatedButton(onPressed: _currentIndex > 0 ? () => setState(() => _currentIndex--) : null, child: const Text('← 上一題'))),
                const SizedBox(width: 10),
                Expanded(child: ElevatedButton(onPressed: _currentIndex < _examQuestions.length - 1 ? () => setState(() => _currentIndex++) : null, child: const Text('下一題 →'))),
              ],
            ),
          ],
          if (!isExam) ...[
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(width: 80, child: TextField(
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(hintText: '題號', isDense: true, contentPadding: EdgeInsets.symmetric(horizontal: 8, vertical: 8), border: OutlineInputBorder()),
                  onSubmitted: (v) { final n = int.tryParse(v); if (n != null && n >= 1 && n <= _filteredQuestions.length) setState(() => _currentIndex = n - 1); },
                )),
                const SizedBox(width: 8),
                ElevatedButton(onPressed: () {}, child: const Text('跳至題號')),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildQuestionText(Question q, int wi) {
    final replaced = q.question.replaceAllMapped(RegExp(r'([a-zA-Z])\s*圖'), (m) => '${m.group(1)!}圖');
    return Text(replaced, style: TextStyle(fontSize: respFont(context, 15), color: const Color(0xFFE0E0E0), height: 1.6));
  }
}
