const fs = require('fs');

const path = 'components/workspace/SettingsWorkspace.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  // text-primary
  /text-gray-900 dark:text-white/g, 'text-[var(--text-primary)]',
  /text-\[\#111827\] dark:text-\[\#F9FAFB\]/g, 'text-[var(--text-primary)]',
  /text-\[\#1F2937\] dark:text-\[\#E5E7EB\]/g, 'text-[var(--text-primary)]', // section title

  // text-secondary
  /text-gray-700 dark:text-gray-300/g, 'text-[var(--text-secondary)]',
  /text-gray-800 dark:text-gray-200/g, 'text-[var(--text-secondary)]',
  /text-gray-700 dark:text-gray-200/g, 'text-[var(--text-secondary)]',
  /text-gray-800 dark:text-gray-300/g, 'text-[var(--text-secondary)]',
  /text-\[\#374151\] dark:text-\[\#D1D5DB\]/g, 'text-[var(--text-secondary)]',

  // text-muted
  /text-gray-500 dark:text-gray-400/g, 'text-[var(--text-muted)]',
  /text-gray-600 dark:text-gray-400/g, 'text-[var(--text-muted)]',
  /text-gray-600 dark:text-gray-300/g, 'text-[var(--text-muted)]',
  /text-gray-400 dark:text-gray-500/g, 'text-[var(--text-muted)]',
  /text-\[\#6B7280\] dark:text-\[\#9CA3AF\]/g, 'text-[var(--text-muted)]',
  /text-\[\#9CA3AF\] dark:text-\[\#6B7280\]/g, 'text-[var(--text-muted)]',
  /text-gray-400/g, 'text-[var(--text-muted)]', // standalone
  /text-gray-500/g, 'text-[var(--text-muted)]', // standalone

  // text-accent
  /text-\[\#FF5A1F\] dark:text-\[\#FF6B35\]/g, 'text-[var(--accent)]',
  /text-\[\#FF5A1F\]/g, 'text-[var(--accent)]',

  // Background replacements
  /bg-white dark:bg-gray-900/g, 'bg-[var(--surface)]',
  /bg-white dark:bg-\[\#111827\]/g, 'bg-[var(--surface)]',
  /bg-white dark:bg-gray-800/g, 'bg-[var(--surface-hover)]',
  /bg-gray-50 dark:bg-gray-800/g, 'bg-[var(--surface-muted)]',
  /bg-\[\#F9FAFB\] dark:bg-\[\#111827\]/g, 'bg-[var(--surface)]', // Wait, #F9FAFB is secondary surface in light, #111827 is workspace in dark.
  /bg-\[\#F3F4F6\] dark:bg-\[\#273244\]/g, 'bg-[var(--surface-muted)]',
  /bg-\[\#FFF4EF\] dark:bg-\[\#FF5A1F\]\/15/g, 'bg-[var(--accent)]/10 text-[var(--accent)]',

  // Borders
  /border-gray-200 dark:border-gray-800/g, 'border-[var(--border)]',
  /border-gray-200 dark:border-gray-700/g, 'border-[var(--border)]',
  /border-gray-300 dark:border-gray-700/g, 'border-[var(--border-strong)]',
  /border-gray-300 dark:border-gray-800/g, 'border-[var(--border)]',
  /border-\[\#E5E7EB\] dark:border-\[\#374151\]/g, 'border-[var(--border)]',
  /border-\[\#D1D5DB\] dark:border-\[\#4B5563\]/g, 'border-[var(--border-strong)]',
];

for (let i = 0; i < replacements.length; i += 2) {
  content = content.replace(replacements[i], replacements[i + 1]);
}

fs.writeFileSync(path, content, 'utf8');
