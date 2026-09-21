// @types/jest-axe só declara o matcher toHaveNoViolations para o namespace
// do Jest; este projeto usa Vitest, então a extensão de tipos é feita à
// mão aqui — mesmo padrão de arquivo usado por @testing-library/jest-dom
// (types/vitest.d.ts), incluído automaticamente pelo tsconfig.json.
import "vitest";

declare module "vitest" {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
