import { Post } from '../types/post';
import { API_BASE_URL } from '../constants/constants';

class PostAPI {
  static async getAllPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to fetch posts: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async getPostById(id: string): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`);
      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to fetch post: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  }

  static async createPost(title: string, summary: string, content: string): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title, summary, content }),
      });
      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to create post: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  static async updatePost(id: string, partial: Partial<Post>): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(partial),
      });
      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to update post: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  }

  static async deletePost(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to delete post: ${errText}`);
      }
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }
}

export default PostAPI;
