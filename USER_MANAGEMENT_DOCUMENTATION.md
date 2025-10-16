# Dokumentasi User Management

## Overview
Halaman User Management adalah fitur untuk mengelola data user dalam aplikasi. Halaman ini mengikuti struktur dan styling yang sama dengan halaman Product List yang sudah ada.

## Struktur File

### 1. Data Layer
- **`src/data/mockUsers.js`**: Mock data untuk user dengan 12 sample users
  - Berisi array `mockUsers` dengan data user
  - Berisi array `userStatuses` untuk filter status

### 2. Service Layer
- **`src/services/userService.js`**: Service untuk mengelola operasi CRUD user
  - `getUsers()`: Mendapatkan list user dengan filter, search, dan pagination
  - `getUserById()`: Mendapatkan detail user berdasarkan ID
  - `createUser()`: Menambah user baru
  - `updateUser()`: Update data user
  - `deleteUser()`: Hapus user

### 3. Components
- **`src/components/UserActions.jsx`**: Dropdown menu actions untuk setiap user
  - Lihat Detail
  - Edit
  - Ubah Status
  - Hapus

- **`src/components/UserDetailModal.jsx`**: Modal untuk menampilkan detail user
  - Menampilkan avatar user
  - Informasi lengkap user (nama, email, no telp, tanggal dibuat, status)
  - Tombol Edit User

- **`src/components/UserModal.jsx`**: Modal untuk tambah/edit user
  - Form input: Nama, Email, No Telepon, Tanggal Dibuat, Status
  - Validasi form
  - Mode: Add atau Edit

### 4. Pages
- **`src/pages/UserList.jsx`**: Halaman utama User Management
  - Header dengan judul dan tombol "Tambah User"
  - Filter: Search dan Status
  - Sort: Ascending/Descending berdasarkan nama
  - Table dengan kolom: Nama User, No Telp, Tanggal Dibuat, Status, Actions
  - Pagination

### 5. Styles
- **`src/styles/UserList.css`**: Styling untuk halaman UserList
- **`src/styles/UserDetailModal.css`**: Styling untuk modal detail
- **`src/styles/UserModal.css`**: Styling untuk modal add/edit

## Fitur Utama

### 1. Tampilan User List
- **Table dengan kolom**:
  - Nama User (dengan avatar dan email)
  - No Telp
  - Tanggal Dibuat
  - Status (Aktif/Nonaktif)
  - Actions (Lihat Detail, Edit, Ubah Status, Hapus)

### 2. Filter & Search
- **Search**: Cari user berdasarkan nama atau email
- **Filter Status**: Filter berdasarkan status (Semua Status, Aktif, Nonaktif)
- **Sort**: Urutkan berdasarkan nama (Ascending/Descending)

### 3. Status Badge
- **Aktif**: Badge hijau dengan icon check (✓)
- **Nonaktif**: Badge abu-abu dengan icon circle (●)

### 4. CRUD Operations
- **Create**: Tambah user baru melalui modal
- **Read**: Lihat detail user melalui modal detail
- **Update**: Edit user melalui modal edit
- **Delete**: Hapus user dengan konfirmasi

### 5. Pagination
- Menampilkan 10 user per halaman
- Navigasi halaman dengan nomor halaman
- Tombol Previous/Next

## Perbedaan dengan Product List

1. **Status**: Hanya 2 status (Aktif dan Nonaktif)
   - Aktif: Icon check (✓) dengan background hijau
   - Nonaktif: Icon circle (●) dengan background abu-abu

2. **Sort**: Tidak ada pilihan sort by field
   - Hanya ada toggle Ascending/Descending
   - Sort berdasarkan nama user

3. **Table Columns**:
   - Nama User (dengan avatar dan email di bawahnya)
   - No Telp
   - Tanggal Dibuat
   - Status
   - Actions

4. **Avatar**: Menggunakan avatar circular dengan initial nama user

## Cara Mengakses

1. Login ke aplikasi
2. Akses URL: `http://localhost:5173/users`
3. Atau tambahkan menu navigasi di Navbar (opsional)

## Route
```javascript
<Route
  path="/users"
  element={
    <ProtectedRoute>
      <UserList />
    </ProtectedRoute>
  }
/>
```

## Mock Data
Data user menggunakan mock data dengan 12 sample users. Data ini bisa diganti dengan real API dengan mengubah flag `USE_MOCK_DATA` di `userService.js`.

## Best Practices yang Diterapkan

1. **Separation of Concerns**:
   - Data layer (mockUsers.js)
   - Service layer (userService.js)
   - Component layer (UserList, UserModal, UserDetailModal)
   - Style layer (CSS files)

2. **Reusable Components**:
   - Menggunakan komponen yang sudah ada: SelectWithIcon, SortOrderButton, SuccessModal, Navbar

3. **Consistent Styling**:
   - Mengikuti design system yang sama dengan ProductList
   - Menggunakan color palette yang konsisten

4. **State Management**:
   - Menggunakan React hooks (useState, useEffect)
   - Proper state management untuk loading, error, pagination

5. **Form Validation**:
   - Validasi input di UserModal
   - Error messages yang jelas

## Testing
Untuk testing halaman ini:
1. Jalankan development server: `npm run dev`
2. Login ke aplikasi
3. Akses `/users`
4. Test fitur:
   - Tambah user baru
   - Edit user
   - Lihat detail user
   - Ubah status user
   - Hapus user
   - Search user
   - Filter by status
   - Sort ascending/descending
   - Pagination

## Future Improvements
1. Tambahkan menu navigasi di Navbar untuk akses lebih mudah
2. Tambahkan export data ke CSV/Excel
3. Tambahkan bulk actions (delete multiple users)
4. Tambahkan role management
5. Integrasi dengan real API
