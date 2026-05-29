import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const CompanyApp());
}

class CompanyApp extends StatelessWidget {
  const CompanyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '展星股份有限公司',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const CheckInScreen(),
    );
  }
}

class CheckInScreen extends StatefulWidget {
  const CheckInScreen({super.key});

  @override
  State<CheckInScreen> createState() => _CheckInScreenState();
}

class _CheckInScreenState extends State<CheckInScreen> {
  final MobileScannerController _scanner = MobileScannerController();
  final TextEditingController _userIdCtrl = TextEditingController();

  String _serverHost = '';
  String _statusText = '請輸入員工編號，再掃描 QR Code';
  bool _isProcessing = false;
  bool _initialized = false;
  DateTime _lastScanTime = DateTime(2000);

  @override
  void initState() {
    super.initState();
    _loadPrefs();
  }

  @override
  void dispose() {
    _scanner.dispose();
    _userIdCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _serverHost = prefs.getString('serverHost') ?? '';
      _userIdCtrl.text = prefs.getString('userId') ?? '';
      _initialized = true;
    });
    if (_serverHost.isEmpty) {
      _showServerDialog();
    }
  }

  Future<void> _savePrefs() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('serverHost', _serverHost);
    await prefs.setString('userId', _userIdCtrl.text.trim());
  }

  void _onDetect(BarcodeCapture capture) {
    if (_isProcessing || !_initialized) return;

    final now = DateTime.now();
    if (now.difference(_lastScanTime).inSeconds < 3) return;

    for (final barcode in capture.barcodes) {
      if (barcode.rawValue != null) {
        _processQRCode(barcode.rawValue!, now);
        break;
      }
    }
  }

  Future<void> _processQRCode(String data, DateTime scanTime) async {
    _lastScanTime = scanTime;

    String? token;
    final uri = Uri.tryParse(data);
    if (uri != null && uri.hasScheme) {
      token = uri.queryParameters['token'];
    }
    token ??= data;

    if (token == null || token.isEmpty) {
      _showResult('無效的 QR Code', false);
      return;
    }

    final userId = _userIdCtrl.text.trim();
    if (userId.isEmpty) {
      _showResult('請先輸入員工編號', false);
      return;
    }

    if (_serverHost.isEmpty) {
      _showResult('請先設定伺服器位址', false);
      return;
    }

    setState(() {
      _isProcessing = true;
      _statusText = '簽到中...';
    });

    try {
      final url = Uri.parse(
        'http://$_serverHost/checkin?token=$token&user_id=$userId',
      );
      final response = await http.get(url);
      final body = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode == 200 && body['status'] == 'ok') {
        _showResult(body['message'] as String? ?? '簽到成功！', true);
        await Future.delayed(const Duration(seconds: 3));
      } else {
        _showResult(body['message'] as String? ?? '簽到失敗', false);
      }
    } catch (e) {
      _showResult('連線錯誤：$e', false);
    }

    setState(() => _isProcessing = false);
  }

  void _showResult(String message, bool success) {
    setState(() => _statusText = message);
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: success ? Colors.green : Colors.red,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _showServerDialog() {
    final ctrl = TextEditingController(text: _serverHost);
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Text('伺服器設定'),
        content: TextField(
          controller: ctrl,
          decoration: const InputDecoration(
            labelText: '伺服器 IP:Port',
            hintText: '192.168.1.100:8000',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              final host = ctrl.text.trim();
              if (host.isNotEmpty) {
                setState(() => _serverHost = host);
                _savePrefs();
                Navigator.pop(ctx);
              }
            },
            child: const Text('確認'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code 簽到'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: _showServerDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: TextField(
              controller: _userIdCtrl,
              decoration: const InputDecoration(
                labelText: '員工編號',
                hintText: '請輸入員工編號',
                prefixIcon: Icon(Icons.badge),
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              onChanged: (_) => _savePrefs(),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(8),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: MobileScanner(
                  controller: _scanner,
                  onDetect: _onDetect,
                ),
              ),
            ),
          ),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            color: Theme.of(context).colorScheme.surfaceContainerHighest,
            child: Column(
              children: [
                Text(
                  _statusText,
                  style: Theme.of(context).textTheme.titleMedium,
                  textAlign: TextAlign.center,
                ),
                if (_isProcessing)
                  const Padding(
                    padding: EdgeInsets.only(top: 8),
                    child: LinearProgressIndicator(),
                  ),
                if (_serverHost.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      '伺服器: $_serverHost',
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: Colors.grey),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
