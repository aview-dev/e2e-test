import { expect } from "@playwright/test";
import { test } from '@playwright/test';
import { login, verifySuccessfulLogin } from './utils/auth.utils';
import { ADMIN_ID, ADMIN_PASSWORD, handleDialog, Logout, wait } from "./utils/common";
import { ConfigPage, UserPage, UserSettingPage } from "./utils/navigate.utils";

// 최상위 시리얼 그룹으로 묶어서 순차 실행되도록 수정
test.describe.serial('User Tests', () => {
  test.describe('Configuration [pwd, security]', () => {
    test('Update Password Config', async ({ page }) => {
      await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
      await ConfigPage(page);

      await page.locator('#form-storage').getByRole('button').click();
      await page.locator('#form-storage').getByRole('button', { name: 'Restore default' }).click();
      await page.getByRole('button', { name: 'OK' }).click();

      await page.getByRole('searchbox', { name: 'Search…' }).fill('password');
      await page.waitForTimeout(500);
      await page.getByRole('spinbutton').first().click();
      await page.getByRole('spinbutton').first().fill('3');

      await page.locator('div:nth-child(4) > div:nth-child(2) > .mb-1 > .relative > .slide-toggle > .slide-toggle-label > .slide-toggle-track').click();
      await page.locator('div:nth-child(5) > div:nth-child(2) > .mb-1 > .relative > .slide-toggle > .slide-toggle-label > .slide-toggle-track').click();
      await page.locator('div:nth-child(6) > div:nth-child(2) > .mb-1 > .relative > .slide-toggle > .slide-toggle-label > .slide-toggle-track').click();
      await page.locator('div:nth-child(7) > div:nth-child(2) > .mb-1 > .relative > .slide-toggle > .slide-toggle-label > .slide-toggle-track').click();
    });

    test('Update Security Config', async ({ page }) => {
      await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
      await ConfigPage(page);

      await page.getByRole('searchbox', { name: 'Search…' }).fill('security');
      await page.waitForTimeout(500);
      await page.getByRole('spinbutton').nth(0).fill('3');
      // click 해야지 위 내용이 적용됨.
      await page.getByRole('spinbutton').nth(1).click();
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

  test.describe('User Management Tests', () => {
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
      password: 'Defg1234!',
    }

    test('Create User', async ({ page }) => {
      await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
      await UserPage(page);
      // 새로고침
      await page.reload();

      // click create user button
      await page.getByRole('link', { name: 'Create a user' }).click();

      // validation password rule
      await expect(page.getByText('Password must be at least 3 characters long')).toBeVisible();
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
      await wait(page);

      await page.getByRole('row', { name: 'Name Description' }).getByRole('checkbox').check();
      await page.getByRole('button', { name: 'Update' }).click();
    });

    test('Update User Info by Admin', async ({ page }) => {
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
      await login(page, testUser.username, testUser.password);
      await verifySuccessfulLogin(page);
    });

    test('Change User Info', async ({ page }) => {
      await login(page, testUser.username, testUser.password);
      await UserSettingPage(page);

      await page.getByRole('link', { name: 'Edit' }).click();
      await page.getByRole('textbox', { name: 'Display Name*' }).fill(testUser.displayName);
      await page.getByRole('textbox', { name: 'Email' }).fill(testUser.email);
      await page.getByRole('button', { name: 'Update' }).click();
    });

    test('Change User Password', async ({ page }) => {
      await login(page, testUser.username, testUser.password);
      await UserSettingPage(page);
      await page.getByRole('link', { name: 'Change Password' }).click();
      await wait(page);

      await page.getByRole('textbox', { name: 'Current Password*' }).fill(testUser.password);
      await page.getByRole('textbox', { name: 'New Password*' }).fill(updateUser.password);
      await page.getByRole('textbox', { name: 'Confirm Password*' }).fill(updateUser.password);
      await page.getByRole('button', { name: 'Update' }).click();
      await wait(page);
    });

    test('Login After Change Password', async ({ page }) => {
      await login(page, testUser.username, updateUser.password);
      await verifySuccessfulLogin(page);
    });

    test('Deactivate user after 3 failed login attempts', async ({ page }) => {
      await login(page, testUser.username, "dfafasdfas");
      await expect(page.getByText('Invalid credentials!')).toBeVisible();
      await login(page, testUser.username, "dfafasdfas");
      await expect(page.getByText('Invalid credentials!')).toBeVisible();

      // check deactivated
      await login(page, testUser.username, "dfafasdfas");
      await expect(page.getByText('Deactivated user')).toBeVisible();
    });

    // TODO:
    test.skip('Activate deactivated user by Admin & Login', async ({ page }) => {
      await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
      await UserPage(page);

      await page.getByRole('cell', { name: 'test' }).first().click();

      await page.getByRole('button', { name: 'Activate' }).click();
      await page.getByRole('button', { name: 'OK' }).click();

      await page.getByRole('button', { name: 'A https://www.gravatar.com/' }).nth(1).click();
      await page.getByText('Logout').click();
      await page.getByPlaceholder('Username or Email').fill(testUser.username);
      await page.getByPlaceholder('Password').fill(updateUser.password);

      // 로그인 버튼 클릭 및 페이지 로드 대기
      await page.getByTestId('login').click();
      await verifySuccessfulLogin(page);
    });

    test('Delete User', async ({ page }) => {
      await login(page, ADMIN_ID!, ADMIN_PASSWORD!);
      await UserPage(page);

      await page.getByRole('cell', { name: 'test' }).first().click();
      await page.getByRole('button', { name: 'Remove' }).click();
      await page.getByRole('button', { name: 'OK' }).click();

      await expect(page).toHaveURL(/.*\/resource\/users.*/);
    });
  });
});