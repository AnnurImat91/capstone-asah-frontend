export const BASE_URL = 'https://capstone-asah-backend-production.up.railway.app'; 

/**
 * Utility untuk memanggil API backend.
 * @param {string} endpoint - Misalnya '/auth/login' atau '/nasabah'
 * @param {string} method - Metode HTTP (GET, POST, PUT, DELETE, PATCH)
 * @param {object} data - Payload data untuk POST/PUT/PATCH
 * @param {string | null} token - JWT Token untuk permintaan terproteksi
 */
export const apiClient = async (endpoint, method = 'GET', data = null, token = null) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
        // Mencoba membaca body JSON untuk pesan error
        const result = await response.json().catch(() => ({ message: `Error ${response.status}: Failed to process request.` }));
        
        // Perbaikan: Ambil pesan error dari field 'message' atau 'error' atau default ke status
        const serverErrorMessage = result.message || result.error || `API Error: ${response.status} ${response.statusText}`;
        
        console.error('API Call Failed:', serverErrorMessage, result);
        throw new Error(serverErrorMessage);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Network or Parsing Error:', error);
    throw error; 
  }
};