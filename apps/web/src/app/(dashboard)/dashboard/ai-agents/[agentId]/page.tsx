'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStoreStore } from '@/store/store';
import {
  useAIAgent,
  useUpdateAgent,
  useDeleteAgent,
  AI_MODELS,
  AVATAR_COLORS,
  type AIModelType,
  type UpdateAgentInput,
} from '@/hooks/use-ai-agents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  ChevronLeft,
  Settings,
  MessageSquare,
  Brain,
  Palette,
  Code,
  BarChart3,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Send,
  User,
  Sparkles,
  Clock,
  MessageCircle,
  FileText,
  Upload,
  Plus,
  X,
  Cpu,
  Wand2,
  BookOpen,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

// Tab definitions
const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'instructions', label: 'Instructions', icon: Brain },
  { id: 'behavior', label: 'Behavior', icon: Wand2 },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integration', label: 'Integration', icon: Code },
  { id: 'test', label: 'Test Chat', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const;

type TabId = typeof TABS[number]['id'];

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <div className="text-xl font-semibold text-white">{value}</div>
          <div className="text-xs text-white/40">{label}</div>
          {subValue && <div className="text-xs text-emerald-400">{subValue}</div>}
        </div>
      </div>
    </div>
  );
}

// Chat Message Component
function ChatMessage({
  role,
  content,
  timestamp,
}: {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        role === 'user'
          ? 'bg-white/10'
          : 'bg-gradient-to-br from-amber-500 to-orange-600'
      }`}>
        {role === 'user' ? (
          <User className="w-4 h-4 text-white/70" />
        ) : (
          <Bot className="w-4 h-4 text-black" />
        )}
      </div>
      <div className={`flex-1 max-w-[80%] ${role === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-2.5 rounded-2xl ${
          role === 'user'
            ? 'bg-amber-500/20 text-white rounded-tr-md'
            : 'bg-white/[0.06] text-white/80 rounded-tl-md'
        }`}>
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        {timestamp && (
          <p className="text-[10px] text-white/30 mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
}

// Knowledge Item Component
function KnowledgeItem({
  title,
  type,
  size,
  onRemove,
}: {
  title: string;
  type: string;
  size: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] group hover:bg-white/[0.04] transition-colors">
      <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
        <FileText className="w-5 h-5 text-white/40" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-white/40">{type} • {size}</p>
      </div>
      <button
        onClick={onRemove}
        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/[0.06] text-white/40 hover:text-red-400 transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Main Page Component
export default function AgentConfigurationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const agentId = params.agentId as string;
  const { currentStore } = useStoreStore();
  const storeId = currentStore?.id || '';

  // Get initial tab from URL
  const initialTab = (searchParams.get('tab') as TabId) || 'general';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState<AIModelType>('gpt-4-turbo');
  const [systemInstructions, setSystemInstructions] = useState('');
  const [avatarColor, setAvatarColor] = useState('amber');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);

  // Test chat state
  const [testMessages, setTestMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [testInput, setTestInput] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Queries and mutations
  const { data: agent, isLoading } = useAIAgent(agentId);
  const updateAgent = useUpdateAgent();
  const deleteAgentMutation = useDeleteAgent();

  // Initialize form with agent data
  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setDescription(agent.description);
      setModel(agent.model);
      setSystemInstructions(agent.systemInstructions);
      setAvatarColor(agent.avatarColor);
      setWelcomeMessage(agent.welcomeMessage);
      setFallbackMessage(agent.fallbackMessage);
      setIsActive(agent.isActive);
    }
  }, [agent]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [testMessages]);

  // Handle tab change
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    router.push(`/dashboard/ai-agents/${agentId}?tab=${tabId}`, { scroll: false });
  };

  // Handle save
  const handleSave = async () => {
    const data: UpdateAgentInput = {
      name,
      description,
      model,
      systemInstructions,
      avatarColor,
      welcomeMessage,
      fallbackMessage,
      isActive,
    };

    try {
      await updateAgent.mutateAsync({ agentId, storeId, data });
      toast({ title: 'Agent saved successfully' });
    } catch (error) {
      toast({ title: 'Failed to save agent', variant: 'destructive' });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteAgentMutation.mutateAsync({ agentId, storeId });
      toast({ title: 'Agent deleted' });
      router.push('/dashboard/ai-agents');
    } catch (error) {
      toast({ title: 'Failed to delete agent', variant: 'destructive' });
    }
  };

  // Handle test chat
  const handleTestSend = async () => {
    if (!testInput.trim() || isTestLoading) return;

    const userMessage = testInput.trim();
    setTestInput('');
    setTestMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTestLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that! Let me look into this for you.",
        "Great question! Based on our store policies, I can provide you with the following information...",
        "Thank you for reaching out! I can assist you with your inquiry right away.",
        "I understand your concern. Let me check the details and get back to you with an accurate answer.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setTestMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      setIsTestLoading(false);
    }, 1500);
  };

  // Copy embed code
  const embedCode = `<script src="https://rendrix.io/chat/widget.js" data-agent-id="${agentId}" data-store-id="${storeId}"></script>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    toast({ title: 'Embed code copied to clipboard' });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Agent Not Found</h2>
        <p className="text-white/40 mb-6">The agent you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild>
          <Link href="/dashboard/ai-agents">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Link>
        </Button>
      </div>
    );
  }

  const avatarGradient = AVATAR_COLORS.find(c => c.id === avatarColor)?.gradient || AVATAR_COLORS[0].gradient;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/ai-agents"
            className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-lg`}>
            <Bot className="w-6 h-6 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white tracking-tight">{name}</h1>
              <Badge
                variant="secondary"
                className={`border-0 ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/[0.04] text-white/40'}`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-white/40 text-sm">{description || 'No description'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateAgent.isPending}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold gap-2"
          >
            {updateAgent.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white/[0.08] text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Avatar Color */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/70">Avatar Color</label>
                <div className="flex gap-2">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color.id}
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

              {/* Status */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/70">Status</label>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{isActive ? 'Active' : 'Inactive'}</p>
                    <p className="text-xs text-white/40">
                      {isActive ? 'Agent is live and responding to customers' : 'Agent is disabled'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Agent Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Customer Support Bot"
                className="h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this agent does"
              />
            </div>

            {/* Model */}
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
                        <Cpu className="w-4 h-4 text-amber-400" />
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

            {/* Welcome Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Welcome Message</label>
              <Input
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Hi! How can I help you today?"
              />
              <p className="text-xs text-white/30">First message shown when a customer starts a chat</p>
            </div>

            {/* Fallback Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Fallback Message</label>
              <Input
                value={fallbackMessage}
                onChange={(e) => setFallbackMessage(e.target.value)}
                placeholder="Let me connect you with a human agent..."
              />
              <p className="text-xs text-white/30">Message when the agent can&apos;t handle a request</p>
            </div>
          </div>
        )}

        {/* Instructions Tab */}
        {activeTab === 'instructions' && (
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">System Instructions</p>
                <p className="text-sm text-white/50 mt-1">
                  Define your agent&apos;s personality, knowledge, and how it should respond to customers.
                  Be specific and detailed for best results.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/70">Instructions</label>
                <span className="text-xs text-white/30">{systemInstructions.length} characters</span>
              </div>
              <Textarea
                value={systemInstructions}
                onChange={(e) => setSystemInstructions(e.target.value)}
                placeholder={`Example:
You are a helpful customer support assistant for [Store Name]. Your role is to:

1. Answer questions about orders, shipping, and returns
2. Help customers find products
3. Provide information about store policies
4. Be friendly, professional, and helpful

Always respond in a conversational tone. If you cannot help with something, offer to connect the customer with a human agent.`}
                className="min-h-[400px] font-mono text-sm resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
                <HelpCircle className="w-4 h-4" />
                View Examples
              </Button>
              <Button variant="outline" className="gap-2 border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
                <Wand2 className="w-4 h-4" />
                AI Assist
              </Button>
            </div>
          </div>
        )}

        {/* Behavior Tab */}
        {activeTab === 'behavior' && (
          <div className="p-6 space-y-8">
            {/* Temperature */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Creativity (Temperature)</label>
                  <p className="text-xs text-white/40 mt-1">
                    Lower values make responses more focused and deterministic
                  </p>
                </div>
                <span className="text-lg font-semibold text-amber-400">{temperature[0]}</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={0}
                max={1}
                step={0.1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-white/30">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Max Response Length</label>
                  <p className="text-xs text-white/40 mt-1">
                    Maximum number of tokens in each response
                  </p>
                </div>
                <span className="text-lg font-semibold text-amber-400">{maxTokens[0]}</span>
              </div>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                min={256}
                max={4096}
                step={256}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-white/30">
                <span>Brief</span>
                <span>Detailed</span>
              </div>
            </div>

            {/* Response Style */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Response Style</label>
              <div className="grid grid-cols-3 gap-3">
                {['Professional', 'Friendly', 'Casual'].map((style) => (
                  <button
                    key={style}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white/70 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all text-sm font-medium"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Tab */}
        {activeTab === 'knowledge' && (
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <BookOpen className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Knowledge Base</p>
                <p className="text-sm text-white/50 mt-1">
                  Upload documents, FAQs, and product information to enhance your agent&apos;s knowledge.
                </p>
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-white/30 mx-auto mb-4" />
              <p className="text-sm font-medium text-white mb-1">Drop files here or click to upload</p>
              <p className="text-xs text-white/40">PDF, TXT, DOC, DOCX up to 10MB each</p>
            </div>

            {/* Knowledge Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Uploaded Documents</h3>
                <span className="text-xs text-white/40">3 files</span>
              </div>
              <div className="space-y-2">
                <KnowledgeItem
                  title="Store Policies.pdf"
                  type="PDF"
                  size="245 KB"
                  onRemove={() => {}}
                />
                <KnowledgeItem
                  title="Product Catalog.docx"
                  type="DOCX"
                  size="1.2 MB"
                  onRemove={() => {}}
                />
                <KnowledgeItem
                  title="FAQ.txt"
                  type="TXT"
                  size="12 KB"
                  onRemove={() => {}}
                />
              </div>
            </div>

            {/* Quick Add FAQ */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Quick Add FAQ</h3>
              <div className="grid gap-3">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <Input placeholder="Question" className="mb-2" />
                  <Textarea placeholder="Answer" className="min-h-[80px]" />
                  <Button size="sm" className="mt-3 gap-2">
                    <Plus className="w-3 h-3" />
                    Add FAQ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Widget Preview */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Widget Preview</h3>
                <div className="relative w-80 mx-auto">
                  {/* Chat window preview */}
                  <div className="rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/[0.1] shadow-2xl">
                    {/* Header */}
                    <div className={`p-4 bg-gradient-to-r ${avatarGradient}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{name}</p>
                          <p className="text-xs text-white/70">Online</p>
                        </div>
                      </div>
                    </div>
                    {/* Messages */}
                    <div className="p-4 h-48 bg-[#0a0a0a]">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-black" />
                        </div>
                        <div className="bg-white/[0.06] rounded-xl rounded-tl-none px-3 py-2">
                          <p className="text-xs text-white/70">{welcomeMessage || 'Hi! How can I help?'}</p>
                        </div>
                      </div>
                    </div>
                    {/* Input */}
                    <div className="p-3 border-t border-white/[0.06]">
                      <div className="flex gap-2">
                        <div className="flex-1 h-9 rounded-lg bg-white/[0.04] px-3 flex items-center">
                          <span className="text-xs text-white/30">Type a message...</span>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
                          <Send className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white">Widget Settings</h3>

                <div className="space-y-2">
                  <label className="text-xs text-white/50">Widget Position</label>
                  <Select defaultValue="bottom-right">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/50">Theme</label>
                  <Select defaultValue="auto">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Match Site)</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <p className="text-sm text-white">Sound Notifications</p>
                    <p className="text-xs text-white/40">Play sound on new messages</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <p className="text-sm text-white">Auto-open Widget</p>
                    <p className="text-xs text-white/40">Open chat automatically</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-amber-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Tab */}
        {activeTab === 'integration' && (
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Embed Code</h3>
              <p className="text-sm text-white/40">
                Add this code to your website to display the chat widget.
              </p>
              <div className="relative">
                <pre className="p-4 rounded-xl bg-black border border-white/[0.06] text-xs text-white/70 font-mono overflow-x-auto">
                  {embedCode}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyEmbed}
                  className="absolute top-2 right-2 h-8 text-white/40 hover:text-white"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">API Access</h3>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Agent ID</span>
                  <code className="text-xs text-amber-400 font-mono bg-black px-2 py-1 rounded">{agentId}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">API Endpoint</span>
                  <code className="text-xs text-amber-400 font-mono bg-black px-2 py-1 rounded">
                    /api/v1/agents/{agentId}/chat
                  </code>
                </div>
              </div>
            </div>

            <Button variant="outline" className="gap-2 border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
              <ExternalLink className="w-4 h-4" />
              View API Documentation
            </Button>
          </div>
        )}

        {/* Test Chat Tab */}
        {activeTab === 'test' && (
          <div className="flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{name}</p>
                  <p className="text-xs text-white/40">Test your agent&apos;s responses</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTestMessages([])}
                className="text-white/40 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom">
              {testMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-white/40 text-sm">Start a conversation to test your agent</p>
                  <p className="text-white/30 text-xs mt-1">Your agent will respond based on its instructions</p>
                </div>
              )}
              {testMessages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {isTestLoading && (
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGradient} flex items-center justify-center`}>
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <div className="bg-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/[0.06]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTestSend();
                }}
                className="flex gap-3"
              >
                <Input
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Type a test message..."
                  className="flex-1"
                  disabled={isTestLoading}
                />
                <Button
                  type="submit"
                  disabled={!testInput.trim() || isTestLoading}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={MessageSquare}
                label="Conversations"
                value={agent.conversationCount.toLocaleString()}
                subValue="+12% this week"
              />
              <StatCard
                icon={MessageCircle}
                label="Messages"
                value={agent.messageCount.toLocaleString()}
              />
              <StatCard
                icon={CheckCircle2}
                label="Resolution Rate"
                value={`${agent.resolutionRate}%`}
              />
              <StatCard
                icon={Clock}
                label="Avg Response"
                value={`${agent.responseTime}s`}
              />
            </div>

            {/* Chart Placeholder */}
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
              <h3 className="text-sm font-medium text-white mb-4">Conversations Over Time</h3>
              <div className="h-64 flex items-center justify-center text-white/20">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Chart visualization coming soon</p>
                </div>
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Recent Conversations</h3>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                          <User className="w-4 h-4 text-white/50" />
                        </div>
                        <span className="text-sm font-medium text-white">Customer #{1000 + i}</span>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0">
                        Resolved
                      </Badge>
                    </div>
                    <p className="text-sm text-white/50 line-clamp-1">
                      &quot;How can I track my order?&quot; - Inquiry about shipping
                    </p>
                    <p className="text-xs text-white/30 mt-2">2 hours ago • 5 messages</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              Are you sure you want to delete <span className="font-semibold text-white">{name}</span>?
            </p>
            <p className="text-sm text-white/40 mt-2">
              All conversation history and configurations will be permanently removed.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-white/60 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteAgentMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white gap-2"
            >
              {deleteAgentMutation.isPending ? (
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
    </div>
  );
}
