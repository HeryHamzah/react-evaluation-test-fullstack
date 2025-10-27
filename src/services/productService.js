// Service layer untuk mengelola data produk
// Mirip dengan Repository pattern di Flutter

import { mockProducts } from '../data/mockProducts';

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
  if (!url) return 'https://via.placeholder.com/50?text=Produk';

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
      // REAL API
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return { success: false, error: 'Tidak ada token. Silakan login terlebih dahulu.' };
        }

        // Map sortBy dari UI ke field API
        const sortByMap = {
          nama: 'nama_produk',
          harga: 'harga_satuan',
          stok: 'stok',
          kategori: 'kategori'
        };
        const sortByApi = sortByMap[sortBy] || 'nama_produk';

        const queryParams = new URLSearchParams();
        queryParams.append('page', String(page));
        queryParams.append('limit', String(limit));
        if (search && search.trim()) queryParams.append('search', search.trim());
        if (kategori && kategori !== 'Semua Kategori') queryParams.append('kategori', kategori);
        if (status && status !== 'Semua Status') queryParams.append('status', status);
        if (sortByApi) queryParams.append('sort_by', sortByApi);
        if (sortOrder) queryParams.append('sort_order', sortOrder);

        const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const serverMessage = (data && (data.detail || data.message)) || 'Gagal memuat produk';
          return { success: false, error: serverMessage };
        }

        const items = Array.isArray(data?.items) ? data.items : [];
        const mapped = items.map(item => ({
          id: item.id,
          nama: item.nama_produk,
          kategori: item.kategori,
          stok: item.stok,
          harga: item.harga_satuan, // gunakan harga_satuan agar konsisten dengan sorting
          status: item.status_produk,
          gambar: normalizeImageUrl(item.gambar)
        }));

        return {
          success: true,
          data: mapped,
          pagination: {
            currentPage: data?.page ?? page,
            totalPages: data?.pages ?? Math.ceil((data?.total || 0) / (data?.limit || limit)),
            totalItems: data?.total ?? mapped.length,
            itemsPerPage: data?.limit ?? limit
          }
        };

      } catch (error) {
        console.error('Error fetching products:', error);
        return {
          success: false,
          error: error?.message || 'Terjadi kesalahan saat memuat data'
        };
      }
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
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return { success: false, error: 'Token tidak ditemukan. Silakan login ulang.' };
        }

        // Siapkan gambar: jika dataURL (base64) maka upload ke /upload/image untuk mendapatkan URL
        let gambarUrls = [];
        const gambarInput = productData?.gambar;

        const isDataUrl = typeof gambarInput === 'string' && gambarInput.startsWith('data:image');
        const isHttpUrl = typeof gambarInput === 'string' && (gambarInput.startsWith('http://') || gambarInput.startsWith('https://'));
        const isRelativeUpload = typeof gambarInput === 'string' && (gambarInput.startsWith('/uploads') || gambarInput.startsWith('uploads/'));

        if (isDataUrl) {
          // Convert dataURL ke Blob
          const [meta, b64data] = gambarInput.split(',');
          const mimeMatch = /data:(.*?);base64/.exec(meta);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const byteCharacters = atob(b64data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const ext = mimeType.split('/')[1] || 'jpg';
          const fileName = `product_${Date.now()}.${ext}`;

          const formData = new FormData();
          formData.append('file', blob, fileName);

          const uploadResp = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
              // Jangan set Content-Type; biarkan browser set boundary untuk multipart/form-data
            },
            body: formData
          });
          if (!uploadResp.ok) {
            const errText = await uploadResp.text().catch(() => 'Upload gagal');
            throw new Error(`Gagal mengunggah gambar: ${errText}`);
          }
          const uploadData = await uploadResp.json();
          if (uploadData?.url) {
            gambarUrls = [uploadData.url];
          }
        } else if (isHttpUrl || isRelativeUpload) {
          gambarUrls = [normalizeImageUrl(gambarInput)];
        }

        // Mapping field dari UI ke API
        const payload = {
          nama_produk: productData.nama,
          kategori: productData.kategori,
          deskripsi: productData.deskripsi || null,
          harga_satuan: Number(productData.harga) || 0,
          stok_awal: Number(productData.stok) || 0,
          gambar: gambarUrls, // array of URL
          status_produk: productData.status || 'aktif',
          threshold_stok: Number(productData.produkMenipis) || 0,
          diskon: Number(productData.diskon) || 0,
          rating: Number(productData.rating) || 0,
          jumlah_terjual: Number(productData.jumlah_terjual) || 0
        };

        const resp = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const respBody = await resp.json().catch(() => null);
        if (!resp.ok) {
          const serverMsg = (respBody && (respBody.detail || respBody.message)) || 'Gagal menambah produk';
          throw new Error(serverMsg);
        }

        // Berikan struktur respon konsisten untuk UI
        return {
          success: true,
          data: respBody,
          message: 'Produk berhasil ditambahkan'
        };

      } catch (error) {
        return { success: false, error: error.message || 'Terjadi kesalahan saat menambah produk' };
      }
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
