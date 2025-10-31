import { AxiosError } from 'axios';
import instance from './index';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  isOwn?: boolean;
}

export interface CommentResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface CreateCommentPayload {
  postId: string;
  text: string;
}

/**
 * Fetches comments for a specific post with pagination
 */
export const getCommentsService = async (
  postId: string,
  page: number = 1,
  limit: number = 20
): Promise<CommentResponse | null> => {
  try {
    const { data } = await instance.get<CommentResponse>('/comment', {
      params: { postId, page, limit },
    });
    return data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error('Error fetching comments:', error.response?.data?.message);
      return null;
    }
    return null;
  }
};

/**
 * Creates a new comment
 */
export const createCommentService = async (
  payload: CreateCommentPayload
): Promise<{ success: boolean; data?: Comment; message?: string }> => {
  try {
    const { data } = await instance.post<Comment>('/comment', payload);
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create comment',
      };
    }
    return {
      success: false,
      message: 'Something went wrong',
    };
  }
};

/**
 * Deletes a comment
 */
export const deleteCommentService = async (
  commentId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    await instance.delete(`/comment/${commentId}`);
    return {
      success: true,
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete comment',
      };
    }
    return {
      success: false,
      message: 'Something went wrong',
    };
  }
};

