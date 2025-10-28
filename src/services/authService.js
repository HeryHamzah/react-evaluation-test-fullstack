

const BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function login(email, password) {
  try {
    const resp = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Ambil payload JSON (baik success maupun error API mengembalikan JSON)
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      // Prioritaskan pesan error dari server jika ada
      const serverMessage =
        (data && (data.detail || data.message)) || "Email atau password salah";
      throw new Error(serverMessage);
    }

    // Bentuk data sesuai kebutuhan UI
    const accessToken = data?.access_token;
    const userApi = data?.user || {};

    const user = {
      id: userApi.id,
      name: userApi.nama || userApi.name || "",
      email: userApi.email,
      role: userApi.role,
    };

    return { token: accessToken, user };
  } catch (err) {
    // Pastikan error konsisten untuk ditampilkan di UI
    throw new Error(err?.message || "Login gagal");
  }
}

// fungsi untuk logout (membersihkan token)
export function logout() {
  // Opsi: panggil API logout jika diperlukan
  // Biarkan sederhana: bersihkan storage lokal
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Get current authenticated user profile
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Tidak ada token. Silakan login terlebih dahulu.');
    }

    const resp = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      const serverMessage = (data && (data.detail || data.message)) || 'Gagal memuat profil pengguna';
      throw new Error(serverMessage);
    }

    const user = {
      id: data?.id,
      name: data?.nama || data?.name || '',
      email: data?.email || '',
      role: data?.role || 'user',
      status: data?.status_user || 'aktif',
      avatar: data?.photo_profile || null
    };

    // Sinkronkan ke localStorage agar komponen lain bisa pakai
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (err) {
    throw new Error(err?.message || 'Gagal memuat profil pengguna');
  }
}
  