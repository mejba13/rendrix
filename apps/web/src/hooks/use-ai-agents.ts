'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { api } from '@/lib/api'; // Uncomment when API is ready

// Types
export type AIModelType = 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  model: AIModelType;
  systemInstructions: string;
  isActive: boolean;
  avatarColor: string;
  storeId: string;
  conversationCount: number;
  messageCount: number;
  resolutionRate: number;
  responseTime: number;
  satisfactionScore: number;
  capabilities: string[];
  welcomeMessage: string;
  fallbackMessage: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string | null;
}

export interface AIAgentStats {
  totalAgents: number;
  activeAgents: number;
  totalConversations: number;
  conversationsToday: number;
  messagesToday: number;
  averageResolutionRate: number;
  averageResponseTime: number;
  percentageChange: {
    agents: number;
    conversations: number;
    messages: number;
    resolutionRate: number;
  };
}

export interface CreateAgentInput {
  name: string;
  description: string;
  model: AIModelType;
  systemInstructions: string;
  avatarColor?: string;
  welcomeMessage?: string;
  fallbackMessage?: string;
  capabilities?: string[];
}

export interface UpdateAgentInput extends Partial<CreateAgentInput> {
  isActive?: boolean;
}

interface AIAgentsResponse {
  data: AIAgent[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Avatar color options
export const AVATAR_COLORS = [
  { id: 'amber', gradient: 'from-amber-500 to-orange-600' },
  { id: 'blue', gradient: 'from-blue-500 to-cyan-600' },
  { id: 'purple', gradient: 'from-purple-500 to-pink-600' },
  { id: 'green', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'red', gradient: 'from-red-500 to-rose-600' },
  { id: 'indigo', gradient: 'from-indigo-500 to-violet-600' },
];

// Model options
export const AI_MODELS: { id: AIModelType; name: string; provider: string; description: string }[] = [
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', description: 'Most capable, best for complex tasks' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'High quality, reliable performance' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and cost-effective' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Most intelligent, nuanced responses' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: 'Balanced performance and speed' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', description: 'Fastest, ideal for simple queries' },
];

// Fetch all agents for a store
export function useAIAgents(storeId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['ai-agents', storeId, params],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      const mockAgents: AIAgent[] = [
        {
          id: '1',
          name: 'Customer Support Bot',
          description: 'Handles general customer inquiries, order status, and returns',
          model: 'gpt-4-turbo',
          systemInstructions: 'You are a helpful customer support assistant for an e-commerce store...',
          isActive: true,
          avatarColor: 'amber',
          storeId,
          conversationCount: 1247,
          messageCount: 8934,
          resolutionRate: 94.2,
          responseTime: 1.2,
          satisfactionScore: 4.8,
          capabilities: ['orders', 'returns', 'products', 'shipping'],
          welcomeMessage: 'Hi! How can I help you today?',
          fallbackMessage: 'Let me connect you with a human agent.',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-12-20T15:30:00Z',
          lastActiveAt: '2024-12-24T09:45:00Z',
        },
        {
          id: '2',
          name: 'Sales Assistant',
          description: 'Helps customers find products and provides personalized recommendations',
          model: 'claude-3-sonnet',
          systemInstructions: 'You are a knowledgeable sales assistant who helps customers discover products...',
          isActive: true,
          avatarColor: 'blue',
          storeId,
          conversationCount: 856,
          messageCount: 5421,
          resolutionRate: 87.5,
          responseTime: 0.8,
          satisfactionScore: 4.6,
          capabilities: ['recommendations', 'products', 'comparisons'],
          welcomeMessage: 'Welcome! Looking for something specific today?',
          fallbackMessage: 'I\'ll get one of our experts to help you.',
          createdAt: '2024-02-20T14:00:00Z',
          updatedAt: '2024-12-19T11:20:00Z',
          lastActiveAt: '2024-12-24T08:30:00Z',
        },
        {
          id: '3',
          name: 'FAQ Bot',
          description: 'Answers frequently asked questions about store policies and procedures',
          model: 'gpt-3.5-turbo',
          systemInstructions: 'You answer common questions about our store policies...',
          isActive: false,
          avatarColor: 'purple',
          storeId,
          conversationCount: 432,
          messageCount: 1876,
          resolutionRate: 91.0,
          responseTime: 0.5,
          satisfactionScore: 4.3,
          capabilities: ['faq', 'policies'],
          welcomeMessage: 'Hello! I can help answer your questions.',
          fallbackMessage: 'Please contact our support team for more help.',
          createdAt: '2024-03-10T09:00:00Z',
          updatedAt: '2024-11-15T16:45:00Z',
          lastActiveAt: '2024-11-15T16:45:00Z',
        },
      ];

      return {
        data: mockAgents,
        meta: {
          total: mockAgents.length,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: 1,
        },
      } as AIAgentsResponse;
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch single agent
export function useAIAgent(agentId: string) {
  return useQuery({
    queryKey: ['ai-agent', agentId],
    queryFn: async () => {
      // Mock - replace with actual API call
      const mockAgent: AIAgent = {
        id: agentId,
        name: 'Customer Support Bot',
        description: 'Handles general customer inquiries, order status, and returns',
        model: 'gpt-4-turbo',
        systemInstructions: `You are a helpful customer support assistant for an e-commerce store. Your role is to:

1. Answer questions about orders, shipping, and returns
2. Help customers track their packages
3. Provide information about products
4. Resolve common issues quickly and efficiently

Always be polite, professional, and helpful. If you cannot resolve an issue, offer to connect the customer with a human agent.`,
        isActive: true,
        avatarColor: 'amber',
        storeId: 'store-1',
        conversationCount: 1247,
        messageCount: 8934,
        resolutionRate: 94.2,
        responseTime: 1.2,
        satisfactionScore: 4.8,
        capabilities: ['orders', 'returns', 'products', 'shipping'],
        welcomeMessage: 'Hi! How can I help you today?',
        fallbackMessage: 'Let me connect you with a human agent who can better assist you.',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-12-20T15:30:00Z',
        lastActiveAt: '2024-12-24T09:45:00Z',
      };
      return mockAgent;
    },
    enabled: !!agentId,
  });
}

// Fetch agent stats
export function useAgentStats(storeId: string) {
  return useQuery({
    queryKey: ['ai-agent-stats', storeId],
    queryFn: async () => {
      // Mock stats - replace with actual API call
      const mockStats: AIAgentStats = {
        totalAgents: 3,
        activeAgents: 2,
        totalConversations: 2535,
        conversationsToday: 47,
        messagesToday: 312,
        averageResolutionRate: 90.9,
        averageResponseTime: 0.83,
        percentageChange: {
          agents: 50,
          conversations: 12.5,
          messages: 8.2,
          resolutionRate: 2.1,
        },
      };
      return mockStats;
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 2,
  });
}

// Create agent mutation
export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ storeId, data }: { storeId: string; data: CreateAgentInput }) => {
      // Mock - replace with actual API call
      const newAgent: AIAgent = {
        id: `agent-${Date.now()}`,
        ...data,
        avatarColor: data.avatarColor || 'amber',
        welcomeMessage: data.welcomeMessage || 'Hello! How can I help you today?',
        fallbackMessage: data.fallbackMessage || 'Let me connect you with a human agent.',
        capabilities: data.capabilities || [],
        isActive: true,
        storeId,
        conversationCount: 0,
        messageCount: 0,
        resolutionRate: 0,
        responseTime: 0,
        satisfactionScore: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActiveAt: null,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return newAgent;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['ai-agent-stats', variables.storeId] });
    },
  });
}

// Update agent mutation
export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, data }: { agentId: string; storeId: string; data: UpdateAgentInput }) => {
      // Mock - replace with actual API call (storeId used for cache invalidation)
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: agentId, ...data };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['ai-agent', variables.agentId] });
      queryClient.invalidateQueries({ queryKey: ['ai-agent-stats', variables.storeId] });
    },
  });
}

// Delete agent mutation
export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId }: { agentId: string; storeId: string }) => {
      // Mock - replace with actual API call (storeId used for cache invalidation)
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, agentId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['ai-agent-stats', variables.storeId] });
    },
  });
}

// Toggle agent status
export function useToggleAgentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, isActive }: { agentId: string; storeId: string; isActive: boolean }) => {
      // storeId used for cache invalidation
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id: agentId, isActive };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-agents', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['ai-agent', variables.agentId] });
    },
  });
}
