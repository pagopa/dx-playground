import lintRules from "@pagopa/eslint-config";

export default [
  ...lintRules,
  {
    rules: {
      // The following rules are raising errors when running the lint command
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    ignores: ["dist/*"],
  },
];
