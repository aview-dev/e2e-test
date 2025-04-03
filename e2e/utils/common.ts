import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

// ENV 변수 설정
const ADMIN_ID = process.env.ADMIN_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const API_ENDPOINT = process.env.API_ENDPOINT;

export { ADMIN_ID, ADMIN_PASSWORD, API_ENDPOINT };