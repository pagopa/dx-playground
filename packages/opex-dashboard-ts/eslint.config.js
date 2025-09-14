import lintRules from "@pagopa/eslint-config";

export default [
  {
    ignores: ["test/**/*", "**/*local*", "examples"],
  },
  ...lintRules,
];
