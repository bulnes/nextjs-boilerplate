import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";
// For mais info, ver https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // FR-006: regras de acessibilidade em modo estrito, além do "recommended"
  // já incluído em core-web-vitals (o plugin jsx-a11y já é registrado por
  // core-web-vitals, então aqui só sobrepomos o conjunto de regras).
  { rules: jsxA11y.flatConfigs.strict.rules },
  // Desliga regras de estilo que conflitam com o Prettier.
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "storybook-static/**",
    "coverage/**",
  ]),
  ...storybook.configs["flat/recommended"],
]);

export default eslintConfig;
