export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  itemId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  revieweeId: string;
  itemId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}