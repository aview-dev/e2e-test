import dotenv from 'dotenv';
import { Page } from '@playwright/test';
// .env 파일 로드
dotenv.config();

// ENV 변수 설정
const ADMIN_ID = process.env.ADMIN_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const API_ENDPOINT = process.env.API_ENDPOINT;

const wait = async (page: Page) => {
    await page.waitForLoadState('networkidle');
}

const handleDialog = async (page: Page) => {
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
}

const Logout = async (page: Page) => {
    await page.getByRole('button', { name: 'A https://www.gravatar.com/' }).nth(1).click();
    await page.getByText('Logout').click();
    await wait(page)
}

export { ADMIN_ID, ADMIN_PASSWORD, API_ENDPOINT, wait, handleDialog, Logout };