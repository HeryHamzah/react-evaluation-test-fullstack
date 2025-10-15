// Mock data untuk produk
// Nantinya data ini akan diganti dengan data dari API

export const mockProducts = [
  {
    id: 1,
    nama: "Meja Makan Kayu Jati",
    kategori: "Meja",
    stok: 2,
    harga: 3400000,
    status: "menipis",
    gambar: "https://via.placeholder.com/50/8B4513/FFFFFF?text=Meja"
  },
  {
    id: 2,
    nama: "Tempat Tidur Queen Size",
    kategori: "Tempat Tidur",
    stok: 4,
    harga: 6700000,
    status: "menipis",
    gambar: "https://via.placeholder.com/50/D2691E/FFFFFF?text=Bed"
  },
  {
    id: 3,
    nama: "Lemari Baju",
    kategori: "Lemari",
    stok: 8,
    harga: 600000,
    status: "aktif",
    gambar: "https://picsum.photos/400/300"
  },
  {
    id: 4,
    nama: "Kursi Ergonomis",
    kategori: "Kursi",
    stok: 20,
    harga: 300000,
    status: "aktif",
    gambar: "https://picsum.photos/400/300"
  },
  {
    id: 5,
    nama: "Lemari Pakaian 3 Pintu",
    kategori: "Lemari",
    stok: 15,
    harga: 750000,
    status: "aktif",
    gambar: "https://picsum.photos/400/300"
  },
  {
    id: 6,
    nama: "Rak Buku Minimalis",
    kategori: "Rak",
    stok: 29,
    harga: 800000,
    status: "aktif",
    gambar: "https://picsum.photos/400/300"
  },
  {
    id: 7,
    nama: "Meja Belajar Anak",
    kategori: "Meja",
    stok: 12,
    harga: 1150000,
    status: "aktif",
    gambar: "https://picsum.photos/400/300"
  },
  {
    id: 8,
    nama: "Kursi Cafe Kayu",
    kategori: "Kursi",
    stok: 16,
    harga: 780000,
    status: "aktif",
    gambar: "https://picsum.photos/400/300"
  },
  {
    id: 9,
    nama: "Bufet TV Minimalis",
    kategori: "Bufet",
    stok: 24,
    harga: 2900000,
    status: "nonaktif",
    gambar: "https://picsum.photos/400/300"
  },
  {
    id: 10,
    nama: "Meja Kerja Industrial",
    kategori: "Meja",
    stok: 12,
    harga: 2350000,
    status: "nonaktif",
    gambar: "https://via.placeholder.com/50/8B4513/FFFFFF?text=Meja"
  },
  {
    id: 11,
    nama: "Sofa 3 Seater",
    kategori: "Sofa",
    stok: 5,
    harga: 4500000,
    status: "aktif",
    gambar: "https://via.placeholder.com/50/8B7355/FFFFFF?text=Sofa"
  },
  {
    id: 12,
    nama: "Nakas Minimalis",
    kategori: "Nakas",
    stok: 18,
    harga: 350000,
    status: "aktif",
    gambar: "https://via.placeholder.com/50/A0522D/FFFFFF?text=Nakas"
  }
];

// Data kategori untuk filter
export const categories = [
  "Semua Kategori",
  "Meja",
  "Tempat Tidur",
  "Lemari",
  "Kursi",
  "Rak",
  "Bufet",
  "Sofa",
  "Nakas"
];

// Data status untuk filter
export const statuses = [
  "Semua Status",
  "aktif",
  "menipis",
  "nonaktif"
];
