export interface User {
    id: string
    email: string
    name: string
    role: 'user' | 'host' | 'admin'
    avatar?: string
  }
  
  export interface LoginData {
    email: string
    password: string
  }
  
  export interface RegisterData {
    name: string
    email: string
    password: string
    confirmPassword: string
    role: 'user' | 'host'
  }