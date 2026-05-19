const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');

const configuredApiBase = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL);

export const API_BASE = configuredApiBase || '/api';
export const SOCKET_URL = trimTrailingSlash(import.meta.env.VITE_SOCKET_URL)
  || (API_BASE === '/api' ? '/' : API_BASE.replace(/\/api$/, ''));

export const apiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${path}`;
};

export const authHeaders = (headers = {}) => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: authHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }),
  };

  const response = await fetch(apiUrl(endpoint), config);

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const error = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : { error: await response.text().catch(() => '') };

    console.error('API Error:', error);
    if (error.details) {
      console.error('Validation Details:', error.details);
      console.error('Validation Details JSON:', JSON.stringify(error.details, null, 2));
    }

    const details = Array.isArray(error.details) ? error.details : [];
    const apiError = new Error(details[0]?.msg || error.error || error.message || `Request failed with status ${response.status}`);
    apiError.status = response.status;
    apiError.details = details;
    throw apiError;
  }

  return response.json();
};
