export default {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!firebase).+\\.js$'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|png|svg)$': 'identity-obj-proxy',
  },
};