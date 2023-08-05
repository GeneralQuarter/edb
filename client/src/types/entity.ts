import type { Ability } from './ability';
import { EntityStats } from './entity-stats';

export type Entity = {
  id: number;
  name: string;
  type: string;
  abilities: Ability[];
} & EntityStats;
