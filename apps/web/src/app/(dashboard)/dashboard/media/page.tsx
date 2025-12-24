'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Upload,
  Image as ImageIcon,
  Grid,
  List,
  Trash2,
  MoreHorizontal,
  Search,
  RefreshCw,
  Check,
  X,
  Download,
  Copy,
  Loader2,
  FileImage,
  FileVideo,
  File,
  HardDrive,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useStoreStore } from '@/store/store';
import {
  useMedia,
  useUploadMedia,
  useDeleteMedia,
  useBulkDeleteMedia,
  useUpdateMedia,
  type MediaItem,
  type MediaParams,
} from '@/hooks/use-media';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType.startsWith('video/')) return FileVideo;
  return File;
}

// Stat Card Component - Dark Theme
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendUp,
  iconGradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  iconGradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${iconGradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <TrendingUp className={`w-3 h-3 ${!trendUp ? 'rotate-180' : ''}`} />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
        <p className="text-sm text-white/50 mt-1">{label}</p>
        {subValue && (
          <p className="text-xs text-white/40 mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent" />
      <div className="relative flex flex-col items-center justify-center py-20 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 flex items-center justify-center mb-6">
          <ImageIcon className="w-10 h-10 text-pink-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No files yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Upload images, videos, and documents to use across your store.
        </p>
        <Button
          onClick={onUpload}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload your first file
        </Button>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-red-500/20">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
          <ImageIcon className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Error loading media</h3>
        <p className="text-white/50 text-center max-w-sm mb-4">
          Something went wrong while fetching your files. Please try again.
        </p>
        <Button
          onClick={onRetry}
          className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}

// Grid Skeleton
function GridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl bg-white/[0.06]" />
      ))}
    </div>
  );
}

// List Skeleton
function ListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <Skeleton className="h-4 w-4 bg-white/[0.06]" />
          <Skeleton className="h-12 w-12 rounded-lg bg-white/[0.06]" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32 bg-white/[0.06]" />
            <Skeleton className="h-3 w-24 bg-white/[0.06]" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

export default function MediaPage() {
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = React.useState<MediaParams>({
    page: 1,
    limit: 24,
  });
  const [search, setSearch] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [detailsItem, setDetailsItem] = React.useState<MediaItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data, isLoading, error, refetch } = useMedia(filters);
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();
  const bulkDelete = useBulkDeleteMedia();
  void useUpdateMedia();

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        await uploadMedia.mutateAsync({ file });
        toast({
          title: 'File uploaded',
          description: `${file.name} has been uploaded.`,
        });
      } catch {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}.`,
          variant: 'destructive',
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMedia.mutateAsync(deleteConfirmId);
      toast({
        title: 'File deleted',
        description: 'The file has been deleted.',
      });
      setDeleteConfirmId(null);
      setDetailsItem(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete file.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDelete.mutateAsync(Array.from(selectedItems));
      toast({
        title: 'Files deleted',
        description: `${selectedItems.size} files have been deleted.`,
      });
      setSelectedItems(new Set());
      setBulkDeleteConfirm(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete files.',
        variant: 'destructive',
      });
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied',
      description: 'URL copied to clipboard.',
    });
  };

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!data?.data) return { total: 0, images: 0, videos: 0, totalSize: 0 };
    return {
      total: data.meta.total,
      images: data.data.filter((m) => m.mimeType.startsWith('image/')).length,
      videos: data.data.filter((m) => m.mimeType.startsWith('video/')).length,
      totalSize: data.data.reduce((sum, m) => sum + m.size, 0),
    };
  }, [data]);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-white/40" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">No store selected</h3>
          <p className="text-white/50 max-w-sm">
            Please select a store from the sidebar to view media.
          </p>
        </div>
        <Button asChild className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium">
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Media Library</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Upload and manage your images, videos, and files
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderOpen}
          label="Total Files"
          value={stats.total}
          trend={stats.total > 0 ? '+8' : undefined}
          trendUp={true}
          iconGradient="bg-gradient-to-br from-pink-500/20 to-rose-500/10"
        />
        <StatCard
          icon={FileImage}
          label="Images"
          value={stats.images}
          iconGradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/10"
        />
        <StatCard
          icon={FileVideo}
          label="Videos"
          value={stats.videos}
          iconGradient="bg-gradient-to-br from-purple-500/20 to-violet-500/10"
        />
        <StatCard
          icon={HardDrive}
          label="Storage Used"
          value={formatFileSize(stats.totalSize)}
          subValue="From visible files"
          iconGradient="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
        />
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
            />
          </div>

          <Select
            value={filters.mimeType || 'all'}
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                mimeType: value === 'all' ? undefined : value,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[140px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <Filter className="mr-2 h-4 w-4 text-white/40" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">All files</SelectItem>
              <SelectItem value="image" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Images</SelectItem>
              <SelectItem value="video" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Videos</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-white/[0.06] text-white' : 'text-white/50 hover:text-white'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${viewMode === 'list' ? 'bg-white/[0.06] text-white' : 'text-white/50 hover:text-white'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {selectedItems.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <Badge className="bg-amber-500/20 text-amber-400 border-0">
                {selectedItems.size} selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAll}
                className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkDeleteConfirm(true)}
                className="bg-transparent border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Media Grid/List */}
      {isLoading ? (
        viewMode === 'grid' ? <GridSkeleton /> : <ListSkeleton />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data?.data.length === 0 ? (
        <EmptyState onUpload={() => setUploadDialogOpen(true)} />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
          {data?.data.map((item) => {
            const isSelected = selectedItems.has(item.id);
            const isImage = item.mimeType.startsWith('image/');
            const FileIcon = getFileIcon(item.mimeType);

            return (
              <div
                key={item.id}
                className={`group relative aspect-square rounded-xl border overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-amber-500 border-amber-500/50'
                    : 'border-white/[0.06] hover:border-white/[0.15]'
                }`}
                onClick={() => setDetailsItem(item)}
              >
                {isImage ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-white/[0.02]">
                    <FileIcon className="h-12 w-12 text-white/30" />
                  </div>
                )}

                {/* Selection checkbox */}
                <div
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item.id);
                  }}
                >
                  <div
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-black'
                        : 'bg-black/50 border-white/40 hover:border-white'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </div>

                {/* Filename */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                  <p className="text-white text-xs font-medium truncate">{item.filename}</p>
                  <p className="text-white/50 text-xs">{formatFileSize(item.size)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data.map((item) => {
            const isSelected = selectedItems.has(item.id);
            const isImage = item.mimeType.startsWith('image/');
            const FileIcon = getFileIcon(item.mimeType);

            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-amber-500 border-amber-500/50 bg-amber-500/5'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
                onClick={() => setDetailsItem(item)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelect(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="border-white/20"
                />
                <div className="h-12 w-12 rounded-lg border border-white/[0.06] overflow-hidden bg-white/[0.02] flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.filename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileIcon className="h-6 w-6 text-white/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{item.filename}</p>
                  <p className="text-sm text-white/50">
                    {formatFileSize(item.size)} • {item.mimeType}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
                    <DropdownMenuItem
                      onClick={() => copyUrl(item.url)}
                      className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]">
                      <a href={item.url} download={item.filename}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.06]" />
                    <DropdownMenuItem
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-white/50">
            Page <span className="text-white/70 font-medium">{data.meta.page}</span> of{' '}
            <span className="text-white/70 font-medium">{data.meta.totalPages}</span> ({data.meta.total} files)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === data.meta.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilters((f) => ({ ...f, page: pageNum }))}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!data.meta.hasMore}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Files</DialogTitle>
            <DialogDescription className="text-white/50">
              Select files to upload to your media library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadMedia.isPending ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                  <p className="text-white/70 font-medium">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
                    <Upload className="h-7 w-7 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Click to upload</p>
                    <p className="text-sm text-white/50 mt-1">
                      or drag and drop files here
                    </p>
                  </div>
                  <p className="text-xs text-white/40">
                    Supports images, videos, and PDF files
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* File Details Dialog */}
      <Dialog open={!!detailsItem} onOpenChange={() => setDetailsItem(null)}>
        <DialogContent className="max-w-2xl bg-[#1a1a1a] border-white/[0.06]">
          {detailsItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white truncate">{detailsItem.filename}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="aspect-square rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.02] flex items-center justify-center">
                  {detailsItem.mimeType.startsWith('image/') ? (
                    <img
                      src={detailsItem.url}
                      alt={detailsItem.altText || detailsItem.filename}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <File className="h-16 w-16 text-white/30" />
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/50 text-xs uppercase tracking-wider">File name</Label>
                    <p className="font-medium text-white break-all mt-1">{detailsItem.filename}</p>
                  </div>
                  <div>
                    <Label className="text-white/50 text-xs uppercase tracking-wider">Type</Label>
                    <p className="font-medium text-white mt-1">{detailsItem.mimeType}</p>
                  </div>
                  <div>
                    <Label className="text-white/50 text-xs uppercase tracking-wider">Size</Label>
                    <p className="font-medium text-white mt-1">{formatFileSize(detailsItem.size)}</p>
                  </div>
                  <div>
                    <Label className="text-white/50 text-xs uppercase tracking-wider">URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={detailsItem.url}
                        readOnly
                        className="text-xs bg-white/[0.02] border-white/[0.06] text-white/70"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyUrl(detailsItem.url)}
                        className="shrink-0 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" asChild className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
                  <a href={detailsItem.url} download={detailsItem.filename}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
                <Button
                  onClick={() => setDeleteConfirmId(detailsItem.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete file?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will permanently delete this file. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete {selectedItems.size} files?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will permanently delete the selected files. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {bulkDelete.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete {selectedItems.size} files
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
