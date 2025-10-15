# 🚀 Quick Start - Product List

## Jalankan Aplikasi

```bash
npm run dev
```

Akses: `http://localhost:5173/products`

## Files Dibuat

1. `src/data/mockProducts.js` - Mock data
2. `src/services/productService.js` - Service layer (API abstraction)
3. `src/components/ProductModal.jsx` - Modal add/edit
4. `src/pages/ProductList.jsx` - Halaman utama
5. `src/styles/ProductList.css` - Styling terpisah

## Replace Mock dengan Real API

Edit `src/services/productService.js`:
```javascript
const USE_MOCK_DATA = false; // Ubah ke false
const API_BASE_URL = 'https://your-api.com/api'; // Sesuaikan URL
```

## Fitur

✅ Search produk
✅ Filter kategori & status  
✅ Sort by nama/harga/stok
✅ Pagination
✅ Tambah/Edit/Hapus produk
✅ Responsive design

Dokumentasi lengkap: `PRODUCT_LIST_DOCUMENTATION.md`
