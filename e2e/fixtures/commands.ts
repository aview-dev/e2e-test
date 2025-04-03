import { test as base, Page, expect } from '@playwright/test';

// 상수 정의
const DEFAULT_DELAY = 250;
const username = 'admin';
const password = '1';

// 커스텀 커맨드 인터페이스 정의
export interface CustomCommands {
  customWait(ms?: number): Promise<void>;
  resetConfig(): Promise<void>;
  login(inputUsername?: string, inputPassword?: string): Promise<void>;
  inputForm(formData: Record<string, string>): Promise<void>;
  configText(text: string, value: string): Promise<void>;
  configToggle(text: string): Promise<void>;
  clickButtonByText(text: string, useMultiple?: boolean): Promise<void>;
  okButton(): Promise<void>;
  tableRowByText(text: string): Promise<void>;
  myInfoPage(): Promise<void>;
  mgmtPage(): Promise<void>;
  storagePage(): Promise<void>;
  newStoragePage(): Promise<void>;
  apsRulePage(): Promise<void>;
  newApsRulePage(): Promise<void>;
  userPage(): Promise<void>;
  newUserPage(): Promise<void>;
}

export type CustomPage = Page & CustomCommands;

// 커스텀 fixtures 정의
export const test = base.extend<{ customPage: CustomPage }>({
  customPage: async ({ page }, use) => {
    const customPage = page as CustomPage;

    // Basic Functions
    customPage.customWait = async (ms = DEFAULT_DELAY) => {
      await page.waitForTimeout(ms);
    };

    customPage.resetConfig = async () => {
      await page.click('#form-storage > .ml-2');
      await customPage.customWait();
      await customPage.clickButtonByText('Restore default');
      await customPage.customWait();
      await customPage.okButton();
      await customPage.customWait();
    };

    customPage.login = async (inputUsername = '', inputPassword = '') => {
      const loginData = {
        username: inputUsername || username,
        password: inputPassword || password,
      };
      await customPage.inputForm(loginData);
      await page.click('[data-testid="login"]');
      await customPage.customWait();
    };

    // Input Form Functions
    customPage.inputForm = async (formData: Record<string, string>) => {
      for (const [name, value] of Object.entries(formData)) {
        await page.fill(`input[name="${name}"]`, value);
        await customPage.customWait(300);
      }
    };

    customPage.configText = async (text: string, value: string) => {
      const elements = await page.locator('.text-lg').all();
      for (let i = 0; i < elements.length; i++) {
        const elementText = await elements[i].textContent();
        if (elementText?.includes(text)) {
          await page.fill(`:nth-child(${i + 3}) > :nth-child(2) > .items-center > .input`, value);
          await customPage.customWait();
          break;
        }
      }
    };

    customPage.configToggle = async (text: string) => {
      const elements = await page.locator('.text-lg').all();
      for (let i = 0; i < elements.length; i++) {
        const elementText = await elements[i].textContent();
        if (elementText?.includes(text)) {
          await page.click(`:nth-child(${i + 3}) > :nth-child(2) > .mb-1 > .relative > [data-testid="slide-toggle"] > .slide-toggle-label > .slide-toggle-track`);
          await customPage.customWait();
          break;
        }
      }
    };

    // Click Functions
    customPage.clickButtonByText = async (text: string, useMultiple = false) => {
      const buttonWithSpan = page.locator(`button:has(span:text("${text}"))`);
      const buttonWithText = page.locator(`button:text("${text}")`);

      if (await buttonWithSpan.count() > 0) {
        if (useMultiple) {
          await buttonWithSpan.click({ timeout: 5000 });
        } else {
          await buttonWithSpan.first().click({ timeout: 5000 });
        }
      } else {
        if (useMultiple) {
          await buttonWithText.click({ timeout: 5000 });
        } else {
          await buttonWithText.first().click({ timeout: 5000 });
        }
      }
      await customPage.customWait();
    };

    customPage.okButton = async () => {
      await page.click('.variant-filled-primary');
      await customPage.customWait();
    };

    customPage.tableRowByText = async (text: string) => {
      await page.locator('td', { hasText: text }).click();
      await customPage.customWait();
    };

    // Navigation Functions
    customPage.myInfoPage = async () => {
      await page.locator('.btn.btn-sm').nth(1).click();
      await customPage.customWait();
      await page.locator('span', { hasText: 'My Info' }).click();
      await customPage.customWait();
    };

    customPage.mgmtPage = async () => {
      await page.locator('.btn.btn-sm').nth(1).click();
      await customPage.customWait();
      await page.locator('span', { hasText: 'Management' }).click();
      await customPage.customWait();
      await expect(page).toHaveURL(/.*\/mgmt/);
      await customPage.customWait();
    };

    customPage.storagePage = async () => {
      await customPage.mgmtPage();
      await page.click('a[href="/mgmt/resource/storages"]');
      await customPage.customWait();
    };

    customPage.newStoragePage = async () => {
      await customPage.storagePage();
      await page.click('.variant-filled-primary');
      await customPage.customWait();
    };

    customPage.apsRulePage = async () => {
      await customPage.mgmtPage();
      await page.click('a[href="/mgmt/resource/aps-rules"]');
      await customPage.customWait();
    };

    customPage.newApsRulePage = async () => {
      await customPage.apsRulePage();
      await page.click('.variant-filled-primary');
      await customPage.customWait();
    };

    customPage.userPage = async () => {
      await customPage.mgmtPage();
      await page.click('a[href="/mgmt/resource/users"]');
      await customPage.customWait();
    };

    customPage.newUserPage = async () => {
      await customPage.userPage();
      await page.click('a[href="users/new"]');
      await customPage.customWait();
    };

    await use(customPage);
  },
});

export { expect } from '@playwright/test';
