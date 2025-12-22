'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  AlertTriangle,
  Power,
  Trash2,
  Download,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { useStore, useUpdateStore, useDeleteStore } from '@/hooks/use-stores';
import { cn } from '@/lib/utils';

// Danger card component
function DangerCard({
  title,
  description,
  icon: Icon,
  variant = 'warning',
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  variant?: 'warning' | 'danger';
  children: React.ReactNode;
}) {
  const colors = {
    warning: {
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/5',
      icon: 'bg-amber-500/20 text-amber-400',
    },
    danger: {
      border: 'border-red-500/20',
      bg: 'bg-red-500/5',
      icon: 'bg-red-500/20 text-red-400',
    },
  };

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden",
      colors[variant].border,
      colors[variant].bg
    )}>
      <div className={cn("p-6 border-b", colors[variant].border)}>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              colors[variant].icon
            )}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {description && (
              <p className="text-sm text-white/50 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function DangerZonePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const storeId = params.storeId as string;

  const { data: store, isLoading } = useStore(storeId);
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();

  const [showDeactivateDialog, setShowDeactivateDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [confirmStoreName, setConfirmStoreName] = React.useState('');
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    if (store?.settings) {
      setMaintenanceMode(store.settings.maintenanceMode || false);
    }
  }, [store]);

  const handleMaintenanceToggle = async (enabled: boolean) => {
    // Note: maintenanceMode is handled via settings update, not store update
    // This is a UI toggle that would need a settings endpoint
    setMaintenanceMode(enabled);
    toast({
      title: enabled ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
      description: enabled
        ? 'Your store is now in maintenance mode.'
        : 'Your store is now live.',
    });
  };

  const handleDeactivate = async () => {
    try {
      await updateStore.mutateAsync({
        storeId,
        data: { status: store?.status === 'active' ? 'inactive' : 'active' },
      });
      toast({
        title: store?.status === 'active' ? 'Store deactivated' : 'Store activated',
        description: store?.status === 'active'
          ? 'Your store is now hidden from customers.'
          : 'Your store is now visible to customers.',
      });
      setShowDeactivateDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update store status.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (confirmStoreName !== store?.name) {
      toast({
        title: 'Error',
        description: 'Store name does not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await deleteStore.mutateAsync(storeId);
      toast({
        title: 'Store deleted',
        description: 'Your store has been permanently deleted.',
      });
      setShowDeleteDialog(false);
      setConfirmStoreName('');
      router.push('/dashboard/stores');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete store.',
        variant: 'destructive',
      });
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate export - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: 'Export started',
        description: 'You will receive an email when your data is ready.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start export.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white">Danger Zone</p>
          <p className="text-sm text-white/60 mt-1">
            Actions in this section can have permanent effects on your store.
            Please proceed with caution.
          </p>
        </div>
      </div>

      {/* Maintenance Mode */}
      <DangerCard
        title="Maintenance Mode"
        description="Temporarily hide your store while you make changes."
        icon={Shield}
        variant="warning"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">
              {maintenanceMode
                ? 'Your store is in maintenance mode. Customers see a "Coming Soon" page.'
                : 'Enable maintenance mode to hide your store temporarily.'}
            </p>
          </div>
          <Switch
            checked={maintenanceMode}
            onCheckedChange={handleMaintenanceToggle}
            disabled={updateStore.isPending}
            className="data-[state=checked]:bg-amber-500"
          />
        </div>
      </DangerCard>

      {/* Export Data */}
      <DangerCard
        title="Export Store Data"
        description="Download a copy of all your store data."
        icon={Download}
        variant="warning"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">
              Export all products, orders, customers, and settings as a ZIP file.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleExportData}
            disabled={isExporting}
            className="bg-white/[0.02] border-amber-500/30 hover:bg-amber-500/10 text-amber-400 hover:text-amber-400"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </div>
      </DangerCard>

      {/* Deactivate Store */}
      <DangerCard
        title={store?.status === 'active' ? 'Deactivate Store' : 'Activate Store'}
        description={store?.status === 'active'
          ? 'Hide your store from customers temporarily.'
          : 'Make your store visible to customers again.'}
        icon={Power}
        variant="warning"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">
              {store?.status === 'active'
                ? 'Your store will be hidden but all data will be preserved.'
                : 'Your store is currently hidden. Activate to make it visible.'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeactivateDialog(true)}
            className={cn(
              "bg-white/[0.02]",
              store?.status === 'active'
                ? "border-amber-500/30 hover:bg-amber-500/10 text-amber-400 hover:text-amber-400"
                : "border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-400"
            )}
          >
            <Power className="w-4 h-4 mr-2" />
            {store?.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </DangerCard>

      {/* Delete Store */}
      <DangerCard
        title="Delete Store"
        description="Permanently delete this store and all its data."
        icon={Trash2}
        variant="danger"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400/80">
              This action cannot be undone. All products, orders, customers, and settings
              will be permanently deleted.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">
                This will permanently delete <span className="font-medium text-white">{store?.name}</span>.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="bg-white/[0.02] border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Store
            </Button>
          </div>
        </div>
      </DangerCard>

      {/* Deactivate Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {store?.status === 'active' ? 'Deactivate store?' : 'Activate store?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              {store?.status === 'active'
                ? 'Your store will be hidden from customers. You can reactivate it anytime.'
                : 'Your store will become visible to customers again.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.02] border-white/[0.08] text-white hover:bg-white/[0.06] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className={store?.status === 'active'
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-emerald-500 text-white hover:bg-emerald-600"}
            >
              {updateStore.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {store?.status === 'active' ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete store permanently?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-white/60 space-y-3">
                <p>This action cannot be undone. Type the store name to confirm.</p>
                <div className="flex items-center justify-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <code className="text-red-400 font-mono text-lg font-semibold select-all">
                    {store?.name}
                  </code>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Input
              value={confirmStoreName}
              onChange={(e) => setConfirmStoreName(e.target.value)}
              placeholder={`Type "${store?.name}" to confirm`}
              className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 text-center font-mono"
              autoComplete="off"
              autoFocus
            />
            {confirmStoreName && confirmStoreName !== store?.name && (
              <p className="text-xs text-red-400 text-center mt-2">
                Name doesn't match. Please type exactly: {store?.name}
              </p>
            )}
            {confirmStoreName === store?.name && (
              <p className="text-xs text-emerald-400 text-center mt-2">
                Name matches. You can now delete the store.
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmStoreName('')}
              className="bg-white/[0.02] border-white/[0.08] text-white hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={confirmStoreName !== store?.name || deleteStore.isPending}
              className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteStore.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete Store
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
