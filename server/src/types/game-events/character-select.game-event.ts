import type { GameEvent } from '../game-event';
import type { PlayerEventData } from './player-event-data';

export type CharacterSelectData = {
  entityType: string;
} & PlayerEventData;

export type CharacterSelectGameEvent = GameEvent<CharacterSelectData> & {
  type: 'CharacterSelect';
}
