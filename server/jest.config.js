export default {
    testEnvironment: "node",
    transform: {},
    verbose: true,
    testMatch: ["**/tests/**/*.test.js"],
    setupFilesAfterEnv: ["./tests/setup.js"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};
