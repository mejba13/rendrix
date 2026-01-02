'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { useStoreStore } from '@/store/store';
import {
  useStoreBackups,
  useCreateBackup,
  useRestoreBackup,
  useExportThemeConfig,
  useImportThemeConfig,
  type ThemeBackup,
  type ThemeBackupReason,
} from '@/hooks/use-theme-backups';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  RotateCcw,
  Download,
  Upload,
  Clock,
  AlertCircle,
  Check,
  X,
  FileJson,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  GitBranch,
  Settings,
  Calendar,
  Archive,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

// Backup reason labels and icons
const backupReasonInfo: Record<ThemeBackupReason, { label: string; icon: React.ElementType; color: string }> = {
  manual: { label: 'Manual Backup', icon: Save, color: 'text-blue-400' },
  auto_upgrade: { label: 'Auto (Upgrade)', icon: Sparkles, color: 'text-purple-400' },
  rollback: { label: 'Rollback Point', icon: GitBranch, color: 'text-amber-400' },
  theme_change: { label: 'Theme Change', icon: Settings, color: 'text-green-400' },
};

// Backup Card Component
function BackupCard({
  backup,
  onPreview,
  onRestore,
}: {
  backup: ThemeBackup;
  onPreview: () => void;
  onRestore: () => void;
}) {
  const reasonInfo = backup.reason ? backupReasonInfo[backup.reason] : null;
  const ReasonIcon = reasonInfo?.icon || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center ${reasonInfo?.color || 'text-white/40'}`}>
        <ReasonIcon className="w-6 h-6" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white truncate">
            {reasonInfo?.label || 'Backup'}
          </h3>
          {backup.themeVersion && (
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs text-white/50">
              v{backup.themeVersion}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-white/40">
            {formatDistanceToNow(new Date(backup.createdAt), { addSuffix: true })}
          </span>
          <span className="text-xs text-white/30">
            {format(new Date(backup.createdAt), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white text-sm transition-colors"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={onRestore}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restore
        </button>
      </div>
    </motion.div>
  );
}

// Preview Dialog Component
function BackupPreviewDialog({
  backup,
  onClose,
}: {
  backup: ThemeBackup;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'settings' | 'css' | 'sections'>('settings');

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0f0f0f] border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-white">Backup Preview</DialogTitle>
          <DialogDescription className="text-white/50">
            Created {formatDistanceToNow(new Date(backup.createdAt), { addSuffix: true })} • v{backup.themeVersion}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] w-fit">
          {(['settings', 'css', 'sections'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-white/[0.1] text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {tab === 'css' ? 'Custom CSS' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-[400px] overflow-auto">
          {activeTab === 'settings' && (
            <pre className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-white/70 font-mono overflow-x-auto">
              {JSON.stringify(backup.themeSettings, null, 2)}
            </pre>
          )}
          {activeTab === 'css' && (
            <pre className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-white/70 font-mono overflow-x-auto whitespace-pre-wrap">
              {backup.customCss || '/* No custom CSS */'}
            </pre>
          )}
          {activeTab === 'sections' && (
            <pre className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-white/70 font-mono overflow-x-auto">
              {JSON.stringify(backup.sections, null, 2)}
            </pre>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} className="border-white/[0.1] text-white/70">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Import Dialog Component
function ImportDialog({
  open,
  onClose,
  onImport,
  isImporting,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (data: { themeSettings?: unknown; customCss?: string; sections?: unknown[] }) => void;
  isImporting: boolean;
}) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);
    setParseError(null);

    try {
      const text = await file.text();
      JSON.parse(text); // Validate JSON
      setFileContent(text);
    } catch {
      setParseError('Invalid JSON file. Please upload a valid theme export.');
      setFileContent(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleImport = useCallback(() => {
    if (!fileContent) return;
    try {
      const data = JSON.parse(fileContent);
      onImport({
        themeSettings: data.themeSettings,
        customCss: data.customCss,
        sections: data.sections,
      });
    } catch {
      setParseError('Failed to parse import data');
    }
  }, [fileContent, onImport]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0f0f0f] border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-white">Import Theme Configuration</DialogTitle>
          <DialogDescription className="text-white/50">
            Upload a previously exported theme configuration file
          </DialogDescription>
        </DialogHeader>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`mt-4 p-8 rounded-xl border-2 border-dashed transition-colors ${
            fileContent
              ? 'border-green-500/30 bg-green-500/5'
              : parseError
              ? 'border-red-500/30 bg-red-500/5'
              : 'border-white/[0.1] hover:border-white/[0.2]'
          }`}
        >
          <div className="text-center">
            {fileContent ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-white font-medium">{fileName}</p>
                <p className="text-sm text-white/40 mt-1">Ready to import</p>
              </>
            ) : parseError ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-red-400 font-medium">{parseError}</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                  <FileJson className="w-6 h-6 text-white/40" />
                </div>
                <p className="text-white font-medium">Drop your JSON file here</p>
                <p className="text-sm text-white/40 mt-1">or click to browse</p>
              </>
            )}
          </div>

          <input
            type="file"
            accept=".json,application/json"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/[0.1] text-white/70"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!fileContent || isImporting}
            className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Backups Page
export default function BackupsPage() {
  const router = useRouter();
  const { currentStore } = useStoreStore();
  const storeId = currentStore?.id || '';

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: backupsData, isLoading, refetch } = useStoreBackups(storeId, { page, limit });
  const { refetch: fetchExport } = useExportThemeConfig(storeId);
  const createBackup = useCreateBackup(storeId);
  const restoreBackup = useRestoreBackup(storeId);
  const importConfig = useImportThemeConfig(storeId);

  const [isCreating, setIsCreating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [previewBackup, setPreviewBackup] = useState<ThemeBackup | null>(null);
  const [restoreBackupId, setRestoreBackupId] = useState<string | null>(null);

  const backups = backupsData?.data || [];
  const meta = backupsData?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

  // Create backup
  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      await createBackup.mutateAsync('manual');
      refetch();
    } catch (error) {
      console.error('Failed to create backup:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Export theme config
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await fetchExport();
      if (result.data?.data) {
        const blob = new Blob([JSON.stringify(result.data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentStore?.slug || 'store'}-theme-config-${format(new Date(), 'yyyy-MM-dd')}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Restore backup
  const handleRestore = async () => {
    if (!restoreBackupId) return;
    try {
      await restoreBackup.mutateAsync(restoreBackupId);
      setRestoreBackupId(null);
      refetch();
    } catch (error) {
      console.error('Failed to restore:', error);
    }
  };

  // Import config
  const handleImport = async (data: { themeSettings?: unknown; customCss?: string; sections?: unknown[] }) => {
    try {
      await importConfig.mutateAsync(data);
      setShowImport(false);
      refetch();
    } catch (error) {
      console.error('Failed to import:', error);
    }
  };

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-white/30 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Store Selected</h2>
        <p className="text-white/50 mb-6">Please select a store to manage backups</p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 -mx-6 -mt-6 px-6 py-4 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/theme')}
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Theme Backups</h1>
              <p className="text-sm text-white/40">Manage backups and restore points</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="border-white/[0.1] text-white/70 hover:text-white"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImport(true)}
              className="border-white/[0.1] text-white/70 hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              size="sm"
              onClick={handleCreateBackup}
              disabled={isCreating}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Backup
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 mb-8">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Archive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{meta.total}</p>
              <p className="text-sm text-white/40">Total Backups</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">
                {backups.filter((b) => b.reason === 'manual').length}
              </p>
              <p className="text-sm text-white/40">Manual Backups</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">
                {backups.filter((b) => b.reason === 'auto_upgrade').length}
              </p>
              <p className="text-sm text-white/40">Auto Backups</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">
                {backups.length > 0
                  ? formatDistanceToNow(new Date(backups[0].createdAt), { addSuffix: false })
                  : 'Never'}
              </p>
              <p className="text-sm text-white/40">Last Backup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backups List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : backups.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <Archive className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Backups Yet</h3>
          <p className="text-white/50 mb-6">Create your first backup to protect your theme configuration</p>
          <Button onClick={handleCreateBackup} disabled={isCreating} className="bg-primary hover:bg-primary/90 text-black">
            {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Create First Backup
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {backups.map((backup) => (
              <BackupCard
                key={backup.id}
                backup={backup}
                onPreview={() => setPreviewBackup(backup)}
                onRestore={() => setRestoreBackupId(backup.id)}
              />
            ))}
          </AnimatePresence>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
              <p className="text-sm text-white/40">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, meta.total)} of {meta.total} backups
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-white/[0.1] text-white/70 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-white/70 px-3">
                  Page {page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="border-white/[0.1] text-white/70 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Dialog */}
      {previewBackup && (
        <BackupPreviewDialog
          backup={previewBackup}
          onClose={() => setPreviewBackup(null)}
        />
      )}

      {/* Import Dialog */}
      <ImportDialog
        open={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
        isImporting={importConfig.isPending}
      />

      {/* Restore Confirmation */}
      <AlertDialog open={!!restoreBackupId} onOpenChange={() => setRestoreBackupId(null)}>
        <AlertDialogContent className="bg-[#0f0f0f] border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Restore from Backup?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will replace your current theme configuration with the backup. A new backup will be created automatically before restoring.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/[0.1] text-white/70 hover:bg-white/[0.04]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={restoreBackup.isPending}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              {restoreBackup.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Restore Backup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
