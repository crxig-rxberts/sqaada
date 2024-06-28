module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx'],
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    collectCoverageFrom: [
        // Inclusions
        'client/src/**/*.{js,jsx}',
        'server/**/*.{js,jsx}',

        // Exclusions
        '!client/src/index.js',
        '!server/index.js',
        '!client/src/reportWebVitals.js',
        '!client/src/serviceWorker.js',
    ],
    coverageThreshold: {
        global: {
            branches: 10,
            functions: 10,
            lines: 10,
            statements: 10,
        },
    },
};
