// src/services/api.js
const API_BASE_URL = 'http://172.31.40.92:5000/api';

console.log('🔧 API Service loaded with base URL:', API_BASE_URL);

// Check if the backend server is reachable
export const checkConnectivity = async () => {
  console.log('🔍 Starting connectivity check to:', `${API_BASE_URL}/health`);
  
  try {
    console.log('📡 Attempting to fetch health endpoint...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Request timeout after 5 seconds');
      controller.abort();
    }, 5000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log('📨 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connectivity check successful:', data);
      return {
        connected: true,
        message: 'Connected successfully',
        details: {
          baseUrl: API_BASE_URL,
          status: response.status
        }
      };
    } else {
      console.error('❌ Backend responded with error status:', response.status, response.statusText);
      return {
        connected: false,
        message: `Server error: ${response.status}`,
        details: {
          baseUrl: API_BASE_URL,
          error: response.status
        }
      };
    }
  } catch (error) {
    console.error('💥 Connectivity check error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: typeof error
    });
    
    let message = 'Connection failed';
    if (error.name === 'AbortError') {
      message = 'Connection timeout after 5 seconds';
      console.error('❌ Connectivity check timed out after 5 seconds');
    } else if (error.name === 'TypeError') {
      message = 'Network error - server may not be running';
      console.error('❌ Network error - possibly CORS or server not running');
    } else {
      message = `Connection error: ${error.message}`;
      console.error('❌ Connectivity check failed with unknown error:', error.message);
    }
    
    return {
      connected: false,
      message,
      details: {
        baseUrl: API_BASE_URL,
        error: error.name
      }
    };
  }
};

// User service functions
export const userService = {
  // Get all users - FIXED METHOD NAME
  getAll: async () => {
    console.log('👥 Fetching all users from:', `${API_BASE_URL}/users`);
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      console.log('📨 getAll response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ Users fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error fetching users:', error);
      throw new Error(error.message || 'Failed to fetch users');
    }
  },

  // Get user by ID - FIXED METHOD NAME
  getById: async (id) => {
    console.log('👤 Fetching user by ID:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      console.log('📨 getById response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ User fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error fetching user:', error);
      throw new Error(error.message || 'Failed to fetch user');
    }
  },

  // Create new user - FIXED METHOD NAME
  create: async (userData) => {
    console.log('➕ Creating new user:', { name: userData.name, email: userData.email });
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('📨 create response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ User created successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error creating user:', error);
      throw new Error(error.message || 'Failed to create user');
    }
  },

  // Update user - FIXED METHOD NAME
  update: async (id, userData) => {
    console.log('✏️ Updating user:', id, { name: userData.name, email: userData.email });
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('📨 update response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ User updated successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error updating user:', error);
      throw new Error(error.message || 'Failed to update user');
    }
  },

  // Delete user - FIXED METHOD NAME
  delete: async (id) => {
    console.log('🗑️ Deleting user:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      
      console.log('📨 delete response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ User deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error deleting user:', error);
      throw new Error(error.message || 'Failed to delete user');
    }
  },

  // Legacy method names for backward compatibility
  getAllUsers: function() { return this.getAll(); },
  getUserById: function(id) { return this.getById(id); },
  createUser: function(userData) { return this.create(userData); },
  updateUser: function(id, userData) { return this.update(id, userData); },
  deleteUser: function(id) { return this.delete(id); }
};

// Generic API helper functions
export const apiHelper = {
  // Generic GET request
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },

  // Generic POST request
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  },

  // Generic PUT request
  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  },

  // Generic DELETE request
  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  },
};
