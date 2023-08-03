export type GameEvent<T extends (Record<string, any> | undefined)> = {
  type: string;
  data: T;
}
