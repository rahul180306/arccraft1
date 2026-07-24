const fs = require('fs');
const path = 'components/workspace/SettingsWorkspace.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  /text-\[\#6B7280\] hover:text-\[\#111827\] dark:text-\[\#9CA3AF\] dark:hover:text-\[\#F9FAFB\]/g, 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
  /hover:bg-\[\#F3F4F6\] dark:hover:bg-\[\#1F2937\]/g, 'hover:bg-[var(--surface-hover)]',
  /group-hover:text-\[\#111827\] dark:group-hover:text-\[\#F9FAFB\]/g, 'group-hover:text-[var(--text-primary)]',
  /dark:text-\[\#FF7A45\]/g, '', // remove dark specific accent since var(--accent) handles it
  /bg-\[\#F9FAFB\] dark:bg-\[\#1F2937\]/g, 'bg-[var(--surface-hover)]',
  /hover:text-\[\#111827\] dark:hover:text-\[\#F9FAFB\]/g, 'hover:text-[var(--text-primary)]',
  /bg-\[\#CBD5E1\] dark:bg-\[\#374151\]/g, 'bg-[var(--border)]',
  /bg-\[\#D1D5DB\] dark:bg-\[\#4B5563\]/g, 'bg-[var(--border-strong)]',
  /bg-\[\#FF5A1F\]\/15/g, 'bg-[var(--accent)]/15',
  /bg-\[\#FF5A1F\]\/20/g, 'bg-[var(--accent)]/20',
  /bg-\[\#FFF4EF\]/g, 'bg-[var(--accent)]/10',
  /border-\[\#FF5A1F\]\/30/g, 'border-[var(--accent)]/30',
  /bg-\[\#111111\] dark:bg-gray-800/g, 'bg-gray-900 dark:bg-gray-800'
];

for (let i = 0; i < replacements.length; i += 2) {
  content = content.replace(replacements[i], replacements[i + 1]);
}
fs.writeFileSync(path, content, 'utf8');
