import 'package:flutter/material.dart';

Color priceColor(double v) => v >= 0 ? Colors.red : Colors.green;

Color priceBg(bool up) =>
    up ? Colors.red.withValues(alpha: 0.1) : Colors.green.withValues(alpha: 0.1);

Color priceText(bool up) => up ? const Color(0xFFEF4444) : const Color(0xFF10B981);

Widget sectionCard({
  required ThemeData theme,
  required String title,
  required List<Widget> children,
  Widget? trailing,
}) {
  return Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    margin: const EdgeInsets.only(bottom: 12),
    decoration: BoxDecoration(
      color: theme.colorScheme.surface,
      borderRadius: BorderRadius.circular(16),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title.isNotEmpty)
          Row(
            children: [
              Text(title, style: theme.textTheme.titleSmall),
              if (trailing != null) const Spacer(),
              ?trailing,
            ],
          ),
      if (title.isNotEmpty) const SizedBox(height: 12),
        ...children,
      ],
    ),
  );
}

Widget infoRow(String label, String value, {Color? valueColor, bool showPlus = false}) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 3),
    child: Row(
      children: [
        SizedBox(
          width: 90,
          child: Text(label, style: const TextStyle(fontSize: 13, color: Colors.grey)),
        ),
        const Spacer(),
        Text(
          showPlus && !value.startsWith('-') && value != 'N/A' ? '+$value' : value,
          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: valueColor),
        ),
      ],
    ),
  );
}

String fmtNum(double n) {
  if (n >= 1e12) return '${(n / 1e12).toStringAsFixed(2)}T';
  if (n >= 1e9) return '${(n / 1e9).toStringAsFixed(2)}B';
  if (n >= 1e6) return '${(n / 1e6).toStringAsFixed(2)}M';
  if (n >= 1e3) return '${(n / 1e3).toStringAsFixed(1)}K';
  return n.toStringAsFixed(2);
}

String fmtPct(double? v) => v != null ? '${(v * 100).toStringAsFixed(1)}%' : 'N/A';
