import { For, type Component } from 'solid-js';
import { useGame } from '../contexts/game';
import { useUser } from '../contexts/user';

const Lobby: Component = () => {
  const [user] = useUser();
  const [{ game, player }, { sendEvent }] = useGame();

  const entityTypes = () => {
    return game?.entityTypes ?? [];
  };

  const selectCharacter = (entityType: string) => {
    sendEvent({
      type: 'CharacterSelect',
      data: {
        entityType,
      }
    });
  };

  const buttonBackground = (entityType: string) => {
    return entityType === player()?.entityType ? 'green' : 'none';
  }

  const startGame = () => {
    sendEvent({
      type: 'StartGame',
      data: {},
    });
  }

  return <>
    <h2>Connected as {user()?.username}</h2>
    <p>Pick a character</p>
    <ul>
      <For each={entityTypes()}>{(entityType) => 
        <li>
          <button onClick={() => selectCharacter(entityType)} style={{background: buttonBackground(entityType)}}>{entityType}</button>
        </li>
      }</For>
    </ul>
    <button onClick={startGame}>Start Game</button>
  </>;
}

export default Lobby;
