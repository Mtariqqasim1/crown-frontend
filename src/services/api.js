const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// ── Products ──────────────────────────────────────────────────
export const getProducts = async (category = '') => {
  const url = category ? `${API_BASE}/products?category=${category}` : `${API_BASE}/products`;
  const res = await fetch(url);
  return res.json();
};

export const getProductBySlug = async (slug) => {
  const res = await fetch(`${API_BASE}/products/${slug}`);
  return res.json();
};

// ── Orders ────────────────────────────────────────────────────
export const placeOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
};
