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
    this.timeout = config.timeout || 45000;
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

  Snapchat(params: { url: string }) {
    return this.request('/api/download/snapchat', 'GET', params);
  }

  Sharechat(params: { url: string }) {
    return this.request('/api/download/sharechat', 'GET', params);
  }

  Snackvideo(params: { url: string }) {
    return this.request('/api/download/snackvideo', 'GET', params);
  }

  Reddit(params: { url: string }) {
    return this.request('/api/download/reddit', 'GET', params);
  }

  Videezy(params: { url: string }) {
    return this.request('/api/download/videezy', 'GET', params);
  }

  Vidsplay(params: { url: string }) {
    return this.request('/api/download/vidsplay', 'GET', params);
  }

  IMDbVideo(params: { url: string }) {
    return this.request('/api/download/imdb', 'GET', params);
  }

  IFunny(params: { url: string }) {
    return this.request('/api/download/ifunny', 'GET', params);
  }

  Getty(params: { url: string }) {
    return this.request('/api/download/getty', 'GET', params);
  }

  // ==================== IMAGE MAKERS ====================
  TextToPic(params: { text: string }) {
    return this.request('/api/tools/ttp', 'GET', params);
  }

  Quoted(params: { text: string; name: string; profile: string }) {
    return this.request('/api/tools/quoted', 'GET', params);
  }

  Avatar(params: { text: string; shape?: string }) {
    return this.request('/api/tools/avatar', 'GET', params);
  }

  Img2Base64(body: FormData) {
    return this.request('/api/img2base64', 'POST', undefined, body, 'body');
  }

  Carbon(params: { code: string; bg?: string }) {
    return this.request('/api/tools/carbon', 'GET', params);
  }

  // ==================== MUSIC ====================
  Spotify(params: { url: string }) {
    return this.request('/api/spotify/download', 'GET', params);
  }

  SearchScloud(params: { q: string; limit?: number }) {
    return this.request('/api/soundcloud/search', 'GET', params);
  }

  ScloudDl(params: { url: string }) {
    return this.request('/api/soundcloud/download', 'GET', params);
  }

  GeniusSearch(params: { query: string }) {
    return this.request('/api/genius/search', 'GET', params);
  }

  GeniusLyrics(params: { url: string }) {
    return this.request('/api/genius/lyrics', 'GET', params);
  }

  DeezerSearch(params: { track?: string; artist?: string; album?: string }) {
    return this.request('/api/deezer/search', 'GET', params);
  }

  DeezerDl(params: { id: string }) {
    return this.request('/api/deezer/track', 'GET', params);
  }

  JamendoSearch(params: { query: string; type?: string; limit?: number }) {
    return this.request('/api/jamendo/jamendoSearch', 'GET', params);
  }

  JamendoTracks(params: { artist_name: string; limit?: number; type?: string }) {
    return this.request('/api/jamendo/albumTracks', 'GET', params);
  }

   // ==================== IMAGES ====================
  Couple() {
    return this.request('/api/images/couplepp', 'GET');
  }

  Food (params: { food: string; keyword?: string }) {
    return this.request('/api/images/food', 'GET', params);
  }

  Islamic() {
    return this.request('/api/images/islamic', 'GET');
  }

  Tech() {
    return this.request('/api/images/tech', 'GET');
  }

  Game() {
    return this.request('/api/images/game', 'GET');
  }

  Mountain() {
    return this.request('/api/images/mountain', 'GET');
  }

  CyberSpace() {
    return this.request('/api/images/cyberspace', 'GET');
  }

  Coding() {
    return this.request('/api/images/coding', 'GET');
  }

  Coffee() {
    return this.request('/api/images/coffee', 'GET');
  }

  // ==================== NEWS ====================
  GoogleNews(params: { query?: string }) {
    return this.request('/api/news/google', 'GET', params);
  }
  
  Aljazeera() {
    return this.request('/api/news/aljazeera', 'GET');
  }

  Bbc() {
    return this.request('/api/news/bbc', 'GET');
  }
  
  Trt() {
    return this.request('/api/news/trtWorld', 'GET');
  }
  
  Sky() {
    return this.request('/api/news/skyNews', 'GET');
  }
  
  SkySports(params: { sport: string }) {
    return this.request('/api/news/skySports', 'GET', params);
  }
  
  Dawn() {
    return this.request('/api/news/dawn', 'GET');
  }
  
  Cnn() {
    return this.request('/api/news/cnn', 'GET');
  }
  
  Cgtn() {
    return this.request('/api/news/cgtnWorld', 'GET');
  }
  
  GeoUrdu() {
    return this.request('/api/news/geoUrdu', 'GET');
  }
  
  Geo() {
    return this.request('/api/news/geo', 'GET');
  }
  
  Neo() {
    return this.request('/api/news/neo', 'GET');
  }
  
  Express() {
    return this.request('/api/news/express', 'GET');
  } 


  // ==================== STALKER ====================
  PinterestUser(params: { username: string }) {
    return this.request('/api/stalk/pinterest', 'GET', params);
  }
  
  GithubUser(params: { username: string }) {
    return this.request('/api/stalk/github', 'GET', params);
  }
  
  TelegramUser(params: { username: string }) {
    return this.request('/api/stalk/telegram', 'GET', params);
  }
  
  ThreadsUser(params: { username: string }) {
    return this.request('/api/stalk/threads', 'GET', params);
  }
  
  RedditUser(params: { username: string }) {
    return this.request('/api/stalk/reddit', 'GET', params);
  }
  
  ScloudUser(params: { username: string }) {
    return this.request('/api/stalk/soundcloud', 'GET', params);
  }
  
  TiktokUser(params: { username: string }) {
    return this.request('/api/stalk/tiktok', 'GET', params);
  }

  DribbbleUser(params: { username: string }) {
    return this.request('/api/stalk/dribbble', 'GET', params);
  }

  MastodonUser(params: { username: string; instance?: string }) {
    return this.request('/api/stalk/mastodon', 'GET', params);
  }

  // ==================== SEARCH ====================
  BingSearch(params: { query: string }) {
    return this.request('/api/bing/search', 'GET', params);
  }

  BingImage(params: { query: string }) {
    return this.request('/api/bing/image', 'GET');
  }

  GoogleImage(params: { query: string }) {
    return this.request('/api/google/image', 'GET');
  }
  
  ImgurSearch(params: { query: string }) {
    return this.request('/api/imgur/search', 'GET', params);
  }

  TimeSearch(params: { location: string }) {
    return this.request('/api/time/search', 'GET', params);
  }

  FlickrImage(params: { query: string }) {
    return this.request('/api/flickr/search', 'GET', params);
  }

  Wattpad(params: { query: string }) {
    return this.request('/api/search/wattpad', 'GET', params);
  }

  Stickers(params: { query: string; page?: number; limit?: number }) {
    return this.request('/api/stickers/search', 'GET', params);
  }

  YTSearch(params: { query: string; limit?: number }) {
    return this.request('/api/yts/searchVideos', 'GET', params);
  }
  
  PinSearch(params: { query: string }) {
    return this.request('/api/pinterest/search', 'GET', params);
  }

  ImdbSearch(params: { query: string }) {
    return this.request('/api/imdb/search', 'GET', params);
  }

  // ==================== TOOLS ====================
  Dictionary(params: { word: string }) {
    return this.request('/api/tools/dictionary', 'GET', params);
  } 

  Screenshot(params: { url: string }) {
    return this.request('/api/screenshot/take', 'GET', params);
  }

  SSFull(params: { url: string; format?: string; fullSize?: boolean }) {
    return this.request('/api/tools/styletext', 'GET', params);
  }

  Translate(params: { text: string; from?: string; to?: string }) {
    return this.request('/api/translate/bing', 'GET', params);
  }

  Translate2(params: { text: string; from?: string; to?: string }) {
    return this.request('/api/translate/google', 'GET', params);
  }

  Ping(params: { url: string }) {
    return this.request('/api/tools/ping', 'GET', params);
  }

  Handwriting(params: { text: string }) {
    return this.request('/api/text/handwriting', 'GET', params);
  }

  TextStats(params: { text: string }) {
    return this.request('/api/text/stats', 'GET', params);
  }

  UnitConvert(params: { from: string; to: string; value: number }) {
    return this.request('/api/converter/unit', 'GET', params);
  }

  // ==================== PHOTOOXY ====================
  Battlefield(params: { text1: string; text2: string }) {
    return this.request('/api/photooxy/battle4', 'GET', params);
  }

  TikTokEffect(params: { text1: string; text2: string }) {
    return this.request('/api/photooxy/tiktok', 'GET', params);
  }

  CustomPhoto(params: { url: string; text: string }) {
    return this.request('/api/photooxy/custom', 'GET', params);
  }

  // ==================== EPHOTO360 ====================
  WolfGalaxy(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/wolfGalaxy', 'GET', params);
  }

  FreeFire(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/freeFireBanner', 'GET', params);
  }

  ApexLegends(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/apexBanner', 'GET', params);
  }

  CustomEphoto(params: { url: string; text: string }) {
    return this.request('/api/ephoto/custom', 'GET', params);
  }

  // ==================== INFORMATION ====================
  GithubRepo(params: { owner: string; repo: string }) {
    return this.request('/api/github/repo', 'GET', params);
  }

  Universities(params: { country: string }) {
    return this.request('/api/info/universities', 'GET', params);
  }

  IPLookup(params: { ip: string }) {
    return this.request('/api/info/ipinfo', 'GET', params);
  }

  Trends(params: { country: string }) {
    return this.request('/api/info/trends', 'GET', params);
  }

  Weather(params: { city: string }) {
    return this.request('/api/info/weather', 'GET', params);
  }

  Country(params: { name: string }) {
    return this.request('/api/info/country', 'GET', params);
  }

  Wikipedia(params: { query: string }) {
    return this.request('/api/info/wikipedia', 'GET', params);
  }

  // ==================== CRYPTO ====================
 CoinInfo(params: { id: string }) {
  return this.request('/api/info/coininfo', 'GET', params);
 }

 CoinsList() {
  return this.request('/api/info/cointags', 'GET');
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

export default API;
export { API, APIConfig, APIResponse };


  
