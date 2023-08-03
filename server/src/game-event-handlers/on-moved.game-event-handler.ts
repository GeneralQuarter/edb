import SingleGameEventHandler from '../single-game-event-handler';
import type { MovedData, MovedGameEvent } from '../types/game-events/moved.game-event';

export default class OnMovedGameEventHandler extends SingleGameEventHandler<MovedGameEvent> {
  handle(data: MovedData): void {
    // console.log(this.game.map.debugRender());
  }
}
