import { API_BASE_URL } from '../constants/constants';

class AuthAPI {
  static async signUp (name: string, email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        throw new Error(`Failed to signup: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching auth:', error);
      throw error;
    }
  }

  static async logIn (name: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching auth:', error);
      throw error;
    }
  }
}


export default AuthAPI;