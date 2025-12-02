import axios from 'axios';


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const possibleTokenKeys = [
    'token',
    'auth_token',
    'access_token',
    'jwt_token',
    'authToken',
    'backendToken'
  ];

  for (const key of possibleTokenKeys) {
    const token = localStorage.getItem(key);
    if (token && token !== 'null' && token !== 'undefined' && token !== '') {
      return token;
    }
  }


  for (const key of possibleTokenKeys) {
    const token = sessionStorage.getItem(key);
    if (token && token !== 'null' && token !== 'undefined' && token !== '') {
      return token;
    }
  }

  return null;
};

API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    

    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        headers: config.headers,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);


API.interceptors.response.use(
  (response) => {
   
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response Success:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });


    if (error.response?.status === 401) {
      console.log('Token expired or invalid, redirecting to login...');
      
      if (typeof window !== 'undefined') {
     
        const authKeys = [
          'token',
          'auth_token',
          'access_token',
          'jwt_token',
          'authToken',
          'backendToken',
          'user',
          'refreshToken'
        ];
        
        authKeys.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        // Redirect to login page
        window.location.href = '/auth/login?error=session_expired';
      }
    }


    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Check if backend server is running');
      if (typeof window !== 'undefined') {
        alert('Cannot connect to server. Please make sure backend is running on http://localhost:5000');
      }
    }

    return Promise.reject(error);
  }
);

export default API;