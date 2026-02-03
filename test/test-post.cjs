// test/test-post.cjs
const API = require('../dist/index.cjs');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

// Initialize API
const api = new API({
  apiKey: 'qasim-dev',
  fullResponse: false,
  timeout: 30000
});

async function runTest(name, testFn, skip = false) {
  totalTests++;
  
  if (skip) {
    console.log(`${colors.yellow}⊘ SKIP${colors.reset} ${name}`);
    skippedTests++;
    return;
  }

  try {
    await testFn();
    console.log(`${colors.green}✓ PASS${colors.reset} ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`${colors.red}✗ FAIL${colors.reset} ${name}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    failedTests++;
  }
}

function validateResponse(response) {
  if (!response) {
    throw new Error('Response is null or undefined');
  }
  
  // In Node.js, should be base64 string
  if (typeof response === 'string' && response.startsWith('data:image')) {
    return true;
  }
  
  throw new Error('Response is not a valid base64 image string');
}

function createTestImage() {
  const testDir = path.join(__dirname, 'fixtures');
  const testImagePath = path.join(testDir, 'test.jpg');
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Simple 100x100 red square image (minimal JPEG)
  const redSquare = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x03, 0x02, 0x02, 0x02, 0x02, 0x02, 0x03, 0x02, 0x02, 0x02, 0x03,
    0x03, 0x03, 0x03, 0x04, 0x06, 0x04, 0x04, 0x04, 0x04, 0x04, 0x08, 0x06,
    0x06, 0x05, 0x06, 0x09, 0x08, 0x0A, 0x0A, 0x09, 0x08, 0x09, 0x09, 0x0A,
    0x0C, 0x0F, 0x0C, 0x0A, 0x0B, 0x0E, 0x0B, 0x09, 0x09, 0x0D, 0x11, 0x0D,
    0x0E, 0x0F, 0x10, 0x10, 0x11, 0x10, 0x0A, 0x0C, 0x12, 0x13, 0x12, 0x10,
    0x13, 0x0F, 0x10, 0x10, 0x10, 0xFF, 0xC9, 0x00, 0x0B, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xCC, 0x00, 0x06, 0x00, 0x10,
    0x10, 0x05, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
    0xD2, 0xCF, 0x20, 0xFF, 0xD9
  ]);
  
  if (!fs.existsSync(testImagePath)) {
    fs.writeFileSync(testImagePath, redSquare);
  }
  
  return testImagePath;
}

function createFormData(filePath) {
  const FormData = require('form-data');
  const formData = new FormData();
  
  // Only add the file - params go as second argument to the API method
  formData.append('file', fs.createReadStream(filePath));
  
  return formData;
}

async function runAllTests() {
  console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}        QASIMDEV API - POST ENDPOINTS TEST SUITE          ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

  const testImagePath = createTestImage();
  console.log(`Using test image: ${testImagePath}\n`);

  // ==================== IMAGE EFFECTS TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ IMAGE EFFECTS ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('Fisheye - Should add fisheye effect', async () => {
    const formData = createFormData(testImagePath);
    const response = await api.Fisheye(formData, { strength: 2.5 });
    validateResponse(response);
  });

  await runTest('Vignette - Should add vignette effect', async () => {
    const formData = createFormData(testImagePath);
    const response = await api.Vignette(formData, { intensity: 0.5 });
    validateResponse(response);
  });

  await runTest('Blur - Should blur image', async () => {
    const formData = createFormData(testImagePath);
    const response = await api.Blur(formData, { sigma: 3 });
    validateResponse(response);
  });

  await runTest('Grayscale - Should convert to grayscale', async () => {
    const formData = createFormData(testImagePath);
    const response = await api.Grayscale(formData);
    validateResponse(response);
  });

  await runTest('Invert - Should invert colors', async () => {
    const formData = createFormData(testImagePath);
    const response = await api.Invert(formData);
    validateResponse(response);
  });

  await runTest('Resize - Should resize image', async () => {
    const formData = createFormData(testImagePath);
    const response = await api.Resize(formData, { width: 200, height: 200 });
    validateResponse(response);
  });

  // ==================== RESULTS ====================
  console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}                      TEST RESULTS                         ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`\n  Total Tests:   ${colors.bright}${totalTests}${colors.reset}`);
  console.log(`  ${colors.green}✓ Passed:      ${passedTests}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed:      ${failedTests}${colors.reset}`);
  console.log(`  ${colors.yellow}⊘ Skipped:     ${skippedTests}${colors.reset}`);
  
  const passRate = totalTests > 0 ? ((passedTests / (totalTests - skippedTests)) * 100).toFixed(2) : 0;
  console.log(`\n  Pass Rate:     ${colors.bright}${passRate}%${colors.reset} (excluding skipped)`);
  
  console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch(error => {
  console.error(`\n${colors.red}${colors.bright}Fatal Error:${colors.reset}`, error);
  process.exit(1);
});
