// Limits based on the build plan
export const MAX_IMAGES = 3;
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 1024;

export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const STEPS = [
  { id: 1, label: 'Upload Assets' },
  { id: 2, label: 'Vision Analysis' },
  { id: 3, label: 'Brief Generation' },
];
