# Product Detail Page Documentation

## Overview
Halaman detail produk yang menampilkan informasi lengkap tentang produk furniture dengan UI/UX yang modern dan responsive menggunakan Bootstrap.

## Features
- ✅ Image gallery dengan thumbnail navigation
- ✅ Product information (nama, rating, harga, diskon)
- ✅ Quantity selector
- ✅ Shipping information
- ✅ Product description lengkap
- ✅ Responsive design (mobile & desktop)
- ✅ Reusable components
- ✅ Mock data service yang mudah di-switch ke real API

## Struktur Folder

```
src/
├── components/
│   ├── common/                          # Reusable components
│   │   ├── DiscountBadge.jsx           # Badge diskon (reusable)
│   │   ├── QuantitySelector.jsx        # Selector kuantitas (reusable)
│   │   └── StarRating.jsx              # Rating bintang (reusable)
│   └── productDetail/                   # Product detail specific components
│       ├── ImageGallery.jsx            # Gallery gambar produk
│       ├── ProductInfo.jsx             # Informasi produk (harga, rating, dll)
│       ├── ProductDescription.jsx      # Deskripsi produk
│       └── ProductDetailHeader.jsx     # Header dengan logo dan user info
├── data/
│   └── mockProductDetails.js           # Mock data untuk product detail
├── services/
│   └── productDetailService.js         # Service layer untuk product detail
└── pages/
    └── ProductDetail.jsx               # Main product detail page
```

## Components

### 1. Reusable Components

#### DiscountBadge
```jsx
import DiscountBadge from '../components/common/DiscountBadge';

<DiscountBadge discount={12} />
```

**Props:**
- `discount` (number): Persentase diskon
- `className` (string, optional): Additional CSS classes

#### QuantitySelector
```jsx
import QuantitySelector from '../components/common/QuantitySelector';

<QuantitySelector
  quantity={quantity}
  onIncrease={handleIncrease}
  onDecrease={handleDecrease}
  max={15}
  min={1}
/>
```

**Props:**
- `quantity` (number): Current quantity
- `onIncrease` (function): Callback saat tombol + diklik
- `onDecrease` (function): Callback saat tombol - diklik
- `max` (number, default: 99): Maximum quantity
- `min` (number, default: 1): Minimum quantity

#### StarRating
```jsx
import StarRating from '../components/common/StarRating';

<StarRating rating={4.5} reviewCount={30} />
```

**Props:**
- `rating` (number): Rating value (0-5)
- `reviewCount` (number): Jumlah review
- `showCount` (boolean, default: true): Tampilkan jumlah review

### 2. Product Detail Components

#### ImageGallery
Menampilkan gambar produk utama dengan thumbnail navigation.

**Props:**
- `images` (array): Array of image URLs
- `productName` (string): Nama produk untuk alt text

#### ProductInfo
Menampilkan informasi produk (nama, harga, rating, quantity selector, dll).

**Props:**
- `product` (object): Product data
- `onAddToCart` (function): Callback saat tombol "Beli Produk" diklik

#### ProductDescription
Menampilkan deskripsi lengkap produk, spesifikasi, dan kelebihan.

**Props:**
- `description` (object): Product description data

#### ProductDetailHeader
Header dengan logo dan user info.

**Props:**
- `userName` (string, default: 'user 01'): Nama user yang sedang login

## Service Layer

### productDetailService.js

Service ini menyediakan fungsi-fungsi untuk mengakses data product detail. Saat ini menggunakan mock data, tapi mudah di-switch ke real API.

#### Functions:

**getProductDetail(productId)**
```javascript
import { getProductDetail } from '../services/productDetailService';

const product = await getProductDetail(1);
```

**addToCart(productId, quantity)**
```javascript
import { addToCart } from '../services/productDetailService';

const result = await addToCart(1, 2);
```

### Switch ke Real API

Untuk menggunakan real API, uncomment kode di bagian bawah `productDetailService.js` dan sesuaikan dengan endpoint API Anda:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export const getProductDetail = async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
  return response.data;
};
```

## Mock Data Structure

```javascript
{
  id: 1,
  name: "Meja Makan Kayu Jati - Ukuran besar 100m²",
  rating: 4.5,
  reviewCount: 30,
  price: 3400000,
  originalPrice: 4000000,
  discount: 12,
  images: [
    "/src/assets/furniture.jpg",
    // ... more images
  ],
  shipping: {
    guarantee: "Garansi Tiba: 4 - 6 September",
    voucher: "Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat."
  },
  stock: 15,
  description: {
    main: "...",
    secondary: "...",
    specifications: [...],
    advantages: [...]
  }
}
```

## Routing

Route untuk product detail:
```javascript
<Route path="/product/:id" element={<ProductDetail />} />
```

Cara navigasi ke product detail:
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/product/1');  // Navigate to product with ID 1
```

Atau menggunakan Link:
```jsx
import { Link } from 'react-router-dom';

<Link to="/product/1">View Product</Link>
```

## Responsive Design

Halaman ini menggunakan Bootstrap grid system untuk responsive layout:

- **Desktop (lg dan lebih besar)**: 
  - Image gallery: 6 kolom
  - Product info: 6 kolom
  - Description: 12 kolom (full width)

- **Mobile (kurang dari lg)**:
  - Semua section: 12 kolom (full width, stacked vertically)

## Styling

Menggunakan Bootstrap 5 dengan custom inline styles untuk beberapa elemen:
- Bootstrap classes untuk layout dan spacing
- Bootstrap Icons untuk icon
- Custom inline styles untuk ukuran dan positioning spesifik

## Usage Example

```jsx
// Dari halaman catalog atau product list
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  return (
    <div onClick={() => navigate(`/product/${product.id}`)}>
      {/* Product card content */}
    </div>
  );
};
```

## Testing

Untuk test halaman ini:

1. Login ke aplikasi
2. Navigate ke `/product/1` atau `/product/2`
3. Test responsive design dengan resize browser
4. Test quantity selector (increase/decrease)
5. Test image gallery (click thumbnails)
6. Test "Beli Produk" button

## Future Enhancements

- [ ] Add to wishlist functionality
- [ ] Share product functionality
- [ ] Related products section
- [ ] Customer reviews section
- [ ] Product variants (size, color, etc.)
- [ ] Zoom image on hover/click
- [ ] Breadcrumb navigation
- [ ] Back button
