import 'package:flutter_test/flutter_test.dart';
import 'package:test/main.dart';

void main() {
  testWidgets('App loads quiz screen', (WidgetTester tester) async {
    await tester.pumpWidget(const QuizApp());
    await tester.pump();
    expect(find.byType(QuizApp), findsOneWidget);
  });
}
