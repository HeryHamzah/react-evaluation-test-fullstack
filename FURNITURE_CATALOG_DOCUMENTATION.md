# Furniture Catalog - Dokumentasi

## 📋 Overview
Furniture Catalog adalah halaman katalog produk furniture dengan UI/UX yang modern dan responsive, menggunakan Bootstrap 5.

## 🗂️ Struktur Folder

```
src/
├── components/
│   └── catalog/
│       ├── CatalogHeader.jsx      # Header dengan search bar dan background image
│       ├── ProductCard.jsx        # Card untuk menampilkan produk
│       └── ProductGrid.jsx        # Grid layout untuk produk
├── data/
│   └── mockFurnitureProducts.js   # Mock data produk furniture
├── pages/
│   └── FurnitureCatalog.jsx       # Halaman utama catalog
├── services/
│   └── furnitureService.js        # Service layer untuk data management
└── assets/
    └── furniture.jpg              # Background image untuk header
```

## 🎨 Fitur

### 1. **CatalogHeader**
- Background image dengan overlay gelap
- Logo dan judul "Cari Funitur Impian"
- Search bar dengan tombol search berwarna orange
- User dropdown di pojok kanan atas
- Fully responsive

### 2. **ProductCard**
- Gambar produk dengan hover effect (zoom)
- Badge diskon (merah untuk ≥15%, kuning untuk <15%)
- Nama produk
- Harga dengan format Rupiah
- Harga coret untuk produk diskon
- Rating bintang dan jumlah terjual
- Shadow effect saat hover

### 3. **ProductGrid**
- Responsive grid layout:
  - Mobile (xs): 1 kolom
  - Tablet (sm): 2 kolom
  - Desktop (lg): 3 kolom
  - Large Desktop (xl): 4 kolom
- Loading state dengan spinner
- Empty state untuk produk kosong

### 4. **Search Functionality**
- Real-time search berdasarkan nama produk
- Search berdasarkan kategori
- Simulasi delay API (300ms)

## 🔧 Service Layer

### furnitureService.js
Service layer yang memudahkan switching antara mock data dan real API.

**Cara menggunakan:**

```javascript
import furnitureService from '../services/furnitureService';

// Get all products
const products = await furnitureService.getAllProducts();

// Search products
const results = await furnitureService.searchProducts('meja');

// Get by category
const categoryProducts = await furnitureService.getProductsByCategory('Sofa');
```

### Switching ke Real API

1. Buka file `src/services/furnitureService.js`
2. Ubah `USE_MOCK_DATA` dari `true` menjadi `false`
3. Uncomment bagian REAL API di setiap method
4. Sesuaikan `API_BASE_URL` dengan endpoint backend Anda

```javascript
// Ubah ini:
const USE_MOCK_DATA = true;

// Menjadi:
const USE_MOCK_DATA = false;
```

## 📊 Mock Data

File: `src/data/mockFurnitureProducts.js`

**Format data produk:**
```javascript
{
  id: 1,
  name: "Nama Produk",
  price: 3400000,
  originalPrice: 4250000,
  discount: 12,
  rating: 4.9,
  totalReviews: 121,
  image: "url_gambar",
  category: "Kategori"
}
```

**Helper functions:**
- `formatPrice(price)` - Format harga ke Rupiah
- `getAllProducts()` - Get semua produk
- `searchProducts(query)` - Search produk
- `getProductsByCategory(category)` - Filter by kategori

## 🎯 Routing

Akses halaman catalog melalui:
```
/catalog
```

Route sudah dilindungi dengan `ProtectedRoute`, jadi user harus login terlebih dahulu.

## 🎨 Styling

Menggunakan **Bootstrap 5** dengan customization:
- Warna primary: Orange (#ff8c00)
- Warna danger untuk harga
- Warna warning untuk rating bintang
- Shadow effects untuk depth
- Smooth transitions untuk interaktivitas

## 📱 Responsive Design

### Breakpoints:
- **Mobile** (< 576px): 1 kolom, stack layout
- **Tablet** (≥ 576px): 2 kolom
- **Desktop** (≥ 992px): 3 kolom
- **Large Desktop** (≥ 1200px): 4 kolom

### Header Responsive:
- Search bar menyesuaikan lebar layar
- User dropdown tetap di pojok kanan
- Background image dengan cover positioning

## 🚀 Cara Menggunakan

1. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

2. **Login terlebih dahulu** (karena route dilindungi)

3. **Akses catalog:**
   ```
   http://localhost:5173/catalog
   ```

4. **Fitur yang bisa dicoba:**
   - Search produk
   - Lihat detail produk di card
   - Hover effect pada card
   - Responsive design (resize browser)

## 🔄 Integrasi dengan Real API

Ketika backend API sudah siap, ikuti langkah berikut:

### 1. Update Service
```javascript
// src/services/furnitureService.js
const USE_MOCK_DATA = false;
const API_BASE_URL = 'https://your-api.com/api';
```

### 2. Expected API Endpoints

**GET /furniture**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 3400000,
    "originalPrice": 4250000,
    "discount": 12,
    "rating": 4.9,
    "totalReviews": 121,
    "image": "image_url",
    "category": "Category"
  }
]
```

**GET /furniture/search?q={query}**
```json
// Same format as above
```

**GET /furniture/category/{category}**
```json
// Same format as above
```

### 3. Error Handling
Service sudah dilengkapi dengan try-catch untuk error handling. Uncomment bagian REAL API untuk melihat implementasinya.

## 📝 Best Practices

1. **Separation of Concerns**
   - Components: UI logic
   - Services: Data fetching
   - Data: Mock data terpisah

2. **Reusability**
   - ProductCard dapat digunakan di halaman lain
   - ProductGrid dapat menerima berbagai jenis produk
   - Service layer dapat digunakan di berbagai component

3. **Maintainability**
   - Mock data terpisah dari logic
   - Easy switch antara mock dan real API
   - Clear folder structure

4. **Performance**
   - Lazy loading images
   - Optimized re-renders
   - Smooth transitions

## 🎯 Future Enhancements

Beberapa fitur yang bisa ditambahkan:

1. **Filter & Sort**
   - Filter by kategori
   - Filter by harga
   - Sort by rating, harga, terbaru

2. **Pagination**
   - Load more button
   - Infinite scroll
   - Page numbers

3. **Product Detail**
   - Modal detail produk
   - Image gallery
   - Add to cart

4. **Wishlist**
   - Favorite products
   - Save for later

5. **Shopping Cart**
   - Add to cart
   - Cart management
   - Checkout

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi tim development.

---

**Created with ❤️ using React + Bootstrap**
