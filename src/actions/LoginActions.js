export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = userName => ({ type: LOGIN, userName });
export const logout = { type: LOGOUT };
