interface Config {
  apiUrl: string;
  apiKey: string | null;
}

interface Params {
  [key: string]: any;
  apikey?: string;
}

interface ApiResponse {
  result?: any;
  [key: string]: any;
}

let config: Config = {
  apiUrl: "https://api.nexoracle.com/api",
  apiKey: null,
};

function setConfig({ apiUrl, apiKey }: { apiUrl?: string; apiKey?: string }): void {
  if (apiUrl) config.apiUrl = apiUrl.endsWith("/api") ? apiUrl : apiUrl + "/api";
  if (apiKey) config.apiKey = apiKey;
}

function apiParams(params: Params): Params {
  if (params.apikey) return params;
  if (config.apiKey) return { ...params, apikey: config.apiKey };
  return params;
}

function buildOptions(method: string, params: Params): { urlParams?: URLSearchParams; options: RequestInit } {
  const finalParams = apiParams(params);
  const options: RequestInit = { method };

  if (method === "GET" || method === "DELETE") {
    const urlParams = new URLSearchParams();
    Object.entries(finalParams).forEach(([key, value]) => {
      urlParams.append(key, String(value));
    });
    return { urlParams, options };
  } else {
    const formData = new FormData();
    Object.entries(finalParams).forEach(([key, value]) => {
      formData.append(key, value);
    });
    options.body = formData;
    return { options };
  }
}

const fetchApi = {
  async json(
    endpoint: string,
    params: Params = {},
    fetchResultOnly: boolean = false,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
  ): Promise<any> {
    try {
      let url = new URL(endpoint, config.apiUrl);
      const { urlParams, options } = buildOptions(method, params);

      if (urlParams) url.search = urlParams.toString();

      const response = await fetch(url.toString(), options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = (await response.json()) as ApiResponse;
      return fetchResultOnly ? (data?.result ?? "No Result Found in API Response.") : data;
    } catch (err) {
      return fetchResultOnly ? "No Result Found in API Response." : { error: String(err) };
    }
  },

  async buffer(
    endpoint: string,
    params: Params = {},
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
  ): Promise<any> {
    try {
      let url = new URL(endpoint, config.apiUrl);
      const { urlParams, options } = buildOptions(method, params);

      if (urlParams) url.search = urlParams.toString();

      const response = await fetch(url.toString(), options);
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = (await response.json()) as ApiResponse;
        return data?.result ?? "No Results Found";
      } else {
        return await response.arrayBuffer();
      }
    } catch {
      return "No Results Found in API Response.";
    }
  },
};

export { setConfig, apiParams, fetchApi, config };
