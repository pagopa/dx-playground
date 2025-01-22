import lintRules from "@pagopa/eslint-config";

const eslintConfig = [
  ...lintRules,
  {
    ignores: ["src/lib/client/*", ".next/*"],
  },
];

export default eslintConfig;
