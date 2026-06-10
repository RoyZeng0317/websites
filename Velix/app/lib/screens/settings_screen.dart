import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'package:url_launcher/url_launcher.dart';
import '../models/draft_model.dart';
import '../models/post_model.dart';
import '../models/user_model.dart';
import '../post_card.dart';
import '../providers/admin_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';
import '../providers/user_provider.dart';
import '../services/storage_service.dart';
import '../theme/app_theme.dart';
import 'create_post_screen.dart';
import 'admin_screen.dart';
import 'follow_list_screen.dart';
import '../rules/rules.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserDataProvider);

    return userAsync.when(
      data: (userData) => userData == null
          ? const Center(child: Text('找不到使用者資料'))
          : _ProfilePage(userData: userData),
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (e, _) =>
          Scaffold(body: Center(child: Text('錯誤：$e'))),
    );
  }
}

class _ProfilePage extends ConsumerStatefulWidget {
  final UserModel userData;
  const _ProfilePage({required this.userData});

  @override
  ConsumerState<_ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends ConsumerState<_ProfilePage>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final u = widget.userData;

    return Scaffold(
      appBar: AppBar(
        title: Text(u.username.isNotEmpty ? '@${u.username}' : '個人主頁'),
        centerTitle: true,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => _showSettingsSheet(context),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(0.5),
          child: Container(height: 0.5, color: Colors.white12),
        ),
      ),
      body: Column(
        children: [
          // ── 個人資料頭部 ──
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundImage: u.photoUrl.isNotEmpty
                          ? NetworkImage(u.photoUrl)
                          : null,
                      backgroundColor: Colors.grey[800],
                      child: u.photoUrl.isEmpty
                          ? Text(
                              u.displayName.isNotEmpty
                                  ? u.displayName[0].toUpperCase()
                                  : '?',
                              style: const TextStyle(fontSize: 24),
                            )
                          : null,
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _Stat(label: '貼文', count: u.postsCount),
                          _Stat(
                            label: '粉絲',
                            count: u.followersCount,
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => FollowListScreen(
                                  uid: u.uid,
                                  type: FollowListType.followers,
                                ),
                              ),
                            ),
                          ),
                          _Stat(
                            label: '追蹤中',
                            count: u.followingCount,
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => FollowListScreen(
                                  uid: u.uid,
                                  type: FollowListType.following,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(u.displayName,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16)),
                      if (u.bio.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(u.bio,
                            style: const TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 13)),
                      ],
                      if (u.socialLinks.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        _SocialLinksDisplay(links: u.socialLinks),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => _showEditDialog(context),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppTheme.divider),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8)),
                      foregroundColor: AppTheme.textPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                    child: const Text('編輯個人資料',
                        style: TextStyle(fontSize: 13)),
                  ),
                ),
              ],
            ),
          ),

          // ── Tab Bar ──
          TabBar(
            controller: _tab,
            indicatorColor: AppTheme.accent,
            labelColor: AppTheme.accent,
            unselectedLabelColor: AppTheme.textSecondary,
            tabs: const [
              Tab(text: '貼文'),
              Tab(text: '轉發'),
              Tab(text: '收藏'),
              Tab(text: '草稿'),
            ],
          ),
          const Divider(color: AppTheme.divider, height: 1),

          // ── Tab 內容 ──
          Expanded(
            child: TabBarView(
              controller: _tab,
              children: [
                _UserPostsTab(uid: u.uid),
                _UserRepostsTab(uid: u.uid),
                _BookmarksTab(uid: u.uid),
                _DraftsTab(uid: u.uid),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Settings bottom sheet ───────────────────────────
  void _showSettingsSheet(BuildContext context) {
    final u = widget.userData;
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheet) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 10, bottom: 4),
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                  color: AppTheme.divider,
                  borderRadius: BorderRadius.circular(2)),
            ),
            // 私密帳戶開關
            SwitchListTile(
              secondary: const Icon(Icons.lock_outline,
                  color: AppTheme.textPrimary),
              title: const Text('私密帳戶',
                  style: TextStyle(color: AppTheme.textPrimary)),
              subtitle: const Text('開啟後，只有你批准的追蹤者才能查看你的貼文',
                  style: TextStyle(
                      fontSize: 12, color: AppTheme.textSecondary)),
              value: u.isPrivate,
              activeThumbColor: AppTheme.accent,
              onChanged: (val) async {
                setSheet(() {});
                await ref.read(authServiceProvider).updateProfile(
                      uid: u.uid,
                      displayName: u.displayName,
                      bio: u.bio,
                      isPrivate: val,
                    );
              },
            ),
            const Divider(color: AppTheme.divider, height: 1),
            ListTile(
              leading: const Icon(Icons.edit_outlined,
                  color: AppTheme.textPrimary),
              title: const Text('編輯個人資料',
                  style: TextStyle(color: AppTheme.textPrimary)),
              onTap: () {
                Navigator.pop(ctx);
                _showEditDialog(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.lock_outline,
                  color: AppTheme.textPrimary),
              title: const Text('更改密碼',
                  style: TextStyle(color: AppTheme.textPrimary)),
              onTap: () {
                Navigator.pop(ctx);
                _showChangePasswordDialog(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.description_outlined,
                  color: AppTheme.textPrimary),
              title: const Text('規範與政策',
                  style: TextStyle(color: AppTheme.textPrimary)),
              onTap: () {
                Navigator.pop(ctx);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const RulesScreen()),
                );
              },
            ),
            if (ref.watch(isAdminProvider))
              ListTile(
                leading: const Icon(Icons.admin_panel_settings,
                    color: AppTheme.accent),
                title: const Text('管理後台',
                    style: TextStyle(color: AppTheme.accent)),
                onTap: () {
                  Navigator.pop(ctx);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const AdminScreen()),
                  );
                },
              ),
            ListTile(
              leading:
                  const Icon(Icons.logout, color: Colors.red),
              title: const Text('登出',
                  style: TextStyle(color: Colors.red)),
              onTap: () {
                Navigator.pop(ctx);
                _confirmSignOut(context);
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
      ),
    );
  }

  void _showEditDialog(BuildContext context) {
    final u = widget.userData;
    final nameCtrl = TextEditingController(text: u.displayName);
    final usernameCtrl = TextEditingController(text: u.username);
    final bioCtrl = TextEditingController(text: u.bio);
    File? newPhoto;
    bool saving = false;
    String? usernameError;
    final links = List<SocialLink>.from(u.socialLinks);

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlgState) => AlertDialog(
          backgroundColor: AppTheme.surface,
          title: const Text('編輯個人資料'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Avatar
                GestureDetector(
                  onTap: () async {
                    final file =
                        await ref.read(storageServiceProvider).pickImage();
                    if (file != null) setDlgState(() => newPhoto = file);
                  },
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 36,
                        backgroundImage: newPhoto != null
                            ? FileImage(newPhoto!) as ImageProvider
                            : (u.photoUrl.isNotEmpty
                                ? NetworkImage(u.photoUrl)
                                : null),
                        backgroundColor: Colors.grey[800],
                        child: (newPhoto == null && u.photoUrl.isEmpty)
                            ? Text(
                                u.displayName.isNotEmpty
                                    ? u.displayName[0].toUpperCase()
                                    : '?',
                                style: const TextStyle(fontSize: 24))
                            : null,
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          width: 22,
                          height: 22,
                          decoration: const BoxDecoration(
                              color: AppTheme.accent,
                              shape: BoxShape.circle),
                          child: const Icon(Icons.edit,
                              size: 12, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                TextField(
                    controller: nameCtrl,
                    maxLength: 30,
                    decoration:
                        const InputDecoration(labelText: '顯示名稱')),
                const SizedBox(height: 8),
                TextField(
                  controller: usernameCtrl,
                  maxLength: 20,
                  decoration: InputDecoration(
                    labelText: '用戶名稱（@username）',
                    prefixText: '@',
                    errorText: usernameError,
                  ),
                  onChanged: (_) {
                    if (usernameError != null) {
                      setDlgState(() => usernameError = null);
                    }
                  },
                ),
                const SizedBox(height: 8),
                TextField(
                    controller: bioCtrl,
                    maxLength: 100,
                    maxLines: 3,
                    decoration:
                        const InputDecoration(labelText: '個人簡介')),

                // ── Social Links section ──────────────
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Text('社群連結',
                        style: TextStyle(
                            fontSize: 13,
                            color: AppTheme.textSecondary)),
                    const Spacer(),
                    Text('${links.length}/5',
                        style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.textSecondary)),
                  ],
                ),
                const SizedBox(height: 8),

                ...links.asMap().entries.map((e) {
                  final idx = e.key;
                  final link = e.value;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppTheme.bg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.divider),
                    ),
                    child: Row(
                      children: [
                        Icon(link.icon, size: 16, color: link.color),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment:
                                CrossAxisAlignment.start,
                            children: [
                              Text(link.label,
                                  style: const TextStyle(
                                      fontSize: 12,
                                      color: AppTheme.textSecondary)),
                              Text(link.displayText,
                                  style: const TextStyle(
                                      fontSize: 13)),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: () => setDlgState(
                              () => links.removeAt(idx)),
                          child: const Icon(Icons.close,
                              size: 18,
                              color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  );
                }),

                if (links.length < 5)
                  TextButton.icon(
                    onPressed: () => _showAddLinkDialog(
                        ctx, setDlgState, links),
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('新增連結'),
                    style: TextButton.styleFrom(
                        foregroundColor: AppTheme.accent),
                  ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: saving ? null : () => Navigator.pop(ctx),
              child: const Text('取消',
                  style: TextStyle(color: AppTheme.textSecondary)),
            ),
            ElevatedButton(
              onPressed: saving
                  ? null
                  : () async {
                      final name = nameCtrl.text.trim();
                      final newUsername = usernameCtrl.text
                          .trim()
                          .toLowerCase()
                          .replaceAll(RegExp(r'[^a-z0-9_.]'), '');
                      if (name.isEmpty) return;
                      if (newUsername.isEmpty) {
                        setDlgState(
                            () => usernameError = '用戶名稱不得為空');
                        return;
                      }
                      setDlgState(() => saving = true);
                      try {
                        final available = await ref
                            .read(authServiceProvider)
                            .isUsernameAvailable(newUsername, u.uid);
                        if (!available) {
                          setDlgState(() {
                            saving = false;
                            usernameError = '此用戶名稱已被使用';
                          });
                          return;
                        }
                        String? photoUrl;
                        if (newPhoto != null) {
                          photoUrl = await ref
                              .read(storageServiceProvider)
                              .uploadPostImage(u.uid, newPhoto!);
                        }
                        await ref
                            .read(authServiceProvider)
                            .updateProfile(
                              uid: u.uid,
                              displayName: name,
                              bio: bioCtrl.text.trim(),
                              username: newUsername,
                              photoUrl: photoUrl,
                              socialLinks: links,
                            );
                        if (ctx.mounted) Navigator.pop(ctx);
                      } catch (e) {
                        setDlgState(() => saving = false);
                        if (ctx.mounted) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                              SnackBar(content: Text('儲存失敗：$e')));
                        }
                      }
                    },
              child: saving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white))
                  : const Text('儲存'),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddLinkDialog(BuildContext parentCtx,
      StateSetter setDlgState, List<SocialLink> links) {
    String selectedPlatform = 'instagram';
    final valueCtrl = TextEditingController();

    showDialog(
      context: parentCtx,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setAddState) => AlertDialog(
          backgroundColor: AppTheme.surface,
          title: const Text('新增社群連結'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('選擇平台',
                    style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary)),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: kSocialPlatforms.map((p) {
                    final isSelected = selectedPlatform == p.$1;
                    return GestureDetector(
                      onTap: () =>
                          setAddState(() => selectedPlatform = p.$1),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppTheme.accent
                                  .withValues(alpha: 0.2)
                              : AppTheme.bg,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected
                                ? AppTheme.accent
                                : AppTheme.divider,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(p.$3, size: 14, color: p.$4),
                            const SizedBox(width: 6),
                            Text(p.$2,
                                style: TextStyle(
                                    fontSize: 12,
                                    color: isSelected
                                        ? AppTheme.accent
                                        : AppTheme.textPrimary)),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: valueCtrl,
                  autofocus: true,
                  decoration: InputDecoration(
                    labelText: selectedPlatform == 'custom'
                        ? '完整網址（含 https://）'
                        : '用戶名稱',
                    prefixText:
                        selectedPlatform == 'custom' ? null : '@',
                    border: const OutlineInputBorder(),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('取消',
                  style: TextStyle(color: AppTheme.textSecondary)),
            ),
            ElevatedButton(
              onPressed: () {
                final val = valueCtrl.text.trim().replaceAll('@', '');
                if (val.isEmpty) return;
                final newLink = SocialLink(
                    platform: selectedPlatform, value: val);
                setDlgState(() => links.add(newLink));
                Navigator.pop(ctx);
              },
              style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.accent,
                  foregroundColor: Colors.white),
              child: const Text('新增'),
            ),
          ],
        ),
      ),
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    final currentCtrl = TextEditingController();
    final newCtrl = TextEditingController();
    final confirmCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('更改密碼'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
                controller: currentCtrl,
                obscureText: true,
                decoration: const InputDecoration(labelText: '目前密碼')),
            const SizedBox(height: 8),
            TextField(
                controller: newCtrl,
                obscureText: true,
                decoration: const InputDecoration(labelText: '新密碼')),
            const SizedBox(height: 8),
            TextField(
                controller: confirmCtrl,
                obscureText: true,
                decoration: const InputDecoration(labelText: '確認新密碼')),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消',
                style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () async {
              if (newCtrl.text != confirmCtrl.text) {
                ScaffoldMessenger.of(ctx).showSnackBar(
                    const SnackBar(content: Text('新密碼不一致')));
                return;
              }
              if (newCtrl.text.length < 6) {
                ScaffoldMessenger.of(ctx).showSnackBar(
                    const SnackBar(content: Text('密碼至少 6 個字元')));
                return;
              }
              try {
                final email =
                    ref.read(currentUserProvider)?.email ?? '';
                await ref.read(authServiceProvider).signIn(
                    email: email, password: currentCtrl.text);
                await ref
                    .read(firebaseAuthProvider)
                    .currentUser
                    ?.updatePassword(newCtrl.text);
                if (ctx.mounted) {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(ctx).showSnackBar(
                      const SnackBar(content: Text('密碼已更新')));
                }
              } catch (e) {
                if (ctx.mounted) {
                  ScaffoldMessenger.of(ctx).showSnackBar(
                      SnackBar(content: Text('更改失敗：$e')));
                }
              }
            },
            child: const Text('確認'),
          ),
        ],
      ),
    );
  }

  void _confirmSignOut(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('登出'),
        content: const Text('確定要登出嗎？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消',
                style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            style:
                ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authServiceProvider).signOut();
              if (context.mounted) context.go('/login');
            },
            child: const Text('登出'),
          ),
        ],
      ),
    );
  }
}

// ── 統計數字 ───────────────────────────────────────────
class _Stat extends StatelessWidget {
  final String label;
  final int count;
  final VoidCallback? onTap;
  const _Stat({required this.label, required this.count, this.onTap});

  @override
  Widget build(BuildContext context) {
    final col = Column(
      children: [
        Text('$count',
            style: const TextStyle(
                fontSize: 17, fontWeight: FontWeight.bold)),
        Text(label,
            style: const TextStyle(
                fontSize: 12, color: AppTheme.textSecondary)),
      ],
    );
    if (onTap == null) return col;
    return GestureDetector(onTap: onTap, child: col);
  }
}

class _SocialLinksDisplay extends StatelessWidget {
  final List<SocialLink> links;
  const _SocialLinksDisplay({required this.links});

  Future<void> _open(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 4,
      children: links.map((link) => GestureDetector(
        onTap: () => _open(link.url),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(link.icon, size: 14, color: link.color),
            const SizedBox(width: 4),
            Text(link.displayText,
                style: TextStyle(fontSize: 13, color: link.color)),
          ],
        ),
      )).toList(),
    );
  }
}

// ── 貼文 Tab ──────────────────────────────────────────
class _UserPostsTab extends ConsumerWidget {
  final String uid;
  const _UserPostsTab({required this.uid});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsAsync = ref.watch(userPostsProvider(uid));

    return postsAsync.when(
      data: (posts) => posts.isEmpty
          ? const Center(
              child: Text('還沒有貼文',
                  style: TextStyle(color: AppTheme.textSecondary)))
          : ListView.builder(
              itemCount: posts.length,
              itemBuilder: (_, i) => PostCard(post: posts[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) =>
          Center(child: Text('載入失敗：$e')),
    );
  }
}

// ── 轉發 Tab ──────────────────────────────────────────
class _UserRepostsTab extends ConsumerWidget {
  final String uid;
  const _UserRepostsTab({required this.uid});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repostsAsync =
        ref.watch(_userRepostsProvider(uid));

    return repostsAsync.when(
      data: (posts) => posts.isEmpty
          ? const Center(
              child: Text('尚無轉發',
                  style: TextStyle(color: AppTheme.textSecondary)))
          : ListView.builder(
              itemCount: posts.length,
              itemBuilder: (_, i) => _RepostCard(post: posts[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) =>
          Center(child: Text('載入失敗：$e')),
    );
  }
}

// 用 StreamProvider.family 包裝 userRepostsStream
final _userRepostsProvider =
    StreamProvider.family<List<PostModel>, String>((ref, uid) {
  return ref.read(postRepositoryProvider).userRepostsStream(uid);
});

class _RepostCard extends StatelessWidget {
  final PostModel post;
  const _RepostCard({required this.post});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
          child: Row(
            children: [
              const Icon(Icons.repeat, size: 14, color: AppTheme.textSecondary),
              const SizedBox(width: 4),
              const Text('已轉發',
                  style: TextStyle(
                      fontSize: 12, color: AppTheme.textSecondary)),
            ],
          ),
        ),
        PostCard(post: post),
      ],
    );
  }
}

// ── 收藏 Tab ──────────────────────────────────────────
final _userBookmarksProvider =
    StreamProvider.family<List<PostModel>, String>((ref, uid) {
  return ref.read(postRepositoryProvider).userBookmarksStream(uid);
});

class _BookmarksTab extends ConsumerWidget {
  final String uid;
  const _BookmarksTab({required this.uid});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookmarksAsync = ref.watch(_userBookmarksProvider(uid));

    return bookmarksAsync.when(
      data: (posts) => posts.isEmpty
          ? const Center(
              child: Text('尚無收藏',
                  style: TextStyle(color: AppTheme.textSecondary)))
          : ListView.builder(
              itemCount: posts.length,
              itemBuilder: (_, i) => PostCard(post: posts[i]),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('載入失敗：$e')),
    );
  }
}

// ── 草稿 Tab ──────────────────────────────────────────
class _DraftsTab extends ConsumerWidget {
  final String uid;
  const _DraftsTab({required this.uid});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final draftsAsync = ref.watch(userDraftsProvider(uid));

    return draftsAsync.when(
      data: (drafts) => drafts.isEmpty
          ? const Center(
              child: Text('尚無草稿',
                  style: TextStyle(color: AppTheme.textSecondary)))
          : ListView.separated(
              itemCount: drafts.length,
              separatorBuilder: (ctx, i) =>
                  const Divider(color: AppTheme.divider, height: 1),
              itemBuilder: (ctx, i) =>
                  _DraftTile(draft: drafts[i], uid: uid),
            ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) =>
          Center(child: Text('載入失敗：$e')),
    );
  }
}

class _DraftTile extends ConsumerWidget {
  final DraftModel draft;
  final String uid;
  const _DraftTile({required this.draft, required this.uid});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final hasMedia = draft.imageUrl != null ||
        draft.gifUrl != null ||
        draft.videoUrl != null;

    return ListTile(
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      title: draft.content.isNotEmpty
          ? Text(draft.content,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 14))
          : const Text('（無文字）',
              style: TextStyle(
                  color: AppTheme.textSecondary,
                  fontStyle: FontStyle.italic,
                  fontSize: 14)),
      subtitle: Padding(
        padding: const EdgeInsets.only(top: 4),
        child: Row(
          children: [
            if (hasMedia) ...[
              Icon(
                draft.videoUrl != null
                    ? Icons.videocam_outlined
                    : draft.gifUrl != null
                        ? Icons.gif_box_outlined
                        : Icons.image_outlined,
                size: 13,
                color: AppTheme.textSecondary,
              ),
              const SizedBox(width: 4),
            ],
            if (draft.locationName != null) ...[
              const Icon(Icons.location_on_outlined,
                  size: 13, color: AppTheme.textSecondary),
              const SizedBox(width: 2),
              Text(draft.locationName!,
                  style: const TextStyle(
                      fontSize: 12, color: AppTheme.textSecondary)),
              const SizedBox(width: 6),
            ],
            Text(
              timeago.format(draft.updatedAt, locale: 'zh'),
              style: const TextStyle(
                  fontSize: 12, color: AppTheme.textSecondary),
            ),
          ],
        ),
      ),
      trailing: IconButton(
        icon: const Icon(Icons.delete_outline,
            color: AppTheme.textSecondary, size: 20),
        onPressed: () => _confirmDelete(context, ref),
      ),
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => CreatePostScreen(draft: draft)),
      ),
    );
  }

  void _confirmDelete(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        title: const Text('刪除草稿'),
        content: const Text('確定要刪除這則草稿嗎？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消',
                style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            style:
                ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              Navigator.pop(ctx);
              await ref
                  .read(postRepositoryProvider)
                  .deleteDraft(uid, draft.id);
            },
            child: const Text('刪除'),
          ),
        ],
      ),
    );
  }
}
