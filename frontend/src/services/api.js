import axios from 'axios';

// Render production backend URL fallback
const PRODUCTION_BACKEND_URL = 'https://peerconnect-a7dz.onrender.com/api';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If running on local computer or local IP
    if (hostname === 'localhost' || hostname === '127.0.0.1' || /^10\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
      return `http://${hostname}:5000/api`;
    }
  }

  // Fallback for deployed frontend (Vercel)
  return PRODUCTION_BACKEND_URL;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
