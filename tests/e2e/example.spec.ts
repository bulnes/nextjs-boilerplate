import { expect, test } from "@playwright/test";

test("a home carrega com sucesso", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "nextjs-boilerplate" })).toBeVisible();
});
