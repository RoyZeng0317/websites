import 'package:go_router/go_router.dart';
import 'screens/home_screen.dart';
import 'screens/stock_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/stock/:symbol',
      builder: (context, state) {
        final symbol = state.pathParameters['symbol']!;
        return StockScreen(symbol: symbol);
      },
    ),
  ],
);