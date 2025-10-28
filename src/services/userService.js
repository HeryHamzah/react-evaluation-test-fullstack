// Service layer untuk mengelola data user
// Mirip dengan Repository pattern di Flutter

import { mockUsers } from '../data/mockUsers';

// Flag untuk toggle antara mock dan real API
const USE_MOCK_DATA = false;

// Base URL untuk API (gunakan proxy Vite di dev: /api -> 127.0.0.1:8000)
const API_BASE_URL = '/api/v1';

// Helper untuk normalisasi URL avatar dari API
function normalizeAvatarUrl(photoProfile) {
  let url = null;
  if (typeof photoProfile === 'string' && photoProfile.trim() !== '') {
    url = photoProfile.trim();
  }

  // Fallback jika kosong/null
  if (!url) return 'https://ui-avatars.com/api/?name=User&background=e5e7eb&color=9ca3af';

  // Jika path relatif dari backend (mis. "/uploads/..." atau "uploads/"), gunakan proxy vite
  if (url.startsWith('/uploads')) {
    return url; // akan diproxy oleh vite jika ada rule /uploads
  }
  if (url.startsWith('uploads/')) {
    return '/' + url; // pastikan diawali slash
  }

  // Jika absolute URL, gunakan apa adanya
  return url;
}

class UserService {
  
  /**
   * Mendapatkan semua user dengan filter, sort, dan pagination
   */
  async getUsers({ 
    page = 1, 
    limit = 10, 
    search = '', 
    status = '', 
    sortOrder = 'asc' 
  }) {
    
    if (USE_MOCK_DATA) {
      // MOCK DATA - Simulasi loading time seperti real API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filtered = [...mockUsers];
      
      // Filter berdasarkan search (nama atau email)
      if (search) {
        filtered = filtered.filter(u => 
          u.nama.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Filter berdasarkan status
      if (status && status !== 'Semua Status') {
        filtered = filtered.filter(u => u.status === status);
      }
      
      // Sort data berdasarkan nama
      filtered.sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.nama.localeCompare(b.nama) 
          : b.nama.localeCompare(a.nama);
      });
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filtered.length / limit),
          totalItems: filtered.length,
          itemsPerPage: limit
        }
      };
      
    } else {
      // REAL API
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return { success: false, error: 'Tidak ada token. Silakan login terlebih dahulu.' };
        }

        const queryParams = new URLSearchParams();
        queryParams.append('page', String(page));
        queryParams.append('limit', String(limit));
        if (search && search.trim()) queryParams.append('search', search.trim());
        if (status && status !== 'Semua Status') queryParams.append('status', status);
        // Sort by nama (sesuai UI toggle Asc/Desc)
        queryParams.append('sort_by', 'nama');
        if (sortOrder) queryParams.append('sort_order', sortOrder);

        const response = await fetch(`${API_BASE_URL}/users?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const serverMessage = (data && (data.detail || data.message)) || 'Gagal memuat users';
          return { success: false, error: serverMessage };
        }

        // Ambil items dari response; fallback ke data/data.items jika berbeda
        const items = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];

        const mapped = items.map(item => ({
          id: item.id,
          nama: item.nama,
          email: item.email,
          noTelp: item.no_telepon || item.noTelp || '',
          status: item.status_user,
          avatar: normalizeAvatarUrl(item.photo_profile),
          tanggalDibuat: item.created_at
        }));

        return {
          success: true,
          data: mapped,
          pagination: {
            currentPage: data?.page ?? page,
            totalPages: data?.pages ?? Math.ceil((data?.total || 0) / (data?.limit || limit)),
            totalItems: data?.total ?? mapped.length,
            itemsPerPage: data?.limit ?? limit
          }
        };

      } catch (error) {
        console.error('Error fetching users:', error);
        return {
          success: false,
          error: error?.message || 'Terjadi kesalahan saat memuat data'
        };
      }
    }
  }
  
  /**
   * Mendapatkan detail user berdasarkan ID
   */
  async getUserById(id) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const user = mockUsers.find(u => u.id === id);
      
      return {
        success: true,
        data: user || null
      };
      
    } else {
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        return data;
      } catch (error) {
        return { success: false, error: error.message };
      }
      */
    }
  }
  
  /**
   * Menambah user baru
   */
  async createUser(userData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nama)}&background=FF6B2C&color=fff`
      };
      
      mockUsers.push(newUser);
      
      return {
        success: true,
        data: newUser,
        message: 'User berhasil ditambahkan'
      };
      
    } else {
      // REAL API
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return { success: false, error: 'Tidak ada token. Silakan login terlebih dahulu.' };
        }

        // Handle avatar upload
        let avatarUrl = null;
        const avatarInput = userData.avatar;
        const isDataUrl = typeof avatarInput === 'string' && avatarInput.startsWith('data:');
        const isHttpUrl = typeof avatarInput === 'string' && (avatarInput.startsWith('http://') || avatarInput.startsWith('https://'));
        const isRelativeUpload = typeof avatarInput === 'string' && (avatarInput.startsWith('/uploads') || avatarInput.startsWith('uploads/'));

        if (isDataUrl) {
          // Convert data URL to Blob
          const matches = avatarInput.match(/^data:(.*?);base64,(.*)$/);
          const mimeType = matches?.[1] || 'image/jpeg';
          const base64Data = matches?.[2] || '';
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const ext = mimeType.split('/')[1] || 'jpg';
          const fileName = `user_${Date.now()}.${ext}`;

          const formData = new FormData();
          formData.append('file', blob, fileName);

          const uploadResp = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
              // Jangan set Content-Type; biarkan browser set boundary untuk multipart/form-data
            },
            body: formData
          });
          if (!uploadResp.ok) {
            const errText = await uploadResp.text().catch(() => 'Upload gagal');
            throw new Error(`Gagal mengunggah avatar: ${errText}`);
          }
          const uploadData = await uploadResp.json();
          if (uploadData?.url) {
            avatarUrl = uploadData.url;
          }
        } else if (isHttpUrl || isRelativeUpload) {
          avatarUrl = normalizeAvatarUrl(avatarInput);
        }

        // Payload mapping sesuai API
        const payload = {
          nama: userData.nama,
          email: userData.email,
          no_telepon: userData.noTelp,
          // Default role ke 'user' jika tidak disediakan dari UI
          role: userData.role || 'user',
          // Default password bila tidak disediakan dari UI
          password: userData.password || 'password123',
          status_user: userData.status || 'nonaktif',
          photo_profile: avatarUrl || null
        };

        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const respBody = await response.json().catch(() => null);
        if (!response.ok) {
          // Ekstrak pesan error lebih informatif, termasuk validasi 422
          let serverMsg = 'Gagal menambah user';
          if (respBody) {
            if (typeof respBody.detail === 'string') {
              serverMsg = respBody.detail;
            } else if (Array.isArray(respBody.detail)) {
              // Format: [{ loc: ["body", "email"], msg: "value is not a valid email address" }, ...]
              serverMsg = respBody.detail
                .map(e => {
                  const field = Array.isArray(e.loc) ? e.loc[e.loc.length - 1] : e.loc;
                  return field ? `${field}: ${e.msg}` : e.msg;
                })
                .join(', ');
            } else if (respBody.message) {
              serverMsg = respBody.message;
            }
          }
          throw new Error(serverMsg);
        }

        // Kembalikan struktur konsisten untuk UI
        return {
          success: true,
          data: respBody,
          message: 'User berhasil ditambahkan'
        };

      } catch (error) {
        return { success: false, error: error?.message || 'Terjadi kesalahan saat menambah user' };
      }
    }
  }
  
  /**
   * Update user
   */
  async updateUser(id, userData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...userData };
        
        return {
          success: true,
          data: mockUsers[index],
          message: 'User berhasil diupdate'
        };
      }
      
      return {
        success: false,
        error: 'User not found'
      };
      
    } else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return { success: false, error: 'Tidak ada token. Silakan login terlebih dahulu.' };
        }

        // Handle avatar
        let avatarUrl;
        const avatarInput = userData?.avatar;
        const isDataUrl = typeof avatarInput === 'string' && avatarInput.startsWith('data:');
        const isHttpUrl = typeof avatarInput === 'string' && (avatarInput.startsWith('http://') || avatarInput.startsWith('https://'));
        const isRelativeUpload = typeof avatarInput === 'string' && (avatarInput.startsWith('/uploads') || avatarInput.startsWith('uploads/'));
        const isEmpty = typeof avatarInput === 'string' && avatarInput.trim() === '';

        if (isDataUrl) {
          const matches = avatarInput.match(/^data:(.*?);base64,(.*)$/);
          const mimeType = matches?.[1] || 'image/jpeg';
          const base64Data = matches?.[2] || '';
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const ext = mimeType.split('/')[1] || 'jpg';
          const fileName = `user_${Date.now()}.${ext}`;

          const formData = new FormData();
          formData.append('file', blob, fileName);

          const uploadResp = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          });
          const uploadBody = await uploadResp.json().catch(() => null);
          if (!uploadResp.ok) {
            const errMsg = (uploadBody && (uploadBody.detail || uploadBody.message)) || 'Upload avatar gagal';
            throw new Error(errMsg);
          }
          if (uploadBody?.url) {
            avatarUrl = uploadBody.url;
          }
        } else if (isHttpUrl || isRelativeUpload) {
          avatarUrl = normalizeAvatarUrl(avatarInput);
        } else if (isEmpty) {
          avatarUrl = null; // hapus avatar
        }

        // Bangun payload secara partial
        const payload = {};
        if (typeof userData.nama !== 'undefined') payload.nama = userData.nama;
        if (typeof userData.email !== 'undefined') payload.email = userData.email;
        if (typeof userData.noTelp !== 'undefined') payload.no_telepon = userData.noTelp;
        if (typeof userData.status !== 'undefined') payload.status_user = userData.status || 'nonaktif';
        if (typeof userData.role !== 'undefined') payload.role = userData.role;
        if (typeof userData.password !== 'undefined' && userData.password) payload.password = userData.password;
        if (typeof avatarUrl !== 'undefined') payload.photo_profile = avatarUrl;

        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const respBody = await response.json().catch(() => null);
        if (!response.ok) {
          let serverMsg = 'Gagal mengupdate user';
          if (respBody) {
            if (typeof respBody.detail === 'string') {
              serverMsg = respBody.detail;
            } else if (Array.isArray(respBody.detail)) {
              serverMsg = respBody.detail
                .map(e => {
                  const field = Array.isArray(e.loc) ? e.loc[e.loc.length - 1] : e.loc;
                  return field ? `${field}: ${e.msg}` : e.msg;
                })
                .join(', ');
            } else if (respBody.message) {
              serverMsg = respBody.message;
            }
          }
          throw new Error(serverMsg);
        }

        return {
          success: true,
          data: respBody,
          message: 'User berhasil diupdate'
        };

      } catch (error) {
        return { success: false, error: error?.message || 'Terjadi kesalahan saat mengupdate user' };
      }
    }
  }

  /**
   * Patch status user: hanya 'aktif' atau 'nonaktif'
   */
  async updateUserStatus(id, newStatus) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers[index].status = newStatus;
        return { success: true, data: mockUsers[index], message: 'Status user diperbarui' };
      }
      return { success: false, error: 'User not found' };
    } else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return { success: false, error: 'Tidak ada token. Silakan login terlebih dahulu.' };
        }

        // Coba endpoint PATCH khusus status terlebih dahulu
        const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status_user: newStatus })
        });

        const respBody = await response.json().catch(() => null);
        if (response.ok) {
          return { success: true, data: respBody, message: 'Status user diperbarui' };
        }

        // Jika endpoint tidak ditemukan/diizinkan, fallback ke PUT /users/{id}
        if (response.status === 404 || response.status === 405) {
          const fallbackResp = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status_user: newStatus })
          });

          const fallbackBody = await fallbackResp.json().catch(() => null);
          if (fallbackResp.ok) {
            return { success: true, data: fallbackBody, message: 'Status user diperbarui' };
          }

          let msg = 'Gagal mengubah status';
          if (fallbackBody) {
            if (typeof fallbackBody.detail === 'string') msg = fallbackBody.detail;
            else if (Array.isArray(fallbackBody.detail)) {
              msg = fallbackBody.detail
                .map(e => {
                  const field = Array.isArray(e.loc) ? e.loc[e.loc.length - 1] : e.loc;
                  return field ? `${field}: ${e.msg}` : e.msg;
                })
                .join(', ');
            } else if (fallbackBody.message) msg = fallbackBody.message;
          }
          return { success: false, error: msg };
        }

        // Selain 404/405, kembalikan error dari PATCH status
        {
          const serverMessage = (respBody && (respBody.detail || respBody.message)) || 'Gagal mengubah status';
          return { success: false, error: serverMessage };
        }
      } catch (error) {
        return { success: false, error: error.message || 'Terjadi kesalahan saat mengubah status' };
      }
    }
  }
  
  /**
   * Hapus user
   */
  async deleteUser(id) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        
        return {
          success: true,
          message: 'User berhasil dihapus'
        };
      }
      
      return {
        success: false,
        error: 'User not found'
      };
      
    } else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return { success: false, error: 'Tidak ada token. Silakan login terlebih dahulu.' };
        }

        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Beberapa API delete mengembalikan body kosong; tangani aman
        let respBody = null;
        try {
          respBody = await response.json();
        } catch (_) {
          respBody = null;
        }

        if (!response.ok) {
          const serverMessage = (respBody && (respBody.detail || respBody.message)) || 'Gagal menghapus user';
          return { success: false, error: serverMessage };
        }

        return { success: true, message: 'User berhasil dihapus', data: respBody };
      } catch (error) {
        return { success: false, error: error.message || 'Terjadi kesalahan saat menghapus user' };
      }
    }
  }
}

// Export singleton instance
export default new UserService();
