// src/index.ts
interface APIConfig {
  apiKey: string;
  baseURL?: string;
  fullResponse?: boolean;
  timeout?: number;
}

interface APIResponse<T = any> {
  data?: T;
  success?: boolean;
  [key: string]: any;
}

class API {
  private apiKey: string;
  private baseURL: string;
  private fullResponse: boolean;
  private timeout: number;

  constructor(config: APIConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
    
    this.apiKey = config.apiKey || 'qasim-dev';
    this.baseURL = config.baseURL || 'https://api.qasimdev.dpdns.org';
    this.fullResponse = config.fullResponse ?? false;
    this.timeout = config.timeout || 30000;
  }

  private buildURL(endpoint: string, params: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    const allParams = { ...params, apikey: this.apiKey };
    
    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.toString();
  }

  private async request<T = any>(
    endpoint: string,
    method: string = 'GET',
    params?: Record<string, any>,
    body?: Record<string, any> | FormData,
    apiKeyLocation: 'query' | 'body' = 'query'
  ): Promise<T | APIResponse<T>> {
    let url: string;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        signal: controller.signal,
        headers: {}
      };

      if (method === 'GET') {
        url = this.buildURL(endpoint, params || {});
      } else {
        url = apiKeyLocation === 'query' 
          ? this.buildURL(endpoint, params || {})
          : `${this.baseURL}${endpoint}`;

        if (body) {
          if (body instanceof FormData) {
            if (apiKeyLocation === 'body') {
              body.append('apikey', this.apiKey);
            }
            fetchOptions.body = body;
          } else {
            fetchOptions.headers = { 'Content-Type': 'application/json' };
            const bodyData = apiKeyLocation === 'body' 
              ? { ...body, apikey: this.apiKey }
              : body;
            fetchOptions.body = JSON.stringify(bodyData);
          }
        }
      }

      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data: APIResponse<T> = await response.json();
        return this.fullResponse ? data : (data.data ?? data);
      }
      
      return response.text() as any;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  
  // ==================== AI ====================
  KimiAi(params: { prompt: string }) {
    return this.request('/api/kimi/ai', 'GET', params);
  }

  MistralAi(params: { text: string }) {
    return this.request('/api/mistral/ai', 'GET', params);
  }

  CodestralAi(params: { text: string; model: string }) {
    return this.request('/api/mistral/advanced', 'GET', params);
  }

  LlamaAi(params: { prompt: string }) {
    return this.request('/api/novita/llama', 'GET', params);
  }

  QwenAi(params: { text: string }) {
    return this.request('/api/novita/qwen', 'GET', params);
  }

  CerebrasAi(params: { text: string }) {
    return this.request('/api/cerebras/ai', 'GET', params);
  }

  GroqAi(params: { text: string }) {
    return this.request('/api/groq/ai', 'GET', params);
  }

  // ==================== APPS ====================
  An1Search(params: { query: string }) {
    return this.request('/api/an1apk/search', 'GET', params);
  }

  An1Dl(params: { url: string }) {
    return this.request('/api/an1apk/download', 'GET', params);
  }

  ApkpureSearch(params: { id: string }) {
    return this.request('/api/apkpure/search', 'GET', params);
  }

  ApkpureDl(params: { query: string }) {
    return this.request('/api/apkpure/download', 'GET', params);
  }

  AptoideSearch(params: { url: string }) {
    return this.request('/api/aptoide/search', 'GET', params);
  }

  AptoideDl(params: { url: string }) {
    return this.request('/api/aptoide/download', 'GET', params);
  }
  
  // ==================== URL SHORTENER ====================
  Reurl(params: { url: string }) {
    return this.request('/api/shortener/reurl', 'GET', params);
  }

  Itsl(params: { url: string }) {
    return this.request('/api/shortener/itsssl', 'GET', params);
  }

  Cuqin(params: { url: string }) {
    return this.request('/api/shortener/cuqin', 'GET', params);
  }

  Surl(params: { url: string }) {
    return this.request('/api/shortener/ssur', 'GET', params);
  }

  Vurl(params: { url: string }) {
    return this.request('/api/shortener/vurl', 'GET', params);
  }

  Vgd(params: { url: string }) {
    return this.request('/api/shortener/vgd', 'GET', params);
  }

  Clean(params: { url: string }) {
    return this.request('/api/shortener/cleanuri', 'GET', params);
  }

  Tiny(params: { url: string }) {
    return this.request('/api/shortener/tiny', 'GET', params);
  }

  Unshort(params: { url: string }) {
    return this.request('/api/shortener/unshort', 'GET', params);
  }

  // ==================== DOWNLOADS ====================
  Facebook(params: { url: string }) {
    return this.request('/api/facebook/download', 'GET', params);
  }

  Gitclone(params: { url: string }) {
    return this.request('/api/gitclone/download', 'GET', params);
  }

  Instagram(params: { url: string }) {
    return this.request('/api/instagram/download', 'GET', params);
  }

  Mediafire(params: { url: string }) {
    return this.request('/api/mediafire/download', 'GET', params);
  }

  Pinterest(params: { text: string }) {
    return this.request('/api/download/pinterest', 'GET', params);
  }

  TikTok(params: { url: string }) {
    return this.request('/api/tiktok/download', 'GET', params);
  }

  Twitter(params: { url: string }) {
    return this.request('/api/twitter/download', 'GET', params);
  }

  Threads(params: { url: string }) {
    return this.request('/api/threads/download', 'GET', params);
  }

  Twitch(params: { url: string }) {
    return this.request('/api/download/twitch', 'GET', params);
  }

  WallBest(params: { text: string; page?: string }) {
    return this.request('/api/wallpaper/wallbest', 'GET', params);
  }

  WallCraft(params: { text: string }) {
    return this.request('/api/wallpaper/wallcraft', 'GET', params);
  }

  WallHaven(params?: { query?: string; sorting?: string; page?: string; purity?: string; categories?: string }) {
    return this.request('/api/wallpaper/wallhaven', 'GET', params);
  }

  Wikimedia(params: { title: string }) {
    return this.request('/api/wallpaper/wikimedia', 'GET', params);
  }

  dlYouTube(params: { url: string; format: string }) {
    return this.request('/api/dl/youtube', 'GET', params);
  }

  dlBilibili(params: { url: string }) {
    return this.request('/api/dl/bilibili', 'GET', params);
  }

  dlLinkedIn(params: { url: string }) {
    return this.request('/api/dl/linkedin', 'GET', params);
  }

  dlSnapChat(params: { url: string }) {
    return this.request('/api/dl/snapchat', 'GET', params);
  }

  dlShareChat(params: { url: string }) {
    return this.request('/api/dl/sharechat', 'GET', params);
  }

  dlSnackVideo(params: { url: string }) {
    return this.request('/api/dl/snack', 'GET', params);
  }

  dlPinterestVideo(params: { url: string }) {
    return this.request('/api/dl/pinterest', 'GET', params);
  }

  dlRedditVideo(params: { url: string }) {
    return this.request('/api/dl/reddit', 'GET', params);
  }

  dlVideezy(params: { url: string }) {
    return this.request('/api/dl/videezy', 'GET', params);
  }

  dlVidsPlay(params: { url: string }) {
    return this.request('/api/dl/vidsplay', 'GET', params);
  }

  dlIMDbVideo(params: { url: string }) {
    return this.request('/api/dl/imdb', 'GET', params);
  }

  dlIFunny(params: { url: string }) {
    return this.request('/api/dl/ifunny', 'GET', params);
  }

  dlGetty(params: { url: string }) {
    return this.request('/api/dl/getty', 'GET', params);
  }

  pexelsVideos(params: { query: string }) {
    return this.request('/api/pexels/videos', 'GET', params);
  }

  pexelsImages(params: { query: string }) {
    return this.request('/api/pexels/images', 'GET', params);
  }

  loremPicsum(params: { id: string; height?: string; width?: string; grayscale?: string; blur?: string }) {
    return this.request('/api/dl/picsum', 'GET', params);
  }

  iconFinder(params: { query: string }) {
    return this.request('/api/icon/finder', 'GET', params);
  }

  pixabayImages(params: { query: string; page?: string }) {
    return this.request('/api/pixabay/images', 'GET', params);
  }

  pixabayVideos(params: { query: string; page?: string; category?: string }) {
    return this.request('/api/pixabay/videos', 'GET', params);
  }

  tenorGifs(params: { query: string }) {
    return this.request('/api/dl/tenor', 'GET', params);
  }

  pasteBin(params: { id: string; dl?: string }) {
    return this.request('/api/dl/pastebin', 'GET', params);
  }

  googleImage(params: { query: string }) {
    return this.request('/api/dl/gimage', 'GET', params);
  }

  baiduImage(params: { query: string; page?: string }) {
    return this.request('/api/img/baidu', 'GET', params);
  }

  dailyBing() {
    return this.request('/api/img/dailybing', 'GET');
  }

  dlIStock(params: { url: string }) {
    return this.request('/api/dl/istock', 'GET', params);
  }

  dlOdysee(params: { url: string }) {
    return this.request('/api/dl/odysee', 'GET', params);
  }

  dlAlamy(params: { url: string }) {
    return this.request('/api/dl/alamy', 'GET', params);
  }

  // ==================== IMAGE MAKERS ====================
  qrCode(params: { text: string }) {
    return this.request('/api/maker/qrcode', 'GET', params);
  }

  qrTag(params: { text: string; size?: string; color?: string; logo?: string }) {
    return this.request('/api/maker/qrtag', 'GET', params);
  }

  textToPic(params: { text: string }) {
    return this.request('/api/maker/ttp', 'GET', params);
  }

  designFont(params: { text: string }) {
    return this.request('/api/design/font', 'GET', params);
  }

  captchaImage() {
    return this.request('/api/maker/captcha', 'GET');
  }

  customQR(params: { text: string; size?: string; color?: string }) {
    return this.request('/api/maker/customqr', 'GET', params);
  }

  textAvatar(params: { text: string; shape?: string }) {
    return this.request('/api/maker/avatar', 'GET', params);
  }

  webLogo(params: { url: string }) {
    return this.request('/api/maker/weblogo', 'GET', params);
  }

  whoWins(params: { url1: string; url2: string }) {
    return this.request('/api/maker/whowin', 'GET', params);
  }

  quoted(params: { text: string; name: string; profile: string; color?: string }) {
    return this.request('/api/maker/quoted', 'GET', params);
  }

  qrPro(params: { text: string; size?: string; color?: string; logo?: string; caption?: string }) {
    return this.request('/api/qr/pro', 'GET', params);
  }

  img2Base64(body: FormData) {
    return this.request('/api/img2base64', 'POST', undefined, body, 'body');
  }

  base64ToImg(params: { data: string }) {
    return this.request('/api/img2base64', 'GET', params);
  }

  barcode128(params: { text: string }) {
    return this.request('/api/barcode/code', 'GET', params);
  }

  barcodeEAN(params: { text: string }) {
    return this.request('/api/barcode/ean', 'GET', params);
  }

  barcodeQR(params: { text: string }) {
    return this.request('/api/barcode/qr', 'GET', params);
  }

  emojiMosaic(body: FormData, params: { width: string; palette: string; format?: string }) {
    return this.request('/api/emoji/mosaic', 'POST', params, body, 'body');
  }

  emojiTranslate(params: { text: string }) {
    return this.request('/api/emoji/translate', 'GET', params);
  }

  emojiReplace(params: { text: string }) {
    return this.request('/api/emoji/replace', 'GET', params);
  }

  emojiMirror(params: { text: string }) {
    return this.request('/api/emoji/mirror', 'GET', params);
  }

  emojiRainbow(params: { text: string }) {
    return this.request('/api/emoji/rainbow', 'GET', params);
  }

  emojiMix(params: { e1: string; e2: string }) {
    return this.request('/api/emoji/mix', 'GET', params);
  }

  carbonImage(params: { code: string; bg?: string }) {
    return this.request('/api/maker/carbon', 'GET', params);
  }

  welcomeImage(params: { background: string; avatar: string; text1: string; text2: string; text3: string }) {
    return this.request('/api/maker/welcome', 'GET', params);
  }

  // ==================== MUSIC ====================
  searchSpotify(params: { query: string }) {
    return this.request('/api/search/spotify', 'GET', params);
  }

  dlSpotify(params: { url: string }) {
    return this.request('/api/dl/spotify', 'GET', params);
  }

  searchSoundCloud(params: { query: string }) {
    return this.request('/api/search/soundcloud', 'GET', params);
  }

  dlSoundCloud(params: { url: string }) {
    return this.request('/api/dl/soundcloud', 'GET', params);
  }

  lyrics(params: { song: string }) {
    return this.request('/api/music/lyrics', 'GET', params);
  }

  ringtones(params: { title: string }) {
    return this.request('/api/dl/ringtone', 'GET', params);
  }

  searchSound(params: { query: string }) {
    return this.request('/api/search/sound', 'GET', params);
  }

  previewSound(params: { id: string }) {
    return this.request('/api/dl/sound', 'GET', params);
  }

  searchDeezer(params: { track?: string; artist?: string; album?: string }) {
    return this.request('/api/search/deezer', 'GET', params);
  }

  previewDeezer(params: { id: string }) {
    return this.request('/api/search/deezer', 'GET', params);
  }

  searchMusicBrainz(params: { entity: string; query?: string; id?: string }) {
    return this.request('/api/search/musicbrainz', 'GET', params);
  }

  openWhyd(params: { username: string; limit?: string }) {
    return this.request('/api/search/openwhyd', 'GET', params);
  }

  // ==================== JOKES ====================
  dadJoke() {
    return this.request('/api/joke/dad', 'GET');
  }

  generalJoke() {
    return this.request('/api/joke/general', 'GET');
  }

  knockJoke() {
    return this.request('/api/joke/knock', 'GET');
  }

  programmingJoke() {
    return this.request('/api/joke/programming', 'GET');
  }

  miscJoke() {
    return this.request('/api/joke/misc', 'GET');
  }

  codingJoke() {
    return this.request('/api/joke/coding', 'GET');
  }

  spookyJoke() {
    return this.request('/api/joke/spooky', 'GET');
  }

  darkJoke() {
    return this.request('/api/joke/dark', 'GET');
  }

  christmasJoke() {
    return this.request('/api/joke/Christmas', 'GET');
  }

  randomJoke() {
    return this.request('/api/joke/random', 'GET');
  }

  animalJoke() {
    return this.request('/api/joke/animal', 'GET');
  }

  careerJoke() {
    return this.request('/api/joke/career', 'GET');
  }

  celebrityJoke() {
    return this.request('/api/joke/celebrity', 'GET');
  }

  explicitJoke() {
    return this.request('/api/joke/explicit', 'GET');
  }

  fashionJoke() {
    return this.request('/api/joke/fashion', 'GET');
  }

  foodJoke() {
    return this.request('/api/joke/food', 'GET');
  }

  historyJoke() {
    return this.request('/api/joke/history', 'GET');
  }

  moneyJoke() {
    return this.request('/api/joke/money', 'GET');
  }

  movieJoke() {
    return this.request('/api/joke/movie', 'GET');
  }

  musicJoke() {
    return this.request('/api/joke/music', 'GET');
  }

  scienceJoke() {
    return this.request('/api/joke/science', 'GET');
  }

  sportJoke() {
    return this.request('/api/joke/sport', 'GET');
  }

  travelJoke() {
    return this.request('/api/joke/travel', 'GET');
    }

   // ==================== IMAGES ====================
  coupleImage() {
    return this.request('/api/img/couple', 'GET');
  }

  pizzaImage() {
    return this.request('/api/images/pizza', 'GET');
  }

  burgerImage() {
    return this.request('/api/images/burger', 'GET');
  }

  dosaImage() {
    return this.request('/api/images/dosa', 'GET');
  }

  pastaImage() {
    return this.request('/api/images/pasta', 'GET');
  }

  biryaniImage() {
    return this.request('/api/images/biryani', 'GET');
  }

  islamicImage() {
    return this.request('/api/img/islamic', 'GET');
  }

  techImage() {
    return this.request('/api/img/tech', 'GET');
  }

  gameImage() {
    return this.request('/api/img/game', 'GET');
  }

  mountainImage() {
    return this.request('/api/img/mountain', 'GET');
  }

  programmingImage() {
    return this.request('/api/img/programming', 'GET');
  }

  cyberSpaceImage() {
    return this.request('/api/img/cyberspace', 'GET');
  }

  wallPcImage() {
    return this.request('/api/img/wallpc', 'GET');
  }

  messiImage() {
    return this.request('/api/img/messi', 'GET');
  }

  ronaldoImage() {
    return this.request('/api/img/ronaldo', 'GET');
  }

  coffeeImage() {
    return this.request('/api/img/coffee', 'GET');
  }

  catImage() {
    return this.request('/api/img/cat', 'GET');
  }

  dogImage() {
    return this.request('/api/img/dog', 'GET');
  }

  yesNoImage() {
    return this.request('/api/img/yesno', 'GET');
  }

  foxImage() {
    return this.request('/api/img/fox', 'GET');
  }

  notExistImage() {
    return this.request('/api/img/notexist', 'GET');
  }

  // ==================== NEWS ====================
  AljazeeraEnglish() {
    return this.request('/api/news/aljazeera', 'GET');
  }
  
  AlJazeeraArticle(params: { url: string }) {
    return this.request('/api/aljazeera/article', 'GET', params);
  }
  
  AlJazeeraArabic() {
    return this.request('/api/news/aljazeera/ar', 'GET');
  }
  
  ArabicArticle(params: { url: string }) {
    return this.request('/api/aljazeera/article/ar', 'GET', params);
  }
  
  TRTWorld() {
    return this.request('/api/news/trt', 'GET');
  }
  
  TRTArticle(params: { url: string }) {
    return this.request('/api/trt/article', 'GET', params);
  }
  
  TRTAfrika() {
    return this.request('/api/news/trt/af', 'GET');
  }
  
  AfrikaArticle(params: { url: string }) {
    return this.request('/api/trt/article/af', 'GET', params);
  }
  
  SkyNews() {
    return this.request('/api/news/sky', 'GET');
  }
  
  SkyArticle(params: { url: string }) {
    return this.request('/api/sky/article', 'GET', params);
  }
  
  SkySports() {
    return this.request('/api/news/skysports', 'GET');
  }
  
  SportsArticle(params: { url: string }) {
    return this.request('/api/skysports/article', 'GET', params);
  }
  
  DawnNews() {
    return this.request('/api/news/dawn', 'GET');
  }
  
  DawnArticle(params: { url: string }) {
    return this.request('/api/dawn/article', 'GET', params);
  }
  
  CNNNews() {
    return this.request('/api/news/cnn', 'GET');
  }
  
  CNNArticle(params: { url: string }) {
    return this.request('/api/cnn/article', 'GET', params);
  }
  
  CGTNWorld() {
    return this.request('/api/news/cgtn', 'GET');
  }
  
  CGTNArticle(params: { url: string }) {
    return this.request('/api/cgtn/article', 'GET', params);
  }
  
  GeoUrdu() {
    return this.request('/api/news/geo', 'GET');
  }
  
  GeoArticle(params: { url: string }) {
    return this.request('/api/geo/article', 'GET', params);
  }
  
  GeoEnglish() {
    return this.request('/api/news/geo/en', 'GET');
  }
  
  GeoArticleEn(params: { url: string }) {
    return this.request('/api/geo/article/en', 'GET', params);
  }
  
  GeoSuper() {
    return this.request('/api/news/geosuper', 'GET');
  }
  
  SuperArticle(params: { url: string }) {
    return this.request('/api/geosuper/article', 'GET', params);
  }
  
  ExpressTribune() {
    return this.request('/api/news/tribune', 'GET');
  }
  
  TribuneArticle(params: { url: string }) {
    return this.request('/api/tribune/article', 'GET', params);
  }
  
  NeoNews() {
    return this.request('/api/news/neo', 'GET');
  }
  
  NeoArticle(params: { url: string }) {
    return this.request('/api/neo/article', 'GET', params);
  }
  
  ExpressNews() {
    return this.request('/api/news/express', 'GET');
  }
  
  ExpressArticle(params: { url: string }) {
    return this.request('/api/express/article', 'GET', params);
  }
  
  TheGuardian() {
    return this.request('/api/news/guardian', 'GET');
  }
  
  GuardianArticle(params: { url: string }) {
    return this.request('/api/guardian/article', 'GET', params);
  }
  
  AntaraNews() {
    return this.request('/api/news/antara', 'GET');
  }
  
  AntaraArticle(params: { url: string }) {
    return this.request('/api/antara/article', 'GET', params);
  }

  // ==================== STALKER ====================
  stalkPinterest(params: { username: string }) {
    return this.request('/api/stalk/pinterest', 'GET', params);
  }
  
  stalkGithub(params: { username: string }) {
    return this.request('/api/stalk/github', 'GET', params);
  }
  
  stalkInstagram(params: { username: string }) {
    return this.request('/api/stalk/instagram', 'GET', params);
  }
  
  stalkThreads(params: { username: string }) {
    return this.request('/api/stalk/threads', 'GET', params);
  }
  
  stalkTwitter(params: { username: string }) {
    return this.request('/api/stalk/twitter', 'GET', params);
  }
  
  stalkTelegram(params: { username: string }) {
    return this.request('/api/stalk/telegram', 'GET', params);
  }
  
  stalkTikTok(params: { username: string }) {
    return this.request('/api/stalk/tiktok', 'GET', params);
  }

  // ==================== SEARCH ====================
  searchGoogle(params: { query: string }) {
    return this.request('/api/search/google', 'GET', params);
  }

  searchBing(params: { query: string }) {
    return this.request('/api/search/bing', 'GET', params);
  }

  searchBaidu() {
    return this.request('/api/search/baidu', 'GET');
  }

  searchWeibo() {
    return this.request('/api/search/weibo', 'GET');
  }
  
  searchImgur(params: { query: string }) {
    return this.request('/api/search/imgur', 'GET', params);
  }

  searchTime(params: { query: string }) {
    return this.request('/api/search/time', 'GET', params);
  }

  searchFlicker(params: { query: string }) {
    return this.request('/api/search/flicker', 'GET', params);
  }

  searchItunes(params: { query: string }) {
    return this.request('/api/search/itunes', 'GET', params);
  }

  searchWattpad(params: { query: string }) {
    return this.request('/api/search/wattpad', 'GET', params);
  }

  searchStickers(params: { query: string }) {
    return this.request('/api/search/stickers', 'GET', params);
  }

  searchYoutube(params: { query: string }) {
    return this.request('/api/search/youtube2', 'GET', params);
  }

  searchTracks(params: { query: string }) {
    return this.request('/api/search/youtube2', 'GET', params);
  }
  
  searchGifs(params: { query: string }) {
    return this.request('/api/klipy/gif', 'GET', params);
  }

  searchMemes(params: { query: string }) {
    return this.request('/api/klipy/meme', 'GET', params);
  }

  // ==================== TOOLS ====================
  toolsCompress(params: { type: string; text: string }) {
    return this.request('/api/compress', 'GET', params);
  }

  toolsDecompress(params: { type: string; data: string }) {
    return this.request('/api/decompress', 'GET', params);
  }

  toolsBanklogo(params: { domain: string }) {
    return this.request('/api/tools/banklogo', 'GET', params);
  }
  
  toolsDetectLang(params: { text: string }) {
    return this.request('/api/tools/detect', 'GET', params);
  }

  toolsDictionary(params: { word: string }) {
    return this.request('/api/tools/dictionary', 'GET', params);
  }

  toolsDictionary2(params: { word: string }) {
    return this.request('/api/tools/dict', 'GET', params);
  }

  toolsMathematics(params: { expr: string }) {
    return this.request('/api/tools/math', 'GET', params);
  }

  toolsPreview(params: { url: string }) {
    return this.request('/api/tools/preview', 'GET', params);
  }

  toolsScreenshot(params: { url: string }) {
    return this.request('/api/tools/ssweb', 'GET', params);
  }

  toolsStyleText(params: { text: string }) {
    return this.request('/api/tools/styletext', 'GET', params);
  }

  toolsTranslate(params: { text: string; to: string }) {
    return this.request('/api/tools/translate', 'GET', params);
  }

  toolsTranslate2(params: { text: string; lang: string }) {
    return this.request('/api/go/translate', 'GET', params);
  }

  toolsPing(params: { url: string }) {
    return this.request('/api/simple/ping', 'GET', params);
  }

  toolsCounter(params: { count: number }) {
    return this.request('/api/tools/count', 'GET', params);
  }

  toolsHandwriting(params: { text: string }) {
    return this.request('/api/tools/handwrite', 'GET', params);
  }

  toolsTextStats(params: { text: string }) {
    return this.request('/api/tools/string', 'GET', params);
  }

  toolsWordCount(params: { text: string }) {
    return this.request('/api/word/count', 'GET', params);
  }

  toolsUnitConvert(params: { from: string; to: string; value: number }) {
    return this.request('/api/convert/unit', 'GET', params);
  }

  // ==================== MEMES ====================
  memesTwoButton(params: { text1: string; text2: string }) {
    return this.request('/api/meme/buttons', 'GET', params);
  }
  
  memesYelling(params: { text1: string; text2: string }) {
    return this.request('/api/meme/yelling', 'GET', params);
  }

  memesSuccess(params: { text1: string; text2: string }) {
    return this.request('/api/meme/success', 'GET', params);
  }

  memesPuppet(params: { text1: string; text2: string }) {
    return this.request('/api/meme/puppet', 'GET', params);
  }

  memesCouple(params: { text1: string; text2: string }) {
    return this.request('/api/meme/couple', 'GET', params);
  }

  memesSquid(params: { text1: string; text2: string }) {
    return this.request('/api/meme/squid', 'GET', params);
  }

  memesMask(params: { text1: string; text2?: string; text3?: string; text4?: string }) {
    return this.request('/api/meme/mask', 'GET', params);
  }

  memesDrowning(params: { text1: string; text2?: string; text3?: string; text4?: string }) {
    return this.request('/api/meme/drowning', 'GET', params);
  }

  memesDistracted(params: { text1: string; text2?: string; text3?: string }) {
    return this.request('/api/meme/boyfriend', 'GET', params);
  }

  memesExit(params: { text1: string; text2?: string; text3?: string }) {
    return this.request('/api/meme/exit', 'GET', params);
  }

  // ==================== PHOTOOXY ====================
  photoPubg(params: { text1: string; text2: string }) {
    return this.request('/api/photo/pubg', 'GET', params);
  }

  photoBattle(params: { text1: string; text2: string }) {
    return this.request('/api/photo/battle4', 'GET', params);
  }

  photoTikTok(params: { text1: string; text2: string }) {
    return this.request('/api/photo/tiktok', 'GET', params);
  }

  photoNeon(params: { text: string }) {
    return this.request('/api/photo/neon', 'GET', params);
  }

  photoWarface(params: { text: string }) {
    return this.request('/api/photo/warface', 'GET', params);
  }

  photoWarface2(params: { text: string }) {
    return this.request('/api/photo/warface2', 'GET', params);
  }

  photoLeague(params: { text: string }) {
    return this.request('/api/photo/league', 'GET', params);
  }

  photoLolCover(params: { text: string }) {
    return this.request('/api/photo/lolcover', 'GET', params);
  }

  photoLolShine(params: { text: string }) {
    return this.request('/api/photo/lolshine', 'GET', params);
  }

  photoMetal(params: { text: string }) {
    return this.request('/api/photo/darkmetal', 'GET', params);
  }

  // ==================== EPHOTO360 ====================
  ephotoDeadpool(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/deadpool', 'GET', params);
  }

  ephotoWolf(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/wolf', 'GET', params);
  }

  ephotoShirt(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/shirt', 'GET', params);
  }

  ephotoPencil(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/sketch', 'GET', params);
  }

  ephotoThor(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/thor', 'GET', params);
  }

  ephotoRoyal(params: { text: string }) {
    return this.request('/api/ephoto/royal', 'GET', params);
  }

  ephotoComic(params: { text: string }) {
    return this.request('/api/ephoto/comic', 'GET', params);
  }

  ephotoWings(params: { text: string }) {
    return this.request('/api/ephoto/angel', 'GET', params);
  }

  ephotoFps(params: { text: string }) {
    return this.request('/api/ephoto/game', 'GET', params);
  }

  ephotoMetal(params: { text: string }) {
    return this.request('/api/ephoto/mavatar', 'GET', params);
  }

  // ==================== INFORMATION ====================
  infoGithubUser(params: { username: string }) {
    return this.request('/api/github/user', 'GET', params);
  }

  infoGithubRepo(params: { owner: string; repo: string }) {
    return this.request('/api/github/repo', 'GET', params);
  }

  infoIMDb(params: { query: string }) {
    return this.request('/api/info/imdb', 'GET', params);
  }

  infoTMDb(params: { query: string }) {
    return this.request('/api/info/tmdb', 'GET', params);
  }

  infoUniversity(params: { country: string }) {
    return this.request('/api/info/university', 'GET', params);
  }

  infoIP(params: { ip: string }) {
    return this.request('/api/info/ip', 'GET', params);
  }

  infoTrends(params: { country: string }) {
    return this.request('/api/info/trends', 'GET', params);
  }

  infoWeather(params: { city: string }) {
    return this.request('/api/weather/info', 'GET', params);
  }

  infoCountry(params: { name: string }) {
    return this.request('/api/info/country', 'GET', params);
  }

  infoWikipedia(params: { query: string }) {
    return this.request('/api/info/wiki', 'GET', params);
  }

  // ==================== CRYPTO ====================
 CryptoPrice(params: { id: string }) {
  return this.request('/api/info/crypto', 'GET', params);
 }

 cryptoList() {
  return this.request('/api/crypto/tags', 'GET');
 }

  // ==================== UTILITY METHODS ====================
  setFullResponse(value: boolean): void {
    this.fullResponse = value;
  }

  getFullResponse(): boolean {
    return this.fullResponse;
  }

  setAPIKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}

export default APIQasim;
export { API, APIConfig, APIResponse };


  
