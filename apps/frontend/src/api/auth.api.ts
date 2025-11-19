import { API_BASE_URL } from '../constants/constants';

class AuthAPI {
  static async _signUp(name: string, email: string, password: string, admin: boolean = false, token: string | null = null) {
    const method = admin ? "signup-admin" : "signup";
    var headers;
    if (admin) {
      headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
    } else {
      headers = { 'Content-Type': 'application/json', };
    }
      const response = await fetch(`${API_BASE_URL}/auth/${method}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      let errText = response.statusText;
      try {
        const errJson = await response.json();
        errText = errJson?.message || errJson?.error || errText;
      } catch {}
      throw new Error(`Failed to signup: ${errText}`);
    }
    return await response.json();
  }

  static async signUp(name: string, email: string, password: string) {
    return this._signUp(name, email, password);
  }

  static async signUpAdmin(name: string, email: string, password: string, role: string, token: string | null) {
    if (role !== 'admin') {
      throw new Error('Only admins can create admin accounts');
    }
    return this._signUp(name, email, password, true, token);
  }

  static async logIn(name: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });

    if (!response.ok) {
      let errText = response.statusText;
      try {
        const errJson = await response.json();
        errText = errJson?.message || errJson?.error || errText;
      } catch {}
      throw new Error(`Failed to login: ${errText}`);
    }
    return await response.json();
  }
}

export default AuthAPI;
