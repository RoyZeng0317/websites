import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../post_card.dart';
import '../providers/post_provider.dart';
import '../providers/user_provider.dart';
import '../services/prefs_service.dart';
import '../theme/app_theme.dart';
import 'user_profile_screen.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen>
    with SingleTickerProviderStateMixin {
  final _ctrl = TextEditingController();
  late final TabController _tabController;
  String _query = '';
  List<String> _history = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _history = ref.read(prefsServiceProvider).getSearchHistory();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    _tabController.dispose();
    super.dispose();
  }

  void _submitSearch(String value) {
    final q = value.trim();
    if (q.isEmpty) return;
    setState(() => _query = q);
    ref.read(prefsServiceProvider).addSearchHistory(q).then((_) {
      setState(() {
        _history = ref.read(prefsServiceProvider).getSearchHistory();
      });
    });
  }

  void _clearHistory() {
    ref.read(prefsServiceProvider).clearSearchHistory().then((_) {
      setState(() => _history = []);
    });
  }

  void _removeHistory(String q) {
    ref.read(prefsServiceProvider).removeSearchHistory(q).then((_) {
      setState(() {
        _history = ref.read(prefsServiceProvider).getSearchHistory();
      });
    });
  }

  void _tapHistory(String q) {
    _ctrl.text = q;
    _submitSearch(q);
  }

  @override
  Widget build(BuildContext context) {
    final showResults = _query.isNotEmpty;

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _ctrl,
          autofocus: true,
          decoration: InputDecoration(
            hintText: '搜尋貼文 #hashtag 或用戶名稱…',
            filled: true,
            fillColor: AppTheme.surface,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(24),
              borderSide: BorderSide.none,
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
            suffixIcon: _ctrl.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.close,
                        color: AppTheme.textSecondary, size: 18),
                    onPressed: () {
                      _ctrl.clear();
                      setState(() => _query = '');
                    },
                  )
                : null,
          ),
          style: const TextStyle(fontSize: 14),
          onChanged: (v) {
            setState(() {});
            if (v.trim().isEmpty) setState(() => _query = '');
          },
          onSubmitted: _submitSearch,
        ),
        bottom: showResults
            ? TabBar(
                controller: _tabController,
                indicatorColor: AppTheme.accent,
                labelColor: AppTheme.accent,
                unselectedLabelColor: AppTheme.textSecondary,
                tabs: const [
                  Tab(text: '貼文'),
                  Tab(text: '用戶'),
                ],
              )
            : null,
      ),
      body: showResults
          ? TabBarView(
              controller: _tabController,
              children: [
                _PostsTab(query: _query),
                _UsersTab(query: _query),
              ],
            )
          : _HistoryView(
              history: _history,
              onTap: _tapHistory,
              onRemove: _removeHistory,
              onClearAll: _clearHistory,
            ),
    );
  }
}

// ── 搜尋紀錄 ─────────────────────────────────────────
class _HistoryView extends StatelessWidget {
  final List<String> history;
  final void Function(String) onTap;
  final void Function(String) onRemove;
  final VoidCallback onClearAll;

  const _HistoryView({
    required this.history,
    required this.onTap,
    required this.onRemove,
    required this.onClearAll,
  });

  @override
  Widget build(BuildContext context) {
    if (history.isEmpty) {
      return const Center(
        child: Text('尚無搜尋紀錄',
            style: TextStyle(color: AppTheme.textSecondary)),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding:
              const EdgeInsets.fromLTRB(16, 14, 8, 6),
          child: Row(
            children: [
              const Text(
                '最近搜尋',
                style: TextStyle(
                    fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const Spacer(),
              TextButton(
                onPressed: onClearAll,
                style: TextButton.styleFrom(
                    foregroundColor: AppTheme.textSecondary),
                child: const Text('清除全部',
                    style: TextStyle(fontSize: 13)),
              ),
            ],
          ),
        ),
        const Divider(color: AppTheme.divider, height: 1),
        Expanded(
          child: ListView.separated(
            itemCount: history.length,
            separatorBuilder: (_, i) =>
                const Divider(color: AppTheme.divider, height: 1),
            itemBuilder: (_, i) {
              final q = history[i];
              return ListTile(
                leading: const Icon(Icons.history,
                    color: AppTheme.textSecondary, size: 20),
                title: Text(q, style: const TextStyle(fontSize: 14)),
                trailing: IconButton(
                  icon: const Icon(Icons.close,
                      size: 16, color: AppTheme.textSecondary),
                  onPressed: () => onRemove(q),
                ),
                onTap: () => onTap(q),
              );
            },
          ),
        ),
      ],
    );
  }
}

// ── 貼文搜尋（hashtag）─────────────────────────────────
class _PostsTab extends ConsumerWidget {
  final String query;
  const _PostsTab({required this.query});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (query.isEmpty) {
      return const Center(
        child: Text('輸入 #hashtag 搜尋貼文',
            style: TextStyle(color: AppTheme.textSecondary)),
      );
    }

    final tag = query.startsWith('#') ? query.substring(1) : query;
    final postsAsync =
        ref.watch(hashtagPostsProvider(tag.toLowerCase()));

    return postsAsync.when(
      data: (posts) => posts.isEmpty
          ? Center(
              child: Text('找不到 #$tag 的貼文',
                  style:
                      const TextStyle(color: AppTheme.textSecondary)))
          : ListView.builder(
              itemCount: posts.length,
              itemBuilder: (_, i) => PostCard(post: posts[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('錯誤：$e')),
    );
  }
}

// ── 用戶搜尋 ─────────────────────────────────────────
class _UsersTab extends ConsumerWidget {
  final String query;
  const _UsersTab({required this.query});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (query.isEmpty) {
      return const Center(
        child: Text('輸入用戶名稱搜尋',
            style: TextStyle(color: AppTheme.textSecondary)),
      );
    }

    final usersAsync = ref.watch(userSearchProvider(query));

    return usersAsync.when(
      data: (users) => users.isEmpty
          ? Center(
              child: Text('找不到「$query」相關用戶',
                  style:
                      const TextStyle(color: AppTheme.textSecondary)))
          : ListView.builder(
              itemCount: users.length,
              itemBuilder: (_, i) => _UserTile(user: users[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('錯誤：$e')),
    );
  }
}

class _UserTile extends StatelessWidget {
  final UserModel user;
  const _UserTile({required this.user});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        radius: 22,
        backgroundImage: user.photoUrl.isNotEmpty
            ? NetworkImage(user.photoUrl)
            : null,
        backgroundColor: Colors.grey[800],
        child: user.photoUrl.isEmpty
            ? Text(
                user.displayName.isNotEmpty
                    ? user.displayName[0].toUpperCase()
                    : '?',
              )
            : null,
      ),
      title: Row(
        children: [
          Text(user.displayName,
              style: const TextStyle(fontWeight: FontWeight.w600)),
          if (user.isPrivate) ...[
            const SizedBox(width: 6),
            const Icon(Icons.lock_outline,
                size: 12, color: AppTheme.textSecondary),
          ],
        ],
      ),
      subtitle: Text('@${user.username}',
          style: const TextStyle(
              color: AppTheme.textSecondary, fontSize: 13)),
      trailing: Text(
        '${user.followersCount} 粉絲',
        style: const TextStyle(
            fontSize: 12, color: AppTheme.textSecondary),
      ),
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => UserProfileScreen(user: user)),
      ),
    );
  }
}
