export type GameEvent<T extends Record<string, any>> = {
  type: string;
  data: T;
}
