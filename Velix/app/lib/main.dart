import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'services/prefs_service.dart';
import 'firebase_options.dart';
import 'providers/auth_provider.dart';
import 'providers/message_provider.dart';
import 'screens/ai_chat_screen.dart';
import 'screens/create_post_screen.dart';
import 'screens/home_screen.dart';
import 'screens/inbox_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/search_screen.dart';
import 'screens/admin_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/settings_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  final prefs = await SharedPreferences.getInstance();
  runApp(
    ProviderScope(
      overrides: [prefsProvider.overrideWithValue(prefs)],
      child: const VelixApp(),
    ),
  );
}

class VelixApp extends ConsumerWidget {
  const VelixApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter(
      initialLocation: '/',
      redirect: (context, state) {
        final authState = ref.read(authStateProvider);
        final isLoggedIn = authState.valueOrNull != null;
        final isAuthRoute =
            state.matchedLocation == '/login' ||
            state.matchedLocation == '/register';
        if (!isLoggedIn && !isAuthRoute) return '/login';
        if (isLoggedIn &&
            (state.matchedLocation == '/login' ||
                state.matchedLocation == '/register')) {
          return '/';
        }
        return null;
      },
      routes: [
        GoRoute(path: '/', builder: (_, _) => const MainShell()),
        GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
        GoRoute(path: '/register', builder: (_, _) => const RegisterScreen()),
        GoRoute(
          path: '/create-post',
          builder: (_, _) => const CreatePostScreen(),
        ),
        GoRoute(path: '/search', builder: (_, _) => const SearchScreen()),
        GoRoute(path: '/admin', builder: (_, _) => const AdminScreen()),
        GoRoute(
          path: '/notifications',
          builder: (_, _) => const NotificationsScreen(),
        ),
      ],
    );

    return MaterialApp.router(
      title: 'Velix',
      theme: AppTheme.dark,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}

class _TabScrollBehavior extends MaterialScrollBehavior {
  @override
  Set<PointerDeviceKind> get dragDevices => {
    PointerDeviceKind.touch,
    PointerDeviceKind.mouse,
    PointerDeviceKind.trackpad,
  };
}

class MainShell extends ConsumerStatefulWidget {
  const MainShell({super.key});

  @override
  ConsumerState<MainShell> createState() => _MainShellState();
}

class _MainShellState extends ConsumerState<MainShell> {
  int _currentIndex = 0;
  late final PageController _pageController;

  static const _screens = [
    HomeScreen(),
    InboxScreen(),
    AiChatScreen(),
    SettingsScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onTabTap(int i) {
    setState(() => _currentIndex = i);
    _pageController.animateToPage(
      i,
      duration: const Duration(milliseconds: 260),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final unreadMessages = ref.watch(unreadMessagesCountProvider);

    // Navigate to login when user signs out
    ref.listen<User?>(currentUserProvider, (prev, next) {
      if (prev != null && next == null && context.mounted) {
        context.go('/login');
      }
    });

    return Scaffold(
      body: ScrollConfiguration(
        behavior: _TabScrollBehavior(),
        child: PageView(
          controller: _pageController,
          onPageChanged: (i) => setState(() => _currentIndex = i),
          children: _screens,
        ),
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: AppTheme.bg,
        indicatorColor: AppTheme.accent.withValues(alpha: 0.2),
        selectedIndex: _currentIndex,
        onDestinationSelected: _onTabTap,
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: '首頁',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: unreadMessages > 0,
              label: Text(unreadMessages > 99 ? '99+' : '$unreadMessages'),
              child: const Icon(Icons.mail_outline),
            ),
            selectedIcon: Badge(
              isLabelVisible: unreadMessages > 0,
              label: Text(unreadMessages > 99 ? '99+' : '$unreadMessages'),
              child: const Icon(Icons.mail),
            ),
            label: '訊息',
          ),
          const NavigationDestination(
            icon: Icon(Icons.auto_awesome_outlined),
            selectedIcon: Icon(Icons.auto_awesome),
            label: 'AI',
          ),
          const NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: '個人',
          ),
        ],
      ),
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton(
              heroTag: 'post',
              onPressed: () => context.push('/create-post'),
              child: const Icon(Icons.edit_outlined),
            )
          : null,
    );
  }
}
