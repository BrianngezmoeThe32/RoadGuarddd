export const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  
  return '';
};

export const validateName = (name: string): string => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  
  return '';
};

export const validatePhone = (phone: string): string => {
  if (!phone) return 'Phone number is required';
  
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!phoneRegex.test(phone.replace(/\D/g, ''))) return 'Please enter a valid phone number';
  
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  
  return '';
};