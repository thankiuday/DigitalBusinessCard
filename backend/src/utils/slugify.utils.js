import { v4 as uuidv4 } from 'uuid';

export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
};

export const generateUniqueSlug = (name) => {
  const base = slugify(name || 'card');
  const suffix = uuidv4().split('-')[0];
  return `${base}-${suffix}`;
};
