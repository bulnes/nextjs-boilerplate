-- Row Level Security para a tabela de exemplo `example_items` (FR-026).
--
-- Padrão do boilerplate: default deny. Habilitar RLS sem nenhuma policy
-- permissiva significa que NENHUM acesso é permitido — nem para o dono da
-- linha — até que uma policy explícita seja criada. Isso é intencional:
-- cada projeto derivado deve decidir e declarar suas próprias regras de
-- acesso, nunca herdar um acesso liberado por padrão.
--
-- Rode este arquivo depois da migration gerada pelo Drizzle
-- (db/migrations/0000_fair_captain_cross.sql) ter sido aplicada.

ALTER TABLE "example_items" ENABLE ROW LEVEL SECURITY;

-- Nenhuma policy é criada abaixo desta linha por padrão — a tabela fica
-- inacessível via API até que uma das policies de exemplo (ou outra
-- equivalente) seja descomentada e aplicada intencionalmente por quem
-- estiver implementando o projeto derivado.

-- Exemplo: permitir que cada usuário autenticado leia apenas os próprios itens.
-- CREATE POLICY "example_items_select_own"
--   ON "example_items"
--   FOR SELECT
--   TO authenticated
--   USING (owner_id = auth.uid());

-- Exemplo: permitir que cada usuário autenticado crie itens em seu próprio nome.
-- CREATE POLICY "example_items_insert_own"
--   ON "example_items"
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (owner_id = auth.uid());

-- Exemplo: permitir que cada usuário autenticado atualize/apague apenas os próprios itens.
-- CREATE POLICY "example_items_update_own"
--   ON "example_items"
--   FOR UPDATE
--   TO authenticated
--   USING (owner_id = auth.uid())
--   WITH CHECK (owner_id = auth.uid());

-- CREATE POLICY "example_items_delete_own"
--   ON "example_items"
--   FOR DELETE
--   TO authenticated
--   USING (owner_id = auth.uid());
