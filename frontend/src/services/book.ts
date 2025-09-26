import { API_URL } from '../config';

export interface Book {
  id?: number;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  genre?: string;
  description?: string;
  publishedYear?: number;
  pageCount?: number;
}

export interface BookListResponse {
  content: Book[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const bookService = {
  async getBooks(page = 0, size = 10): Promise<BookListResponse> {
    const response = await fetch(`${API_URL}/books?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return response.json();
  },

  async addBook(book: Book): Promise<Book> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(book)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add book');
    }

    return response.json();
  },

  async deleteBook(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete book');
    }
  },

  async uploadBookCover(bookId: number, file: File): Promise<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/books/${bookId}/cover`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload cover');
    }

    return response.text();
  }
}; 