// Service layer untuk furniture catalog
// Mudah untuk di-switch ke real API nantinya

import { 
  getAllProducts as getAllProductsMock, 
  searchProducts as searchProductsMock, 
  getProductsByCategory as getProductsByCategoryMock 
} from '../data/mockFurnitureProducts';

// Flag untuk toggle antara mock dan real API
const USE_MOCK_DATA = false;

// Base URL untuk API (gunakan proxy Vite di dev: /api -> 127.0.0.1:8000)
const API_BASE_URL = '/api/v1';

// Helper untuk normalisasi URL gambar dari API
function normalizeImageUrl(gambarField) {
  let url = null;
  if (Array.isArray(gambarField) && gambarField.length > 0) {
    url = gambarField[0];
  } else if (typeof gambarField === 'string' && gambarField.trim() !== '') {
    url = gambarField.trim();
  }

  // Fallback jika kosong/null
  if (!url) return '/placeholder.svg';

  // Jika path relatif dari backend (mis. "/uploads/..." atau "uploads/..."), gunakan proxy vite
  if (url.startsWith('/uploads')) {
    return url; // akan diproxy oleh vite jika ada rule /uploads
  }
  if (url.startsWith('uploads/')) {
    return '/' + url; // pastikan diawali slash
  }

  // Jika absolute URL, gunakan apa adanya
  return url;
}

class FurnitureService {
  
  /**
   * Mendapatkan semua produk furniture
   * Untuk switch ke real API: ubah USE_MOCK_DATA menjadi false
   */
  async getAllProducts() {
    if (USE_MOCK_DATA) {
      return await getAllProductsMock();
    } else {
      // REAL API
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Tidak ada token. Silakan login terlebih dahulu.');
        }

        // Ambil hingga 100 produk (sesuai batas API)
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', '100');
        queryParams.append('sort_by', 'updated_at');
        queryParams.append('sort_order', 'desc');

        const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const serverMessage = (data && (data.detail || data.message)) || 'Gagal memuat produk';
          throw new Error(serverMessage);
        }

        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

        // Map ke bentuk yang digunakan ProductCard
        const mapped = items.map(item => ({
          id: item.id,
          name: item.nama_produk,
          price: item.harga_setelah_diskon ?? item.harga_satuan,
          originalPrice: item.harga_satuan,
          discount: item.diskon ?? 0,
          rating: item.rating ?? 0,
          totalReviews: item.jumlah_terjual ?? 0,
          image: normalizeImageUrl(item.gambar)
        }));

        return mapped;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    }
  }
  
  /**
   * Search produk berdasarkan query
   */
  async searchProducts(query) {
    if (USE_MOCK_DATA) {
      return await searchProductsMock(query);
    } else {
      // REAL API
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Tidak ada token. Silakan login terlebih dahulu.');
        }

        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', '100');
        if (query && query.trim()) queryParams.append('search', query.trim());

        const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const serverMessage = (data && (data.detail || data.message)) || 'Gagal mencari produk';
          throw new Error(serverMessage);
        }

        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        const mapped = items.map(item => ({
          id: item.id,
          name: item.nama_produk,
          price: item.harga_setelah_diskon ?? item.harga_satuan,
          originalPrice: item.harga_satuan,
          discount: item.diskon ?? 0,
          rating: item.rating ?? 0,
          totalReviews: item.jumlah_terjual ?? 0,
          image: normalizeImageUrl(item.gambar)
        }));

        return mapped;
      } catch (error) {
        console.error('Error searching products:', error);
        throw error;
      }
    }
  }
  
  /**
   * Filter produk berdasarkan kategori
   */
  async getProductsByCategory(category) {
    if (USE_MOCK_DATA) {
      return await getProductsByCategoryMock(category);
    } else {
      // REAL API
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Tidak ada token. Silakan login terlebih dahulu.');
        }

        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', '100');
        if (category && category !== 'Semua Kategori') queryParams.append('kategori', category);

        const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const serverMessage = (data && (data.detail || data.message)) || 'Gagal memuat produk berdasarkan kategori';
          throw new Error(serverMessage);
        }

        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        const mapped = items.map(item => ({
          id: item.id,
          name: item.nama_produk,
          price: item.harga_setelah_diskon ?? item.harga_satuan,
          originalPrice: item.harga_satuan,
          discount: item.diskon ?? 0,
          rating: item.rating ?? 0,
          totalReviews: item.jumlah_terjual ?? 0,
          image: normalizeImageUrl(item.gambar)
        }));

        return mapped;
      } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
      }
    }
  }
}

// Export singleton instance
export default new FurnitureService();
