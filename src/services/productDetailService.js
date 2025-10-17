// src/services/productDetailService.js
import { mockProductDetails } from '../data/mockProductDetails';

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
  await simulateDelay();
  
  const product = mockProductDetails[productId];
  
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  return product;
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
  await simulateDelay();
  
  // Mock implementation
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
