

export function login(email, password) {
    return new Promise((resolve, reject) => {
      // simulasi delay 700ms
      setTimeout(() => {
        // contoh mock credential: email: user@example.com, password: password123
        if (email === "user@example.com" && password === "password123") {
          const token = "mock-jwt-token-123"; // nanti ganti dengan yang nyata
          const user = { id: 1, name: "Mock User", email };
          resolve({ token, user });
        } else {
          reject(new Error("Email atau password salah"));
        }
      }, 700);
    });
  }
  
  // fungsi untuk logout (membersihkan token)
  export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  