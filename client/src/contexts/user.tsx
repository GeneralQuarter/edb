import { createSignal, createContext, useContext, type Component, JSX, onMount, Accessor } from 'solid-js';
import { User } from '../types/user';

const UserContext = createContext<ContextValue>([() => null, {setUser: () => {}, clearUser: () => {}}]);
const storageKey = 'edb_user';

type Props = {
  children: JSX.Element;
}

type ContextValue = [Accessor<User | null>, {setUser: (user: User) => void, clearUser: () => void}];

const UserProvider: Component<Props> = (props) => {
  const [user, _setUser] = createSignal<User | null>(null);

  onMount(() => {
    const userJson = sessionStorage.getItem(storageKey);

    if (!userJson) {
      return;
    }

    try {
      const {username, token} = JSON.parse(userJson);

      if (!username || !token) {
        return;
      }

      _setUser({username, token});
    } catch (e) {
      // skip
    }
  });
  
  const value: ContextValue = [
    user,
    {
      setUser(user: User) {
        sessionStorage.setItem(storageKey, JSON.stringify(user));
        _setUser(user);
      },
      clearUser() {
        sessionStorage.removeItem(storageKey);
        _setUser(null);
      },
    }
  ]

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export function useUser() { return useContext<ContextValue>(UserContext); }
