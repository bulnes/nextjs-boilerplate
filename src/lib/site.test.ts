import { describe, expect, it } from "vitest";

import { DEFAULT_SITE_URL, resolveSiteUrl } from "./site";

describe("resolveSiteUrl", () => {
  it("usa a URL fornecida quando presente", () => {
    expect(resolveSiteUrl("https://exemplo.com")).toBe("https://exemplo.com");
  });

  it("cai para o domínio padrão quando a env var não está definida", () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT_SITE_URL);
  });
});
