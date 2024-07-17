module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom/dist/index.js',
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
    'client/src/Components/**/*.{js,jsx}',
    'client/src/clients/**/*.{js,jsx}',
    'server/config/**/*.{js,jsx}',
    'server/controllers/**/*.{js,jsx}',
    'server/repositories/**/*.{js,jsx}',
    'server/routes/**/*.{js,jsx}',
    'server/services/**/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};