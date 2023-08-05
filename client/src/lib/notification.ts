import type { NewNotification } from '../contexts/notifications';
import type { EntityStats } from '../types/entity-stats';
import type { Game } from '../types/game';
import { toTilePosition } from './board';

const statToEmoji: Partial<Record<keyof EntityStats, string>> = {
  damage: '🗡️',
  hitChance: '🎯',
  resistance: '🛡️',
  health: '💔'
}

export function createStatNotification(game: Game, {entityId, stat, from, to}: {entityId: number, stat: keyof EntityStats, from: number, to: number}): NewNotification | null {
  const emoji = statToEmoji[stat];

  if (!emoji) {
    return null;
  }
  
  const index = game.map.entityTiles.indexOf(entityId);

  if (index === -1) {
    return null;
  }

  const at = toTilePosition(index, game.map.width);
  const change = to - from;
  const sign = change > 0 ? '+' : '';
  const text = `${emoji}${sign}${change}`

  return {at, text};
}

export function createMissNotification(game: Game, {entityId}: {entityId: number}): NewNotification | null {
  const index = game.map.entityTiles.indexOf(entityId);

  if (index === -1) {
    return null;
  }

  const at = toTilePosition(index, game.map.width);
  return {at, text: 'Miss'};
}
