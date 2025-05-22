export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  surname: string;
  role: string;
  password: string;
  password2: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}
