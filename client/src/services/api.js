import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token to authorization headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API endpoint methods
export const authAPI = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password, role) => {
    const response = await API.post('/auth/register', { name, email, password, role });
    return response.data;
  },
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await API.post('/auth/logout');
    return response.data;
  },
};

export const productAPI = {
  getProducts: async (params = {}) => {
    const response = await API.get('/products', { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (data) => {
    const response = await API.post('/products', data);
    return response.data;
  },
  updateProduct: async (id, data) => {
    const response = await API.put(`/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },
  addProductReview: async (id, data) => {
    const response = await API.post(`/products/${id}/reviews`, data);
    return response.data;
  },
  updateProductReview: async (id, data) => {
    const response = await API.put(`/products/${id}/reviews`, data);
    return response.data;
  },
};

export const uploadAPI = {
  uploadImage: async (formData) => {
    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const cartAPI = {
  getCart: async () => {
    const response = await API.get('/cart');
    return response.data;
  },
  addToCart: async (productId, quantity) => {
    const response = await API.post('/cart', { productId, quantity });
    return response.data;
  },
  updateCartItem: async (productId, quantity) => {
    const response = await API.put(`/cart/${productId}`, { quantity });
    return response.data;
  },
  removeCartItem: async (productId) => {
    const response = await API.delete(`/cart/${productId}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await API.delete('/cart');
    return response.data;
  },
};

export const orderAPI = {
  placeOrder: async (shippingAddress) => {
    const response = await API.post('/orders', { shippingAddress });
    return response.data;
  },
  getMyOrders: async () => {
    const response = await API.get('/orders');
    return response.data;
  },
  getOrderDetails: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },
  getAllOrders: async () => {
    const response = await API.get('/orders/all');
    return response.data;
  },
  updateOrderStatus: async (id, orderStatus) => {
    const response = await API.put(`/orders/${id}/status`, { orderStatus });
    return response.data;
  },
};

export const userAPI = {
  getUsers: async () => {
    const response = await API.get('/users');
    return response.data;
  },
  getUser: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id, data) => {
    const response = await API.put(`/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },
};

export default API;
