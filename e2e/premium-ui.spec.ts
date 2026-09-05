import { expect, test } from "@playwright/test";

async function ready(page: import("@playwright/test").Page) {
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.waitForTimeout(120);
}

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
    const metrics = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 1);
}

test("Notebook landing keeps the shared premium rhythm", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("header").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("notebook-landing.png"), fullPage: true, animations: "disabled" });
});

test("Notebook workspace keeps document-first geometry", async ({ page }, testInfo) => {
    await page.goto("/workspace", { waitUntil: "domcontentloaded" });
    await ready(page);
    await expect(page.locator("#notebook")).toBeVisible();
    await expect(page.locator(".notebook-document")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("notebook-workspace.png"), fullPage: true, animations: "disabled" });
});
