import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../rules/rules.dart';
import '../services/storage_service.dart';
import '../theme/app_theme.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _pageController = PageController();
  int _step = 0;

  // Step 0 — rules
  final _rulesScroll = ScrollController();
  bool _reachedBottom = false;
  bool _agreed = false;

  // Step 1 — basic info
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obscure = true;

  // Step 2 — verification
  File? _selfieFile;
  File? _idCardFile;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _rulesScroll.addListener(() {
      if (!_reachedBottom) {
        final pos = _rulesScroll.position;
        if (pos.pixels >= pos.maxScrollExtent - 80) {
          setState(() => _reachedBottom = true);
        }
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    _rulesScroll.dispose();
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  void _goStep(int s) {
    setState(() => _step = s);
    _pageController.animateToPage(
      s,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  Future<void> _submit() async {
    if (_selfieFile == null || _idCardFile == null) {
      _snack('請完成面部掃描及身分證上傳');
      return;
    }
    setState(() => _submitting = true);
    try {
      final auth = ref.read(authServiceProvider);
      final storage = ref.read(storageServiceProvider);

      final uid = await auth.signUp(
        email: _emailCtrl.text.trim(),
        password: _passwordCtrl.text,
        displayName: _nameCtrl.text.trim(),
      );

      final selfieUrl =
          await storage.uploadVerificationDoc(uid, 'selfie', _selfieFile!);
      final idCardUrl =
          await storage.uploadVerificationDoc(uid, 'id_card', _idCardFile!);

      await auth.saveVerificationDocs(uid, selfieUrl, idCardUrl);

      if (mounted) context.go('/');
    } catch (e) {
      if (mounted) _snack('註冊失敗：$e');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _snack(String msg) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(msg)));
  }

  static const _stepTitles = ['閱讀規範', '基本資訊', '身份驗證'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_stepTitles[_step]),
        leading: _step > 0
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => _goStep(_step - 1),
              )
            : IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => context.go('/login'),
              ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4),
          child: LinearProgressIndicator(
            value: (_step + 1) / 3,
            backgroundColor: Colors.white12,
            color: AppTheme.accent,
          ),
        ),
      ),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _buildRulesStep(),
          _buildBasicInfoStep(),
          _buildVerificationStep(),
        ],
      ),
    );
  }

  // ── Step 0: 規範閱讀 ───────────────────────────────
  Widget _buildRulesStep() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            controller: _rulesScroll,
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '請滑動閱讀完整規範，才可勾選同意並繼續。',
                  style: TextStyle(
                      fontSize: 12, color: AppTheme.textSecondary),
                ),
                const SizedBox(height: 16),
                _PolicySection(
                    title: '隱私權政策', content: kPrivacyPolicyText),
                const SizedBox(height: 16),
                _PolicySection(
                    title: '社群準則', content: kCommunityGuidelinesText),
                const SizedBox(height: 16),
                _PolicySection(
                    title: '免責聲明', content: kDisclaimerText),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          decoration: const BoxDecoration(
            border: Border(top: BorderSide(color: AppTheme.divider)),
          ),
          child: Column(
            children: [
              if (!_reachedBottom)
                const Padding(
                  padding: EdgeInsets.only(bottom: 8),
                  child: Text(
                    '請滑動至底部完整閱讀後，才可勾選同意',
                    style: TextStyle(
                        fontSize: 12, color: AppTheme.textSecondary),
                    textAlign: TextAlign.center,
                  ),
                ),
              CheckboxListTile(
                value: _agreed,
                onChanged: _reachedBottom
                    ? (v) => setState(() => _agreed = v ?? false)
                    : null,
                title: const Text(
                  '我已閱讀並同意所有規範與政策',
                  style: TextStyle(fontSize: 13),
                ),
                activeColor: AppTheme.accent,
                controlAffinity: ListTileControlAffinity.leading,
                contentPadding: EdgeInsets.zero,
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _agreed ? () => _goStep(1) : null,
                  child: const Text('下一步'),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ── Step 1: 基本資訊 ───────────────────────────────
  Widget _buildBasicInfoStep() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            const SizedBox(height: 8),
            TextFormField(
              controller: _nameCtrl,
              decoration: const InputDecoration(
                labelText: '顯示名稱',
                prefixIcon: Icon(Icons.person_outlined),
              ),
              validator: (v) =>
                  v?.isEmpty ?? true ? '請輸入名稱' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _emailCtrl,
              decoration: const InputDecoration(
                labelText: 'Email',
                prefixIcon: Icon(Icons.email_outlined),
              ),
              keyboardType: TextInputType.emailAddress,
              validator: (v) =>
                  v?.isEmpty ?? true ? '請輸入 Email' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _passwordCtrl,
              decoration: InputDecoration(
                labelText: '密碼',
                prefixIcon: const Icon(Icons.lock_outlined),
                suffixIcon: IconButton(
                  icon: Icon(_obscure
                      ? Icons.visibility_off
                      : Icons.visibility),
                  onPressed: () =>
                      setState(() => _obscure = !_obscure),
                ),
              ),
              obscureText: _obscure,
              validator: (v) =>
                  (v?.length ?? 0) < 6 ? '密碼至少 6 個字元' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _confirmCtrl,
              decoration: const InputDecoration(
                labelText: '確認密碼',
                prefixIcon: Icon(Icons.lock_outlined),
              ),
              obscureText: true,
              validator: (v) =>
                  v != _passwordCtrl.text ? '密碼不一致' : null,
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _goStep(2);
                  }
                },
                child: const Text('下一步'),
              ),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => context.go('/login'),
              child: const Text('已經有帳號？登入'),
            ),
          ],
        ),
      ),
    );
  }

  // ── Step 2: 身份驗證 ───────────────────────────────
  Widget _buildVerificationStep() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.orange.shade900.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                  color: Colors.orange.shade700, width: 0.5),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline,
                    color: Colors.orange, size: 18),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '為確保本平台僅供成年人使用，需驗證您的年齡與身份。資料審核通過後將於三天內刪除。',
                    style: TextStyle(
                        fontSize: 12, color: Colors.orange),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // ── 面部掃描 ────────────────────────────────
          const Text('面部掃描',
              style: TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 6),
          const Text(
            '請使用前鏡頭拍攝正面照片，確保光線充足、臉部清晰。',
            style: TextStyle(
                fontSize: 12, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 12),
          _UploadTile(
            file: _selfieFile,
            icon: Icons.face,
            label: '點擊拍攝自拍照',
            onTap: () async {
              final file =
                  await ref.read(storageServiceProvider).captureSelfie();
              if (file != null) setState(() => _selfieFile = file);
            },
          ),

          const SizedBox(height: 28),

          // ── 身分證上傳 ───────────────────────────────
          const Text('身分證上傳',
              style: TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.red.shade900.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(6),
            ),
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.warning_amber_outlined,
                    color: Colors.red, size: 16),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '上傳前請務必在身分證上加浮水印：「僅供velix平台使用」，否則將被退件。',
                    style:
                        TextStyle(fontSize: 11, color: Colors.red),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          _UploadTile(
            file: _idCardFile,
            icon: Icons.badge_outlined,
            label: '點擊上傳身分證',
            onTap: _showIdCardPicker,
          ),

          const SizedBox(height: 36),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed:
                  (_submitting || _selfieFile == null || _idCardFile == null)
                      ? null
                      : _submit,
              child: _submitting
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('完成註冊'),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  void _showIdCardPicker() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined),
              title: const Text('拍照'),
              onTap: () async {
                Navigator.pop(context);
                final file = await ref
                    .read(storageServiceProvider)
                    .captureIdCard();
                if (file != null) {
                  setState(() => _idCardFile = file);
                }
              },
            ),
            ListTile(
              leading: const Icon(Icons.image_outlined),
              title: const Text('從相簿選取'),
              onTap: () async {
                Navigator.pop(context);
                final file =
                    await ref.read(storageServiceProvider).pickImage();
                if (file != null) {
                  setState(() => _idCardFile = file);
                }
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

// ── 規範區塊 ────────────────────────────────────────────
class _PolicySection extends StatefulWidget {
  final String title;
  final String content;
  const _PolicySection(
      {required this.title, required this.content});

  @override
  State<_PolicySection> createState() => _PolicySectionState();
}

class _PolicySectionState extends State<_PolicySection> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(8)),
            onTap: () => setState(() => _expanded = !_expanded),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.title,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14),
                    ),
                  ),
                  Icon(
                    _expanded
                        ? Icons.expand_less
                        : Icons.expand_more,
                    color: AppTheme.textSecondary,
                  ),
                ],
              ),
            ),
          ),
          if (_expanded) ...[
            const Divider(color: AppTheme.divider, height: 1),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 10, 14, 14),
              child: Text(
                widget.content,
                style: const TextStyle(
                  fontSize: 12,
                  height: 1.6,
                  color: AppTheme.textSecondary,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ── 驗證文件上傳區塊 ────────────────────────────────────
class _UploadTile extends StatelessWidget {
  final File? file;
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _UploadTile({
    required this.file,
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        height: 140,
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: file != null
                ? AppTheme.accent
                : AppTheme.divider,
            width: file != null ? 2 : 1,
          ),
        ),
        child: file != null
            ? ClipRRect(
                borderRadius: BorderRadius.circular(11),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.file(file!, fit: BoxFit.cover),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.accent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('已選取',
                            style: TextStyle(
                                fontSize: 11, color: Colors.white)),
                      ),
                    ),
                    Positioned(
                      bottom: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('點擊重新選取',
                            style: TextStyle(
                                fontSize: 10, color: Colors.white)),
                      ),
                    ),
                  ],
                ),
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon,
                      size: 40, color: AppTheme.textSecondary),
                  const SizedBox(height: 8),
                  Text(label,
                      style: const TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 13)),
                ],
              ),
      ),
    );
  }
}
