import { Upload } from '../types/upload';
import { API_BASE_URL } from '../constants/constants';

class UploadAPI {

  static async uploadFile(file: File): Promise<Upload> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'POST',
        credentials: 'include',
        // do not set Content-Type — browser sets multipart/form-data
        body: formData,
      });

      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to upload file: ${errText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error uploading file:`, error);
      throw error;
    }
  }

  static async deleteUpload(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        let errText = response.statusText;
        try {
          const errJson = await response.json();
          errText = errJson?.message || errJson?.error || errText;
        } catch {}
        throw new Error(`Failed to delete upload: ${errText}`);
      }
    } catch (error) {
      console.error(`Error deleting upload ${id}:`, error);
      throw error;
    }
  }
}

export default UploadAPI;