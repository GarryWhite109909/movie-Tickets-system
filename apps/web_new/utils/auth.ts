export type AuthUser = Record<string, unknown> & {
  userId?: number | string;
  userName?: string;
  username?: string;
  token?: string;
};

let cachedToken: string | null | undefined = undefined;
let cachedUser: AuthUser | null | undefined = undefined;

function readTokenFromStorage(): string | null {
  const token = localStorage.getItem('token');
  return token;
}

function readUserFromStorage(): AuthUser | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const parsed: unknown = JSON.parse(userStr);
    if (typeof parsed === 'object' && parsed !== null) return parsed as AuthUser;
    return null;
  } catch {
    return null;
  }
}

export const auth = {
  login: (token: string, user: AuthUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    cachedToken = token;
    cachedUser = user;
    window.dispatchEvent(new Event('auth-change'));
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cachedToken = null;
    cachedUser = null;
    window.dispatchEvent(new Event('auth-change'));
  },
  getToken: () => {
    if (typeof window === 'undefined') return null;
    if (cachedToken === undefined) cachedToken = readTokenFromStorage();
    return cachedToken;
  },
  getUser: () => {
    if (typeof window === 'undefined') return null;
    if (cachedUser === undefined) cachedUser = readUserFromStorage();
    return cachedUser;
  }
};
