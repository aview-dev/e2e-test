import { expect } from "@playwright/test";
import { test } from '@playwright/test';
import { login, verifySuccessfulLogin } from './utils/auth.utils';
import { ADMIN_ID, ADMIN_PASSWORD } from "./utils/common";

test('Failed Login', async ({ page }) => {
  const wrongPwd = "dfaf12312"
  await login(page, 'dfafaq', wrongPwd);
  await expect(page.getByText('Unauthenticated!')).toBeVisible();
  
  await login(page, ADMIN_ID!, wrongPwd);
  await expect(page.getByText('Invalid credentials!')).toBeVisible();
});

test('Success Login', async ({ page }) => {
  await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
  await verifySuccessfulLogin(page);
});

test('Update Password Config', async ({ page }) => {

}); 