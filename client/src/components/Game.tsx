import { For, type Component } from 'solid-js';
import type { Direction } from '../types/direction';
import { useGame } from '../contexts/game';
import Board from './Board';

const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

const Game: Component = () => {
  const [{ game, player }, { sendEvent }] = useGame();

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

  const endTurn = () => {
    sendEvent({
      type: 'NextTurn',
      data: {},
    });
  }

  const board = () => {
    const _game = game();

    if (!_game) {
      return '';
    }

    return '\n' + _game.map.entityTiles.reduce((acc, entityId, index) => {
      acc += `${entityId} `;

      if (index % _game.map.width === (_game.map.width - 1)) {
        acc += '\n';
      }

      return acc;
    }, '');
  }

  return <>
    <Board />
    <br/>
    <For each={directions}>{(direction) => 
      <button onClick={() => move(direction)}>{direction}</button>
    }</For>
    <br/>
    <button onClick={endTurn}>End Turn</button>
  </>;
}

export default Game;
