'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useCustomThemes,
  useDeleteCustomTheme,
  useThemeVersions,
  useActivateThemeVersion,
  type CustomTheme,
  type ThemeVersionInfo,
} from '@/hooks/use-theme-upload';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Upload,
  Package,
  MoreVertical,
  Trash2,
  GitBranch,
  Clock,
  CheckCircle2,
  Store,
  RotateCcw,
  Loader2,
  AlertTriangle,
  Sparkles,
  Plus,
  History,
} from 'lucide-react';

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Theme Card Skeleton
function ThemeCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-xl bg-white/[0.04]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32 bg-white/[0.06]" />
          <Skeleton className="h-4 w-48 bg-white/[0.04]" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg bg-white/[0.04]" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Skeleton className="h-6 w-20 rounded-full bg-white/[0.04]" />
        <Skeleton className="h-4 w-24 bg-white/[0.04]" />
        <Skeleton className="h-4 w-16 bg-white/[0.04]" />
      </div>
    </div>
  );
}

// Version Timeline Component
function VersionTimeline({
  themeId,
  themeName,
  isOpen,
  onClose,
}: {
  themeId: string;
  themeName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const { data: versionsData, isLoading } = useThemeVersions(themeId, { limit: 20 });
  const activateVersionMutation = useActivateThemeVersion();

  const versions = versionsData?.data || [];

  const handleActivate = async (version: ThemeVersionInfo) => {
    try {
      await activateVersionMutation.mutateAsync({
        themeId,
        versionId: version.id,
      });
      toast({
        title: 'Version activated',
        description: `Version ${version.version} is now active.`,
      });
    } catch {
      toast({
        title: 'Failed to activate version',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            Version History
          </DialogTitle>
          <DialogDescription className="text-white/50">
            {themeName} - View and manage theme versions
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02]">
                  <Skeleton className="w-12 h-12 rounded-lg bg-white/[0.04]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 bg-white/[0.06]" />
                    <Skeleton className="h-3 w-32 bg-white/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <GitBranch className="w-12 h-12 mx-auto text-white/20 mb-4" />
              <p className="text-white/50">No version history available</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-8 bottom-8 w-px bg-white/[0.08]" />

              <div className="space-y-4">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`relative flex gap-4 p-4 rounded-xl transition-colors ${
                      version.isLatest
                        ? 'bg-amber-500/10 border border-amber-500/20'
                        : 'bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        version.isLatest
                          ? 'bg-amber-500/20'
                          : 'bg-white/[0.04]'
                      }`}
                    >
                      {version.isLatest ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      ) : (
                        <GitBranch className="w-5 h-5 text-white/40" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">v{version.version}</span>
                        {version.isLatest && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400 font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50 mb-2">
                        {version.changelog || 'No changelog provided'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/30">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(version.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {!version.isLatest && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActivate(version)}
                        disabled={activateVersionMutation.isPending}
                        className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white flex-shrink-0"
                      >
                        {activateVersionMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteConfirmDialog({
  theme,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  theme: CustomTheme | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  if (!theme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Delete Theme
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Are you sure you want to delete &quot;{theme.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {theme.storeCount > 0 && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400">
              This theme is currently used by {theme.storeCount} store{theme.storeCount !== 1 ? 's' : ''}.
              You cannot delete it while it&apos;s in use.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting || theme.storeCount > 0}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Theme
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Theme Card Component
function ThemeCard({
  theme,
  onViewVersions,
  onDelete,
}: {
  theme: CustomTheme;
  onViewVersions: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();

  return (
    <div className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:border-white/[0.1] transition-all">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
          <Package className="w-8 h-8 text-amber-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{theme.name}</h3>
            {theme.isActive && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 font-medium flex-shrink-0">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-white/50 line-clamp-2">
            {theme.description || 'No description provided'}
          </p>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/[0.05]"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0c0c0c] border-white/[0.08]">
            <DropdownMenuItem
              onClick={onViewVersions}
              className="text-white/70 hover:text-white focus:text-white"
            >
              <History className="w-4 h-4 mr-2" />
              View Versions
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/theme/upload?upgrade=${theme.id}`)}
              className="text-white/70 hover:text-white focus:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Version
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 focus:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Theme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-white/30" />
          <span className="text-sm text-white/60">v{theme.version}</span>
        </div>
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-white/30" />
          <span className="text-sm text-white/60">
            {theme.storeCount} store{theme.storeCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/30" />
          <span className="text-sm text-white/60">{formatDate(theme.updatedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onViewVersions}
          className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white"
        >
          <History className="w-4 h-4 mr-2" />
          {theme.versionCount} Version{theme.versionCount !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
        <Package className="w-10 h-10 text-white/20" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No Custom Themes Yet</h3>
      <p className="text-white/50 max-w-md mx-auto mb-6">
        Upload your first custom theme to start personalizing your storefronts with unique designs.
      </p>
      <Link href="/dashboard/theme/upload">
        <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
          <Upload className="w-4 h-4 mr-2" />
          Upload Your First Theme
        </Button>
      </Link>
    </div>
  );
}

// Main Page Component
export default function MyThemesPage() {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<CustomTheme | null>(null);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: themesData, isLoading } = useCustomThemes({ limit: 50 });
  const deleteMutation = useDeleteCustomTheme();

  const themes = themesData?.data || [];

  const handleViewVersions = useCallback((theme: CustomTheme) => {
    setSelectedTheme(theme);
    setIsVersionsOpen(true);
  }, []);

  const handleDeleteClick = useCallback((theme: CustomTheme) => {
    setSelectedTheme(theme);
    setIsDeleteOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedTheme) return;

    try {
      await deleteMutation.mutateAsync(selectedTheme.id);
      toast({
        title: 'Theme deleted',
        description: `"${selectedTheme.name}" has been deleted.`,
      });
      setIsDeleteOpen(false);
      setSelectedTheme(null);
    } catch {
      toast({
        title: 'Failed to delete theme',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [selectedTheme, deleteMutation, toast]);

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/[0.02] blur-[100px]" />
      </div>

      <div className="relative space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/dashboard/theme"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Theme Studio
          </Link>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Themes</h1>
                <p className="text-white/50">Manage your custom theme library</p>
              </div>
            </div>

            <Link href="/dashboard/theme/upload">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Upload Theme
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <ThemeCardSkeleton key={i} />
            ))}
          </div>
        ) : themes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onViewVersions={() => handleViewVersions(theme)}
                onDelete={() => handleDeleteClick(theme)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Version Timeline Dialog */}
      {selectedTheme && (
        <VersionTimeline
          themeId={selectedTheme.id}
          themeName={selectedTheme.name}
          isOpen={isVersionsOpen}
          onClose={() => setIsVersionsOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        theme={selectedTheme}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
