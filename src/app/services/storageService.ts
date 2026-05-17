import { appConfig } from '../config/env';
import { ServiceError } from '../types';
import { supabaseAdapter } from './supabaseAdapter';

export const storageService = {
  async uploadImage(file: File) {
    if (!file.type.startsWith('image/')) {
      throw new ServiceError('upload_failed', 'Please choose an image file.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new ServiceError('upload_failed', 'Image is too large. Please use a file under 10MB.');
    }

    if (appConfig.serviceMode === 'remote') {
      const extension = file.name.split('.').pop() ?? 'png';
      return supabaseAdapter.uploadObject(`uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`, file);
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
          return;
        }

        reject(new ServiceError('upload_failed', 'We could not read that image. Try another file.'));
      };
      reader.onerror = () => reject(new ServiceError('upload_failed', 'Image upload failed. Try again.'));
      reader.readAsDataURL(file);
    });
  },
};
