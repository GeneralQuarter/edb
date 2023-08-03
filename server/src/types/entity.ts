import type { EntityStats } from './entity-stats';

export type Entity = {
  id: number;
  type: string;
} & EntityStats;
