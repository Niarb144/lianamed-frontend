// src/utils/logout.ts
import { setAuthToken } from '../api/api';

export const logout = (navigate: (path: string) => void) => {
  // 1. Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');

  // 2. Remove auth header
  setAuthToken(null);

  // 3. Redirect to login
  navigate('/');
};
