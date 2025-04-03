import { Page } from "@playwright/test";

const endpoint = 'http://localhost';

export async function Login(page: Page) {
  await page.goto(`${endpoint}/login`);
}

export async function Mgmt(page: Page) {
  await page.goto(`${endpoint}/mgmt`);
}
