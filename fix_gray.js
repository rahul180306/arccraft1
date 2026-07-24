const fs = require('fs');

const path = 'components/workspace/SettingsWorkspace.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  /bg-gray-200 dark:bg-gray-700/g, 'bg-[var(--surface-muted)]',
  /bg-gray-100 dark:bg-gray-800/g, 'bg-[var(--surface-muted)]',
  /hover:bg-gray-800/g, 'hover:bg-[var(--surface-muted)]'
];

for (let i = 0; i < replacements.length; i += 2) {
  content = content.replace(replacements[i], replacements[i + 1]);
}

fs.writeFileSync(path, content, 'utf8');
