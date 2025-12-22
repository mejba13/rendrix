'use client';

import * as React from 'react';
import {
  MessageCircle,
  Bot,
  Sparkles,
  Clock,
  Globe,
  Palette,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  MousePointer,
  Keyboard,
  Check,
  Loader2,
  MessageSquare,
  Zap,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Types
interface ChatbotSettings {
  enabled: boolean;
  autoOpen: boolean;
  showOnAllPages: boolean;
  greeting: string;
  position: 'bottom-right' | 'bottom-left';
  theme: 'auto' | 'light' | 'dark';
  sound: boolean;
  notifications: boolean;
  responseDelay: number;
  showQuickReplies: boolean;
  showTypingIndicator: boolean;
  keyboardShortcut: boolean;
}

const initialSettings: ChatbotSettings = {
  enabled: true,
  autoOpen: false,
  showOnAllPages: true,
  greeting: "Hi there! I'm the Rendrix Assistant. How can I help you today?",
  position: 'bottom-right',
  theme: 'auto',
  sound: true,
  notifications: true,
  responseDelay: 1000,
  showQuickReplies: true,
  showTypingIndicator: true,
  keyboardShortcut: true,
};

// Settings Card Component
function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
  badge,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/50" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-primary/20 text-primary rounded-full">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-white/40 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Toggle Setting Item
function ToggleSetting({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  iconActiveColor = 'text-primary',
  switchColor = 'data-[state=checked]:bg-primary',
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  iconActiveColor?: string;
  switchColor?: string;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            checked ? 'bg-primary/20' : 'bg-white/[0.04]'
          }`}
        >
          <Icon
            className={`w-5 h-5 ${checked ? iconActiveColor : 'text-white/40'}`}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-white/40 mt-0.5">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={switchColor}
      />
    </div>
  );
}

// Preview Component
function ChatPreview({ settings }: { settings: ChatbotSettings }) {
  return (
    <div className="relative h-[300px] rounded-xl bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/[0.06] overflow-hidden">
      {/* Mock Page Background */}
      <div className="absolute inset-4 rounded-lg bg-[#0a0a0a] border border-white/[0.06]">
        <div className="p-4">
          <div className="w-24 h-3 rounded bg-white/[0.08] mb-3" />
          <div className="w-full h-2 rounded bg-white/[0.04] mb-2" />
          <div className="w-3/4 h-2 rounded bg-white/[0.04] mb-2" />
          <div className="w-1/2 h-2 rounded bg-white/[0.04]" />
        </div>
      </div>

      {/* Chat Button Preview */}
      {settings.enabled && (
        <div
          className={`absolute bottom-6 ${
            settings.position === 'bottom-right' ? 'right-6' : 'left-6'
          }`}
        >
          <div className="relative">
            {settings.notifications && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            )}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/30">
              <MessageCircle className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            settings.enabled ? 'bg-emerald-400' : 'bg-red-400'
          }`}
        />
        <span className="text-xs text-white/40">
          {settings.enabled ? 'Active' : 'Disabled'}
        </span>
      </div>
    </div>
  );
}

// Main Chatbot Settings Page
export default function ChatbotSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [settings, setSettings] = React.useState<ChatbotSettings>(initialSettings);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const updateSetting = <K extends keyof ChatbotSettings>(
    key: K,
    value: ChatbotSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    toast({
      title: 'Settings saved',
      description: 'Your chat assistant settings have been updated.',
    });
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setHasChanges(true);
    toast({
      title: 'Settings reset',
      description: 'Chat assistant settings have been restored to defaults.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] rounded-2xl" />
        <Skeleton className="h-[300px] rounded-2xl" />
        <Skeleton className="h-[250px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <SettingsCard
        title="Chat Widget Preview"
        description="See how your chat assistant will appear to users"
        icon={Eye}
        badge="Live Preview"
      >
        <ChatPreview settings={settings} />
      </SettingsCard>

      {/* General Settings */}
      <SettingsCard
        title="General Settings"
        description="Control the basic behavior of the chat assistant"
        icon={Bot}
      >
        <div className="space-y-1">
          <ToggleSetting
            icon={Sparkles}
            title="Enable Chat Assistant"
            description="Show the chat widget on your dashboard"
            checked={settings.enabled}
            onCheckedChange={(v) => updateSetting('enabled', v)}
          />

          {settings.enabled && (
            <>
              <ToggleSetting
                icon={MousePointer}
                title="Auto-open on First Visit"
                description="Automatically open the chat for new users"
                checked={settings.autoOpen}
                onCheckedChange={(v) => updateSetting('autoOpen', v)}
              />

              <ToggleSetting
                icon={Globe}
                title="Show on All Pages"
                description="Display the chat widget across all dashboard pages"
                checked={settings.showOnAllPages}
                onCheckedChange={(v) => updateSetting('showOnAllPages', v)}
              />

              <ToggleSetting
                icon={Keyboard}
                title="Keyboard Shortcut"
                description="Enable Cmd/Ctrl + K to open the chat"
                checked={settings.keyboardShortcut}
                onCheckedChange={(v) => updateSetting('keyboardShortcut', v)}
              />
            </>
          )}
        </div>
      </SettingsCard>

      {/* Appearance Settings */}
      {settings.enabled && (
        <SettingsCard
          title="Appearance"
          description="Customize how the chat widget looks"
          icon={Palette}
        >
          <div className="space-y-6">
            {/* Position */}
            <div className="space-y-3">
              <Label className="text-white/70">Widget Position</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'bottom-right', label: 'Bottom Right' },
                  { value: 'bottom-left', label: 'Bottom Left' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateSetting(
                        'position',
                        option.value as 'bottom-right' | 'bottom-left'
                      )
                    }
                    className={`p-4 rounded-xl border transition-all text-left ${
                      settings.position === option.value
                        ? 'bg-primary/10 border-primary'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        settings.position === option.value
                          ? 'text-primary'
                          : 'text-white'
                      }`}
                    >
                      {option.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-3">
              <Label className="text-white/70">Color Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(v) =>
                  updateSetting('theme', v as 'auto' | 'light' | 'dark')
                }
              >
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-white/[0.08]">
                  <SelectItem
                    value="auto"
                    className="text-white hover:bg-white/[0.08]"
                  >
                    Auto (Match system)
                  </SelectItem>
                  <SelectItem
                    value="dark"
                    className="text-white hover:bg-white/[0.08]"
                  >
                    Dark
                  </SelectItem>
                  <SelectItem
                    value="light"
                    className="text-white hover:bg-white/[0.08]"
                  >
                    Light
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsCard>
      )}

      {/* Behavior Settings */}
      {settings.enabled && (
        <SettingsCard
          title="Behavior"
          description="Fine-tune how the assistant responds"
          icon={Zap}
        >
          <div className="space-y-6">
            {/* Response Delay */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/70">Response Delay</Label>
                  <p className="text-xs text-white/40 mt-0.5">
                    Simulate typing time before responses
                  </p>
                </div>
                <span className="text-sm font-mono text-primary">
                  {settings.responseDelay}ms
                </span>
              </div>
              <Slider
                value={[settings.responseDelay]}
                onValueChange={(values: number[]) => updateSetting('responseDelay', values[0])}
                min={0}
                max={3000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/30">
                <span>Instant</span>
                <span>Natural</span>
                <span>Slow</span>
              </div>
            </div>

            <div className="border-t border-white/[0.04] pt-4 space-y-1">
              <ToggleSetting
                icon={MessageSquare}
                title="Quick Reply Suggestions"
                description="Show suggested responses after bot messages"
                checked={settings.showQuickReplies}
                onCheckedChange={(v) => updateSetting('showQuickReplies', v)}
              />

              <ToggleSetting
                icon={Clock}
                title="Typing Indicator"
                description="Show animated dots while assistant is responding"
                checked={settings.showTypingIndicator}
                onCheckedChange={(v) => updateSetting('showTypingIndicator', v)}
              />
            </div>
          </div>
        </SettingsCard>
      )}

      {/* Notification Settings */}
      {settings.enabled && (
        <SettingsCard
          title="Notifications"
          description="Control sounds and alerts"
          icon={Bell}
        >
          <div className="space-y-1">
            <ToggleSetting
              icon={settings.sound ? Volume2 : VolumeX}
              title="Sound Effects"
              description="Play sounds for new messages"
              checked={settings.sound}
              onCheckedChange={(v) => updateSetting('sound', v)}
            />

            <ToggleSetting
              icon={settings.notifications ? Bell : BellOff}
              title="Unread Badge"
              description="Show unread message count on the widget"
              checked={settings.notifications}
              onCheckedChange={(v) => updateSetting('notifications', v)}
            />
          </div>
        </SettingsCard>
      )}

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={handleReset}
          className="text-white/50 hover:text-white hover:bg-white/[0.06]"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#1a1a1a] border border-white/[0.1] shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-white/70">You have unsaved changes</span>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-black font-semibold rounded-full"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
