import axiosInstance from './axiosInstance';
import { User } from '../types/user.types';

export const uploadProfilePhoto = async (uri: string): Promise<User> => {
  const formData = new FormData();
  const filename = uri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('file', {
    uri,
    name: filename,
    type,
  } as any);

  const res = await axiosInstance.post('/users/me/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
