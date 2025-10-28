// src/services/productDetailService.js
import { mockProductDetails } from '../data/mockProductDetails';

const USE_MOCK_DATA = false;
const API_BASE_URL = '/api/v1';

function normalizeImageArray(gambarField) {
  if (Array.isArray(gambarField)) {
    return gambarField.map(url => {
      if (typeof url !== 'string') return url;
      if (url.startsWith('/uploads')) return url;
      if (url.startsWith('uploads/')) return '/' + url;
      return url;
    });
  }
  if (typeof gambarField === 'string' && gambarField.trim() !== '') {
    const url = gambarField.trim();
    if (url.startsWith('/uploads')) return [url];
    if (url.startsWith('uploads/')) return ['/' + url];
    return [url];
  }
  return [];
}

/**
 * Service untuk mengelola product detail
 * Mudah di-switch ke real API dengan mengganti implementasi fungsi-fungsi ini
 */

// Simulasi delay network request
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get product detail by ID
 * @param {number|string} productId - ID produk
 * @returns {Promise<Object>} Product detail object
 */
export const getProductDetail = async (productId) => {
  if (USE_MOCK_DATA) {
    await simulateDelay();
    const product = mockProductDetails[productId];
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    return product;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Tidak ada token. Silakan login terlebih dahulu.');

    const resp = await fetch(`${API_BASE_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      const serverMessage = (data && (data.detail || data.message)) || 'Gagal memuat detail produk';
      throw new Error(serverMessage);
    }

    // Map ke bentuk yang dipakai oleh ProductDetail
    const images = normalizeImageArray(data?.gambar);
    const price = data?.harga_setelah_diskon ?? data?.harga_satuan ?? 0;
    const product = {
      id: data?.id,
      name: data?.nama_produk,
      price,
      originalPrice: data?.harga_satuan ?? price,
      discount: data?.diskon ?? 0,
      rating: data?.rating ?? 0,
      reviewCount: data?.jumlah_terjual ?? 0,
      stock: data?.stok ?? 0,
      images,
      description: {
        main: data?.deskripsi || '',
        secondary: null,
        specifications: [],
        advantages: []
      },
      shipping: null
    };

    return product;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};

/**
 * Get related products (untuk future implementation)
 * @param {number|string} productId - ID produk
 * @returns {Promise<Array>} Array of related products
 */
export const getRelatedProducts = async (productId) => {
  await simulateDelay();
  
  // Mock implementation - return empty array for now
  return [];
};

/**
 * Add product to cart (untuk future implementation)
 * @param {number|string} productId - ID produk
 * @param {number} quantity - Jumlah produk
 * @returns {Promise<Object>} Cart response
 */
export const addToCart = async (productId, quantity) => {
  // Tetap mock untuk sekarang; belum ada API cart di dokumentasi
  await simulateDelay();
  return {
    success: true,
    message: 'Product added to cart successfully',
    productId,
    quantity
  };
};

// ============================================
// UNTUK SWITCH KE REAL API, GANTI DENGAN:
// ============================================
/*
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export const getProductDetail = async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
  return response.data;
};

export const getRelatedProducts = async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/products/${productId}/related`);
  return response.data;
};

export const addToCart = async (productId, quantity) => {
  const response = await axios.post(`${API_BASE_URL}/cart`, {
    productId,
    quantity
  });
  return response.data;
};
*/
