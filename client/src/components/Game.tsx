import { For, type Component, createSignal, createMemo } from 'solid-js';
import type { Direction } from '../types/direction';
import { useGame } from '../contexts/game';
import Board from './Board';
import type { Ability } from '../types/ability';
import type { TilePosition } from '../types/tile-position';
import { isTileInTiles, toTilePosition } from '../lib/board';
import { computeShape } from '../lib/tile-shapes';

const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

const Game: Component = () => {
  const [{ game, player, playerEntity }, { sendEvent }] = useGame();
  const [reachAbilityId, setReachAbilityId] = createSignal<string | null>(null);

  const move = (direction: Direction) => {
    const _player = player();

    if (!_player || !_player.entityId) {
      return;
    }
    sendEvent({
      type: 'Move',
      data: {
        direction,
        entityId: _player.entityId
      },
    });
  };

  const abilityClicked = (ability: Ability) => {
    setReachAbilityId(ability.reach ? ability.id : null);

    if (!ability.reach) {
      sendEvent({
        type: 'CastAbility',
        data: {
          entityId: playerEntity()?.id,
          abilityId: ability.id,
        }
      });
    }
  }

  const endTurn = () => {
    sendEvent({
      type: 'NextTurn',
      data: {},
    });
  }

  const abilities = () => {
    const _playerEntity = playerEntity();

    if (!_playerEntity) {
      return [];
    }

    return _playerEntity.abilities;
  }

  const reachTiles = createMemo(() => {
    const _reachAbilityId = reachAbilityId();

    if (!_reachAbilityId) {
      return [];
    }

    if (!game) {
      return [];
    }
    
    const _playerEntity = playerEntity();

    if (!_playerEntity) {
      return [];
    }

    const ability = _playerEntity.abilities.find(a => a.id === _reachAbilityId);

    if (!ability || !ability.reach) {
      return [];
    }

    const origin = toTilePosition(game.map.entityTiles.findIndex(id => id === _playerEntity.id), game.map.width);

    return computeShape(ability.reach, origin, game.map);
  });

  const onTileClicked = (mouseTile: TilePosition) => {
    if (!isTileInTiles(mouseTile, reachTiles())) {
      setReachAbilityId(null);
      return;
    }

    sendEvent({
      type: 'CastAbility',
      data: {
        entityId: playerEntity()?.id,
        abilityId: reachAbilityId(),
        target: mouseTile,
      },
    });
    setReachAbilityId(null);
  }

  return <>
    <Board reachTiles={reachTiles()} onClick={onTileClicked}/>
    <br/>
    <For each={abilities()}>{(ability) => 
      <button onClick={() => abilityClicked(ability)}>{ability.name}</button>
    }</For>
    <br />
    <For each={directions}>{(direction) => 
      <button onClick={() => move(direction)}>{direction}</button>
    }</For>
    <br/>
    <button onClick={endTurn}>End Turn</button>
  </>;
}

export default Game;
