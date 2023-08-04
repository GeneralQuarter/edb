export function pascalCase(str: string) {
  return str
    .replace('.', '-')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}
