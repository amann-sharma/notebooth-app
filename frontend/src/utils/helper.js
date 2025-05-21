export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const getInitials = (name = '') => {
  const trimmed = name.trim();
  if (!trimmed) return '?';

  const words = trimmed.split(' ');
  let initials = '';

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    if (words[i]) {
      initials += words[i][0];
    }
  }

  return initials.toUpperCase() || '?';
};
