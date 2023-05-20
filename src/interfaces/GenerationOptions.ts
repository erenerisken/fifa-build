import { Player } from './Player';

export enum GenerationType {
  PLAYER = 'PLAYER',
  ROLE = 'ROLE',
  POSITION = 'POSITION',
  RANDOM = 'RANDOM',
}

export interface GenerationOptions {
  type: GenerationType;
  value: string;
  count: number;
}

export type PlayerFilterFn = (player: Player) => boolean;
