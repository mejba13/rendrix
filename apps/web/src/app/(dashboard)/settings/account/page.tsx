'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Shield,
  Key,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  LogOut,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  QrCode,
  Copy,
  RefreshCw,
  MapPin,
  Chrome,
  Tablet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
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

// Types
interface Session {
  id: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

interface LoginAttempt {
  id: string;
  ip: string;
  location: string;
  time: string;
  status: 'success' | 'failed';
  browser: string;
}

// Validation schemas
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

// Mock data
const mockSessions: Session[] = [
  {
    id: '1',
    device: 'desktop',
    browser: 'Chrome 120',
    os: 'macOS Sonoma',
    location: 'San Francisco, US',
    ip: '192.168.1.1',
    lastActive: 'Active now',
    isCurrent: true,
  },
  {
    id: '2',
    device: 'mobile',
    browser: 'Safari',
    os: 'iOS 17',
    location: 'New York, US',
    ip: '192.168.1.2',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: '3',
    device: 'tablet',
    browser: 'Firefox',
    os: 'iPadOS 17',
    location: 'London, UK',
    ip: '192.168.1.3',
    lastActive: '3 days ago',
    isCurrent: false,
  },
];

const mockLoginHistory: LoginAttempt[] = [
  {
    id: '1',
    ip: '192.168.1.1',
    location: 'San Francisco, US',
    time: 'Today, 10:30 AM',
    status: 'success',
    browser: 'Chrome on macOS',
  },
  {
    id: '2',
    ip: '192.168.1.1',
    location: 'San Francisco, US',
    time: 'Yesterday, 3:45 PM',
    status: 'success',
    browser: 'Chrome on macOS',
  },
  {
    id: '3',
    ip: '45.67.89.123',
    location: 'Unknown',
    time: 'Dec 15, 2024, 8:22 PM',
    status: 'failed',
    browser: 'Unknown browser',
  },
  {
    id: '4',
    ip: '192.168.1.2',
    location: 'New York, US',
    time: 'Dec 14, 2024, 11:15 AM',
    status: 'success',
    browser: 'Safari on iOS',
  },
];

const mockRecoveryCodes = [
  'ABCD-1234-EFGH',
  'IJKL-5678-MNOP',
  'QRST-9012-UVWX',
  'YZAB-3456-CDEF',
  'GHIJ-7890-KLMN',
  'OPQR-2345-STUV',
  'WXYZ-6789-ABCD',
  'EFGH-0123-IJKL',
];

// Settings Card Component
function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
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

// Password Strength Indicator
function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= strength ? colors[strength - 1] : 'bg-white/[0.1]'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength >= 4 ? 'text-green-400' : 'text-white/40'}`}>
        Password strength: {labels[strength - 1] || 'Very Weak'}
      </p>
    </div>
  );
}

// Session Item Component
function SessionItem({
  session,
  onRevoke,
}: {
  session: Session;
  onRevoke: () => void;
}) {
  const deviceIcons = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
  };
  const DeviceIcon = deviceIcons[session.device];

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
          <DeviceIcon className="w-5 h-5 text-white/50" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white">
              {session.browser} on {session.os}
            </p>
            {session.isCurrent && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                Current
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-white/40">
              <MapPin className="w-3 h-3" />
              {session.location}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/40">
              <Clock className="w-3 h-3" />
              {session.lastActive}
            </span>
          </div>
        </div>
      </div>
      {!session.isCurrent && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRevoke}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Revoke
        </Button>
      )}
    </div>
  );
}

// Main Account & Security Page
export default function AccountSecurityPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(false);
  const [show2FASetup, setShow2FASetup] = React.useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = React.useState(false);
  const [sessions, setSessions] = React.useState<Session[]>(mockSessions);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const watchNewPassword = watch('newPassword', '');

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChangePassword = async (data: PasswordFormData) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    reset();
    toast({
      title: 'Password updated',
      description: 'Your password has been changed successfully.',
    });
  };

  const handle2FAToggle = (enabled: boolean) => {
    if (enabled) {
      setShow2FASetup(true);
    } else {
      setIs2FAEnabled(false);
      toast({
        title: '2FA Disabled',
        description: 'Two-factor authentication has been disabled.',
      });
    }
  };

  const handleComplete2FASetup = () => {
    setIs2FAEnabled(true);
    setShow2FASetup(false);
    setShowRecoveryCodes(true);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast({
      title: 'Session revoked',
      description: 'The session has been terminated.',
    });
  };

  const handleRevokeAllSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setShowRevokeAllDialog(false);
    toast({
      title: 'All sessions revoked',
      description: 'All other sessions have been terminated.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[350px] rounded-2xl" />
        <Skeleton className="h-[250px] rounded-2xl" />
        <Skeleton className="h-[300px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <SettingsCard
        title="Change Password"
        description="Update your password to keep your account secure"
        icon={Key}
      >
        <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white/70">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                {...register('currentPassword')}
                placeholder="Enter your current password"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-400">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white/70">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                {...register('newPassword')}
                placeholder="Enter your new password"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={watchNewPassword} />
            {errors.newPassword && (
              <p className="text-sm text-red-400">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white/70">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Confirm your new password"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Update Password
            </Button>
          </div>
        </form>
      </SettingsCard>

      {/* Two-Factor Authentication */}
      <SettingsCard
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        icon={Smartphone}
      >
        {!show2FASetup && !showRecoveryCodes ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  is2FAEnabled ? 'bg-green-500/20' : 'bg-white/[0.04]'
                }`}>
                  <Shield className={`w-5 h-5 ${is2FAEnabled ? 'text-green-400' : 'text-white/50'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {is2FAEnabled ? 'Two-Factor Authentication Enabled' : 'Enable Two-Factor Authentication'}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {is2FAEnabled
                      ? 'Your account is protected with 2FA'
                      : 'Protect your account with TOTP-based 2FA'}
                  </p>
                </div>
              </div>
              <Switch
                checked={is2FAEnabled}
                onCheckedChange={handle2FAToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {is2FAEnabled && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRecoveryCodes(true)}
                  className="bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
                >
                  <Key className="w-4 h-4 mr-2" />
                  View Recovery Codes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Codes
                </Button>
              </div>
            )}
          </div>
        ) : show2FASetup ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-white/70 mb-4">
                Scan this QR code with your authenticator app
              </p>
              <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 mb-4">
                <QrCode className="w-full h-full text-black" />
              </div>
              <p className="text-xs text-white/40">
                Or enter this code manually: <code className="text-primary">ABCD-EFGH-1234-5678</code>
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Enter verification code</Label>
              <Input
                placeholder="000000"
                maxLength={6}
                className="bg-white/[0.04] border-white/[0.08] text-white text-center text-xl tracking-widest font-mono"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShow2FASetup(false)}
                className="bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleComplete2FASetup}
                className="bg-primary hover:bg-primary/90 text-black font-semibold"
              >
                <Check className="w-4 h-4 mr-2" />
                Verify & Enable
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Save your recovery codes</p>
                  <p className="text-xs text-white/50 mt-1">
                    Store these codes in a safe place. You'll need them if you lose access to your authenticator app.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {mockRecoveryCodes.map((code) => (
                <code
                  key={code}
                  className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white/70 font-mono text-center"
                >
                  {code}
                </code>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
                onClick={() => {
                  navigator.clipboard.writeText(mockRecoveryCodes.join('\n'));
                  toast({ title: 'Copied', description: 'Recovery codes copied to clipboard' });
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Codes
              </Button>
              <Button
                onClick={() => setShowRecoveryCodes(false)}
                className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </SettingsCard>

      {/* Active Sessions */}
      <SettingsCard
        title="Active Sessions"
        description="Manage your logged-in devices"
        icon={Monitor}
      >
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              onRevoke={() => handleRevokeSession(session.id)}
            />
          ))}

          {sessions.length > 1 && (
            <Button
              variant="outline"
              className="w-full mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => setShowRevokeAllDialog(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out All Other Sessions
            </Button>
          )}
        </div>
      </SettingsCard>

      {/* Login History */}
      <SettingsCard
        title="Login History"
        description="Recent account activity"
        icon={Clock}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 border-b border-white/[0.06]">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">IP Address</th>
                <th className="pb-3 font-medium">Browser</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLoginHistory.map((attempt) => (
                <tr key={attempt.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="py-3 text-sm text-white/70">{attempt.time}</td>
                  <td className="py-3 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {attempt.location}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white/50 font-mono">{attempt.ip}</td>
                  <td className="py-3 text-sm text-white/50">{attempt.browser}</td>
                  <td className="py-3">
                    <Badge
                      className={
                        attempt.status === 'success'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }
                    >
                      {attempt.status === 'success' ? 'Success' : 'Failed'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      {/* Revoke All Sessions Dialog */}
      <AlertDialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Sign out all other sessions?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will terminate all sessions except your current one. You'll need to sign in again on those devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.04] border-white/[0.08] text-white hover:bg-white/[0.08]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeAllSessions}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Sign Out All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
