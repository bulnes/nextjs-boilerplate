import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db } from "@/db/client";
import { exampleItems } from "@/db/schema/example";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { exampleBodySchema } from "@/lib/validations/example.schema";

/**
 * Route Handler de exemplo — ver contracts/example-route-handler.md na spec
 * desta feature. O rate limiting da rota já é aplicado em proxy.ts antes de
 * a requisição chegar aqui (FR-018); este handler cobre validação (FR-016),
 * autorização de sessão (FR-024) e persistência via Drizzle (FR-028).
 */
export async function POST(request: NextRequest) {
  const rawBody: unknown = await request.json().catch(() => null);
  const parsed = exampleBodySchema.safeParse(rawBody);

  if (!parsed.success) {
    logger.warn("example_validation_failed", { issues: parsed.error.issues });
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("example_unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [item] = await db
    .insert(exampleItems)
    .values({ ownerId: user.id, title: parsed.data.title })
    .returning({ id: exampleItems.id });

  if (!item) {
    logger.error("example_item_insert_failed");
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  logger.info("example_item_created", { id: item.id });
  return NextResponse.json({ id: item.id }, { status: 201 });
}
