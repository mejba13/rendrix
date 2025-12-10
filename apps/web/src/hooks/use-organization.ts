'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Types
type MemberRole = 'owner' | 'admin' | 'manager' | 'staff' | 'viewer';

interface OrganizationMember {
  id: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
}

interface OrganizationInvite {
  id: string;
  email: string;
  role: MemberRole;
  expiresAt: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: MemberRole;
  plan: string;
  storesCount: number;
  membersCount: number;
  joinedAt: string;
}

export type { OrganizationMember, OrganizationInvite, Organization, MemberRole };

// Fetch user's organizations
export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Organization[] }>('/organizations');
      return response.data;
    },
  });
}

// Fetch organization members
export function useOrganizationMembers() {
  return useQuery({
    queryKey: ['organization-members'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: OrganizationMember[] }>(
        '/organizations/current/members'
      );
      return response.data;
    },
  });
}

// Fetch pending invites
export function useOrganizationInvites() {
  return useQuery({
    queryKey: ['organization-invites'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: OrganizationInvite[] }>(
        '/organizations/current/invites'
      );
      return response.data;
    },
  });
}

// Invite member
export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: MemberRole }) => {
      const response = await apiClient.post<OrganizationInvite>(
        '/organizations/current/invites',
        { email, role }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-invites'] });
    },
  });
}

// Cancel invite
export function useCancelInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      await apiClient.delete(`/organizations/current/invites/${inviteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-invites'] });
    },
  });
}

// Resend invite
export function useResendInvite() {
  return useMutation({
    mutationFn: async (inviteId: string) => {
      await apiClient.post(`/organizations/current/invites/${inviteId}/resend`);
    },
  });
}

// Update member role
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: MemberRole }) => {
      const response = await apiClient.patch<OrganizationMember>(
        `/organizations/current/members/${memberId}`,
        { role }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
    },
  });
}

// Remove member
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      await apiClient.delete(`/organizations/current/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
    },
  });
}

// Leave organization
export function useLeaveOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/organizations/current/leave');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

// Update organization
export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; settings?: Record<string, unknown> }) => {
      const response = await apiClient.patch('/organizations/current', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}
