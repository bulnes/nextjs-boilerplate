export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

/**
 * @public Contrato a implementar ao trocar o backing store (ver
 * InMemoryRateLimiter abaixo) — nenhum código deste repo consome a
 * interface diretamente além da própria implementação, mas é o ponto de
 * extensão documentado para produção multi-instância (ex.: Redis/Upstash).
 */
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
 * Limitações conhecidas:
 * - O estado não é compartilhado entre instâncias/processos. Em produção
 *   multi-instância, substitua por uma implementação desta mesma interface
 *   apoiada em um store externo (ex.: Redis/Upstash) sem alterar os
 *   chamadores.
 * - A chave (`key`) é responsabilidade de quem chama `check()`; se derivada
 *   de um IP obtido de um header (ex.: x-forwarded-for), esse valor só é
 *   confiável quando há um proxy/CDN confiável reescrevendo o header antes da
 *   aplicação — ver getClientIp() em proxy.ts.
 */
export class InMemoryRateLimiter implements RateLimiter {
  private readonly windows = new Map<string, Window>();
  private checksSinceSweep = 0;

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly sweepEvery = 100,
  ) {}

  check(key: string): RateLimitResult {
    const now = Date.now();
    this.sweepExpired(now);

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

  /**
   * Remove entradas expiradas do Map a cada `sweepEvery` chamadas de
   * check(). Sem isso, chaves distintas que nunca são reconsultadas (ex.:
   * IPs forjados, um por requisição) se acumulariam indefinidamente.
   */
  private sweepExpired(now: number) {
    this.checksSinceSweep += 1;
    if (this.checksSinceSweep < this.sweepEvery) {
      return;
    }

    this.checksSinceSweep = 0;
    for (const [key, window] of this.windows) {
      if (window.resetAt <= now) {
        this.windows.delete(key);
      }
    }
  }
}

/** Instância padrão aplicada a toda rota sob /api/* (ver proxy.ts): 10 requisições por minuto. */
export const apiRateLimiter = new InMemoryRateLimiter(10, 60_000);
