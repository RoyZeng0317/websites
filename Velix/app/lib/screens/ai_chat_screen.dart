import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class AiChatScreen extends StatelessWidget {
  const AiChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundColor: AppTheme.accent,
              child: Text('AI',
                  style: TextStyle(
                      fontSize: 11,
                      color: Colors.white,
                      fontWeight: FontWeight.bold)),
            ),
            SizedBox(width: 8),
            Text('Velix AI'),
          ],
        ),
      ),
      body: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircleAvatar(
              radius: 48,
              backgroundColor: AppTheme.surface,
              child: Icon(Icons.auto_awesome,
                  size: 40, color: AppTheme.accent),
            ),
            SizedBox(height: 24),
            Text(
              '正在開發當中...',
              style: TextStyle(
                  fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            Text(
              '敬請期待',
              style: TextStyle(
                  fontSize: 15, color: AppTheme.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
