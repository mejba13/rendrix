'use client';

import * as React from 'react';
import {
  Store,
  Package,
  HelpCircle,
  CreditCard,
  Truck,
  BarChart3,
  Settings,
  Users,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  prompt: string;
  category: 'getting-started' | 'orders' | 'products' | 'support';
}

const quickActions: QuickAction[] = [
  {
    id: 'create-store',
    label: 'Create a store',
    icon: Store,
    prompt: 'How do I create a store?',
    category: 'getting-started',
  },
  {
    id: 'add-products',
    label: 'Add products',
    icon: Package,
    prompt: 'How do I add products to my store?',
    category: 'products',
  },
  {
    id: 'manage-orders',
    label: 'Manage orders',
    icon: Truck,
    prompt: 'Help with orders',
    category: 'orders',
  },
  {
    id: 'view-analytics',
    label: 'View analytics',
    icon: BarChart3,
    prompt: 'How do I view my store analytics?',
    category: 'getting-started',
  },
  {
    id: 'pricing',
    label: 'Pricing plans',
    icon: CreditCard,
    prompt: 'Pricing plans',
    category: 'support',
  },
  {
    id: 'customers',
    label: 'Manage customers',
    icon: Users,
    prompt: 'How do I manage my customers?',
    category: 'getting-started',
  },
  {
    id: 'store-settings',
    label: 'Store settings',
    icon: Settings,
    prompt: 'How do I configure my store settings?',
    category: 'getting-started',
  },
  {
    id: 'get-help',
    label: 'Get support',
    icon: HelpCircle,
    prompt: 'Contact support',
    category: 'support',
  },
];

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  variant?: 'horizontal' | 'grid';
  showAll?: boolean;
}

export function QuickActions({
  onSelect,
  variant = 'horizontal',
  showAll = false,
}: QuickActionsProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const displayedActions = showAll ? quickActions : quickActions.slice(0, 5);

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-2 animate-fade-in">
        {displayedActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onSelect(action.prompt)}
              onMouseEnter={() => setHoveredId(action.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200',
                'bg-white/[0.02] border border-white/[0.06]',
                'hover:bg-white/[0.06] hover:border-primary/30',
                'group'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200',
                  hoveredId === action.id
                    ? 'bg-primary/20'
                    : 'bg-white/[0.04]'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors duration-200',
                    hoveredId === action.id ? 'text-primary' : 'text-white/50'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  hoveredId === action.id ? 'text-white' : 'text-white/70'
                )}
              >
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* AI Suggestion Label */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-orange-600/20 border border-primary/30 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary whitespace-nowrap">
            Suggestions
          </span>
        </div>

        {displayedActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onSelect(action.prompt)}
              onMouseEnter={() => setHoveredId(action.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 flex-shrink-0',
                'bg-white/[0.04] border border-white/[0.08]',
                'hover:bg-white/[0.08] hover:border-white/[0.15]',
                hoveredId === action.id && 'bg-primary/10 border-primary/30'
              )}
            >
              <Icon
                className={cn(
                  'w-3.5 h-3.5 transition-colors',
                  hoveredId === action.id ? 'text-primary' : 'text-white/40'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap transition-colors',
                  hoveredId === action.id ? 'text-white' : 'text-white/60'
                )}
              >
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fade indicators for scroll */}
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}

// Category-based quick actions
export function QuickActionsCategories({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Sparkles },
    { id: 'orders', label: 'Orders', icon: Truck },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ] as const;

  const [activeCategory, setActiveCategory] = React.useState<string>('getting-started');

  const filteredActions = quickActions.filter(
    (action) => action.category === activeCategory
  );

  return (
    <div className="space-y-3">
      {/* Category Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/50 hover:text-white/70 hover:bg-white/[0.04]'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filteredActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onSelect(action.prompt)}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-primary/30 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
