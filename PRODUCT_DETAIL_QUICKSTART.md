# Product Detail - Quick Start Guide

## 🚀 Cara Mengakses Product Detail

### 1. Via URL Langsung
```
http://localhost:5173/product/1
http://localhost:5173/product/2
```

### 2. Via Navigation dari Code
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/product/1');
```

### 3. Via Link Component
```jsx
import { Link } from 'react-router-dom';

<Link to="/product/1" className="btn btn-primary">
  Lihat Detail
</Link>
```

## 📁 File-file yang Dibuat

### Components
- ✅ `src/components/common/DiscountBadge.jsx` - Badge diskon (reusable)
- ✅ `src/components/common/QuantitySelector.jsx` - Selector kuantitas (reusable)
- ✅ `src/components/common/StarRating.jsx` - Rating bintang (reusable)
- ✅ `src/components/productDetail/ImageGallery.jsx` - Gallery gambar
- ✅ `src/components/productDetail/ProductInfo.jsx` - Info produk
- ✅ `src/components/productDetail/ProductDescription.jsx` - Deskripsi produk
- ✅ `src/components/productDetail/ProductDetailHeader.jsx` - Header

### Pages
- ✅ `src/pages/ProductDetail.jsx` - Main page

### Services
- ✅ `src/services/productDetailService.js` - Service layer

### Data
- ✅ `src/data/mockProductDetails.js` - Mock data

## 🎨 Fitur UI/UX

1. **Header**
   - Logo (klik untuk kembali ke catalog)
   - User info dengan dropdown icon

2. **Image Gallery**
   - Main image (400px height)
   - Thumbnail navigation
   - Click thumbnail untuk ganti main image

3. **Product Info**
   - Nama produk
   - Rating dengan bintang
   - Harga dengan diskon badge
   - Info pengiriman
   - Quantity selector
   - Tombol "Beli Produk"

4. **Product Description**
   - Deskripsi utama
   - Spesifikasi produk
   - Kelebihan produk

## 📱 Responsive Design

- **Desktop**: 2 kolom (image gallery + product info)
- **Mobile**: 1 kolom (stacked vertically)

## 🔧 Cara Menambah Product Baru

Edit file `src/data/mockProductDetails.js`:

```javascript
export const mockProductDetails = {
  // ... existing products
  3: {
    id: 3,
    name: "Nama Produk Baru",
    rating: 4.8,
    reviewCount: 50,
    price: 2500000,
    originalPrice: 3000000,
    discount: 17,
    images: [
      "/src/assets/furniture.jpg",
      // ... more images
    ],
    shipping: {
      guarantee: "Garansi Tiba: 3 - 5 September",
      voucher: "Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat."
    },
    stock: 20,
    description: {
      main: "Deskripsi utama produk...",
      secondary: "Deskripsi tambahan...",
      specifications: [
        "Spesifikasi 1",
        "Spesifikasi 2"
      ],
      advantages: [
        "Kelebihan 1",
        "Kelebihan 2"
      ]
    }
  }
};
```

## 🔄 Switch ke Real API

1. Install axios (jika belum):
```bash
npm install axios
```

2. Buat file `.env`:
```
REACT_APP_API_URL=https://your-api.com
```

3. Edit `src/services/productDetailService.js`:
   - Comment bagian mock implementation
   - Uncomment bagian real API implementation
   - Sesuaikan endpoint dengan API Anda

## 🧪 Testing

1. **Start development server**:
```bash
npm run dev
```

2. **Login** ke aplikasi

3. **Navigate** ke `/product/1` atau `/product/2`

4. **Test features**:
   - ✅ Click thumbnails untuk ganti gambar
   - ✅ Increase/decrease quantity
   - ✅ Click "Beli Produk"
   - ✅ Resize browser untuk test responsive
   - ✅ Click logo untuk kembali ke catalog

## 💡 Tips

1. **Reusable Components**: 
   - `DiscountBadge`, `QuantitySelector`, dan `StarRating` bisa digunakan di halaman lain

2. **Service Layer**: 
   - Semua data access melalui service layer
   - Mudah untuk mock/test
   - Mudah switch ke real API

3. **Error Handling**: 
   - Loading state saat fetch data
   - Error state jika product tidak ditemukan
   - Button "Kembali ke Katalog" di error state

## 🎯 Next Steps

Untuk menghubungkan dengan catalog/product list:

```jsx
// Di ProductCard atau ProductList
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="card" 
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* Product card content */}
    </div>
  );
};
```
