import 'package:flutter_test/flutter_test.dart';
import 'package:sotcks/main.dart';

void main() {
  testWidgets('App should render home screen', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.text('Stock Info'), findsOneWidget);
  });
}
