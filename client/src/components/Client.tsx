import { type Component } from 'solid-js';
import { useGame } from '../contexts/game';
import { useUser } from '../contexts/user';
import Lobby from './Lobby';
import Game from './Game';

const Client: Component = () => {
  const [{ game }, { disconnect }] = useGame();
  const [, { clearUser }] = useUser();

  const userDisconnect = () => {
    disconnect();
    clearUser();
  }

  return <>
    {game()?.state === 'Lobby' && <Lobby />}
    {game()?.state === 'Game' && <Game />}
    <br />
    <button onClick={userDisconnect}>Disconnect</button>
  </>
}

export default Client;
