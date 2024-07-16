module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-router-dom)/)'
  ],
  moduleFileExtensions: ['js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx}',
    'server/**/*.{js,jsx}',
    '!client/src/index.js',
    '!server/index.js',
    '!client/src/reportWebVitals.js',
    '!client/src/serviceWorker.js',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 60,
      statements: 50,
    },
  },
};