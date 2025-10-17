# Changelog - Furniture Catalog

## Update Terbaru (Oct 17, 2025)

### ✅ Perbaikan yang Telah Diterapkan

#### 1. **Logo Putih di Header**
- Logo sekarang berwarna putih menggunakan CSS filter
- Posisi: Sudut kiri atas, sejajar dengan user profile
- File: `src/components/catalog/CatalogHeader.jsx`

#### 2. **Search Bar dengan Border Radius 50**
- Textfield search sekarang fully rounded (border-radius: 50px)
- Tombol search terpisah dari textfield dengan gap spacing
- Tombol search berbentuk **circle** (50x50px)
- Warna orange (#ff8c00) dipertahankan

#### 3. **Button "Lihat Semua Produk"**
- Style: Border #E7EAF0, text hitam, background transparent
- **Functionality**: 
  - Awalnya hanya menampilkan 4 produk
  - Klik button untuk menampilkan semua produk (8 produk)
  - Button hilang setelah diklik atau jika produk ≤ 4

#### 4. **Harga Produk Berwarna Orange**
- Semua harga produk sekarang menggunakan warna orange (#ff8c00)
- Tetap bold untuk emphasis

#### 5. **Badge Diskon - Discount Ribbon Tag**
- **Shape**: Chevron end (arrow pointing right)
- **Warna**: Orange dengan opacity 50% `rgba(255, 140, 0, 0.5)`
- **Text**: Orange solid (#ff8c00)
- **Posisi**: Di samping harga (bukan di sudut card)
- **Implementasi**: Menggunakan CSS `clipPath: polygon()` untuk membuat bentuk ribbon

#### 6. **User Dropdown dengan Caret Icon**
- Icon caret-down dipindahkan ke **depan nama user**
- Urutan: [Caret Down Icon] → [Nama User] → [Avatar]
- Icon: `bi-caret-down-fill` dari Bootstrap Icons

---

## Struktur Komponen

### CatalogHeader.jsx
```jsx
- Logo (kiri atas) - putih
- Title & Subtitle (center)
- Search Bar (center) - rounded dengan circle button
- User Dropdown (kanan atas) - caret icon di depan
```

### ProductCard.jsx
```jsx
- Product Image (hover zoom effect)
- Product Name
- Price (orange) + Discount Badge (ribbon chevron)
- Original Price (strikethrough jika ada diskon)
- Rating & Reviews
```

### FurnitureCatalog.jsx (Main Page)
```jsx
- State Management:
  - products: Semua produk dari API
  - displayedProducts: Produk yang ditampilkan (4 atau semua)
  - showAll: Toggle untuk show all functionality
  
- Functions:
  - loadProducts(): Load 4 produk pertama
  - handleSearch(): Search functionality
  - handleShowAll(): Tampilkan semua produk
```

---

## CSS Techniques Used

### 1. **Logo Putih (CSS Filter)**
```css
filter: brightness(0) invert(1)
```

### 2. **Discount Ribbon Tag (Chevron End)**
```css
clipPath: polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)
```
Ini membuat bentuk seperti tag dengan arrow di sisi kanan.

### 3. **Circle Button**
```css
width: 50px;
height: 50px;
border-radius: 50%;
```

### 4. **Opacity Background**
```css
backgroundColor: rgba(255, 140, 0, 0.5)
```

---

## Fitur "Lihat Semua Produk"

### Behavior:
1. **Initial Load**: Tampilkan 4 produk pertama
2. **Klik Button**: Tampilkan semua 8 produk
3. **Button Visibility**: 
   - Tampil jika: `!showAll && products.length > 4`
   - Hilang setelah diklik atau jika total produk ≤ 4

### Code Flow:
```javascript
// Initial state
showAll = false
displayedProducts = products.slice(0, 4)

// After click "Lihat Semua Produk"
showAll = true
displayedProducts = products (all 8 products)
```

---

## Testing Checklist

- [x] Logo berwarna putih
- [x] Search bar fully rounded
- [x] Search button circle dan terpisah
- [x] Badge diskon berbentuk ribbon chevron
- [x] Badge diskon orange 50% opacity
- [x] Harga berwarna orange
- [x] Caret icon di depan nama user
- [x] Button "Lihat Semua Produk" berfungsi
- [x] Responsive design tetap berfungsi
- [x] Hover effects tetap berfungsi

---

## Browser Compatibility

Semua fitur menggunakan modern CSS yang didukung oleh:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: `clipPath` polygon didukung penuh di semua browser modern.

---

## Next Steps (Optional Enhancements)

1. **Pagination**: Tambahkan pagination untuk produk lebih dari 8
2. **Filter**: Tambahkan filter by kategori
3. **Sort**: Tambahkan sort by harga, rating, dll
4. **Animation**: Tambahkan smooth transition saat show all
5. **Lazy Loading**: Implementasi lazy loading untuk images

---

**Last Updated**: Oct 17, 2025 at 3:15pm UTC+07:00
