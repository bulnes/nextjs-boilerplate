import { describe, expect, it } from "vitest";

import { InMemoryRateLimiter } from "./rate-limit";

describe("InMemoryRateLimiter", () => {
  it("permite requisições até o limite configurado", () => {
    const limiter = new InMemoryRateLimiter(3, 60_000);

    expect(limiter.check("key").allowed).toBe(true);
    expect(limiter.check("key").allowed).toBe(true);
    expect(limiter.check("key").allowed).toBe(true);
  });

  it("bloqueia requisições após exceder o limite", () => {
    const limiter = new InMemoryRateLimiter(2, 60_000);

    limiter.check("key");
    limiter.check("key");
    const result = limiter.check("key");

    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("não compartilha o limite entre chaves diferentes", () => {
    const limiter = new InMemoryRateLimiter(1, 60_000);

    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("b").allowed).toBe(true);
  });

  it("libera novamente a chave após a janela expirar", async () => {
    const limiter = new InMemoryRateLimiter(1, 10);

    expect(limiter.check("key").allowed).toBe(true);
    expect(limiter.check("key").allowed).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(limiter.check("key").allowed).toBe(true);
  });
});
