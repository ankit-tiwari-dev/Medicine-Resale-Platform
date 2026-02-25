export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "current_user"
};

export const ROLES = {
  ADMIN: "admin",
  RIDER: "rider",
  USER: "user"
};

export const MEDICINE_CATEGORIES = [
  'All Categories',
  'Tablets',
  'Syrups',
  'Injections',
  'Inhalers',
  'First Aid',
  'Devices',
  'Vitamins'
];
