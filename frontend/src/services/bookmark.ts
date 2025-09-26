import { API_URL } from '../config';

export interface BookmarkedBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  dateAdded: string;
}

export const bookmarkService = {
  async getBookmarks(): Promise<BookmarkedBook[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/bookmarks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookmarks');
    }

    return response.json();
  },

  async toggleBookmark(bookId: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/bookmarks/${bookId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to toggle bookmark');
    }
  },

  async isBookmarked(bookId: number): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_URL}/bookmarks/${bookId}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return false;
    }

    return response.json();
  }
}; 