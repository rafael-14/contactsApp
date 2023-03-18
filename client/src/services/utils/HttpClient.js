import APIError from '../../errors/APIError';

class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(path) {
    const response = await fetch(`${this.baseURL}${path}`);
    let body;
    const contentType = response.headers.get('Content-Type');
    if (contentType.includes('application/json')) body = await response.json();
    if (response.ok) return body;
    throw new APIError(response, body);
  }
}

export default HttpClient;
