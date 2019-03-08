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
    "eslint:recommended",
    'plugin:react/recommended',
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
    "prettier/prettier": "error",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
};
