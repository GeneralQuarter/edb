export type Player = {
  token: string;
  username: string;
  connected: boolean;
  disconnectTimeout?: NodeJS.Timeout;
  entityType?: string;
  entityId?: number;
}
