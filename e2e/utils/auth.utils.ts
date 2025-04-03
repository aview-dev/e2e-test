import { Page, expect } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
  await page.goto('http://localhost/login');
  
  // 로그인 수행
  await page.getByPlaceholder('Username or Email').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  
  // 로그인 버튼 클릭 및 페이지 로드 대기
  await page.getByTestId('login').click();
  await page.waitForLoadState('networkidle');
}

export async function verifySuccessfulLogin(page: Page) {
  await expect(page).toHaveURL(/.*\/wl\/.*/);
  await expect(page).not.toHaveURL('about:blank');
}

export async function verifyFailedLogin(page: Page) {
  await expect(page.getByText('Invalid credentials!')).toBeVisible();
}