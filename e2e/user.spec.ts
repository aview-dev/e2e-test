import { expect } from "@playwright/test";
import { test } from '@playwright/test';
import { login, verifySuccessfulLogin } from './utils/auth.utils';
import { ADMIN_ID, ADMIN_PASSWORD } from "./utils/common";
import { ConfigPage, UserPage } from "./utils/navigate.utils";

// Password Config 테스트는 가장 먼저 실행
test.describe.serial('Password Configuration', () => {
  test('Update Password Config', async ({ page }) => {
    await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
    await ConfigPage(page);

    await page.getByRole('searchbox', { name: 'Search…' }).click();
    await page.getByRole('searchbox', { name: 'Search…' }).fill('password');
    await page.getByRole('spinbutton').first().click();
    await page.getByRole('spinbutton').first().fill('3');

    await page.locator('div:nth-child(4) > div:nth-child(2) > .mb-1 > .relative > .slide-toggle > .slide-toggle-label > .slide-toggle-track').click();
    await page.locator('div:nth-child(5) > div:nth-child(2) > .mb-1 > .relative > .slide-toggle > .slide-toggle-label > .slide-toggle-track').click();
    await page.locator('div:nth-child(6) > div:nth-child(2) > .mb-1 > .relative > .slide-toggle > .slide-toggle-label > .slide-toggle-track').click();
    await page.locator('div:nth-child(7) > div:nth-child(2) > .mb-1 > .relative > .slide-toggle > .slide-toggle-label > .slide-toggle-track').click();
  });
});

// 로그인 관련 테스트는 병렬 실행
test.describe('Login Tests', () => {
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
});

const testUser = {
  username: 'test',
  displayName: 'test',
  email: 'test@test.com',
  description: 'for test',
  password: 'Abcd1234!',
}

const updateUser = {
  username: testUser.username,
  displayName: 'edit test',
  email: 'edittest@test.com',
  description: 'for test',
}

test.describe.serial('User Management Tests', () => {
  test('Create User', async ({ page }) => {
    await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
    await UserPage(page);

    // click create user button
    await page.getByRole('link', { name: 'Create a user' }).click();

    // validation password rule
    await expect(page.getByText('Password must be at least 1')).toBeVisible();
    await expect(page.getByText('Password must not include user id or email ID.')).toBeVisible();
    await expect(page.getByText('Password must include at least 1 number.')).toBeVisible();
    await expect(page.getByText('Password must include at least 1 special character.')).toBeVisible();
    await expect(page.getByText('Password must include mixed case letters.')).toBeVisible();

    // input user info
    await page.getByRole('textbox', { name: 'Username*' }).fill(testUser.username);
    await page.getByRole('textbox', { name: 'Display name*' }).fill(testUser.displayName);
    await page.getByRole('textbox', { name: 'Email' }).fill(testUser.email);
    await page.getByRole('textbox', { name: 'Description' }).fill(testUser.description);
    await page.getByRole('textbox', { name: 'Password*', exact: true }).fill(testUser.password);
    await page.getByText('Confirm password').click();
    await page.getByRole('textbox', { name: 'Password*', exact: true }).fill(testUser.password);
    await page.getByRole('textbox', { name: 'Confirm password*' }).fill(testUser.password);

    // click create button
    await page.getByRole('button', { name: 'Create' }).click();
  });

  test('Update User Info', async ({ page }) => {
    await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
    await UserPage(page);

    // click user -> edit button
    await page.getByRole('cell', { name: testUser.username }).first().click();
    await page.locator('form').getByRole('link', { name: 'Edit' }).click();

    // update user info
    await page.getByRole('textbox', { name: 'Display name*' }).fill(updateUser.displayName);
    await page.getByRole('textbox', { name: 'Email' }).fill(updateUser.email);
    await page.getByRole('button', { name: 'Update' }).click();

    // check validation
    await expect(page.getByText(updateUser.displayName)).toBeVisible();
    await expect(page.getByText(updateUser.email)).toBeVisible();
  });

  test('Login New User', async ({ page }) => {
    
  });

});