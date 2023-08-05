import EventBus from '../event-bus';
import Game from '../game';
import type { Entity } from '../types/entity';
import type { MoveGameEvent } from '../types/game-events/move.game-event';
import type { TilePosition } from '../types/tile-position';
import { TileShapeReference } from '../types/tile-shape-reference';
import { delay } from './timer';

export async function moveTowardsClosestPlayer(entity: Entity, game: Game, eventBus: EventBus) {
  let from = game.map.getEntityTilePosition(entity.id);

  if (!from) {
    return;
  }

  const result = game.getClosestPlayerEntity(from);

  if (!result) {
    return;
  }

  const { position } = result;
  const path = game.map.path(from, position);
  const moves = path.slice(0, entity.movement);

  for (const move of moves) {
    eventBus.dispatch<MoveGameEvent>('Move', {
      entityId: entity.id,
      direction: nextDirection(from, move),
    });
    from = move;
    await delay(200);
  }
}

function nextDirection(from: TilePosition, to: TilePosition) {
  const xd = to.x - from.x;
  const yd = to.y - from.y;

  if (xd !== 0) {
    return xd > 0 ? 'RIGHT' : 'LEFT';
  }

  return yd > 0 ? 'DOWN' : 'UP';
}

export function computeOptimalAbilityTarget(caster: Entity, abilityId: string, game: Game): {targetCount: number, target: TilePosition} | null {
  const ability = game.abilityBlueprintByAbilityId[abilityId];

  if (!ability) {
    return null;
  }

  const origin = game.map.getEntityTilePosition(caster.id);

  if (!origin) {
    return null;
  }

  const targets = game.getPlayerTiles();

  if (targets.length === 0) {
    return null;
  }

  if (!ability.reach) {
    const targetsInImpact = getTargetsInShape(game, ability.impact, origin, targets);
    return {targetCount: targetsInImpact.length, target: origin};
  }

  const reachTiles = game.computeShape(ability.reach, origin);

  let result: {targetCount: number, target: TilePosition} | null = null;

  for (const reachTile of reachTiles) {
    const targetsInImpact = getTargetsInShape(game, ability.impact, reachTile, targets);

    if (result && targetsInImpact.length <= result.targetCount) {
      continue;
    }

    result = {targetCount: targetsInImpact.length, target: reachTile};

    if (result.targetCount === targets.length) {
      return result;
    }
  }

  return result;
}

function getTargetsInShape(game: Game, tileShapeReference: TileShapeReference, origin: TilePosition, targets: TilePosition[]) {
  const tiles = game.computeShape(tileShapeReference, origin);
  return targets.filter(target => tiles.some(tile => tile.x === target.x && tile.y === target.y));
}
