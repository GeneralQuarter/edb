import SingleGameEventHandler from '../single-game-event-handler';
import type { Entity } from '../types/entity';
import type { EntityStatsBlueprint } from '../types/entity-stats-blueprint';
import type { NextTurnEvent } from '../types/game-events/next-turn.game-event';
import type { StartGameData, StartGameGameEvent } from '../types/game-events/start-game.game-event';

export default class OnStartGameGameEventHandler extends SingleGameEventHandler<StartGameGameEvent> {
  handle(_: StartGameData): void {
    if (this.game.state !== 'Lobby') {
      throw new Error('Game is already started');
    }

    const everyPlayerHasACharacter = this.game.players.every(p => !!p.entityType);

    if (!everyPlayerHasACharacter) {
      throw new Error('Players without characters');
    }

    let entityId = 1;

    for (const player of this.game.players) {
      const type = player.entityType;

      if (!type) {
        continue;
      }

      const entityBlueprint = this.game.entityBlueprintByEntityType[type];

      if (!entityBlueprint) {
        continue;
      }

      const stats = entityBlueprint.generateStats();

      const spawnPosition = this.game.map.getRandomSpawnLocation('Player');

      if (!spawnPosition) {
        continue;
      }

      const entity = generateEntity(entityId++, type, stats);
      player.entityId = entity.id;
      this.game.placeEntity(entity, spawnPosition);
    }

    const aiTypes = Object.entries(this.game.entityBlueprintByEntityType)
      .filter(([, eb]) => !!eb.playTurn)
      .map(([entityType,]) => entityType);
    
    for (const aiType of aiTypes) {
      for (const spawnLocation of this.game.map.getSpawnLocations(aiType)) {
        const entityBlueprint = this.game.entityBlueprintByEntityType[aiType];

        if (!entityBlueprint) {
          continue;
        }

        const stats = entityBlueprint.generateStats();
        const aiEntity = generateEntity(entityId++, aiType, stats);
        this.game.placeEntity(aiEntity, spawnLocation);
      }
    }

    this.game.state = 'Game';

    this.eventBus.dispatch<NextTurnEvent>('NextTurn', {});
  }
}

function generateEntity(id: number, type: string, stats: EntityStatsBlueprint): Entity {
  return {
    id,
    type,
    maxHealth: stats.health,
    health: stats.health,
    damage: stats.damage,
    hitChance: stats.hitChance,
    initiative: stats.initiative,
    resistance: stats.resistance,
    initialMovement: stats.movement,
    movement: stats.movement,
  };
}
