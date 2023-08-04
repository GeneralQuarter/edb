import type { Ability } from './ability';
import type { EntityStats } from './entity-stats';

export type Entity = {
  id: number;
  type: string;
  abilities: Ability[];
} & EntityStats;
