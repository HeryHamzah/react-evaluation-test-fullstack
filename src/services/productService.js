// Service layer untuk mengelola data produk
// Mirip dengan Repository pattern di Flutter

import { mockProducts } from '../data/mockProducts';

// Flag untuk toggle antara mock dan real API
const USE_MOCK_DATA = true;

// Base URL untuk API (akan digunakan saat sudah connect ke real API)
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * STRATEGI UNTUK REPLACE MOCK DENGAN REAL API:
 * 
 * 1. Ubah USE_MOCK_DATA menjadi false
 * 2. Setiap function sudah memiliki struktur yang sama dengan API response
 * 3. Uncomment bagian fetch() dan comment bagian mock
 * 4. Sesuaikan endpoint URL dengan backend API Anda
 * 
 * Mirip seperti di Flutter ketika menggunakan Provider/Repository pattern,
 * dimana kita bisa switch antara MockRepository dan ApiRepository
 */

class ProductService {
  
  /**
   * Mendapatkan semua produk dengan filter, sort, dan pagination
   * Mirip dengan getProducts() di Flutter Repository
   */
  async getProducts({ 
    page = 1, 
    limit = 10, 
    search = '', 
    kategori = '', 
    status = '', 
    sortBy = 'nama', 
    sortOrder = 'asc' 
  }) {
    
    if (USE_MOCK_DATA) {
      // MOCK DATA - Simulasi loading time seperti real API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filtered = [...mockProducts];
      
      // Filter berdasarkan search
      if (search) {
        filtered = filtered.filter(p => 
          p.nama.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Filter berdasarkan kategori
      if (kategori && kategori !== 'Semua Kategori') {
        filtered = filtered.filter(p => p.kategori === kategori);
      }
      
      // Filter berdasarkan status
      if (status && status !== 'Semua Status') {
        filtered = filtered.filter(p => p.status === status);
      }
      
      // Sort data
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filtered.length / limit),
          totalItems: filtered.length,
          itemsPerPage: limit
        }
      };
      
    } else {
      // REAL API - Uncomment ketika sudah siap
      /*
      try {
        const queryParams = new URLSearchParams({
          page,
          limit,
          search,
          kategori,
          status,
          sortBy,
          sortOrder
        });
        
        const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        return data;
        
      } catch (error) {
        console.error('Error fetching products:', error);
        return {
          success: false,
          error: error.message
        };
      }
      */
    }
  }
  
  /**
   * Mendapatkan detail produk berdasarkan ID
   */
  async getProductById(id) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const product = mockProducts.find(p => p.id === id);
      
      return {
        success: true,
        data: product || null
      };
      
    } else {
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        return data;
      } catch (error) {
        return { success: false, error: error.message };
      }
      */
    }
  }
  
  /**
   * Menambah produk baru
   */
  async createProduct(productData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newProduct = {
        id: mockProducts.length + 1,
        ...productData
      };
      
      mockProducts.push(newProduct);
      
      return {
        success: true,
        data: newProduct,
        message: 'Produk berhasil ditambahkan'
      };
      
    } else {
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });
        
        if (!response.ok) throw new Error('Failed to create product');
        const data = await response.json();
        return data;
        
      } catch (error) {
        return { success: false, error: error.message };
      }
      */
    }
  }
  
  /**
   * Update produk
   */
  async updateProduct(id, productData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...productData };
        
        return {
          success: true,
          data: mockProducts[index],
          message: 'Produk berhasil diupdate'
        };
      }
      
      return {
        success: false,
        error: 'Product not found'
      };
      
    } else {
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });
        
        if (!response.ok) throw new Error('Failed to update product');
        const data = await response.json();
        return data;
        
      } catch (error) {
        return { success: false, error: error.message };
      }
      */
    }
  }
  
  /**
   * Hapus produk
   */
  async deleteProduct(id) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        
        return {
          success: true,
          message: 'Produk berhasil dihapus'
        };
      }
      
      return {
        success: false,
        error: 'Product not found'
      };
      
    } else {
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete product');
        const data = await response.json();
        return data;
        
      } catch (error) {
        return { success: false, error: error.message };
      }
      */
    }
  }
}

// Export singleton instance
export default new ProductService();
