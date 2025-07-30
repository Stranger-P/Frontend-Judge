export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    GOOGLE: '/api/auth/google',
    REFRESH: '/api/auth/refresh',
  },
  PROBLEMS: {
    LIST: '/api/problems',
    DETAIL: (id) => `/api/problems/${id}`,
    CREATE: '/api/problems',
    UPDATE: (id) => `/api/problems/${id}`,
    DELETE: (id) => `/api/problems/${id}`,
  },
  SUBMISSIONS: {
    SUBMIT: '/api/submissions',
    LIST: '/api/submissions',
    DETAIL: (id) => `/api/submissions/${id}`,
  },
  USERS: {
    LIST: '/api/users',
    DETAIL: (id) => `/api/users/${id}`,
    UPDATE_ROLE: (id) => `/api/users/${id}/role`,
    DELETE: (id) => `/api/users/${id}`,
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROBLEMS: '/problems',
  PROBLEM_DETAIL: (id) => `/problems/${id}`,
  CREATE_PROBLEM: '/problems/create',
  EDIT_PROBLEM: (id) => `/problems/${id}/edit`,
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  CREATED_PROBLEM: '/problems/mine',
  NOT_FOUND: '/404',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An internal server error occurred.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

export const USER_ROLES = {
  STUDENT: 'student',
  PROBLEM_SETTER: 'problem-setter',
  ADMIN: 'admin',
};

export const PROBLEM_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};