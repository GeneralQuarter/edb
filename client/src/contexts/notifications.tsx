import { Accessor, Component, createContext, createMemo, createUniqueId, useContext, type JSX } from 'solid-js';
import { TilePosition } from '../types/tile-position';
import { createStore, produce } from 'solid-js/store';

type Notification = {
  id: string;
  text: string;
}

type NotificationClusters = Record<string, Notification[]>;

type ContextValue = [
  clusters: Accessor<{id: string, at: TilePosition, notifications: Notification[]}[]>,
  addNotification: (create: NewNotification) => void,
];

export type NewNotification = {
  at: TilePosition;
  text: string;
}

const NotificationsContext = createContext<ContextValue>([
  () => [],
  () => {},
]);

type Props = {
  children: JSX.Element;
}

const NotificationsProvider: Component<Props> = (props) => {
  const [notificationClusters, setNotificationClusters] = createStore<NotificationClusters>({});

  const addNotification = ({at, text}: NewNotification) => {
    const clusterId = `${at.x},${at.y}`;
    const id = createUniqueId();

    setNotificationClusters(produce(s => {
      s[clusterId] = [...(s[clusterId] ?? []), {id, text}];
    }));

    setTimeout(() => {
      setNotificationClusters(produce(s => {
        const index = s[clusterId].findIndex(n => n.id === id);

        if (index === -1) {
          return;
        }

        s[clusterId].splice(index, 1);
      }));
    }, 3000);
  }

  const clusters = createMemo(() => {
    return Object.entries(notificationClusters).map(([clusterId, notifications]) => {
      const [x, y] = clusterId.split(',').map(n => parseInt(n));
      return {
        id: clusterId,
        at: {x, y},
        notifications
      };
    })
  });

  const value: ContextValue = [
    clusters,
    addNotification,
  ];

  return (
    <NotificationsContext.Provider value={value}>
      {props.children}
    </NotificationsContext.Provider>
  ); 
}

export default NotificationsProvider;

export function useNotifications() { return useContext<ContextValue>(NotificationsContext); }
