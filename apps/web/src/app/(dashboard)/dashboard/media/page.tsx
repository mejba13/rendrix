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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
      } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store from the sidebar to view media.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your images and files.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
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
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All files</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {selectedItems.size > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedItems.size} selected</Badge>
            <Button variant="outline" size="sm" onClick={deselectAll}>
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteConfirm(true)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      {isLoading ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6' : ''}`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className={viewMode === 'grid' ? 'aspect-square' : 'h-16'} />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Error loading media</h3>
            <p className="text-muted-foreground mt-1">Please try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : data?.data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No files yet</h3>
            <p className="text-muted-foreground mt-2">
              Upload your first file to get started.
            </p>
            <Button className="mt-6" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload files
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
          {data?.data.map((item) => {
            const isSelected = selectedItems.has(item.id);
            const isImage = item.mimeType.startsWith('image/');
            const FileIcon = getFileIcon(item.mimeType);

            return (
              <div
                key={item.id}
                className={`group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
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
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <FileIcon className="h-12 w-12 text-muted-foreground" />
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
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </div>

                {/* Filename */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">{item.filename}</p>
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
                className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setDetailsItem(item)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelect(item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="h-12 w-12 rounded border overflow-hidden bg-muted flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.filename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(item.size)} • {item.mimeType}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => copyUrl(item.url)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={item.url} download={item.filename}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="text-destructive focus:text-destructive"
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} files)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.meta.hasMore}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Select files to upload to your media library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadMedia.isPending ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Click to upload</p>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop files here
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
        <DialogContent className="max-w-2xl">
          {detailsItem && (
            <>
              <DialogHeader>
                <DialogTitle className="truncate">{detailsItem.filename}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="aspect-square rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                  {detailsItem.mimeType.startsWith('image/') ? (
                    <img
                      src={detailsItem.url}
                      alt={detailsItem.altText || detailsItem.filename}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <File className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">File name</Label>
                    <p className="font-medium break-all">{detailsItem.filename}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium">{detailsItem.mimeType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Size</Label>
                    <p className="font-medium">{formatFileSize(detailsItem.size)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={detailsItem.url} readOnly className="text-xs" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyUrl(detailsItem.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" asChild>
                  <a href={detailsItem.url} download={detailsItem.filename}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteConfirmId(detailsItem.id)}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this file. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedItems.size} files?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected files. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
