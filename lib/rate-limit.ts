export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

interface Window {
  count: number;
  resetAt: number;
}

/**
 * Rate limiter em memória (sliding window fixo por janela), sem dependência
 * externa (decisão confirmada com o usuário — ver research.md §12).
 *
 * Limitação conhecida: o estado não é compartilhado entre instâncias/processos.
 * Em produção multi-instância, substitua por uma implementação desta mesma
 * interface apoiada em um store externo (ex.: Redis/Upstash) sem alterar os
 * chamadores.
 */
export class InMemoryRateLimiter implements RateLimiter {
  private readonly windows = new Map<string, Window>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  check(key: string): RateLimitResult {
    const now = Date.now();
    const existing = this.windows.get(key);

    if (!existing || existing.resetAt <= now) {
      this.windows.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, retryAfterMs: 0 };
    }

    if (existing.count < this.limit) {
      existing.count += 1;
      return { allowed: true, retryAfterMs: 0 };
    }

    return { allowed: false, retryAfterMs: existing.resetAt - now };
  }
}

/** Instância padrão para rotas sensíveis de exemplo: 10 requisições por minuto. */
export const authRateLimiter = new InMemoryRateLimiter(10, 60_000);
