import { Page } from "@playwright/test";
import { API_ENDPOINT } from "./common";

export async function Login(page: Page) {
  await page.goto(`${API_ENDPOINT}/login`);
}

export async function ConfigPage(page: Page) {
    await page.goto(`${API_ENDPOINT}/mgmt/system/config`);
    await page.waitForLoadState('networkidle');
}

export async function UserPage(page: Page) {
    await page.goto(`${API_ENDPOINT}/mgmt/resource/users`);
    await page.waitForLoadState('networkidle');
}

export async function DatastoragePage(page: Page) {
    await page.goto(`${API_ENDPOINT}/mgmt/resource/storages`);
    await page.waitForLoadState('networkidle');
}

export async function ApsRulePage(page: Page) {
    await page.goto(`${API_ENDPOINT}/mgmt/resource/aps-rules`);
    await page.waitForLoadState('networkidle');
}
