'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreStore } from '@/store/store';
import {
  useAIAgents,
  useAgentStats,
  useCreateAgent,
  useDeleteAgent,
  useToggleAgentStatus,
  AI_MODELS,
  AVATAR_COLORS,
  type AIAgent,
  type AIModelType,
  type CreateAgentInput,
} from '@/hooks/use-ai-agents';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Plus,
  MessageSquare,
  CheckCircle2,
  Settings,
  MessageCircle,
  Trash2,
  Sparkles,
  Clock,
  TrendingUp,
  MoreVertical,
  Copy,
  ExternalLink,
  AlertTriangle,
  Brain,
  Cpu,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: number;
  delay: number;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-white tracking-tight">{value}</span>
            {change !== undefined && (
              <span className={`text-xs font-medium flex items-center gap-0.5 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
                {change >= 0 ? '+' : ''}{change}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for stat card
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

// Agent Card Component
function AgentCard({
  agent,
  onConfigure,
  onTestChat,
  onDelete,
  onToggleStatus,
  isTogglingStatus,
}: {
  agent: AIAgent;
  onConfigure: () => void;
  onTestChat: () => void;
  onDelete: () => void;
  onToggleStatus: (isActive: boolean) => void;
  isTogglingStatus: boolean;
}) {
  const avatarColor = AVATAR_COLORS.find(c => c.id === agent.avatarColor) || AVATAR_COLORS[0];
  const modelInfo = AI_MODELS.find(m => m.id === agent.model);

  const formatLastActive = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 5) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] transition-all duration-500 hover:bg-white/[0.03] hover:border-white/[0.1] hover:shadow-[0_8px_40px_-12px_rgba(251,191,36,0.1)]">
      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${agent.isActive ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500' : 'bg-white/10'}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColor.gradient} flex items-center justify-center shadow-lg`}>
              <Bot className="w-6 h-6 text-white" />
              {/* Active pulse indicator */}
              {agent.isActive && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white truncate">{agent.name}</h3>
              <p className="text-sm text-white/40 truncate">{agent.description}</p>
            </div>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onConfigure}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onTestChat}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Test Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Embed Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-400 focus:text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Model & Status */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-white/[0.06] text-white/70 border-0 gap-1.5">
            <Cpu className="w-3 h-3" />
            {modelInfo?.name || agent.model}
          </Badge>
          <Badge
            variant="secondary"
            className={`border-0 gap-1 ${agent.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/[0.04] text-white/40'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${agent.isActive ? 'bg-emerald-400' : 'bg-white/40'}`} />
            {agent.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{agent.conversationCount.toLocaleString()}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Conversations</div>
          </div>
          <div className="text-center border-x border-white/[0.06]">
            <div className="text-lg font-semibold text-white">{agent.messageCount.toLocaleString()}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Messages</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{agent.resolutionRate}%</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Resolved</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Clock className="w-3 h-3" />
            {formatLastActive(agent.lastActiveAt)}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">{agent.isActive ? 'Online' : 'Offline'}</span>
            <Switch
              checked={agent.isActive}
              onCheckedChange={onToggleStatus}
              disabled={isTogglingStatus}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Agent Card Skeleton
function AgentCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl mb-4" />
      <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-10 rounded-full" />
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-6">
      {/* Animated illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
          <Bot className="w-16 h-16 text-amber-400/60" />
        </div>
        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-amber-500/20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-md bg-orange-500/20 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 -right-6 w-3 h-3 rounded-full bg-amber-400/30 animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">No AI Agents Yet</h3>
      <p className="text-white/40 text-center max-w-md mb-6">
        Create your first AI agent to provide intelligent, 24/7 customer support for your store.
      </p>

      <Button
        onClick={onCreate}
        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold px-6 gap-2"
      >
        <Plus className="w-4 h-4" />
        Create Your First Agent
      </Button>
    </div>
  );
}

// Create Agent Dialog
function CreateAgentDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAgentInput) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState<AIModelType>('gpt-4-turbo');
  const [systemInstructions, setSystemInstructions] = useState('');
  const [avatarColor, setAvatarColor] = useState('amber');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !systemInstructions.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      model,
      systemInstructions: systemInstructions.trim(),
      avatarColor,
    });
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setModel('gpt-4-turbo');
      setSystemInstructions('');
      setAvatarColor('amber');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-amber-500/10 to-transparent border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-white">Create AI Agent</DialogTitle>
              <DialogDescription className="text-sm text-white/40">
                Configure your intelligent assistant
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Avatar Color Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Avatar Color</label>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setAvatarColor(color.id)}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center transition-all duration-200 ${
                    avatarColor === color.id
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110'
                      : 'hover:scale-105 opacity-60 hover:opacity-100'
                  }`}
                >
                  {avatarColor === color.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Agent Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Customer Support Bot"
              className="h-11"
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this agent does"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">AI Model</label>
            <Select value={model} onValueChange={(v) => setModel(v as AIModelType)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-amber-400" />
                      <span>{m.name}</span>
                      <span className="text-white/30 text-xs">({m.provider})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-white/30">
              {AI_MODELS.find(m => m.id === model)?.description}
            </p>
          </div>

          {/* System Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">System Instructions</label>
            <Textarea
              value={systemInstructions}
              onChange={(e) => setSystemInstructions(e.target.value)}
              placeholder="Define how your AI agent should behave, what it knows, and how it should respond to customers..."
              className="min-h-[120px] resize-none"
              required
            />
            <p className="text-xs text-white/30">
              These instructions guide your agent&apos;s personality and capabilities
            </p>
          </div>

          <DialogFooter className="pt-4 border-t border-white/[0.06]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/60 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || !systemInstructions.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Agent
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteAgentDialog({
  open,
  onOpenChange,
  agent,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AIAgent | null;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-white">Delete Agent</DialogTitle>
              <DialogDescription className="text-sm text-white/40">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-white/70">
            Are you sure you want to delete <span className="font-semibold text-white">{agent.name}</span>?
          </p>
          <p className="text-sm text-white/40 mt-2">
            All conversation history and configurations will be permanently removed.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white/60 hover:text-white hover:bg-white/[0.06]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Agent
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Page Component
export default function AIAgentsPage() {
  const router = useRouter();
  const { currentStore } = useStoreStore();
  const { toast } = useToast();
  const storeId = currentStore?.id || '';

  // State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteAgent, setDeleteAgent] = useState<AIAgent | null>(null);
  const [togglingAgentId, setTogglingAgentId] = useState<string | null>(null);

  // Queries and Mutations
  const { data: agentsData, isLoading: isLoadingAgents } = useAIAgents(storeId);
  const { data: stats, isLoading: isLoadingStats } = useAgentStats(storeId);
  const createAgent = useCreateAgent();
  const deleteAgentMutation = useDeleteAgent();
  const toggleStatus = useToggleAgentStatus();

  const agents = agentsData?.data || [];

  // Handlers
  const handleCreateAgent = async (data: CreateAgentInput) => {
    try {
      await createAgent.mutateAsync({ storeId, data });
      toast({ title: 'AI Agent created successfully' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({ title: 'Failed to create agent', variant: 'destructive' });
    }
  };

  const handleDeleteAgent = async () => {
    if (!deleteAgent) return;
    try {
      await deleteAgentMutation.mutateAsync({ agentId: deleteAgent.id, storeId });
      toast({ title: 'Agent deleted successfully' });
      setDeleteAgent(null);
    } catch (error) {
      toast({ title: 'Failed to delete agent', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (agent: AIAgent, isActive: boolean) => {
    setTogglingAgentId(agent.id);
    try {
      await toggleStatus.mutateAsync({ agentId: agent.id, storeId, isActive });
      toast({ title: `Agent ${isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
      toast({ title: 'Failed to update agent status', variant: 'destructive' });
    } finally {
      setTogglingAgentId(null);
    }
  };

  const handleConfigure = (agentId: string) => {
    router.push(`/dashboard/ai-agents/${agentId}`);
  };

  const handleTestChat = (agentId: string) => {
    router.push(`/dashboard/ai-agents/${agentId}?tab=test`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
            <Bot className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">AI Agents</h1>
            <p className="text-white/40 text-sm mt-0.5">
              Create intelligent chatbots to assist your customers
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold gap-2 h-11 px-5"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingStats ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Bot}
              label="Total Agents"
              value={stats?.totalAgents || 0}
              change={stats?.percentageChange.agents}
              delay={0}
            />
            <StatCard
              icon={MessageSquare}
              label="Conversations Today"
              value={stats?.conversationsToday || 0}
              change={stats?.percentageChange.conversations}
              delay={50}
            />
            <StatCard
              icon={MessageCircle}
              label="Messages Today"
              value={stats?.messagesToday || 0}
              change={stats?.percentageChange.messages}
              delay={100}
            />
            <StatCard
              icon={CheckCircle2}
              label="Resolution Rate"
              value={`${stats?.averageResolutionRate || 0}%`}
              change={stats?.percentageChange.resolutionRate}
              delay={150}
            />
          </>
        )}
      </div>

      {/* Agents Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Your Agents</h2>
          {agents.length > 0 && (
            <span className="text-sm text-white/40">{agents.length} agent{agents.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {isLoadingAgents ? (
            <>
              <AgentCardSkeleton />
              <AgentCardSkeleton />
              <AgentCardSkeleton />
            </>
          ) : agents.length === 0 ? (
            <EmptyState onCreate={() => setIsCreateDialogOpen(true)} />
          ) : (
            agents.map((agent, index) => (
              <div
                key={agent.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AgentCard
                  agent={agent}
                  onConfigure={() => handleConfigure(agent.id)}
                  onTestChat={() => handleTestChat(agent.id)}
                  onDelete={() => setDeleteAgent(agent)}
                  onToggleStatus={(isActive) => handleToggleStatus(agent, isActive)}
                  isTogglingStatus={togglingAgentId === agent.id}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateAgentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAgent}
        isLoading={createAgent.isPending}
      />

      <DeleteAgentDialog
        open={!!deleteAgent}
        onOpenChange={(open) => !open && setDeleteAgent(null)}
        agent={deleteAgent}
        onConfirm={handleDeleteAgent}
        isLoading={deleteAgentMutation.isPending}
      />
    </div>
  );
}
