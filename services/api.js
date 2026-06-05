// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    console.error('Error Status:', error.response?.status);
    console.error('Error URL:', error.config?.url);
    return Promise.reject(error);
  }
);

// ==================== BOOKING APIs ====================

// Get all bookings with filters
export const getBookings = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/bookings?${params.toString()}`);
  return response.data;
};

// Get booking by ID
export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// Get booking by GR number
export const getBookingByGrNo = async (grNo) => {
  const response = await api.get(`/bookings/grn/${grNo}`);
  return response.data;
};

// Create new booking
export const createBooking = async (bookingData) => {
  console.log('Creating booking with data:', bookingData);
  const response = await api.post('/bookings', bookingData);
  console.log('Create booking response:', response.data);
  return response.data;
};

// Update booking
export const updateBooking = async (id, bookingData) => {
  console.log(`Updating booking ${id} with data:`, bookingData);
  const response = await api.put(`/bookings/${id}`, bookingData);
  console.log('Update booking response:', response.data);
  return response.data;
};

// Cancel booking
export const cancelBooking = async (id, cancelledReason) => {
  console.log(`Cancelling booking ${id} with reason:`, cancelledReason);
  const response = await api.put(`/bookings/${id}/cancel`, { cancelledReason });
  return response.data;
};

// Restore booking
export const restoreBooking = async (id) => {
  console.log(`Restoring booking ${id}`);
  const response = await api.put(`/bookings/${id}/restore`);
  return response.data;
};

// Delete booking (permanent)
export const deleteBooking = async (id) => {
  console.log(`Deleting booking ${id}`);
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// Get booking statistics
export const getBookingStats = async () => {
  const response = await api.get('/bookings/stats');
  return response.data;
};

// Update POD entry
export const updatePodEntry = async (id, podEntry) => {
  const response = await api.put(`/bookings/${id}/pod`, { podEntry });
  return response.data;
};

// Update detention
export const updateDetention = async (id, detentionDays, detentionAmount) => {
  const response = await api.put(`/bookings/${id}/detention`, { detentionDays, detentionAmount });
  return response.data;
};

// ==================== CLIENT APIs ====================

// Get all clients
export const getClients = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/clients?${params.toString()}`);
  return response.data;
};

// Create new client
export const createClient = async (clientData) => {
  console.log('Creating client with data:', clientData);
  const response = await api.post('/clients', clientData);
  console.log('Create client response:', response.data);
  return response.data;
};

// Update client
export const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

// Delete client
export const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};

// Search client by ID type
export const searchClient = async (idType, idValue) => {
  console.log(`Searching client by ${idType}: ${idValue}`);
  const response = await api.get(`/clients/search?idType=${idType}&idValue=${idValue}`);
  console.log('Search client response:', response.data);
  return response.data;
};

// ==================== DASHBOARD APIs ====================

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// Get booking trends
export const getBookingTrends = async (year, months) => {
  const response = await api.get(`/dashboard/trends?year=${year}&months=${months}`);
  return response.data;
};

// Get branch performance
export const getBranchPerformance = async () => {
  const response = await api.get('/dashboard/branches');
  return response.data;
};

// ==================== FILE UPLOAD APIs ====================

// Upload single file
export const uploadFile = async (file, type = 'uploads', bookingId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  if (bookingId) formData.append('bookingId', bookingId);
  
  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Upload multiple files
export const uploadMultipleFiles = async (files, type = 'uploads', bookingId = null) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('type', type);
  if (bookingId) formData.append('bookingId', bookingId);
  
  const response = await api.post('/files/upload-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete file
export const deleteFile = async (publicId) => {
  const response = await api.delete(`/files/${publicId}`);
  return response.data;
};

// Get file URL
export const getFileUrl = async (publicId) => {
  const response = await api.get(`/files/${publicId}`);
  return response.data;
};

// ==================== STATIC DATA APIs ====================

// Get content categories
export const getContentCategories = async () => {
  try {
    const response = await api.get('/static/content-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching content categories, using fallback data:', error);
    // Return fallback data
    return {
      success: true,
      data: [
        {
          id: 1, name: "Electrical Goods",
          subCategories: [
            { id: 11, name: "Fan", parentId: 1 },
            { id: 12, name: "Switch Boards", parentId: 1 },
            { id: 13, name: "Wires", parentId: 1 },
            { id: 14, name: "Light/LED", parentId: 1 },
          ]
        },
        {
          id: 2, name: "Electronics",
          subCategories: [
            { id: 21, name: "Mobile Phones", parentId: 2 },
            { id: 22, name: "Laptops", parentId: 2 },
            { id: 23, name: "TV/Monitors", parentId: 2 },
          ]
        },
        {
          id: 3, name: "Automobile Parts",
          subCategories: [
            { id: 31, name: "Engine Parts", parentId: 3 },
            { id: 32, name: "Tyres", parentId: 3 },
            { id: 33, name: "Batteries", parentId: 3 },
          ]
        },
        {
          id: 4, name: "Chemicals/Paints",
          subCategories: [
            { id: 41, name: "Industrial Chemicals", parentId: 4 },
            { id: 42, name: "Paints", parentId: 4 },
          ]
        },
        {
          id: 5, name: "Textiles/Clothes",
          subCategories: [
            { id: 51, name: "Readymade Garments", parentId: 5 },
            { id: 52, name: "Fabrics", parentId: 5 },
          ]
        },
        {
          id: 6, name: "General Cargo",
          subCategories: [
            { id: 61, name: "General Goods", parentId: 6 },
            { id: 62, name: "Consumer Goods", parentId: 6 },
          ]
        },
      ]
    };
  }
};

// Get packing types
export const getPackingTypes = async () => {
  try {
    const response = await api.get('/static/packing-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching packing types, using fallback data:', error);
    return {
      success: true,
      data: [
        { id: 1, name: "BOX", minWeight: 0, maxWeight: 30, defaultWeight: 0 },
        { id: 2, name: "CARTON", minWeight: 0, maxWeight: 50, defaultWeight: 0 },
        { id: 3, name: "WOODEN BOX", minWeight: 0, maxWeight: 40, defaultWeight: 0 },
        { id: 4, name: "PALLET", minWeight: 0, maxWeight: 200, defaultWeight: 0 },
        { id: 5, name: "BAG", minWeight: 0, maxWeight: 50, defaultWeight: 0 },
        { id: 6, name: "BORI", minWeight: 0, maxWeight: 60, defaultWeight: 0 },
        { id: 7, name: "BORA", minWeight: 0, maxWeight: 80, defaultWeight: 0 },
        { id: 8, name: "DRUM", minWeight: 0, maxWeight: 200, defaultWeight: 0 },
        { id: 9, name: "LOOSE", minWeight: 0, maxWeight: 1000, defaultWeight: 0 },
      ]
    };
  }
};

// Get branches
export const getBranches = async () => {
  try {
    const response = await api.get('/static/branches');
    return response.data;
  } catch (error) {
    console.error('Error fetching branches, using fallback data:', error);
    return {
      success: true,
      data: ["DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA", "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "JAIPUR"]
    };
  }
};

// ==================== MANUAL BOOKING APIs ====================

// Get all manual bookings
export const getManualBookings = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/bookings-manual?${params.toString()}`);
  return response.data;
};

// Get manual booking by ID
export const getManualBookingById = async (id) => {
  const response = await api.get(`/bookings-manual/${id}`);
  return response.data;
};

// Get manual booking by GR number
export const getManualBookingByGrNo = async (grNo) => {
  const response = await api.get(`/bookings-manual/grn/${grNo}`);
  return response.data;
};

// Create new manual booking
export const createManualBooking = async (bookingData) => {
  console.log('Creating manual booking with data:', bookingData);
  const response = await api.post('/bookings-manual', bookingData);
  console.log('Create manual booking response:', response.data);
  return response.data;
};

// Update manual booking
export const updateManualBooking = async (id, bookingData) => {
  console.log(`Updating manual booking ${id} with data:`, bookingData);
  const response = await api.put(`/bookings-manual/${id}`, bookingData);
  return response.data;
};

// Cancel manual booking
export const cancelManualBooking = async (id, cancelledReason) => {
  console.log(`Cancelling manual booking ${id} with reason:`, cancelledReason);
  const response = await api.put(`/bookings-manual/${id}/cancel`, { cancelledReason });
  return response.data;
};

// Restore manual booking
export const restoreManualBooking = async (id) => {
  console.log(`Restoring manual booking ${id}`);
  const response = await api.put(`/bookings-manual/${id}/restore`);
  return response.data;
};

// Delete manual booking
export const deleteManualBooking = async (id) => {
  console.log(`Deleting manual booking ${id}`);
  const response = await api.delete(`/bookings-manual/${id}`);
  return response.data;
};

// Get manual booking statistics
export const getManualBookingStats = async () => {
  const response = await api.get('/bookings-manual/stats');
  return response.data;
};

// ==================== HEALTH CHECK ====================

// Health check endpoint
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: error.message };
  }
};

export default api;