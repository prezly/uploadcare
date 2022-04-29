module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/build/'],
  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.json`,
    },
  },
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/'],
};
