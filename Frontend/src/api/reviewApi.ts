import axiosInstance from './axiosInstance';
import { Review, CreateReviewRequest } from '../types/review.types';

export const submitReview = async (data: CreateReviewRequest): Promise<Review> => {
  const res = await axiosInstance.post('/reviews', data);
  return res.data;
};

export const getItemReviews = async (itemId: string): Promise<Review[]> => {
  const res = await axiosInstance.get(`/reviews/item/${itemId}`);
  return res.data;
};

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const res = await axiosInstance.get(`/reviews/user/${userId}`);
  return res.data;
};