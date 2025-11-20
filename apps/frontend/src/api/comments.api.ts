import { API_BASE_URL } from '../constants/constants';
import { Comment } from '../types/comment';

class CommentAPI {
  static async getCommentsByPost(postId: string): Promise<Comment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}`);
      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to fetch comments: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }

  static async getCommentById(postId: string, commentId: string): Promise<Comment> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}/${commentId}`);
      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to fetch comment: ${errText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching comment ${commentId}:`, error);
      throw error;
    }
  }

  static async createComment(postId: string, content: string, token: string): Promise<Comment> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to create comment: ${errText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error creating comment for post ${postId}:`, error);
      throw error;
    }
  }

  static async updateComment(
    postId: string,
    commentId: string,
    partial: Partial<Comment>,
    token: string
  ): Promise<Comment> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(partial),
      });

      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to update comment: ${errText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  }

  static async deleteComment(postId: string, commentId: string, token: string | null): Promise<void> {
    if (!token) {
      throw new Error('Authentication token is required to delete a comment.');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${postId}/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to delete comment: ${errText}`);
      }
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  }
}

export default CommentAPI;