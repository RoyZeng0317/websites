import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:video_player/video_player.dart';
import '../constants/post_categories.dart';
import '../models/draft_model.dart';
import '../providers/auth_provider.dart';
import '../providers/post_provider.dart';
import '../services/storage_service.dart';
import '../theme/app_theme.dart';

class CreatePostScreen extends ConsumerStatefulWidget {
  final DraftModel? draft;
  const CreatePostScreen({super.key, this.draft});

  @override
  ConsumerState<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends ConsumerState<CreatePostScreen> {
  final _contentController = TextEditingController();
  final _musicTitleController = TextEditingController();
  final _musicArtistController = TextEditingController();

  // 新選取的本地檔案
  File? _newImageFile;
  File? _newGifFile;
  File? _newVideoFile;

  // 草稿中已存在的網路 URL
  String? _existingImageUrl;
  String? _existingGifUrl;
  String? _existingVideoUrl;

  String? _locationName;
  String _category = '一般生活';
  bool _showMusicInput = false;
  bool _isLoading = false;
  bool _isSavingDraft = false;

  VideoPlayerController? _videoController;
  bool _videoReady = false;

  String? get _draftId => widget.draft?.id;

  bool get _hasMedia =>
      _newImageFile != null ||
      _newGifFile != null ||
      _newVideoFile != null ||
      _existingImageUrl != null ||
      _existingGifUrl != null ||
      _existingVideoUrl != null;

  @override
  void initState() {
    super.initState();
    final d = widget.draft;
    if (d != null) {
      _contentController.text = d.content;
      _existingImageUrl = d.imageUrl;
      _existingGifUrl = d.gifUrl;
      _existingVideoUrl = d.videoUrl;
      _locationName = d.locationName;
      _category = d.category;
      if (d.musicTitle != null) {
        _showMusicInput = true;
        _musicTitleController.text = d.musicTitle!;
        _musicArtistController.text = d.musicArtist ?? '';
      }
      if (d.videoUrl != null) {
        _initVideoFromUrl(d.videoUrl!);
      }
    }
  }

  Future<void> _initVideoFromUrl(String url) async {
    final ctrl = VideoPlayerController.networkUrl(Uri.parse(url));
    await ctrl.initialize();
    if (mounted) setState(() { _videoController = ctrl; _videoReady = true; });
  }

  Future<void> _initVideoFromFile(File file) async {
    await _disposeVideo();
    final ctrl = VideoPlayerController.file(file);
    await ctrl.initialize();
    if (mounted) setState(() { _videoController = ctrl; _videoReady = true; });
  }

  Future<void> _disposeVideo() async {
    await _videoController?.dispose();
    if (mounted) setState(() { _videoController = null; _videoReady = false; });
  }

  void _clearAllMedia() {
    _disposeVideo();
    setState(() {
      _newImageFile = null;
      _newGifFile = null;
      _newVideoFile = null;
      _existingImageUrl = null;
      _existingGifUrl = null;
      _existingVideoUrl = null;
    });
  }

  Future<void> _pickImage() async {
    final file = await ref.read(storageServiceProvider).pickImage();
    if (file == null) return;
    _disposeVideo();
    setState(() {
      _newImageFile = file;
      _newGifFile = null;
      _newVideoFile = null;
      _existingImageUrl = null;
      _existingGifUrl = null;
      _existingVideoUrl = null;
    });
  }

  Future<void> _pickGif() async {
    final file = await ref.read(storageServiceProvider).pickGif();
    if (file == null) return;
    _disposeVideo();
    setState(() {
      _newGifFile = file;
      _newImageFile = null;
      _newVideoFile = null;
      _existingImageUrl = null;
      _existingGifUrl = null;
      _existingVideoUrl = null;
    });
  }

  Future<void> _pickVideo() async {
    final file = await ref.read(storageServiceProvider).pickVideo();
    if (file == null) return;
    setState(() {
      _newVideoFile = file;
      _newImageFile = null;
      _newGifFile = null;
      _existingImageUrl = null;
      _existingGifUrl = null;
      _existingVideoUrl = null;
    });
    await _initVideoFromFile(file);
  }

  void _pickLocation() {
    final ctrl = TextEditingController(text: _locationName ?? '');
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(
            20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('新增位置',
                style:
                    TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(
              controller: ctrl,
              autofocus: true,
              decoration: const InputDecoration(
                hintText: '輸入地點（例如：台北, 台灣）',
                prefixIcon: Icon(Icons.location_on_outlined,
                    color: AppTheme.accent),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                if (_locationName != null)
                  TextButton(
                    onPressed: () {
                      setState(() => _locationName = null);
                      Navigator.pop(ctx);
                    },
                    child: const Text('移除位置',
                        style: TextStyle(color: Colors.red)),
                  ),
                const Spacer(),
                ElevatedButton(
                  onPressed: () {
                    final loc = ctrl.text.trim();
                    setState(() => _locationName = loc.isEmpty ? null : loc);
                    Navigator.pop(ctx);
                  },
                  child: const Text('確認'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<_MediaUrls> _uploadMedia(String uid) async {
    final storage = ref.read(storageServiceProvider);
    String? imageUrl = _existingImageUrl;
    String? gifUrl = _existingGifUrl;
    String? videoUrl = _existingVideoUrl;

    if (_newImageFile != null) {
      imageUrl = await storage.uploadPostImage(uid, _newImageFile!);
    }
    if (_newGifFile != null) {
      gifUrl = await storage.uploadPostImage(uid, _newGifFile!);
    }
    if (_newVideoFile != null) {
      videoUrl = await storage.uploadVideo(uid, _newVideoFile!);
    }
    return _MediaUrls(imageUrl: imageUrl, gifUrl: gifUrl, videoUrl: videoUrl);
  }

  Future<void> _saveDraft() async {
    final content = _contentController.text.trim();
    if (content.isEmpty && !_hasMedia) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('請輸入內容或選擇媒體')));
      return;
    }
    setState(() => _isSavingDraft = true);
    try {
      final user = ref.read(currentUserProvider);
      if (user == null) return;

      final urls = await _uploadMedia(user.uid);
      await ref.read(postRepositoryProvider).saveDraft(
            uid: user.uid,
            draftId: _draftId,
            content: content,
            imageUrl: urls.imageUrl,
            gifUrl: urls.gifUrl,
            videoUrl: urls.videoUrl,
            locationName: _locationName,
            musicTitle: _showMusicInput &&
                    _musicTitleController.text.trim().isNotEmpty
                ? _musicTitleController.text.trim()
                : null,
            musicArtist: _showMusicInput &&
                    _musicArtistController.text.trim().isNotEmpty
                ? _musicArtistController.text.trim()
                : null,
            category: _category,
          );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('已儲存為草稿')));
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('儲存失敗：$e')));
      }
    } finally {
      if (mounted) setState(() => _isSavingDraft = false);
    }
  }

  Future<void> _publish() async {
    final content = _contentController.text.trim();
    if (content.isEmpty) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('請輸入內容')));
      return;
    }
    setState(() => _isLoading = true);
    try {
      final user = ref.read(currentUserProvider);
      if (user == null) return;

      final userData = await ref
          .read(firestoreProvider)
          .collection('users')
          .doc(user.uid)
          .get();
      final data = userData.data() ?? {};

      final urls = await _uploadMedia(user.uid);

      await ref.read(postRepositoryProvider).createPost(
            authorId: user.uid,
            authorName: data['displayName'] ?? user.displayName ?? '匿名',
            authorUsername: data['username'] ?? 'user',
            authorPhotoUrl:
                data['photoUrl'] ?? user.photoURL ?? '',
            content: content,
            imageUrl: urls.imageUrl,
            gifUrl: urls.gifUrl,
            videoUrl: urls.videoUrl,
            locationName: _locationName,
            musicTitle: _showMusicInput &&
                    _musicTitleController.text.trim().isNotEmpty
                ? _musicTitleController.text.trim()
                : null,
            musicArtist: _showMusicInput &&
                    _musicArtistController.text.trim().isNotEmpty
                ? _musicArtistController.text.trim()
                : null,
            category: _category,
            draftId: _draftId,
          );

      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('發布失敗：$e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final busy = _isLoading || _isSavingDraft;

    return Scaffold(
      appBar: AppBar(
        leading: TextButton(
          onPressed: busy ? null : () => context.pop(),
          child: const Text('取消',
              style: TextStyle(color: AppTheme.textSecondary)),
        ),
        title: Text(_draftId != null ? '編輯草稿' : '新貼文'),
        actions: [
          TextButton(
            onPressed: busy ? null : _saveDraft,
            child: _isSavingDraft
                ? const SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(
                        strokeWidth: 2, color: AppTheme.textSecondary))
                : const Text('儲存草稿',
                    style: TextStyle(color: AppTheme.textSecondary)),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 8, 12, 8),
            child: ElevatedButton(
              onPressed: busy ? null : _publish,
              child: _isLoading
                  ? const SizedBox(
                      width: 14,
                      height: 14,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white))
                  : const Text('發布',
                      style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // ── 可捲動內容區 ──
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 輸入框（無字數限制）
                  TextField(
                    controller: _contentController,
                    autofocus: widget.draft == null,
                    maxLines: null,
                    minLines: 8,
                    decoration: const InputDecoration(
                      hintText: '現在在想什麼？支援 #hashtag',
                      border: InputBorder.none,
                      filled: false,
                    ),
                    style: const TextStyle(fontSize: 18, height: 1.5),
                  ),

                  // ── 類別選擇 ──
                  const SizedBox(height: 4),
                  SizedBox(
                    height: 36,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: kPostCategories.length,
                      separatorBuilder: (ctx, i) =>
                          const SizedBox(width: 8),
                      itemBuilder: (_, i) {
                        final cat = kPostCategories[i];
                        final selected = cat == _category;
                        return GestureDetector(
                          onTap: () =>
                              setState(() => _category = cat),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: selected
                                  ? AppTheme.accent
                                      .withValues(alpha: 0.15)
                                  : AppTheme.surface,
                              borderRadius:
                                  BorderRadius.circular(20),
                              border: Border.all(
                                color: selected
                                    ? AppTheme.accent
                                    : AppTheme.divider,
                              ),
                            ),
                            child: Text(
                              cat,
                              style: TextStyle(
                                fontSize: 12,
                                color: selected
                                    ? AppTheme.accent
                                    : AppTheme.textSecondary,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 8),

                  // ── 媒體預覽 ──
                  if (_newImageFile != null)
                    _MediaPreview(
                      child: Image.file(_newImageFile!,
                          fit: BoxFit.cover, width: double.infinity),
                      onRemove: () => setState(() => _newImageFile = null),
                    ),
                  if (_newGifFile != null)
                    _MediaPreview(
                      child: Image.file(_newGifFile!,
                          fit: BoxFit.cover, width: double.infinity),
                      onRemove: () => setState(() => _newGifFile = null),
                    ),
                  if (_existingImageUrl != null)
                    _MediaPreview(
                      child: Image.network(_existingImageUrl!,
                          fit: BoxFit.cover, width: double.infinity),
                      onRemove: () =>
                          setState(() => _existingImageUrl = null),
                    ),
                  if (_existingGifUrl != null)
                    _MediaPreview(
                      child: Image.network(_existingGifUrl!,
                          fit: BoxFit.cover, width: double.infinity),
                      onRemove: () =>
                          setState(() => _existingGifUrl = null),
                    ),
                  if (_videoReady && _videoController != null)
                    _MediaPreview(
                      onRemove: () {
                        _clearAllMedia();
                        setState(() => _newVideoFile = null);
                      },
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          AspectRatio(
                            aspectRatio:
                                _videoController!.value.aspectRatio,
                            child: VideoPlayer(_videoController!),
                          ),
                          Container(
                            width: 48,
                            height: 48,
                            decoration: const BoxDecoration(
                                color: Colors.black54,
                                shape: BoxShape.circle),
                            child: const Icon(Icons.play_arrow,
                                color: Colors.white, size: 28),
                          ),
                        ],
                      ),
                    ),
                  if (_existingVideoUrl != null && !_videoReady)
                    _MediaPreview(
                      onRemove: () =>
                          setState(() => _existingVideoUrl = null),
                      child: Container(
                        height: 120,
                        color: Colors.black,
                        child: const Center(
                          child: Icon(Icons.videocam,
                              color: Colors.white54, size: 40),
                        ),
                      ),
                    ),

                  // ── 位置 chip ──
                  if (_locationName != null) ...[
                    const SizedBox(height: 10),
                    GestureDetector(
                      onTap: _pickLocation,
                      child: Chip(
                        avatar: const Icon(Icons.location_on,
                            size: 16, color: AppTheme.accent),
                        label: Text(_locationName!,
                            style: const TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 13)),
                        backgroundColor: AppTheme.surface,
                        deleteIcon: const Icon(Icons.close,
                            size: 14, color: AppTheme.textSecondary),
                        onDeleted: () =>
                            setState(() => _locationName = null),
                      ),
                    ),
                  ],

                  // ── 音樂輸入 ──
                  if (_showMusicInput) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.divider),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.music_note,
                                  color: AppTheme.accent, size: 18),
                              const SizedBox(width: 8),
                              const Text('新增音樂',
                                  style: TextStyle(
                                      fontWeight: FontWeight.w500,
                                      color: AppTheme.textPrimary)),
                              const Spacer(),
                              GestureDetector(
                                onTap: () => setState(
                                    () => _showMusicInput = false),
                                child: const Icon(Icons.close,
                                    size: 16,
                                    color: AppTheme.textSecondary),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          TextField(
                            controller: _musicTitleController,
                            decoration: const InputDecoration(
                                hintText: '歌曲名稱', isDense: true),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _musicArtistController,
                            decoration: const InputDecoration(
                                hintText: '歌手名稱（選填）',
                                isDense: true),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),

          // ── 底部工具列（固定） ──
          Container(
            decoration: const BoxDecoration(
              color: AppTheme.bg,
              border:
                  Border(top: BorderSide(color: AppTheme.divider)),
            ),
            padding: const EdgeInsets.fromLTRB(4, 4, 4, 12),
            child: SafeArea(
              top: false,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _ToolBtn(
                    icon: Icons.image_outlined,
                    label: '圖片',
                    onTap: _pickImage,
                    active: _newImageFile != null ||
                        _existingImageUrl != null,
                  ),
                  _ToolBtn(
                    icon: Icons.gif_box_outlined,
                    label: 'GIF',
                    onTap: _pickGif,
                    active: _newGifFile != null || _existingGifUrl != null,
                  ),
                  _ToolBtn(
                    icon: Icons.videocam_outlined,
                    label: '影片',
                    onTap: _pickVideo,
                    active: _newVideoFile != null ||
                        _existingVideoUrl != null,
                  ),
                  _ToolBtn(
                    icon: Icons.location_on_outlined,
                    label: '位置',
                    onTap: _pickLocation,
                    active: _locationName != null,
                  ),
                  _ToolBtn(
                    icon: Icons.music_note_outlined,
                    label: '音樂',
                    onTap: () =>
                        setState(() => _showMusicInput = !_showMusicInput),
                    active: _showMusicInput,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _contentController.dispose();
    _musicTitleController.dispose();
    _musicArtistController.dispose();
    _videoController?.dispose();
    super.dispose();
  }
}

class _MediaUrls {
  final String? imageUrl;
  final String? gifUrl;
  final String? videoUrl;
  _MediaUrls({this.imageUrl, this.gifUrl, this.videoUrl});
}

class _MediaPreview extends StatelessWidget {
  final Widget child;
  final VoidCallback onRemove;
  const _MediaPreview({required this.child, required this.onRemove});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: child,
          ),
          Positioned(
            top: 8,
            right: 8,
            child: GestureDetector(
              onTap: onRemove,
              child: Container(
                decoration: const BoxDecoration(
                    color: Colors.black54, shape: BoxShape.circle),
                padding: const EdgeInsets.all(4),
                child:
                    const Icon(Icons.close, color: Colors.white, size: 18),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ToolBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool active;
  const _ToolBtn(
      {required this.icon,
      required this.label,
      required this.onTap,
      this.active = false});

  @override
  Widget build(BuildContext context) {
    final color = active ? AppTheme.accent : AppTheme.textSecondary;
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 2),
            Text(label,
                style: TextStyle(fontSize: 10, color: color)),
          ],
        ),
      ),
    );
  }
}
