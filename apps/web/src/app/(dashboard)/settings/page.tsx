'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Camera,
  Mail,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Building2,
  ExternalLink,
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';

// Types
interface ProfileFormData {
  firstName: string;
  lastName: string;
  bio: string;
}

interface ConnectedAccount {
  id: string;
  provider: 'google' | 'github';
  email: string;
  connected: boolean;
  connectedAt?: string;
}

// Validation schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

// Mock connected accounts
const mockConnectedAccounts: ConnectedAccount[] = [
  {
    id: '1',
    provider: 'google',
    email: 'user@gmail.com',
    connected: true,
    connectedAt: '2024-01-15',
  },
  {
    id: '2',
    provider: 'github',
    email: '',
    connected: false,
  },
];

// Settings Card Component
function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden ${className}`}>
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/50" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
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

// Avatar Upload Component
function AvatarUpload({
  currentAvatar,
  onUpload,
}: {
  currentAvatar?: string | null;
  onUpload: (file: File) => void;
}) {
  const [preview, setPreview] = React.useState<string | null>(currentAvatar || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/10 border-2 border-white/[0.08] overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-10 h-10 text-white/30" />
            </div>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <Camera className="w-6 h-6 text-white" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-white">Profile Photo</p>
        <p className="text-xs text-white/40">
          JPG, PNG or GIF. Max size 2MB.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
        >
          <Camera className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
      </div>
    </div>
  );
}

// Copyable Text Component
function CopyableText({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-white/50 text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <code className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white/70 font-mono truncate">
          {text}
        </code>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-9 w-9 text-white/40 hover:text-white"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

// Connected Account Item Component
function ConnectedAccountItem({
  account,
  onConnect,
  onDisconnect,
}: {
  account: ConnectedAccount;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const providerInfo = {
    google: {
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      color: 'text-white',
    },
    github: {
      name: 'GitHub',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      color: 'text-white',
    },
  };

  const info = providerInfo[account.provider];

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center ${info.color}`}>
          {info.icon}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{info.name}</p>
          {account.connected ? (
            <p className="text-xs text-white/40">
              Connected as {account.email}
            </p>
          ) : (
            <p className="text-xs text-white/40">Not connected</p>
          )}
        </div>
      </div>
      {account.connected ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onDisconnect}
          className="bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
        >
          Disconnect
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={onConnect}
          className="bg-white/[0.08] hover:bg-white/[0.12] text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Connect
        </Button>
      )}
    </div>
  );
}

// Main Profile Page Component
export default function ProfileSettingsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [connectedAccounts, setConnectedAccounts] = React.useState<ConnectedAccount[]>(mockConnectedAccounts);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: '',
    },
  });

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveProfile = async (data: ProfileFormData) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved.',
    });
  };

  const handleAvatarUpload = (file: File) => {
    toast({
      title: 'Avatar uploaded',
      description: 'Your profile photo has been updated.',
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Export started',
      description: 'Your data export is being prepared. You will receive an email when it\'s ready.',
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: 'Account deletion requested',
      description: 'We\'ve sent a confirmation email to proceed with account deletion.',
      variant: 'destructive',
    });
    setShowDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] rounded-2xl" />
        <Skeleton className="h-[200px] rounded-2xl" />
        <Skeleton className="h-[200px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <SettingsCard
        title="Profile Information"
        description="Update your personal details and public profile"
        icon={User}
      >
        <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-6">
          {/* Avatar */}
          <AvatarUpload
            currentAvatar={user?.avatarUrl}
            onUpload={handleAvatarUpload}
          />

          {/* Form Fields */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white/70">First Name</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Enter your first name"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/20"
              />
              {errors.firstName && (
                <p className="text-sm text-red-400">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white/70">Last Name</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Enter your last name"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/20"
              />
              {errors.lastName && (
                <p className="text-sm text-red-400">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label className="text-white/70">Email Address</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <Mail className="w-4 h-4 text-white/30" />
                <span className="text-white/70">{user?.email || 'user@example.com'}</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white/70">Bio</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Tell us a bit about yourself..."
              rows={4}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/20 resize-none"
            />
            <p className="text-xs text-white/30">
              Brief description for your profile. Max 500 characters.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || isSaving}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </SettingsCard>

      {/* Account Details */}
      <SettingsCard
        title="Account Details"
        description="Your account information and membership status"
        icon={Building2}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <CopyableText
            label="Account ID"
            text={user?.id || 'acc_123456789'}
          />
          <div className="space-y-1.5">
            <Label className="text-white/50 text-xs">Member Since</Label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <Calendar className="w-4 h-4 text-white/30" />
              <span className="text-sm text-white/70">January 15, 2024</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/50 text-xs">Account Type</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Pro Plan
              </Badge>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/50 text-xs">Organization</Label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <Building2 className="w-4 h-4 text-white/30" />
              <span className="text-sm text-white/70">My Organization</span>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Connected Accounts */}
      <SettingsCard
        title="Connected Accounts"
        description="Link your accounts for faster sign-in"
        icon={ExternalLink}
      >
        <div className="space-y-3">
          {connectedAccounts.map((account) => (
            <ConnectedAccountItem
              key={account.id}
              account={account}
              onConnect={() => {
                toast({
                  title: `Connecting to ${account.provider}...`,
                  description: 'You will be redirected to authorize.',
                });
              }}
              onDisconnect={() => {
                setConnectedAccounts((prev) =>
                  prev.map((a) =>
                    a.id === account.id ? { ...a, connected: false } : a
                  )
                );
                toast({
                  title: 'Account disconnected',
                  description: `Your ${account.provider} account has been unlinked.`,
                });
              }}
            />
          ))}
        </div>
      </SettingsCard>

      {/* Danger Zone */}
      <SettingsCard
        title="Danger Zone"
        description="Irreversible and destructive actions"
        icon={AlertTriangle}
        className="border-red-500/20"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <p className="text-sm font-medium text-white">Export Your Data</p>
              <p className="text-xs text-white/40 mt-0.5">
                Download a copy of all your data in JSON format
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/[0.05] border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-red-400">Delete Account</p>
              <p className="text-xs text-white/40 mt-0.5">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </SettingsCard>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This action is permanent and cannot be undone. All your data,
              including stores, products, orders, and settings will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.04] border-white/[0.08] text-white hover:bg-white/[0.08]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
