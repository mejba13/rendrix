'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useStoreStore } from '@/store/store';

export type BlogPostStatus = 'draft' | 'published' | 'scheduled';
export type BlogPostVisibility = 'public' | 'private' | 'password';

export interface BlogCategory {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  postsCount?: number;
}

export interface BlogPost {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  authorName: string | null;
  status: BlogPostStatus;
  visibility: BlogPostVisibility;
  password: string | null;
  allowComments: boolean;
  isFeatured: boolean;
  viewCount: number;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: string[];
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  categories: { id: string; name: string; slug: string }[];
}

export interface BlogPostListItem extends Omit<BlogPost, 'content'> {}

interface BlogPostsResponse {
  success: boolean;
  data: BlogPostListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface BlogPostResponse {
  success: boolean;
  data: BlogPost;
}

interface BlogCategoriesResponse {
  success: boolean;
  data: BlogCategory[];
}

interface BlogPostsParams {
  page?: number;
  limit?: number;
  status?: BlogPostStatus;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
  tag?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string | null;
  authorName?: string;
  status?: BlogPostStatus;
  visibility?: BlogPostVisibility;
  password?: string;
  allowComments?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  categoryIds?: string[];
  publishedAt?: string;
  scheduledAt?: string;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {}

export interface CreateBlogCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string | null;
  sortOrder?: number;
}

export interface UpdateBlogCategoryInput extends Partial<CreateBlogCategoryInput> {}

// Blog Posts Hooks
export function useBlogPosts(params: BlogPostsParams = {}) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['blogPosts', currentStore?.id, params],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });

      const response = await api.get<BlogPostsResponse>(
        `/stores/${currentStore.id}/blogs/posts?${searchParams.toString()}`
      );
      return response.data;
    },
    enabled: !!currentStore,
  });
}

export function useBlogPost(postId: string | undefined) {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['blogPost', currentStore?.id, postId],
    queryFn: async () => {
      if (!currentStore || !postId) throw new Error('No store or post selected');

      const response = await api.get<BlogPostResponse>(
        `/stores/${currentStore.id}/blogs/posts/${postId}`
      );
      return response.data.data;
    },
    enabled: !!currentStore && !!postId,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreateBlogPostInput) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.post<BlogPostResponse>(
        `/stores/${currentStore.id}/blogs/posts`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts', currentStore?.id] });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ postId, data }: { postId: string; data: UpdateBlogPostInput }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.patch<BlogPostResponse>(
        `/stores/${currentStore.id}/blogs/posts/${postId}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts', currentStore?.id] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', currentStore?.id, postId] });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!currentStore) throw new Error('No store selected');

      await api.delete(`/stores/${currentStore.id}/blogs/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts', currentStore?.id] });
    },
  });
}

export function useBulkBlogPostAction() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({
      action,
      postIds,
    }: {
      action: 'publish' | 'unpublish' | 'delete' | 'feature' | 'unfeature';
      postIds: string[];
    }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.post(
        `/stores/${currentStore.id}/blogs/posts/bulk`,
        { action, postIds }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts', currentStore?.id] });
    },
  });
}

// Blog Categories Hooks
export function useBlogCategories() {
  const { currentStore } = useStoreStore();

  return useQuery({
    queryKey: ['blogCategories', currentStore?.id],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.get<BlogCategoriesResponse>(
        `/stores/${currentStore.id}/blogs/categories`
      );
      return response.data.data;
    },
    enabled: !!currentStore,
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (data: CreateBlogCategoryInput) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.post(
        `/stores/${currentStore.id}/blogs/categories`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories', currentStore?.id] });
    },
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async ({ categoryId, data }: { categoryId: string; data: UpdateBlogCategoryInput }) => {
      if (!currentStore) throw new Error('No store selected');

      const response = await api.patch(
        `/stores/${currentStore.id}/blogs/categories/${categoryId}`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories', currentStore?.id] });
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();
  const { currentStore } = useStoreStore();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      if (!currentStore) throw new Error('No store selected');

      await api.delete(`/stores/${currentStore.id}/blogs/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories', currentStore?.id] });
    },
  });
}

export type { BlogPostListItem };
