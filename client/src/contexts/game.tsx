import { type Accessor, createContext, type Component, createSignal, type JSX, onMount, onCleanup, useContext } from 'solid-js';
import { createStore, produce, reconcile } from 'solid-js/store';
import type { Game } from '../types/game';
import { io, type Socket } from 'socket.io-client';
import type { User } from '../types/user';
import type { Player } from '../types/player';
import type { GameEvent } from '../types/game-event';
import type { Entity } from '../types/entity';
import { toTileIndex } from '../lib/board';

type ContextValue = [
  {
    game: Game | null,
    player: Accessor<Player | null>,
    playerEntity: Accessor<Entity | null>,
  },
  {
    disconnect: () => void,
    sendEvent: (event: GameEvent<any>) => void,
  },
];

const GameContext = createContext<ContextValue>([
  {
    game: null,
    player: () => null,
    playerEntity: () => null,
  }, 
  {
    disconnect: () => {},
    sendEvent: () => {},
  }
]);

type Props = {
  user: User;
  children: JSX.Element;
}

const GameProvider: Component<Props> = (props) => {
  const [socket, setSocket] = createSignal<Socket | null>(null);
  const [game, setGame] = createStore<Game>({state: 'Lobby', entities: [],entityTypes: [], map: {entityTiles: [], height: 1, width: 1}, players: []});

  onMount(() => {
    const s = io("localhost:3001", {
      auth: {
        username: props.user.username,
        token: props.user.token,
      }
    });

    s.on('connect', () => {
      console.log(s);
    });

    s.on('connect_error', (err) => {
      console.log(err);
    });

    s.on('server_event', (event) => {
      switch (event.type) {
        case 'Moved': {
          setGame(produce(g => {
            const prevIndex = toTileIndex(event.data.from, g.map.width);
            const nextIndex = toTileIndex(event.data.to, g.map.width);

            g.map.entityTiles[prevIndex] = 0;
            g.map.entityTiles[nextIndex] = event.data.entityId;
          }));
        }
      }
    });

    s.on('game_state', (state: Game) => {
      setGame(reconcile(state));
    });

    setSocket(s);
  });

  const disconnect = () => {
    const s = socket();

    if (s) {
      s.disconnect();
    }
    
    setSocket(null);
  };

  const sendEvent = (event: GameEvent<any>) => {
    const s = socket();

    if (s) {
      s.emit('player_event', event);
    }
  };

  onCleanup(() => {
    disconnect();
  });

  const player: Accessor<Player | null> = () => {
    return game.players.find(p => p.username === props.user.username) ?? null;
  };

  const playerEntity: Accessor<Entity | null> = () => {
    const _player = player();

    if (!_player) {
      return null;
    }

    return game.entities.find(e => e.id === _player.entityId) ?? null;
  }

  const value: ContextValue = [
    {
      game,
      player,
      playerEntity,
    },
    {
      disconnect,
      sendEvent,
    }
  ];

  return (
    <GameContext.Provider value={value}>
      {props.children}
    </GameContext.Provider>
  );
}

export default GameProvider;

export function useGame() { return useContext<ContextValue>(GameContext); }
