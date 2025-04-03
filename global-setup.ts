import fs from 'fs';
import path from 'path';

async function globalSetup() {
  // DICOM 파일 관련 유틸리티 함수 추가
  global.getTestDicomFiles = () => {
    const folderPath = path.join(__dirname, 'e2e/fixtures/upload_test_dicom');
    return fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith('.dcm'));
  };
}

export default globalSetup; 