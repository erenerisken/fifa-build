import {
  GenerationOptions,
  GenerationType,
} from '../interfaces/GenerationOptions';

export const getDefaultGenerationOptions = (): GenerationOptions => ({
  type: GenerationType.RANDOM,
  value: '',
  count: 1,
});

export const getGenerationTypeName = (type: GenerationType): string => {
  switch (type) {
    case GenerationType.PLAYER:
      return 'Player';
    case GenerationType.POSITION:
      return 'Position';
    case GenerationType.ROLE:
      return 'Role';
    case GenerationType.RANDOM:
      return 'Random';
    default:
      return 'Unknown';
  }
};
