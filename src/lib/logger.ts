type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

/**
 * Logger estruturado mínimo, sem dependência de serviço externo de error
 * tracking (FR-032). Emite uma linha JSON por evento em stdout/stderr —
 * nunca inclua segredos, tokens ou corpos brutos de requisição em `context`.
 */
function log(level: LogLevel, message: string, context: LogContext = {}) {
  const entry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
};
