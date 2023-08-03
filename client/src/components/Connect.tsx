import { createSignal, type Component } from 'solid-js';
import { useUser } from '../contexts/user';

const Connect: Component = () => {
  const [, { setUser }] = useUser();
  const [username, setUsername] = createSignal<string>('');

  const onSubmit = () => {
    const _username = username();

    if (!_username) {
      return;
    }

    const token = crypto.randomUUID();

    setUser({
      username: _username,
      token,
    });

    return false;
  }
  
  return <form onSubmit={onSubmit}>
    <input name="username" value={username()} onChange={(evt) => setUsername(evt.target.value)} />
  </form>
}

export default Connect;
