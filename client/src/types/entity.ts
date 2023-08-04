import type { Ability } from './ability';

export type Entity = {
  id: number;
  name: string;
  type: string;
  abilities: Ability[];
}
