module.exports = {
  extends: ['@rendrix/config/eslint/node.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
