// Service layer untuk mengelola data user
// Mirip dengan Repository pattern di Flutter

import { mockUsers } from '../data/mockUsers';

// Flag untuk toggle antara mock dan real API
const USE_MOCK_DATA = true;

// Base URL untuk API (akan digunakan saat sudah connect ke real API)
const API_BASE_URL = 'http://localhost:3000/api';

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
      // REAL API - Uncomment ketika sudah siap
      /*
      try {
        const queryParams = new URLSearchParams({
          page,
          limit,
          search,
          status,
          sortOrder
        });
        
        const response = await fetch(`${API_BASE_URL}/users?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        return data;
        
      } catch (error) {
        console.error('Error fetching users:', error);
        return {
          success: false,
          error: error.message
        };
      }
      */
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
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error('Failed to create user');
        const data = await response.json();
        return data;
        
      } catch (error) {
        return { success: false, error: error.message };
      }
      */
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
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error('Failed to update user');
        const data = await response.json();
        return data;
        
      } catch (error) {
        return { success: false, error: error.message };
      }
      */
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
      // REAL API
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete user');
        const data = await response.json();
        return data;
        
      } catch (error) {
        return { success: false, error: error.message };
      }
      */
    }
  }
}

// Export singleton instance
export default new UserService();
