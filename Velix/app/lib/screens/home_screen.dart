import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/post_provider.dart';
import '../providers/user_provider.dart';
import '../post_card.dart';
import '../theme/app_theme.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  bool _usePersonalized = true;

  @override
  Widget build(BuildContext context) {
    final feedAsync = _usePersonalized
        ? ref.watch(personalizedFeedProvider)
        : ref.watch(feedProvider);
    final unreadCount = ref.watch(unreadNotificationsCountProvider);

    return Scaffold(
      appBar: AppBar(
        leading: Stack(
          alignment: Alignment.center,
          children: [
            IconButton(
              icon: const Icon(Icons.notifications_outlined),
              onPressed: () => context.push('/notifications'),
            ),
            if (unreadCount > 0)
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  width: 16,
                  height: 16,
                  decoration: const BoxDecoration(
                      color: Colors.red, shape: BoxShape.circle),
                  child: Center(
                    child: Text(
                      unreadCount > 99 ? '99+' : '$unreadCount',
                      style: const TextStyle(
                          fontSize: 9,
                          color: Colors.white,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ),
          ],
        ),
        title: const Text(
          'Velix',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
        ),
        centerTitle: true,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => context.push('/search'),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(32),
          child: Column(
            children: [
              _FeedToggle(
                usePersonalized: _usePersonalized,
                onChanged: (v) {
                  setState(() => _usePersonalized = v);
                  if (v) ref.invalidate(personalizedFeedProvider);
                },
              ),
              Container(height: 0.5, color: Colors.white12),
            ],
          ),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          if (_usePersonalized) {
            ref.invalidate(personalizedFeedProvider);
          }
        },
        child: feedAsync.when(
          data: (posts) => posts.isEmpty
              ? ListView(
                  children: const [
                    SizedBox(height: 120),
                    Center(
                      child: Text('還沒有貼文，來發第一篇吧！',
                          style: TextStyle(color: AppTheme.textSecondary)),
                    ),
                  ],
                )
              : ListView.builder(
                  itemCount: posts.length,
                  itemBuilder: (ctx, i) => PostCard(post: posts[i]),
                ),
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Center(child: Text('載入失敗：$e')),
        ),
      ),
    );
  }
}

class _FeedToggle extends StatelessWidget {
  final bool usePersonalized;
  final ValueChanged<bool> onChanged;

  const _FeedToggle({
    required this.usePersonalized,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Row(
        children: [
          _TabBtn(
            label: '為你推薦',
            selected: usePersonalized,
            onTap: () => onChanged(true),
          ),
          const SizedBox(width: 8),
          _TabBtn(
            label: '最新',
            selected: !usePersonalized,
            onTap: () => onChanged(false),
          ),
        ],
      ),
    );
  }
}

class _TabBtn extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _TabBtn({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: selected
              ? AppTheme.accent.withValues(alpha: 0.2)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? AppTheme.accent : AppTheme.divider,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: selected ? FontWeight.bold : FontWeight.normal,
            color: selected ? AppTheme.accent : AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }
}
