const envApiBase = import.meta.env.VITE_API_URL?.trim();

// In production we always use same-origin API so deployments don't accidentally
// point to preview/staging backends.
const API_BASE = import.meta.env.PROD ? '/api' : (envApiBase || '/api');

export default API_BASE;
