// test/test.cjs
const API = require('../dist/index.cjs');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracker
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

// Helper function to run tests
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

// Helper to validate response
function validateResponse(response, shouldHaveData = true) {
  if (!response) {
    throw new Error('Response is null or undefined');
  }
  
  if (shouldHaveData && typeof response === 'object' && Object.keys(response).length === 0) {
    throw new Error('Response is empty object');
  }
  
  return true;
}

// Main test suite
async function runAllTests() {
  console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}           DISCARD API - COMPREHENSIVE TEST SUITE        ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

  // ==================== AI TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ AI ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('KimiAi - Should return AI response', async () => {
    const response = await api.KimiAi({ prompt: 'Hello' });
    validateResponse(response);
  });

  await runTest('MistralAi - Should return AI response', async () => {
    const response = await api.MistralAi({ text: 'What is JavaScript?' });
    validateResponse(response);
  });

  await runTest('CodestralAi - Should return code response', async () => {
    const response = await api.CodestralAi({ text: 'Write hello world' });
    validateResponse(response);
  });

  await runTest('LlamaAi - Should return AI response', async () => {
    const response = await api.LlamaAi({ prompt: 'Hi' });
    validateResponse(response);
  });

  await runTest('QwenAi - Should return AI response', async () => {
    const response = await api.QwenAi({ text: 'Hello world' });
    validateResponse(response);
  });

  await runTest('CerebrasAi - Should return AI response', async () => {
    const response = await api.CerebrasAi({ text: 'Test prompt' });
    validateResponse(response);
  });

  await runTest('GroqAi - Should return AI response', async () => {
    const response = await api.GroqAi({ text: 'What is AI?' });
    validateResponse(response);
  });

  // ==================== APPS TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ APPS ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('An1Search - Should search apps', async () => {
    const response = await api.An1Search({ query: 'telegram' });
    validateResponse(response);
  });

  await runTest('ApkpureSearch - Should search apps', async () => {
    const response = await api.ApkpureSearch({ query: 'telegram' });
    validateResponse(response);
  });

  await runTest('AptoideSearch - Should search apps', async () => {
    const response = await api.AptoideSearch({ query: 'telegram' });
    validateResponse(response);
  });

  // ==================== URL SHORTENER TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ URL SHORTENER ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('Tiny - Should shorten URL', async () => {
    const response = await api.Tiny({ url: 'https://www.google.com' });
    validateResponse(response);
  });

  await runTest('Vurl - Should shorten URL', async () => {
    const response = await api.Vurl({ url: 'https://github.com' });
    validateResponse(response);
  });

  await runTest('Clean - Should clean URL', async () => {
    const response = await api.Clean({ url: 'https://example.com' });
    validateResponse(response);
  });

  // ==================== DOWNLOAD TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ DOWNLOAD ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('TikTok - Should download video', async () => {
    const response = await api.TikTok({ url: 'https://vt.tiktok.com/ZSapQQph2/' });
    validateResponse(response);
  });

  await runTest('Instagram - Should download media', async () => {
    const response = await api.Instagram({ url: 'https://www.instagram.com/reel/DUGAQwaiQXS/?igsh=MWxyYjg5Y3NvYzAybQ==' });
    validateResponse(response);
  });

  await runTest('Pinterest - Should search and download', async () => {
    const response = await api.Pinterest({ text: 'nature wallpaper' });
    validateResponse(response);
  });

  await runTest('GoogleImage - Should search images', async () => {
    const response = await api.GoogleImage({ query: 'sunset' });
    validateResponse(response);
  });

  // ==================== IMAGE MAKER TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ IMAGE MAKER ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('TextToPic - Should create image', async () => {
    const response = await api.TextToPic({ text: 'Hello World' });
    validateResponse(response);
  });

  await runTest('Avatar - Should create avatar', async () => {
    const response = await api.Avatar({ text: 'JD', shape: 'circle' });
    validateResponse(response);
  });

  await runTest('Carbon - Should create code image', async () => {
    const response = await api.Carbon({ code: 'console.log("hello")', bg: 'rgba(171, 184, 195, 1)' });
    validateResponse(response);
  });

  // ==================== MUSIC TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ MUSIC ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('Spotify - Should download track', async () => {
    const response = await api.Spotify({ url: '  https://open.spotify.com/track/1vtALFOqKv1Azrp91ck5dC?si=R1rBr5hTQoiyb2h1MH30CQ' });
    validateResponse(response);
  });

  await runTest('SearchScloud - Should search tracks', async () => {
    const response = await api.SearchScloud({ q: 'electronic music', limit: 5 });
    validateResponse(response);
  });

  await runTest('GeniusSearch - Should search lyrics', async () => {
    const response = await api.GeniusSearch({ query: 'imagine dragons' });
    validateResponse(response);
  });

  await runTest('DeezerSearch - Should search music', async () => {
    const response = await api.DeezerSearch({ track: 'lose yourself', artist: 'eminem' });
    validateResponse(response);
  });

  await runTest('JamendoSearch - Should search tracks', async () => {
    const response = await api.JamendoSearch({ query: 'rock', type: 'tracks', limit: 10 });
    validateResponse(response);
  });

  // ==================== IMAGE TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ IMAGE ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('Couple - Should return couple images', async () => {
    const response = await api.Couple();
    validateResponse(response);
  });

  await runTest('Food - Should return food images', async () => {
    const response = await api.Food({ food: 'pizza' });
    validateResponse(response);
  });

  await runTest('Islamic - Should return Islamic images', async () => {
    const response = await api.Islamic();
    validateResponse(response);
  });

  await runTest('Tech - Should return tech images', async () => {
    const response = await api.Tech();
    validateResponse(response);
  });

  await runTest('Coffee - Should return coffee images', async () => {
    const response = await api.Coffee();
    validateResponse(response);
  });

  // ==================== NEWS TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ NEWS ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('GoogleNews - Should return news', async () => {
    const response = await api.GoogleNews({ query: 'technology' });
    validateResponse(response);
  });

  await runTest('Bbc - Should return BBC news', async () => {
    const response = await api.Bbc();
    validateResponse(response);
  });

  await runTest('Cnn - Should return CNN news', async () => {
    const response = await api.Cnn();
    validateResponse(response);
  });

  await runTest('Dawn - Should return Dawn news', async () => {
    const response = await api.Dawn();
    validateResponse(response);
  });

  await runTest('Sky - Should return Sky news', async () => {
    const response = await api.Sky();
    validateResponse(response);
  });

  // ==================== STALKER TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ STALKER ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('GithubUser - Should return user info', async () => {
    const response = await api.GithubUser({ username: 'torvalds' });
    validateResponse(response);
  });

  await runTest('TiktokUser - Should return user info', async () => {
    const response = await api.TiktokUser({ username: 'genius.rai' });
    validateResponse(response);
  });

  await runTest('RedditUser - Should return user info', async () => {
    const response = await api.RedditUser({ username: 'spez' });
    validateResponse(response);
  });

  // ==================== SEARCH TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ SEARCH ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('BingSearch - Should search', async () => {
    const response = await api.BingSearch({ query: 'nodejs' });
    validateResponse(response);
  });

  await runTest('YTSearch - Should search videos', async () => {
    const response = await api.YTSearch({ query: 'programming tutorial', limit: 5 });
    validateResponse(response);
  });

  await runTest('ImdbSearch - Should search movies', async () => {
    const response = await api.ImdbSearch({ query: 'inception' });
    validateResponse(response);
  });

  await runTest('Wattpad - Should search stories', async () => {
    const response = await api.Wattpad({ query: 'romance' });
    validateResponse(response);
  });

  // ==================== TOOLS TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ TOOLS ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('Dictionary - Should define word', async () => {
    const response = await api.Dictionary({ word: 'why' });
    validateResponse(response);
  });

  await runTest('Translate - Should translate text', async () => {
    const response = await api.Translate({ text: 'hello', from: 'en', to: 'es' });
    validateResponse(response);
  });

  await runTest('Translate2 - Should translate text (Google)', async () => {
    const response = await api.Translate2({ text: 'world', from: 'en', to: 'fr' });
    validateResponse(response);
  });

  await runTest('Ping - Should ping URL', async () => {
    const response = await api.Ping({ url: 'https://google.com' });
    validateResponse(response);
  });

  await runTest('TextStats - Should return text statistics', async () => {
    const response = await api.TextStats({ text: 'The quick brown fox jumps over the lazy dog' });
    validateResponse(response);
  });

  await runTest('UnitConvert - Should convert units', async () => {
    const response = await api.UnitConvert({ from: 'km', to: 'miles', value: 10 });
    validateResponse(response);
  });

  // ==================== PHOTOOXY TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ PHOTOOXY ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('Battlefield - Should create image', async () => {
    const response = await api.Battlefield({ text1: 'Player', text2: 'One' });
    validateResponse(response);
  });

  await runTest('TikTokEffect - Should create effect', async () => {
    const response = await api.TikTokEffect({ text1: 'Hello', text2: 'World' });
    validateResponse(response);
  });

  // ==================== EPHOTO360 TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ EPHOTO360 ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('WolfGalaxy - Should create image', async () => {
    const response = await api.WolfGalaxy({ text1: 'Wolf', text2: 'Galaxy' });
    validateResponse(response);
  });

  await runTest('FreeFire - Should create banner', async () => {
    const response = await api.FreeFire({ text1: 'Free', text2: 'Fire' });
    validateResponse(response);
  });

  // ==================== INFORMATION TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ INFORMATION ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('GithubRepo - Should return repo info', async () => {
    const response = await api.GithubRepo({ owner: 'nodejs', repo: 'node' });
    validateResponse(response);
  });

  await runTest('Weather - Should return weather', async () => {
    const response = await api.Weather({ city: 'London' });
    validateResponse(response);
  });

  await runTest('Country - Should return country info', async () => {
    const response = await api.Country({ name: 'Pakistan' });
    validateResponse(response);
  });

  await runTest('Wikipedia - Should search Wikipedia', async () => {
    const response = await api.Wikipedia({ query: 'JavaScript' });
    validateResponse(response);
  });

  await runTest('IPLookup - Should lookup IP', async () => {
    const response = await api.IPLookup({ ip: '8.8.8.8' });
    validateResponse(response);
  });

  // ==================== CRYPTO TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ CRYPTO ENDPOINTS ━━━${colors.reset}`);
  
  await runTest('CoinInfo - Should return coin info', async () => {
    const response = await api.CoinInfo({ id: 'bitcoin' });
    validateResponse(response);
  });

  await runTest('CoinsList - Should list coins', async () => {
    const response = await api.CoinsList();
    validateResponse(response);
  });

  // ==================== UTILITY TESTS ====================
  console.log(`\n${colors.bright}${colors.blue}━━━ UTILITY METHODS ━━━${colors.reset}`);
  
  await runTest('setFullResponse - Should set full response mode', async () => {
    api.setFullResponse(true);
    if (api.getFullResponse() !== true) throw new Error('Full response not set');
    api.setFullResponse(false);
  });

  await runTest('setTimeout - Should set timeout', async () => {
    api.setTimeout(60000);
    // No direct getter, but we can verify it doesn't throw
  });

  await runTest('setAPIKey - Should set API key', async () => {
    api.setAPIKey('test-key');
    api.setAPIKey('qasim-dev'); // Reset to default
  });

  // ==================== RESULTS ====================
  console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}                      TEST RESULTS                         ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`\n  Total Tests:   ${colors.bright}${totalTests}${colors.reset}`);
  console.log(`  ${colors.green}✓ Passed:      ${passedTests}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed:      ${failedTests}${colors.reset}`);
  console.log(`  ${colors.yellow}⊘ Skipped:     ${skippedTests}${colors.reset}`);
  
  const passRate = ((passedTests / totalTests) * 100).toFixed(2);
  console.log(`\n  Pass Rate:     ${colors.bright}${passRate}%${colors.reset}`);
  
  console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

  // Exit with error code if any tests failed
  if (failedTests > 0) {
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error(`\n${colors.red}${colors.bright}Fatal Error:${colors.reset}`, error);
  process.exit(1);
});
