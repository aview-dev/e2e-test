import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

const ADMIN_ID = process.env.ADMIN_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export { ADMIN_ID, ADMIN_PASSWORD };