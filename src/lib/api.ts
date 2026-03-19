import func2url from '../../backend/func2url.json';

const URLS = func2url as Record<string, string>;

export const API = {
  sendCode: URLS['auth-send-code'],
  verifyCode: URLS['auth-verify-code'],
  register: URLS['auth-register'],
  me: URLS['auth-me'],
};

export interface User {
  id: number;
  name: string;
  email: string | null;
  avatar: string;
  status: string;
  phone: string;
  bio: string | null;
}

const TOKEN_KEY = 'pulse_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function fetchMe(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(API.me, { headers: { 'X-Auth-Token': token } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}
