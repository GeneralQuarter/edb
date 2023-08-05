import { GameEvent } from './types/game-event';

const broadcastableEventTypes = [
  'TurnStarted',
  'EntityStatChanged',
  'AbilityMissed',
  'Moved',
]

export default function isEventBroadcastable(event: GameEvent<any>) {
  return broadcastableEventTypes.includes(event.type);
}
