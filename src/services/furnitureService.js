// Service layer untuk furniture catalog
// Mudah untuk di-switch ke real API nantinya

import { 
  getAllProducts, 
  searchProducts, 
  getProductsByCategory 
} from '../data/mockFurnitureProducts';

// Flag untuk toggle antara mock dan real API
const USE_MOCK_DATA = true;

// Base URL untuk API (akan digunakan saat sudah connect ke real API)
const API_BASE_URL = 'http://localhost:3000/api';

class FurnitureService {
  
  /**
   * Mendapatkan semua produk furniture
   * Untuk switch ke real API: ubah USE_MOCK_DATA menjadi false
   */
  async getAllProducts() {
    if (USE_MOCK_DATA) {
      return await getAllProducts();
    } else {
      // REAL API - Uncomment ketika sudah siap
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/furniture`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      */
    }
  }
  
  /**
   * Search produk berdasarkan query
   */
  async searchProducts(query) {
    if (USE_MOCK_DATA) {
      return await searchProducts(query);
    } else {
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/furniture/search?q=${query}`);
        if (!response.ok) throw new Error('Failed to search products');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error searching products:', error);
        throw error;
      }
      */
    }
  }
  
  /**
   * Filter produk berdasarkan kategori
   */
  async getProductsByCategory(category) {
    if (USE_MOCK_DATA) {
      return await getProductsByCategory(category);
    } else {
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/furniture/category/${category}`);
        if (!response.ok) throw new Error('Failed to fetch products by category');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
      }
      */
    }
  }
}

// Export singleton instance
export default new FurnitureService();
