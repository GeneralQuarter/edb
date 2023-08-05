import { type Component } from 'solid-js';
import Connect from './components/Connect';
import Client from './components/Client';
import { useUser } from './contexts/user';
import GameProvider from './contexts/game';
import NotificationsProvider from './contexts/notifications';

const App: Component = () => {
  const [user] = useUser();

  return <>
    {!user() && <Connect />}
    {user() && <NotificationsProvider>
      <GameProvider user={user()!}>
        <Client />
      </GameProvider>
    </NotificationsProvider>}
  </>
};

export default App;
