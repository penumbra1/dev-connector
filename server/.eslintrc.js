module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    "plugin:security/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint", // overrides for @typescript-eslint/recommended
    "plugin:prettier/recommended"  // overrides for everything else
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "prettier/prettier": "error"
  }
};
