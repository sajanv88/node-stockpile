export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    preset: "ts-jest",
    roots: [
        "<rootDir>/src"
    ],
    testEnvironment: "node"
}