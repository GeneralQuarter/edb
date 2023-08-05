import { readdir } from 'fs/promises';
import { join } from 'path';
import { pascalCase } from './pascal-case';

export async function loadModulesInFolder<T>(folderName: string) {
  const modules: Record<string, T> = {};
  const filenames = (await readdir(join(__dirname, '..', folderName))).filter(f => f.endsWith('.js'));

  for (const filename of filenames) {
    const module = (await import(`../${folderName}/${filename}`)).default.default as T;
    const type = pascalCase(filename.split('.')[0]);
    modules[type] = module;
  }

  console.log(`[FolderModules] Loaded from ${folderName}: ${Object.keys(modules).join(', ')}`);

  return modules;
}
