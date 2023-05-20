import { atom } from 'recoil';
import { players } from '../constants/Player';

export const playersAtom = atom({
  key: 'players',
  default: players,
});
