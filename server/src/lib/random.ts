import { getRandomValues } from 'crypto';

export default function getRandomInt(x: number, y: number) {
  return x + (y - x + 1) * getRandomValues(new Uint32Array(1))[0] / 2 ** 32 | 0;
}

export function roll(max: number) {
  return getRandomInt(1, max);
}

export function roll100() {
  return roll(100);
}
