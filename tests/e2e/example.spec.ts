import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("a home carrega com sucesso", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "nextjs-boilerplate" })).toBeVisible();
});

test("a home não tem violações de acessibilidade", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
