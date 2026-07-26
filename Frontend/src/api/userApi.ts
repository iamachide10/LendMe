import axiosInstance from './axiosInstance';
import { MomoDetailsRequest, User } from '../types/user.types';

export const updateMomoDetails = async (
  data: MomoDetailsRequest
): Promise<User> => {
  const res = await axiosInstance.put('/users/me/momo', data);
  return res.data;
};

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
