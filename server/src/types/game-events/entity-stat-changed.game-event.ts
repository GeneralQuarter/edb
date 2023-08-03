import type { GameEvent } from '../game-event';

export type EntityStatChangedData = {
  entityId: number;
  stat: string;
  from: number;
  to: number;
};

export type EntityStatChangedGameEvent = GameEvent<EntityStatChangedData> & {
  type: 'EntityStatChanged';
}
