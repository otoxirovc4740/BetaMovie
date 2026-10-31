const API_URL = import.meta.env.VITE_API_URL || '';

function getInitData(): string {
  return window.Telegram?.WebApp?.initData || '';
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${getInitData()}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Server xatosi: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  me: () => request('/api/me'),

  home: () => request('/api/home'),

  genres: () => request('/api/genres'),

  movies: (params = '') => request(`/api/movies${params}`),

  search: (query: string) =>
    request(`/api/movies/search?q=${encodeURIComponent(query)}`),

  movie: (id: number) => request(`/api/movies/${id}`),

  favorites: () => request('/api/favorites'),

  addFavorite: (id: number) =>
    request(`/api/favorites/${id}`, { method: 'PUT' }),

  removeFavorite: (id: number) =>
    request(`/api/favorites/${id}`, { method: 'DELETE' }),

  updateProfile: (data: { theme?: 'dark' | 'light'; language?: 'uz' }) =>
    request('/api/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
