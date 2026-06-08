export const isKnustEmail = (email: string): boolean => {
  return email.trim().toLowerCase().endsWith('@knust.edu.gh');
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const getEmailError = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!isKnustEmail(email)) return 'Must be a valid @knust.edu.gh email';
  return null;
};

export const getPasswordError = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (!isValidPassword(password)) return 'Password must be at least 8 characters';
  return null;
};

export const getNameError = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
};