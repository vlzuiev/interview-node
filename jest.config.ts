import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  roots: ['./src/', './tests/'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
export default config;
