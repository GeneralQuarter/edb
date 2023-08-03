import { type Component } from 'solid-js';
import Connect from './components/Connect';
import Client from './components/Client';
import { useUser } from './contexts/user';
import GameProvider from './contexts/game';

const App: Component = () => {
  const [user] = useUser();

  return <>
    {!user() && <Connect />}
    {user() && <GameProvider user={user()!}>
      <Client />
    </GameProvider>}
  </>
};

export default App;
