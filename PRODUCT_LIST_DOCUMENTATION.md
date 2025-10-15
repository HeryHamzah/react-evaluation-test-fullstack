# 📦 Dokumentasi Halaman Daftar Produk

## 🎯 Overview

Halaman Daftar Produk adalah aplikasi web management produk yang dibuat dengan **React** dan **Bootstrap**. Dokumentasi ini dibuat khusus untuk developer Flutter agar mudah memahami konsep React.

---

## 📁 Struktur File

```
src/
├── data/
│   └── mockProducts.js          # Data mock produk
├── services/
│   └── productService.js        # Service layer untuk API
├── components/
│   └── ProductModal.jsx         # Modal untuk add/edit produk
├── pages/
│   └── ProductList.jsx          # Halaman utama daftar produk
└── styles/
    └── ProductList.css          # Styling terpisah
```

---

## 🔄 Konsep React untuk Flutter Developer

### 1. **Component = Widget**

Di React, component mirip dengan Widget di Flutter:

**Flutter:**
```dart
class ProductList extends StatefulWidget {
  @override
  _ProductListState createState() => _ProductListState();
}
```

**React:**
```jsx
const ProductList = () => {
  // Component logic here
  return (
    <div>...</div>
  );
};
```

### 2. **useState = setState**

Untuk manage state/data yang berubah:

**Flutter:**
```dart
String searchQuery = '';
void updateSearch(String value) {
  setState(() {
    searchQuery = value;
  });
}
```

**React:**
```jsx
const [searchQuery, setSearchQuery] = useState('');
const updateSearch = (value) => {
  setSearchQuery(value); // Otomatis trigger re-render
};
```

**Perbedaan penting:**
- Flutter: Harus wrap perubahan state dalam `setState()`
- React: Langsung panggil setter function (`setSearchQuery`)

### 3. **useEffect = Lifecycle Methods**

useEffect mirip dengan lifecycle methods di Flutter:

**Flutter:**
```dart
@override
void initState() {
  super.initState();
  fetchProducts();
}

@override
void didUpdateWidget(Widget old) {
  super.didUpdateWidget(old);
  // Logic when widget updates
}
```

**React:**
```jsx
// Seperti initState - run sekali saat component mount
useEffect(() => {
  fetchProducts();
}, []); // [] = hanya run sekali

// Seperti didUpdateWidget - run ketika searchQuery berubah
useEffect(() => {
  fetchProducts();
}, [searchQuery]); // Run ketika searchQuery berubah
```

### 4. **Props = Constructor Parameters**

Passing data ke child component:

**Flutter:**
```dart
ProductModal(
  isVisible: true,
  onSave: (data) => handleSave(data),
  product: selectedProduct,
)
```

**React:**
```jsx
<ProductModal
  show={true}
  onSave={(data) => handleSave(data)}
  product={selectedProduct}
/>
```

### 5. **Event Handlers**

**Flutter:**
```dart
TextField(
  onChanged: (value) {
    handleSearch(value);
  },
)
```

**React:**
```jsx
<input
  onChange={(e) => handleSearch(e.target.value)}
/>
```

**Catatan:** Di React, event handler menerima event object `e`, bukan langsung value.

---

## 🏗️ Arsitektur Aplikasi

### Layer Architecture (Mirip Clean Architecture Flutter)

```
┌─────────────────────────────────────┐
│         UI Layer (Components)        │
│   ProductList.jsx, ProductModal.jsx  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer (Repository)      │
│        productService.js             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Data Layer (Mock/API)            │
│        mockProducts.js               │
└─────────────────────────────────────┘
```

Sama seperti di Flutter ketika menggunakan:
- **Presentation Layer** → Components
- **Domain Layer** → Service
- **Data Layer** → Mock Data / API

---

## 🔧 Strategi Replace Mock dengan Real API

### Langkah-langkah:

1. **Buka file `productService.js`**
2. **Ubah flag `USE_MOCK_DATA` menjadi `false`**
   ```javascript
   const USE_MOCK_DATA = false; // Ganti dari true
   ```

3. **Sesuaikan `API_BASE_URL`** dengan backend API Anda
   ```javascript
   const API_BASE_URL = 'https://api.yourdomain.com/api';
   ```

4. **Uncomment kode Real API** dan **comment kode Mock**

**Contoh sebelum:**
```javascript
async getProducts({ page, limit, ... }) {
  if (USE_MOCK_DATA) {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = [...mockProducts];
    // ... filter logic
    return { success: true, data: filtered };
  } else {
    // REAL API - Uncomment ini ⬇️
    /*
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    return data;
    */
  }
}
```

**Contoh sesudah:**
```javascript
async getProducts({ page, limit, ... }) {
  if (USE_MOCK_DATA) {
    // Comment bagian ini
    /*
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = [...mockProducts];
    return { success: true, data: filtered };
    */
  } else {
    // Uncomment bagian ini
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    return data;
  }
}
```

### Struktur Response API yang Diharapkan

Backend API Anda harus return response dengan struktur ini:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama": "Meja Makan Kayu Jati",
      "kategori": "Meja",
      "stok": 2,
      "harga": 3400000,
      "status": "aktif",
      "gambar": "https://..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

---

## 🎨 Styling dengan Bootstrap

### Konsep CSS di React vs Flutter

**Flutter:**
```dart
Container(
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(8),
  ),
  child: Text('Hello'),
)
```

**React dengan Bootstrap:**
```jsx
<div className="p-3 bg-white rounded">
  Hello
</div>
```

### Bootstrap Classes yang Sering Digunakan

| Bootstrap Class | Flutter Equivalent | Keterangan |
|----------------|-------------------|------------|
| `container` | `Container` | Container dengan max-width responsive |
| `row` | `Row` | Layout horizontal |
| `col-*` | `Expanded` / `Flexible` | Kolom dengan flex |
| `d-flex` | `Row` / `Column` | Display flex |
| `justify-content-between` | `MainAxisAlignment.spaceBetween` | Align horizontal |
| `align-items-center` | `CrossAxisAlignment.center` | Align vertical |
| `p-3` | `padding: 16` | Padding (1 unit = 4px) |
| `m-3` | `margin: 16` | Margin |
| `bg-white` | `color: Colors.white` | Background color |
| `text-center` | `textAlign: center` | Text alignment |

### Custom CSS (ProductList.css)

File CSS terpisah memudahkan maintenance. Mirip dengan memisahkan styling di Flutter ke dalam Theme atau konstanta.

**React:**
```jsx
// Import CSS file
import '../styles/ProductList.css';

// Use className
<div className="product-header">...</div>
```

**CSS:**
```css
.product-header {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
}
```

---

## 📱 Responsive Design

### Breakpoints Bootstrap

| Screen Size | Bootstrap Class | Device |
|------------|----------------|---------|
| < 576px | `col-` | Mobile (Portrait) |
| ≥ 576px | `col-sm-` | Mobile (Landscape) |
| ≥ 768px | `col-md-` | Tablet |
| ≥ 992px | `col-lg-` | Desktop |
| ≥ 1200px | `col-xl-` | Large Desktop |

### Media Queries (ProductList.css)

```css
/* Desktop */
.filter-row {
  display: flex;
  gap: 1rem;
}

/* Tablet */
@media (max-width: 992px) {
  .filter-row {
    flex-direction: column;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .product-table {
    font-size: 0.75rem;
  }
}
```

Mirip dengan:
```dart
// Flutter
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth < 600) {
      return MobileLayout();
    } else {
      return DesktopLayout();
    }
  },
)
```

---

## 🎯 Fitur-fitur Utama

### 1. **Pagination** 

Menggunakan pagination untuk performa yang lebih baik:

```javascript
// State pagination
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);

// Fetch data dengan pagination
const result = await productService.getProducts({
  page: currentPage,
  limit: itemsPerPage
});
```

### 2. **Search**

Real-time search dengan filter:

```javascript
const handleSearch = (e) => {
  const value = e.target.value;
  setSearchQuery(value);
  setCurrentPage(1); // Reset ke page 1
};

// Di useEffect, akan otomatis fetch ketika searchQuery berubah
useEffect(() => {
  fetchProducts();
}, [searchQuery]);
```

### 3. **Filter**

Filter berdasarkan kategori dan status:

```javascript
<select 
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
>
  {categories.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
```

### 4. **Sorting**

Sort data ascending/descending:

```javascript
const [sortBy, setSortBy] = useState('nama');
const [sortOrder, setSortOrder] = useState('asc');

const handleToggleSortOrder = () => {
  setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
};
```

### 5. **Modal Add/Edit**

Menggunakan React Bootstrap Modal:

```javascript
// State modal
const [showModal, setShowModal] = useState(false);
const [modalMode, setModalMode] = useState('add');

// Buka modal
const handleAddProduct = () => {
  setModalMode('add');
  setShowModal(true);
};

// Component
<ProductModal
  show={showModal}
  onHide={() => setShowModal(false)}
  mode={modalMode}
/>
```

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Development Server

```bash
npm run dev
```

### 3. Akses Aplikasi

Buka browser dan akses:
```
http://localhost:5173/products
```

(Pastikan sudah login terlebih dahulu jika ada protected route)

---

## 🔍 Debugging Tips

### 1. **Console.log** (Mirip print() di Flutter)

```javascript
console.log('Products:', products);
console.error('Error:', error);
console.table(products); // Tampilan table
```

### 2. **React Developer Tools**

Install extension React DevTools di browser untuk inspect component state.

### 3. **Network Tab**

Gunakan Network tab di browser DevTools untuk melihat API requests (nanti ketika sudah pakai real API).

---

## 🎓 Best Practices

### 1. **Separation of Concerns**

✅ **Good:**
```
Components → UI only
Services → Business logic
Data → Data management
```

❌ **Bad:**
```
Semua logic di dalam component
```

### 2. **Naming Conventions**

- **Components:** PascalCase (`ProductList.jsx`)
- **Functions/Variables:** camelCase (`handleSearch`, `productData`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes:** kebab-case (`product-header`)

### 3. **State Management**

- Gunakan `useState` untuk local state
- Untuk global state (lebih complex), bisa gunakan Context API atau Redux
- Mirip dengan Provider/Riverpod di Flutter

### 4. **Performance Optimization**

```javascript
// Debouncing untuk search
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    fetchProducts(); // Fetch setelah user stop typing
  }, 500);
  
  return () => clearTimeout(timer); // Cleanup
}, [searchQuery]);
```

---

## 🔄 Perbandingan React vs Flutter

| Aspek | React | Flutter |
|-------|-------|---------|
| **Language** | JavaScript/JSX | Dart |
| **State Management** | useState, Context, Redux | setState, Provider, Bloc |
| **Lifecycle** | useEffect | initState, dispose |
| **Styling** | CSS, inline styles | Widget properties |
| **Component** | Functional Component | StatelessWidget/StatefulWidget |
| **Props** | Props | Constructor parameters |
| **List** | map() | ListView.builder |
| **Conditional** | && atau ternary | if atau condition ? : |

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Bootstrap Documentation](https://getbootstrap.com)
- [React Bootstrap](https://react-bootstrap.github.io)
- [MDN Web Docs](https://developer.mozilla.org)

---

## ❓ FAQ untuk Flutter Developer

### Q: Apakah React menggunakan Virtual DOM seperti Flutter menggunakan Widget Tree?

**A:** Ya! React menggunakan Virtual DOM untuk efisiensi rendering, mirip dengan bagaimana Flutter menggunakan Widget Tree. Ketika state berubah, React hanya update bagian yang berubah saja.

### Q: Bagaimana cara handle async operation di React?

**A:** Sama seperti Flutter, gunakan `async/await`:

```javascript
const fetchProducts = async () => {
  try {
    const result = await productService.getProducts();
    setProducts(result.data);
  } catch (error) {
    console.error(error);
  }
};
```

### Q: Apakah ada hot reload seperti Flutter?

**A:** Ya! Vite (build tool yang digunakan) support Hot Module Replacement (HMR), mirip dengan hot reload Flutter.

### Q: Bagaimana dengan routing?

**A:** Menggunakan `react-router-dom`:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/products" element={<ProductList />} />
  </Routes>
</BrowserRouter>
```

Mirip dengan:
```dart
// Flutter
Navigator.of(context).pushNamed('/products');
```

---

## 🎉 Selesai!

Sekarang Anda sudah memahami dasar-dasar React sebagai Flutter developer. Aplikasi Product List ini menggunakan best practices dan mudah di-scale untuk production.

**Next Steps:**
1. Coba modifikasi styling
2. Tambah fitur baru (export to Excel, etc)
3. Connect ke real API
4. Deploy ke production

Happy Coding! 🚀
