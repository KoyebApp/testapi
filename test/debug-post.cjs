// test/debug-post.cjs
const API = require('../dist/index.cjs');
const fs = require('fs');
const path = require('path');

// Initialize API
const api = new API({
  apiKey: 'qasim-dev',
  fullResponse: true, // Get full response to see errors
  timeout: 30000
});

function createTestImage() {
  const testImagePath = path.join(__dirname, 'test.jpg');
  
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
  
  fs.writeFileSync(testImagePath, redSquare);
  return testImagePath;
}

async function testWithRawFetch() {
  console.log('\n=== TESTING WITH RAW FETCH (to see exact error) ===\n');
  
  const FormData = require('form-data');
  const testImagePath = createTestImage();
  const formData = new FormData();
  formData.append('file', fs.createReadStream(testImagePath));
  
  const url = 'https://api.qasimdev.dpdns.org/api/sharp/grayscale?apikey=qasim-dev';
  
  console.log('URL:', url);
  console.log('Headers:', formData.getHeaders());
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: formData.getHeaders(),
      body: formData
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    if (response.ok) {
      console.log('✅ SUCCESS!');
      if (response.headers.get('content-type')?.includes('image')) {
        console.log('Got image response');
      } else {
        const text = await response.text();
        console.log('Response:', text);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ ERROR Response:', errorText);
    }
  } catch (err) {
    console.error('❌ Request failed:', err.message);
  }
}

async function testWithSDK() {
  console.log('\n=== TESTING WITH SDK ===\n');
  
  const FormData = require('form-data');
  const testImagePath = createTestImage();
  const formData = new FormData();
  formData.append('file', fs.createReadStream(testImagePath));
  
  try {
    const response = await api.Grayscale(formData);
    console.log('✅ SDK SUCCESS!');
    console.log('Response type:', typeof response);
    console.log('Response preview:', response?.substring ? response.substring(0, 50) + '...' : response);
  } catch (err) {
    console.error('❌ SDK ERROR:', err.message);
  }
}

async function run() {
  await testWithRawFetch();
  await testWithSDK();
}

run().catch(console.error);
