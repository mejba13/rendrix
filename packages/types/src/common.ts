// Common utility types

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDelete {
  deletedAt: Date | null;
}

export type ID = string;

export interface BaseEntity {
  id: ID;
}

export interface AuditableEntity extends BaseEntity, Timestamps {}

export type Status = 'active' | 'inactive' | 'pending' | 'suspended';

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
