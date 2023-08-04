import EventBus from '../event-bus';
import Game from '../game';
import type { Entity } from './entity';
import type { EntityStatsBlueprint } from './entity-stats-blueprint';

export type EntityBlueprint = {
  playable: boolean;
  abilityIds: string[];
  playTurn?: (self: Entity, game: Game, eventBus: EventBus) => Promise<void>;
  generateStats: () => EntityStatsBlueprint;
}
