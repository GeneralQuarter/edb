import SingleGameEventHandler from '../single-game-event-handler';
import { CastAbilityData, CastAbilityGameEvent } from '../types/game-events/cast-ability.game-event';

export default class OnCastAbilityGameEventHandler extends SingleGameEventHandler<CastAbilityGameEvent> {
  handle({ playerToken, abilityId, target = {x: 0, y: 0}, entityId }: CastAbilityData): void {
    this.validateEntityControlledByPlayer(entityId, playerToken);
    this.validateEntityTurn(entityId);

    const caster = this.getEntity(entityId);

    const ability = this.game.abilityBlueprintByAbilityId[abilityId];

    if (!ability) {
      throw new Error(`Ability with id ${abilityId} not found`);
    }

    if (!caster.abilities.some(a => a.id === abilityId)) {
      throw new Error(`Caster cannot cast ${abilityId}`);
    }

    if (ability.reach) {
      const origin = this.game.map.getEntityTilePosition(entityId);

      if (!origin) {
        throw new Error(`Cannot find origin to check target is in reach`);
      }

      const reach = this.game.computeShape(ability.reach, origin);

      if (!reach.some(t => t.x === target.x && t.y === target.y)) {
        throw new Error(`Target ${JSON.stringify(target)} is not within reach`);
      }
    }

    const hitEntities = this.game.getEntitiesInTiles(this.game.computeShape(ability.impact, target));
    ability.cast(this.game, this.eventBus, caster, hitEntities);
  }
}
