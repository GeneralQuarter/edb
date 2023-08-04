import { decreaseStat } from '../lib/ability';
import SingleGameEventHandler from '../single-game-event-handler';
import type { MovedData, MovedGameEvent } from '../types/game-events/moved.game-event';

export default class OnMovedGameEventHandler extends SingleGameEventHandler<MovedGameEvent> {
  handle({ entityId }: MovedData): void {
    const entity = this.getEntity(entityId);
    decreaseStat(this.eventBus, entity, 'movement', 1);
  }
}
