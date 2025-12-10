'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Users,
  Plus,
  Mail,
  MoreHorizontal,
  Loader2,
  Send,
  Clock,
  Trash2,
  UserMinus,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  useOrganizationMembers,
  useOrganizationInvites,
  useInviteMember,
  useCancelInvite,
  useResendInvite,
  useUpdateMemberRole,
  useRemoveMember,
  type MemberRole,
} from '@/hooks/use-organization';
import { formatFullName, formatRelativeTime } from '@rendrix/utils';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'manager', 'staff', 'viewer'] as const),
});

type InviteFormData = z.infer<typeof inviteSchema>;

const roleLabels: Record<MemberRole, { label: string; description: string }> = {
  owner: { label: 'Owner', description: 'Full access to all settings' },
  admin: { label: 'Admin', description: 'Can manage team and billing' },
  manager: { label: 'Manager', description: 'Can manage stores and content' },
  staff: { label: 'Staff', description: 'Can manage products and orders' },
  viewer: { label: 'Viewer', description: 'Read-only access' },
};

export default function TeamPage() {
  const { toast } = useToast();
  const { data: members, isLoading: membersLoading } = useOrganizationMembers();
  const { data: invites, isLoading: invitesLoading } = useOrganizationInvites();
  const inviteMember = useInviteMember();
  const cancelInvite = useCancelInvite();
  const resendInvite = useResendInvite();
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const [showInviteDialog, setShowInviteDialog] = React.useState(false);
  const [removeMemberId, setRemoveMemberId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'staff',
    },
  });

  const handleInvite = async (data: InviteFormData) => {
    try {
      await inviteMember.mutateAsync(data);
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${data.email}.`,
      });
      reset();
      setShowInviteDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitation.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await cancelInvite.mutateAsync(inviteId);
      toast({
        title: 'Invitation cancelled',
        description: 'The invitation has been cancelled.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel invitation.',
        variant: 'destructive',
      });
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await resendInvite.mutateAsync(inviteId);
      toast({
        title: 'Invitation resent',
        description: 'The invitation has been resent.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend invitation.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async (memberId: string, role: MemberRole) => {
    try {
      await updateRole.mutateAsync({ memberId, role });
      toast({
        title: 'Role updated',
        description: 'The member role has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async () => {
    if (!removeMemberId) return;
    try {
      await removeMember.mutateAsync(removeMemberId);
      toast({
        title: 'Member removed',
        description: 'The team member has been removed.',
      });
      setRemoveMemberId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove member.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = membersLoading || invitesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Members */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <CardDescription>
              Manage who has access to your organization.
            </CardDescription>
          </div>
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit(handleInvite)}>
                <DialogHeader>
                  <DialogTitle>Invite team member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@example.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={watch('role')}
                      onValueChange={(value: MemberRole) => setValue('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['admin', 'manager', 'staff', 'viewer'] as const).map((role) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex flex-col">
                              <span>{roleLabels[role].label}</span>
                              <span className="text-xs text-muted-foreground">
                                {roleLabels[role].description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={inviteMember.isPending}>
                    {inviteMember.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send invitation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members?.map((member) => {
              const name = formatFullName(member.user.firstName, member.user.lastName);
              const initials = name
                ? name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : member.user.email[0].toUpperCase();

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {member.user.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt={name || member.user.email} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{name || 'Unnamed'}</p>
                      <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={member.role === 'owner' ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {member.role === 'owner' && <Shield className="h-3 w-3" />}
                      {roleLabels[member.role].label}
                    </Badge>
                    {member.role !== 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {(['admin', 'manager', 'staff', 'viewer'] as const).map((role) => (
                            <DropdownMenuItem
                              key={role}
                              onClick={() => handleUpdateRole(member.id, role)}
                              disabled={member.role === role}
                            >
                              {roleLabels[role].label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setRemoveMemberId(member.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remove from team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invites */}
      {invites && invites.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              Invitations that haven't been accepted yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invited {formatRelativeTime(invite.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{roleLabels[invite.role].label}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleResendInvite(invite.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Resend invitation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleCancelInvite(invite.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remove Member Dialog */}
      <AlertDialog open={!!removeMemberId} onOpenChange={() => setRemoveMemberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This person will lose access to your organization and all its stores.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeMember.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
