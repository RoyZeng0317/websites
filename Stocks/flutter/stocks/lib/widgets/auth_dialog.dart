import 'package:flutter/material.dart';

class AuthDialog extends StatelessWidget {
  final VoidCallback onGoogleSignIn;
  const AuthDialog({super.key, required this.onGoogleSignIn});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: const Color(0xFF1E293B),
      title: const Text('登入'),
      content: const Text('使用 Google 帳戶登入以管理持股'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('取消')),
        ElevatedButton.icon(
          onPressed: () {
            Navigator.pop(context);
            onGoogleSignIn();
          },
          icon: const Icon(Icons.login),
          label: const Text('使用 Google 登入'),
        ),
      ],
    );
  }
}
