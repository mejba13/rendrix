import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface AuthState {
  user: User | null;
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setOrganizations: (organizations: Organization[]) => void;
  setCurrentOrganization: (organization: Organization | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  switchOrganization: (orgId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  organizations: [],
  currentOrganization: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setOrganizations: (organizations) => set({ organizations }),
  setCurrentOrganization: (organization) => {
    set({ currentOrganization: organization });
    api.setOrganizationId(organization?.id || null);
  },

  login: async (email, password) => {
    const data = await api.login(email, password);
    set({
      user: { ...data.user, avatarUrl: null },
      organizations: data.organizations,
      currentOrganization: data.organizations[0] || null,
      isAuthenticated: true,
    });
  },

  register: async (email, password, firstName, lastName) => {
    const data = await api.register(email, password, firstName, lastName);
    set({
      user: data.user as User,
      organizations: [],
      currentOrganization: null,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await api.logout();
    set({
      user: null,
      organizations: [],
      currentOrganization: null,
      isAuthenticated: false,
    });
  },

  loadSession: async () => {
    try {
      api.loadTokens();
      api.loadOrganizationId();

      const data = await api.getMe();

      const savedOrgId = typeof window !== 'undefined'
        ? localStorage.getItem('organizationId')
        : null;

      const currentOrg = savedOrgId
        ? data.data.organizations.find((o) => o.id === savedOrgId) || data.data.organizations[0]
        : data.data.organizations[0];

      set({
        user: data.data.user,
        organizations: data.data.organizations,
        currentOrganization: currentOrg || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        organizations: [],
        currentOrganization: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  switchOrganization: (orgId) => {
    const { organizations } = get();
    const org = organizations.find((o) => o.id === orgId);
    if (org) {
      set({ currentOrganization: org });
      api.setOrganizationId(orgId);
    }
  },
}));
