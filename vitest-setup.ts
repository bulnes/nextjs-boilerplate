import { toHaveNoViolations } from "jest-axe";
import { expect } from "vitest";

import "@testing-library/jest-dom/vitest";

expect.extend(toHaveNoViolations);
