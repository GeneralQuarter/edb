import { readFile, writeFile } from 'fs/promises';
import Game from '../game';
import { join } from 'path';
import { dateLog } from './logger';

export async function save(game: Game) {
  dateLog('Saving game...');
  await writeFile(join(__dirname, '..', 'save.json'), JSON.stringify(game.toServerState(), null, 2), 'utf-8');
}

export async function load(game: Game) {
  let json;

  try {
    json = await readFile(join(__dirname, '..', 'save.json'), 'utf-8');
  } catch (e) {}

  if (!json) {
    return;
  }

  let save = null;

  try {
    save = JSON.parse(json);
  } catch (e) {}

  if (save) {
    dateLog('Restore from save...');
    game.restoreFromSave(save);
  }
}
