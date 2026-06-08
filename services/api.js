// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URI || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for debugging and authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('selectedBranch');
      localStorage.removeItem('branchCode');
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================

// Login user
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('isLoggedIn', 'true');
  }
  return response.data;
};

// Select branch after login
export const selectBranch = async (branch, branchCode) => {
  const response = await api.post('/auth/select-branch', { branch, branchCode });
  if (response.data.data) {
    localStorage.setItem('selectedBranch', response.data.data.branch);
    localStorage.setItem('branchCode', response.data.data.branchCode);
  }
  return response.data;
};

// Get current user with branch info
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('selectedBranch');
    localStorage.removeItem('branchCode');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

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

// Get branches - Returns array of objects with value and text
export const getBranches = async () => {
  try {
    const response = await api.get('/static/branches');
    return response.data;
  } catch (error) {
    console.error('Error fetching branches, using fallback data:', error);
    return {
      success: true,
      data: [
  { value: "286", text: "AGARTALA" },
  { value: "125", text: "AGRA (YOGESH SHARMA)" },
  { value: "356", text: "AHMEDABAD CITY" },
  { value: "355", text: "AHMEDABAD-ASALAI (HUB)" },
  { value: "333", text: "AKBERPUR/AMBEDKAR NAGAR" },
  { value: "127", text: "ALIGARH (MUKESH SINGH)" },
  { value: "126", text: "ALIGARH (RAVI)" },
  { value: "265", text: "ALIPURDUAR" },
  { value: "191", text: "ALLAHABAD" },
  { value: "157", text: "ALZALGARH" },
  { value: "139", text: "AMRITSAR" },
  { value: "379", text: "ANANTAPUR" },
  { value: "163", text: "ANOOPSHER" },
  { value: "197", text: "ARARIA COURT" },
  { value: "196", text: "ARRAH" },
  { value: "261", text: "ASANSOL" },
  { value: "198", text: "AURANGABAD B.R" },
  { value: "172", text: "AURANGABAD U.P" },
  { value: "173", text: "AZAMGARH" },
  { value: "159", text: "BABRALA" },
  { value: "140", text: "BADDI" },
  { value: "351", text: "BAHERI" },
  { value: "166", text: "BAHJOI" },
  { value: "370", text: "BAKROL" },
  { value: "174", text: "BALLIA" },
  { value: "262", text: "BANKURA" },
  { value: "353", text: "BARAUT" },
  { value: "347", text: "BAREILLY" },
  { value: "182", text: "BARHALGANJ" },
  { value: "242", text: "BARHI" },
  { value: "280", text: "BARPETA ROAD" },
  { value: "290", text: "BARWALA" },
  { value: "175", text: "BASTI" },
  { value: "106", text: "BAWANA" },
  { value: "203", text: "BEGUSARAI" },
  { value: "178", text: "BELTHARA ROAD" },
  { value: "339", text: "BERHAMPORE W.B" },
  { value: "199", text: "BETTIAH" },
  { value: "205", text: "BHABHUA" },
  { value: "316", text: "BHADOHI" },
  { value: "201", text: "BHAGALPUR" },
  { value: "358", text: "BHAVNAGAR" },
  { value: "135", text: "BHIWANI" },
  { value: "169", text: "BHULANDSHAHAR" },
  { value: "210", text: "BIHARIGANJ" },
  { value: "207", text: "BIHARSHARIF" },
  { value: "208", text: "BIHIYA" },
  { value: "200", text: "BIHTA" },
  { value: "149", text: "BIJNOR" },
  { value: "278", text: "BILASIPARA" },
  { value: "279", text: "BONGAIGOAN" },
  { value: "202", text: "BRAHMAPUR" },
  { value: "263", text: "BURDWAN" },
  { value: "206", text: "BUXAR" },
  { value: "341", text: "CHANCHAL" },
  { value: "165", text: "CHANDAUSI" },
  { value: "141", text: "CHANDIGARH (GANESH)" },
  { value: "308", text: "CHANDIGARH (HARGUN)" },
  { value: "337", text: "CHANDPUR" },
  { value: "243", text: "CHAS" },
  { value: "211", text: "CHHAPRA" },
  { value: "270", text: "COOCHBEHAR" },
  { value: "00000", text: "CORPORATE OFFICE" },
  { value: "275", text: "DALKOLA" },
  { value: "245", text: "DALTONGANJ" },
  { value: "212", text: "DARBHANGA" },
  { value: "213", text: "DAUDNAGAR" },
  { value: "107", text: "DAYA BASTI" },
  { value: "214", text: "DEHRI ON SON" },
  { value: "246", text: "DEOGHAR" },
  { value: "180", text: "DEORIA" },
  { value: "155", text: "DHAMPUR" },
  { value: "305", text: "DHANAURA" },
  { value: "247", text: "DHANBAD" },
  { value: "362", text: "DHORA JI" },
  { value: "282", text: "DHUBRI" },
  { value: "266", text: "DHUPGURI" },
  { value: "167", text: "DIBAI" },
  { value: "271", text: "DINHATA" },
  { value: "294", text: "DIRECT PARTY" },
  { value: "307", text: "DUMKA" },
  { value: "215", text: "DUMROAN" },
  { value: "264", text: "DURGAPUR" },
  { value: "179", text: "FAIZABAD" },
  { value: "267", text: "FALAKATA" },
  { value: "136", text: "FARIDABAD" },
  { value: "216", text: "FORBISGANJ" },
  { value: "109", text: "GANDHI NAGAR (AJAY ANAND)" },
  { value: "108", text: "GANDHI NAGAR (ASHOK)" },
  { value: "300", text: "GANDHI NAGAR GRL" },
  { value: "343", text: "GANGARAMPUR" },
  { value: "248", text: "GARWA" },
  { value: "217", text: "GAYA" },
  { value: "128", text: "GHAZIABAD" },
  { value: "101", text: "GHAZIABAD R.O" },
  { value: "184", text: "GHAZIPUR" },
  { value: "185", text: "GHOSI" },
  { value: "249", text: "GIRIDIH" },
  { value: "283", text: "GOALPARA" },
  { value: "251", text: "GODDA" },
  { value: "218", text: "GOPALGANJ" },
  { value: "183", text: "GORAKHPUR" },
  { value: "336", text: "GOSAINGANJ" },
  { value: "232", text: "GULABBAGH" },
  { value: "168", text: "GULAOTHI" },
  { value: "250", text: "GUMLA" },
  { value: "219", text: "HAJIPUR" },
  { value: "364", text: "HALOL" },
  { value: "317", text: "HARRAIYA" },
  { value: "315", text: "HATA" },
  { value: "129", text: "HATHRAS" },
  { value: "252", text: "HAZARIBAGH" },
  { value: "102", text: "HEAD OFFICE" },
  { value: "385", text: "HINDUPUR" },
  { value: "374", text: "HYDERABAD" },
  { value: "276", text: "ISLAMPUR" },
  { value: "137", text: "JAGADARI" },
  { value: "377", text: "JAGITAL" },
  { value: "164", text: "JAHANGIRABAD" },
  { value: "220", text: "JAINAGAR" },
  { value: "334", text: "JALALPUR" },
  { value: "142", text: "JALANDAR" },
  { value: "268", text: "JALPAIGURI" },
  { value: "110", text: "JAMNA BAZAR" },
  { value: "253", text: "JAMSHEDPUR" },
  { value: "221", text: "JAMUI" },
  { value: "186", text: "JAUNPUR" },
  { value: "363", text: "JETPUR" },
  { value: "345", text: "JHANJHARPUR" },
  { value: "254", text: "JHARIYA" },
  { value: "111", text: "JHILMIL" },
  { value: "255", text: "JHUMRITALIYA" },
  { value: "386", text: "KADAPA" },
  { value: "293", text: "KALA AMB" },
  { value: "297", text: "KALIACHAK" },
  { value: "296", text: "KALIYAGANJ" },
  { value: "112", text: "KAMLA MARKET (RAMAN RAI)" },
  { value: "113", text: "KAMLA MARKET (RAVINDER PANDEY)" },
  { value: "187", text: "KANPUR" },
  { value: "324", text: "KAPTANGANJ" },
  { value: "376", text: "KARIM NAGAR" },
  { value: "298", text: "KARNAL" },
  { value: "115", text: "KAROL BAGH (NITISH)" },
  { value: "114", text: "KAROL BAGH (S.K.OBERI)" },
  { value: "116", text: "KASHMERE GATE (RAM GOPAL)" },
  { value: "117", text: "KASHMERE GATE (VIVEK)" },
  { value: "321", text: "KASIA" },
  { value: "223", text: "KATIHAR" },
  { value: "204", text: "KHAGARIA" },
  { value: "320", text: "KHALILABAD" },
  { value: "103", text: "KHANNA MARKET" },
  { value: "304", text: "KHANNA MARKET GRL" },
  { value: "104", text: "KHERA KALAN (HUB)" },
  { value: "306", text: "KIRATPUR" },
  { value: "222", text: "KISHANGANJ" },
  { value: "224", text: "KOCHAS" },
  { value: "285", text: "KOKRAJHAR" },
  { value: "284", text: "KRISHNAI" },
  { value: "346", text: "KUNDA" },
  { value: "387", text: "KURNOOL" },
  { value: "319", text: "KUSHINAGAR" },
  { value: "329", text: "LAKHISARAI" },
  { value: "318", text: "LALGANJ" },
  { value: "366", text: "LIBASPUR" },
  { value: "244", text: "LOHARDGA" },
  { value: "188", text: "LUCKNOW" },
  { value: "143", text: "LUDHIANA" },
  { value: "332", text: "LUDHIANA (BOBBY)" },
  { value: "331", text: "LUDHIANA (GOSALA)" },
  { value: "144", text: "LUDHIANA CITY" },
  { value: "145", text: "LUDHIANA GILL ROAD" },
  { value: "190", text: "MACHHALISHAR" },
  { value: "227", text: "MADHEPURA" },
  { value: "225", text: "MADHUBANI" },
  { value: "256", text: "MADHUPUR" },
  { value: "322", text: "MAHARAJGANJ" },
  { value: "369", text: "MAIRWA" },
  { value: "274", text: "MALDA" },
  { value: "146", text: "MALERKOTLA" },
  { value: "118", text: "MANGOLPURI" },
  { value: "272", text: "MATHABHANGA" },
  { value: "189", text: "MAU" },
  { value: "368", text: "MAYAPURI" },
  { value: "269", text: "MAYNAGURI" },
  { value: "373", text: "MEERUT ( B.N MALHOTRA)" },
  { value: "130", text: "MEERUT (KAMAL DHINGRA)" },
  { value: "312", text: "MIRZAPUR" },
  { value: "292", text: "MOHALI" },
  { value: "176", text: "MOHAMMDABAD GOHNA" },
  { value: "226", text: "MOHANIYA" },
  { value: "170", text: "MORADABAD" },
  { value: "299", text: "MORI GATE GRL" },
  { value: "326", text: "MOTIHARI" },
  { value: "177", text: "MUBARAKPUR" },
  { value: "311", text: "MUGHALSARAI" },
  { value: "367", text: "MUNGRA BADSHAHPUR" },
  { value: "131", text: "MURAD NAGAR" },
  { value: "229", text: "MURLIGANJ" },
  { value: "340", text: "MURSHIDABAD" },
  { value: "148", text: "MUZAFFARNAGAR" },
  { value: "228", text: "MUZAFFARPUR" },
  { value: "154", text: "NAGINA" },
  { value: "281", text: "NALBARI" },
  { value: "382", text: "NANDYAL" },
  { value: "119", text: "NARELA" },
  { value: "230", text: "NARKATIYA GANJ" },
  { value: "357", text: "NAROL" },
  { value: "350", text: "NAWABGANJ" },
  { value: "209", text: "NAWADA" },
  { value: "150", text: "NETHAUR" },
  { value: "120", text: "NEW LAJPAT RAI MARKET" },
  { value: "132", text: "NOIDA" },
  { value: "152", text: "NOJIBABAD" },
  { value: "151", text: "NOORPUR" },
  { value: "313", text: "PADRAUNA" },
  { value: "289", text: "PANCHKULA" },
  { value: "138", text: "PANIPAT" },
  { value: "288", text: "PARWANOO" },
  { value: "231", text: "PATNA" },
  { value: "147", text: "PHAGWARA" },
  { value: "257", text: "PHUSRO" },
  { value: "348", text: "PILIBHIT" },
  { value: "384", text: "PODDATUR" },
  { value: "310", text: "PRATAPGARH" },
  { value: "349", text: "PURANPUR" },
  { value: "233", text: "PURNIA" },
  { value: "327", text: "PURULIA" },
  { value: "371", text: "RAFIGANJ" },
  { value: "344", text: "RAGHUNATHGANJ" },
  { value: "295", text: "RAIGANJ" },
  { value: "383", text: "RAJAHMUNDRY" },
  { value: "361", text: "RAJKOT (METODA)" },
  { value: "360", text: "RAJKOT (SHAPAR)" },
  { value: "359", text: "RAJKOT - A" },
  { value: "258", text: "RAMGARH" },
  { value: "259", text: "RANCHI" },
  { value: "354", text: "RANGIA" },
  { value: "328", text: "RANIGANJ" },
  { value: "192", text: "RASARA" },
  { value: "352", text: "RAXAUL" },
  { value: "105", text: "SADAR BAZAR" },
  { value: "133", text: "SAHARANPUR" },
  { value: "239", text: "SAHARSA" },
  { value: "158", text: "SAHASWAN" },
  { value: "181", text: "SALEMPUR" },
  { value: "234", text: "SAMASTIPUR" },
  { value: "171", text: "SAMBAL" },
  { value: "342", text: "SAMSI" },
  { value: "301", text: "SANJAY GANDHI GRL" },
  { value: "121", text: "SANJAY GANDHI TPT" },
  { value: "235", text: "SASARAM" },
  { value: "162", text: "SECUNDERABAD" },
  { value: "153", text: "SEOHARA" },
  { value: "122", text: "SHAHDARA" },
  { value: "325", text: "SHAHGANJ" },
  { value: "236", text: "SHERGHATI" },
  { value: "160", text: "SHIKARPUR" },
  { value: "338", text: "SIDDHARTHNAGAR" },
  { value: "375", text: "SIDDIPET" },
  { value: "277", text: "SILLIGURI" },
  { value: "260", text: "SIMDEGA" },
  { value: "314", text: "SISWABAZAR" },
  { value: "237", text: "SITAMARHI" },
  { value: "238", text: "SIWAN" },
  { value: "161", text: "SIYANA" },
  { value: "287", text: "SOLAN" },
  { value: "381", text: "SRIKAKULAM" },
  { value: "193", text: "SULTANPUR" },
  { value: "240", text: "SUPAUL" },
  { value: "372", text: "SURAT" },
  { value: "323", text: "TAMKUHI" },
  { value: "335", text: "TANDA" },
  { value: "156", text: "THAKURDWARA" },
  { value: "134", text: "TRONICA CITY" },
  { value: "273", text: "TUFANGANJ" },
  { value: "302", text: "U P BORDER A JH UP" },
  { value: "303", text: "U P BORDER B BR" },
  { value: "309", text: "U P BORDER C ASM WB" },
  { value: "330", text: "U P BORDER D BR GP" },
  { value: "365", text: "VAPI" },
  { value: "194", text: "VARANASI" },
  { value: "378", text: "VIJAYWADA" },
  { value: "241", text: "VIKRAMGANJ" },
  { value: "388", text: "VISAKHAPATNAM" },
  { value: "380", text: "VIZIANAGARAM" },
  { value: "123", text: "WAZIRPUR" },
  { value: "195", text: "YUSUFPUR" },
  { value: "124", text: "ZAKHIRA" },
  { value: "291", text: "ZIRAKPUR" },
]
    };
  }
};

// Get to stations for manifest
export const getToStations = async () => {
  try {
    const response = await api.get('/static/to-stations');
    return response.data;
  } catch (error) {
    console.error('Error fetching to stations, using fallback data:', error);
    return {
      success: true,
      data: ["U P BORDER A JH UP", "U P BORDER D BR GP", "U P BORDER B BR", "DELHI", "MUMBAI", "BANGALORE"]
    };
  }
};

// Get drivers list
export const getDrivers = async () => {
  try {
    const response = await api.get('/static/drivers');
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers, using fallback data:', error);
    return {
      success: true,
      data: ["Rajesh Kumar", "Suresh Singh", "Mahesh Sharma", "Ramesh Gupta", "Satish Verma", "Vikash Singh"]
    };
  }
};

// Get vendors list
export const getVendors = async () => {
  try {
    const response = await api.get('/static/vendors');
    return response.data;
  } catch (error) {
    console.error('Error fetching vendors, using fallback data:', error);
    return {
      success: true,
      data: ["TATA MOTORS", "ASHOK LEYLAND", "MAHINDRA", "EICHER", "BHARAT BENZ"]
    };
  }
};

// Get loading persons list
export const getLoadingPersons = async () => {
  try {
    const response = await api.get('/static/loading-persons');
    return response.data;
  } catch (error) {
    console.error('Error fetching loading persons, using fallback data:', error);
    return {
      success: true,
      data: ["Mohan Singh", "Ravi Kumar", "Amit Sharma", "Pradeep Verma"]
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

// ==================== LOCAL MANIFEST APIs ====================

// Get all manifests with filters
export const getManifests = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/local-manifests?${params.toString()}`);
  return response.data;
};

// Get manifest by ID
export const getManifestById = async (id) => {
  const response = await api.get(`/local-manifests/${id}`);
  return response.data;
};

// Get manifest by manifest number
export const getManifestByNo = async (manifestNo) => {
  const response = await api.get(`/local-manifests/manifest/${manifestNo}`);
  return response.data;
};

// Create new manifest
export const createManifest = async (manifestData) => {
  console.log('Creating manifest with data:', manifestData);
  const response = await api.post('/local-manifests', manifestData);
  console.log('Create manifest response:', response.data);
  return response.data;
};

// Update manifest
export const updateManifest = async (id, manifestData) => {
  console.log(`Updating manifest ${id} with data:`, manifestData);
  const response = await api.put(`/local-manifests/${id}`, manifestData);
  return response.data;
};

// Update destination
export const updateDestination = async (id, updateData) => {
  console.log(`Updating destination for manifest ${id}:`, updateData);
  const response = await api.put(`/local-manifests/${id}/update-destination`, updateData);
  return response.data;
};

// Cancel manifest
export const cancelManifest = async (id, cancelledReason) => {
  console.log(`Cancelling manifest ${id} with reason:`, cancelledReason);
  const response = await api.put(`/local-manifests/${id}/cancel`, { cancelledReason });
  return response.data;
};

// Restore manifest
export const restoreManifest = async (id) => {
  console.log(`Restoring manifest ${id}`);
  const response = await api.put(`/local-manifests/${id}/restore`);
  return response.data;
};

// Delete manifest
export const deleteManifest = async (id) => {
  console.log(`Deleting manifest ${id}`);
  const response = await api.delete(`/local-manifests/${id}`);
  return response.data;
};

// Get manifest statistics
export const getManifestStats = async () => {
  const response = await api.get('/local-manifests/stats');
  return response.data;
};

// ==================== LONG ROUTE MANIFEST APIs ====================

// Get all long route manifests with filters
export const getLongRouteManifests = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/long-route-manifests?${params.toString()}`);
  return response.data;
};

// Get manifest by ID
export const getLongRouteManifestById = async (id) => {
  const response = await api.get(`/long-route-manifests/${id}`);
  return response.data;
};

// Get manifest by manifest number
export const getLongRouteManifestByNo = async (manifestNo) => {
  const response = await api.get(`/long-route-manifests/manifest/${manifestNo}`);
  return response.data;
};

// Create new long route manifest
export const createLongRouteManifest = async (manifestData) => {
  console.log('Creating long route manifest with data:', manifestData);
  const response = await api.post('/long-route-manifests', manifestData);
  console.log('Create manifest response:', response.data);
  return response.data;
};

// Update long route manifest
export const updateLongRouteManifest = async (id, manifestData) => {
  console.log(`Updating manifest ${id} with data:`, manifestData);
  const response = await api.put(`/long-route-manifests/${id}`, manifestData);
  return response.data;
};

// Update dispatch details
export const updateDispatchDetails = async (id, dispatchedPckgs, dispatchedWt) => {
  console.log(`Updating dispatch details for manifest ${id}:`, { dispatchedPckgs, dispatchedWt });
  const response = await api.put(`/long-route-manifests/${id}/dispatch`, { dispatchedPckgs, dispatchedWt });
  return response.data;
};

// Cancel manifest
export const cancelLongRouteManifest = async (id, cancelledReason) => {
  console.log(`Cancelling manifest ${id} with reason:`, cancelledReason);
  const response = await api.put(`/long-route-manifests/${id}/cancel`, { cancelledReason });
  return response.data;
};

// Restore manifest
export const restoreLongRouteManifest = async (id) => {
  console.log(`Restoring manifest ${id}`);
  const response = await api.put(`/long-route-manifests/${id}/restore`);
  return response.data;
};

// Delete manifest
export const deleteLongRouteManifest = async (id) => {
  console.log(`Deleting manifest ${id}`);
  const response = await api.delete(`/long-route-manifests/${id}`);
  return response.data;
};

// Get manifest statistics
export const getLongRouteManifestStats = async () => {
  const response = await api.get('/long-route-manifests/stats');
  return response.data;
};

// Get stock items for dispatch
export const getStockItems = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/long-route-manifests/stock?${params.toString()}`);
  return response.data;
};

// ==================== LORRY HIRE CHALLAN APIs ====================

// Get all LHCs with filters
export const getLHCs = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/lorry-hire-challans?${params.toString()}`);
  return response.data;
};

// Get LHC by ID
export const getLHCById = async (id) => {
  const response = await api.get(`/lorry-hire-challans/${id}`);
  return response.data;
};

// Get LHC by LHC number
export const getLHCByNo = async (lhcNo) => {
  const response = await api.get(`/lorry-hire-challans/lhc/${lhcNo}`);
  return response.data;
};

// Create new LHC
export const createLHC = async (lhcData) => {
  console.log('Creating LHC with data:', lhcData);
  const response = await api.post('/lorry-hire-challans', lhcData);
  console.log('Create LHC response:', response.data);
  return response.data;
};

// Update LHC
export const updateLHC = async (id, lhcData) => {
  console.log(`Updating LHC ${id} with data:`, lhcData);
  const response = await api.put(`/lorry-hire-challans/${id}`, lhcData);
  return response.data;
};

// Cancel LHC
export const cancelLHC = async (id, cancelledReason) => {
  console.log(`Cancelling LHC ${id} with reason:`, cancelledReason);
  const response = await api.put(`/lorry-hire-challans/${id}/cancel`, { cancelledReason });
  return response.data;
};

// Restore LHC
export const restoreLHC = async (id) => {
  console.log(`Restoring LHC ${id}`);
  const response = await api.put(`/lorry-hire-challans/${id}/restore`);
  return response.data;
};

// Delete LHC
export const deleteLHC = async (id) => {
  console.log(`Deleting LHC ${id}`);
  const response = await api.delete(`/lorry-hire-challans/${id}`);
  return response.data;
};

// Get LHC statistics
export const getLHCStats = async () => {
  const response = await api.get('/lorry-hire-challans/stats');
  return response.data;
};

// Get pending manifests
export const getPendingManifests = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/lorry-hire-challans/pending-manifests?${params.toString()}`);
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