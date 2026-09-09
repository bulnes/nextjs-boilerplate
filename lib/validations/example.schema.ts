import { z } from "zod";

/**
 * Schema do corpo de POST /api/example (ver contracts/example-route-handler.md
 * na spec desta feature). Todo input de usuário MUST ser validado com Zod
 * antes de qualquer regra de negócio (FR-016).
 */
export const exampleBodySchema = z.object({
  title: z.string().min(1).max(200),
});

/** @public Tipo companheiro do schema, para quem consumir o payload já validado. */
export type ExampleBody = z.infer<typeof exampleBodySchema>;
