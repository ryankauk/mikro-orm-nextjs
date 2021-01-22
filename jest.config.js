require('dotenv').config({
    path: '.env.test',
});

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {

    },

    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/node_modules',
    ],
};
