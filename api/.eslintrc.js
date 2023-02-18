module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "class-methods-use-this": "off",
    "consistent-return": "off",
    "no-promise-executor-return": "off",
    camelcase: "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
