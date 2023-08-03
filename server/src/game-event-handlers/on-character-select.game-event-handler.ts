import SingleGameEventHandler from '../single-game-event-handler';
import type { CharacterSelectData, CharacterSelectGameEvent } from '../types/game-events/character-select.game-event';

export default class OnCharacterSelectGameEventHandler extends SingleGameEventHandler<CharacterSelectGameEvent> {
  handle({ playerToken, entityType }: CharacterSelectData): void {
    if (!playerToken) {
      throw new Error('Missing player token');
    }

    if (this.game.state !== 'Lobby') {
      throw new Error(`Can't select character when game is running`);
    }

    if (!this.game.entityTypes.includes(entityType)) {
      throw new Error(`Entity type ${entityType} is not valid`);
    }

    if (this.game.players.some(p => p.entityType === entityType)) {
      throw new Error(`Entity type ${entityType} already taken`);
    }

    const player = this.game.getPlayerWithToken(playerToken);

    if (!player) {
      throw new Error('Player not found');
    }

    player.entityType = entityType;
  }
}
