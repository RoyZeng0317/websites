import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final prefsProvider =
    Provider<SharedPreferences>((_) => throw UnimplementedError());

final prefsServiceProvider = Provider<PrefsService>((ref) {
  return PrefsService(ref.read(prefsProvider));
});

class PrefsService {
  final SharedPreferences _prefs;
  PrefsService(this._prefs);

  static const _historyKey = 'search_history';
  static const _keepLoginKey = 'keep_logged_in';
  static const _maxHistory = 10;

  // ── 搜尋紀錄 ──────────────────────────────────────────
  List<String> getSearchHistory() =>
      _prefs.getStringList(_historyKey) ?? [];

  Future<void> addSearchHistory(String query) async {
    final q = query.trim();
    if (q.isEmpty) return;
    final history = getSearchHistory();
    history.remove(q);
    history.insert(0, q);
    if (history.length > _maxHistory) history.removeLast();
    await _prefs.setStringList(_historyKey, history);
  }

  Future<void> removeSearchHistory(String query) async {
    final history = getSearchHistory();
    history.remove(query);
    await _prefs.setStringList(_historyKey, history);
  }

  Future<void> clearSearchHistory() async {
    await _prefs.remove(_historyKey);
  }

  // ── 保持登入 ──────────────────────────────────────────
  bool getKeepLoggedIn() => _prefs.getBool(_keepLoginKey) ?? true;

  Future<void> setKeepLoggedIn(bool value) =>
      _prefs.setBool(_keepLoginKey, value);
}
