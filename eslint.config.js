const globals = require("globals");
const pluginJs = require("@eslint/js");


module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "indent": ["error", 2],
      "no-mixed-spaces-and-tabs": ["error"],
    },
  },
];