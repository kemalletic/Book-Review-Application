import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Updated port and added /auth path

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  return response.data;
};

export const saveToken = (token: string) => {
  if (!token) {
    console.error('Attempting to save null or empty token');
    return;
  }
  console.log('Saving token:', token.substring(0, 20) + '...');
  localStorage.setItem('token', token);
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found in storage');
    return null;
  }
  console.log('Retrieved token:', token.substring(0, 20) + '...');
  return token;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const getUserProfile = async () => {
  const token = getToken();
  console.log('Token from storage:', token ? 'present' : 'null');
  
  if (!token) {
    console.error('No authentication token found');
    throw new Error('No authentication token found');
  }

  try {
    console.log('Making profile request with token:', token.substring(0, 20) + '...');
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching profile:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        headers: error.config?.headers
      }
    });
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Authentication failed, logging out');
      logout();
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to load profile data');
  }
};

export const updateUserProfile = async (profileData: {
  name: string;
  email: string;
  bio: string;
  avatarUrl?: string;
}) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}; 