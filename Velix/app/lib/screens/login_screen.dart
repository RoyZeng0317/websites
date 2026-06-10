import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../services/prefs_service.dart';
import '../theme/app_theme.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _isLoading = false;
  bool _isGoogleLoading = false;
  bool _obscurePassword = true;
  bool _keepLoggedIn = true;

  @override
  void initState() {
    super.initState();
    _keepLoggedIn =
        ref.read(prefsServiceProvider).getKeepLoggedIn();
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _applyPersistence() async {
    if (!kIsWeb) return;
    await FirebaseAuth.instance.setPersistence(
      _keepLoggedIn ? Persistence.LOCAL : Persistence.SESSION,
    );
  }

  Future<void> _signIn() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      await ref
          .read(prefsServiceProvider)
          .setKeepLoggedIn(_keepLoggedIn);
      await _applyPersistence();
      await ref.read(authServiceProvider).signIn(
            email: _emailCtrl.text.trim(),
            password: _passwordCtrl.text,
          );
      if (mounted) context.go('/');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('登入失敗: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Velix',
                  style: Theme.of(context)
                      .textTheme
                      .displaySmall
                      ?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  '歡迎回來',
                  style: Theme.of(context)
                      .textTheme
                      .bodyLarge
                      ?.copyWith(color: AppTheme.textSecondary),
                ),
                const SizedBox(height: 48),
                TextFormField(
                  controller: _emailCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) =>
                      (v?.isEmpty ?? true) ? '請輸入 Email' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordCtrl,
                  decoration: InputDecoration(
                    labelText: '密碼',
                    prefixIcon: const Icon(Icons.lock_outlined),
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword
                          ? Icons.visibility_off
                          : Icons.visibility),
                      onPressed: () => setState(
                          () => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                  obscureText: _obscurePassword,
                  validator: (v) =>
                      (v?.length ?? 0) < 6 ? '密碼至少 6 個字元' : null,
                ),
                const SizedBox(height: 8),

                // ── 保持登入 ──────────────────────────
                Row(
                  children: [
                    Checkbox(
                      value: _keepLoggedIn,
                      activeColor: AppTheme.accent,
                      onChanged: (v) =>
                          setState(() => _keepLoggedIn = v ?? true),
                    ),
                    const Text('保持登入'),
                    const SizedBox(width: 4),
                    Tooltip(
                      message: '取消勾選後，關閉瀏覽器將會自動登出',
                      child: const Icon(
                        Icons.info_outline,
                        size: 14,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _signIn,
                    child: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.white))
                        : const Text('登入'),
                  ),
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => context.go('/register'),
                  child: const Text('還沒有帳號？註冊'),
                ),
                const SizedBox(height: 24),
                const Divider(),
                const SizedBox(height: 16),
                SizedBox(
                  width: 200,
                  height: 40,
                  child: OutlinedButton.icon(
                    onPressed: _isGoogleLoading
                        ? null
                        : () async {
                            setState(() => _isGoogleLoading = true);
                            try {
                              await ref
                                  .read(prefsServiceProvider)
                                  .setKeepLoggedIn(_keepLoggedIn);
                              await _applyPersistence();
                              final isNew = await ref
                                  .read(authServiceProvider)
                                  .signInWithGoogle();
                              if (context.mounted) {
                                context.go(isNew ? '/google-verify' : '/');
                              }
                            } catch (e) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context)
                                    .showSnackBar(
                                        SnackBar(content: Text('$e')));
                              }
                            } finally {
                              if (mounted) {
                                setState(
                                    () => _isGoogleLoading = false);
                              }
                            }
                          },
                    icon: _isGoogleLoading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                                strokeWidth: 2))
                        : const Icon(Icons.g_mobiledata, size: 20),
                    label: const Text('Google 登入',
                        style: TextStyle(fontSize: 13)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.white24),
                      foregroundColor: Colors.white70,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
