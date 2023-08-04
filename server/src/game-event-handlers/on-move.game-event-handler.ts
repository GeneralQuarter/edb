import SingleGameEventHandler from '../single-game-event-handler';
import type { Direction } from '../types/direction';
import type { MoveData, MoveGameEvent } from '../types/game-events/move.game-event';
import type { MovedGameEvent } from '../types/game-events/moved.game-event';
import type { TilePosition } from '../types/tile-position';

export default class OnMoveGameEventHandler extends SingleGameEventHandler<MoveGameEvent> {
  handle({ entityId, direction, playerToken }: MoveData): void {
    this.validateEntityControlledByPlayer(entityId, playerToken);
    
    const entity = this.getEntity(entityId);

    if (entity.movement <= 0) {
      throw new Error(`Cannot move any more`);
    }

    const currentPosition = this.game.map.getEntityTilePosition(entityId);

    if (!currentPosition) {
      throw new Error(`Position of entity ${entityId} not found`);
    }

    const nextPosition = this.getTilePositionFromDirection(currentPosition, direction);

    if (!this.game.map.isInMap(nextPosition)) {
      throw new Error(`Move position ${JSON.stringify(nextPosition)} is out of the map`);
    }

    if (!this.game.map.isEmpty(nextPosition)) {
      throw new Error(`Move position ${JSON.stringify(nextPosition)} is not empty`);
    }

    this.game.map.swapTiles(currentPosition, nextPosition);

    this.eventBus.dispatch<MovedGameEvent>('Moved',  {
      entityId,
      from: currentPosition,
      to: nextPosition,
    });
  }

  private getTilePositionFromDirection(previousPosition: TilePosition, direction: Direction) {
    switch (direction) {
      case 'UP':
        return {...previousPosition, y: previousPosition.y - 1};
      case 'DOWN':
        return {...previousPosition, y: previousPosition.y + 1};
      case 'LEFT':
        return {...previousPosition, x: previousPosition.x - 1};
      case 'RIGHT':
        return {...previousPosition, x: previousPosition.x + 1};
    }
  }
}
