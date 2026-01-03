'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderTree,
  FileText,
  RefreshCw,
  Tag,
  Merge,
  Hash,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useBlogTags,
  useCreateBlogTag,
  useUpdateBlogTag,
  useDeleteBlogTag,
  useMergeBlogTags,
  BlogTag,
  CreateBlogTagInput,
} from '@/hooks/use-blogs';
import { useStoreStore } from '@/store/store';
import { cn } from '@/lib/utils';

// Blog navigation tabs
const blogTabs = [
  { name: 'All Posts', href: '/dashboard/blog', icon: FileText },
  { name: 'Categories', href: '/dashboard/blog/categories', icon: FolderTree },
  { name: 'Tags', href: '/dashboard/blog/tags', icon: Tag },
];

// Bento Stat Card
function BentoCard({
  icon: Icon,
  label,
  value,
  subValue,
  gradient,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6',
        'hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500',
        'animate-in fade-in slide-in-from-bottom-4'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className={cn('absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br', gradient)} />

      <div className="relative flex items-start justify-between">
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', gradient)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="relative mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
        <p className="text-sm text-white/50 mt-1">{label}</p>
        {subValue && <p className="text-xs text-white/40 mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
}

// Tag Chip
function TagChip({
  tag,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  delay = 0,
}: {
  tag: BlogTag;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-xl bg-white/[0.02] border p-4',
        'hover:bg-white/[0.04] transition-all duration-300',
        'animate-in fade-in slide-in-from-bottom-2',
        isSelected ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/[0.06]'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelect}
        className="border-white/20"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-violet-400" />
          <span className="font-medium text-white truncate">{tag.name}</span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-white/40">/{tag.slug}</span>
          <Badge variant="outline" className="text-xs border-white/10 text-white/50 bg-transparent">
            {tag.postsCount} posts
          </Badge>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
          <DropdownMenuLabel className="text-white/50 text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/[0.06]" />
          <DropdownMenuItem onClick={onEdit} className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/[0.06]" />
          <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Empty State
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
      <div className="relative flex flex-col items-center justify-center py-20 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center mb-6">
          <Tag className="w-10 h-10 text-violet-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No tags yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Create tags to help readers discover related content and improve your blog&apos;s SEO.
        </p>
        <Button onClick={onAdd} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2">
          <Plus className="w-4 h-4" />
          Create your first tag
        </Button>
      </div>
    </div>
  );
}

// Skeleton Loader
function TagsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-4 h-4 bg-white/[0.06]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24 bg-white/[0.06]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16 bg-white/[0.06]" />
                <Skeleton className="h-4 w-14 rounded-full bg-white/[0.06]" />
              </div>
            </div>
            <Skeleton className="w-8 h-8 rounded-lg bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogTagsPage() {
  const pathname = usePathname();
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [search, setSearch] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = React.useState(false);
  const [editTag, setEditTag] = React.useState<BlogTag | null>(null);
  const [deleteTag, setDeleteTag] = React.useState<BlogTag | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [mergeTargetId, setMergeTargetId] = React.useState<string>('');
  const [formData, setFormData] = React.useState<CreateBlogTagInput>({
    name: '',
    slug: '',
    description: '',
  });

  const { data, isLoading, refetch } = useBlogTags({
    sortBy: 'postsCount',
    sortOrder: 'desc',
  });
  const createTag = useCreateBlogTag();
  const updateTag = useUpdateBlogTag();
  const deleteTagMutation = useDeleteBlogTag();
  const mergeTags = useMergeBlogTags();

  const tags = data?.data || [];

  // Filter tags by search
  const filteredTags = React.useMemo(() => {
    if (!search) return tags;
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      tag.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [tags, search]);

  // Stats
  const stats = React.useMemo(() => {
    const totalPosts = tags.reduce((sum, tag) => sum + tag.postsCount, 0);
    const mostUsed = tags.length > 0 ? Math.max(...tags.map((t) => t.postsCount)) : 0;
    return {
      total: tags.length,
      totalUsage: totalPosts,
      mostUsed,
    };
  }, [tags]);

  const openDialog = (tag?: BlogTag) => {
    if (tag) {
      setEditTag(tag);
      setFormData({
        name: tag.name,
        slug: tag.slug,
        description: tag.description || '',
      });
    } else {
      setEditTag(null);
      setFormData({ name: '', slug: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditTag(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editTag) {
        await updateTag.mutateAsync({ tagId: editTag.id, data: formData });
        toast({ title: 'Tag updated', description: 'The tag has been updated successfully.' });
      } else {
        await createTag.mutateAsync(formData);
        toast({ title: 'Tag created', description: 'The tag has been created successfully.' });
      }
      closeDialog();
    } catch {
      toast({ title: 'Error', description: 'Failed to save tag. Please try again.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTag) return;

    try {
      await deleteTagMutation.mutateAsync(deleteTag.id);
      toast({ title: 'Tag deleted', description: 'The tag has been deleted successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete tag. Please try again.', variant: 'destructive' });
    }
    setDeleteTag(null);
  };

  const handleMerge = async () => {
    if (selectedTags.length < 2 || !mergeTargetId) return;

    const sourceIds = selectedTags.filter((id) => id !== mergeTargetId);

    try {
      await mergeTags.mutateAsync({ sourceTagIds: sourceIds, targetTagId: mergeTargetId });
      toast({ title: 'Tags merged', description: `Successfully merged ${sourceIds.length} tags.` });
      setSelectedTags([]);
      setMergeTargetId('');
      setIsMergeDialogOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to merge tags. Please try again.', variant: 'destructive' });
    }
  };

  const toggleSelect = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center">
          <Tag className="w-8 h-8 text-white/40" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">No store selected</h3>
          <p className="text-white/50 max-w-sm">Please select a store from the sidebar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
            <Tag className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Blog Tags</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Manage tags for better content discovery
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
            onClick={() => openDialog()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2"
          >
            <Plus className="w-4 h-4" />
            New Tag
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {blogTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
                isActive
                  ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BentoCard
          icon={Tag}
          label="Total Tags"
          value={stats.total}
          gradient="from-violet-500 to-purple-500"
          delay={0}
        />
        <BentoCard
          icon={Hash}
          label="Total Usage"
          value={stats.totalUsage}
          subValue="Tag assignments"
          gradient="from-blue-500 to-cyan-500"
          delay={50}
        />
        <BentoCard
          icon={Sparkles}
          label="Most Used"
          value={stats.mostUsed}
          subValue="Posts with top tag"
          gradient="from-amber-500 to-orange-500"
          delay={100}
        />
      </div>

      {/* Search & Bulk Actions */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
            />
          </div>
          {selectedTags.length >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMergeTargetId(selectedTags[0]);
                setIsMergeDialogOpen(true);
              }}
              className="gap-2 bg-transparent border-violet-500/30 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
            >
              <Merge className="w-4 h-4" />
              Merge {selectedTags.length} tags
            </Button>
          )}
        </div>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
            <span className="text-sm text-white/60 font-medium">
              {selectedTags.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="text-white/50 hover:text-white"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Tags Grid */}
      {isLoading ? (
        <TagsSkeleton />
      ) : filteredTags.length === 0 && !search ? (
        <EmptyState onAdd={() => openDialog()} />
      ) : filteredTags.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-12 text-center">
          <p className="text-white/50">No tags match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTags.map((tag, index) => (
            <TagChip
              key={tag.id}
              tag={tag}
              isSelected={selectedTags.includes(tag.id)}
              onSelect={() => toggleSelect(tag.id)}
              onEdit={() => openDialog(tag)}
              onDelete={() => setDeleteTag(tag)}
              delay={index * 30}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/[0.06] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editTag ? 'Edit Tag' : 'Create Tag'}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              {editTag
                ? 'Update the tag details below.'
                : 'Add a new tag for your blog posts.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: editTag ? formData.slug : generateSlug(e.target.value),
                  });
                }}
                placeholder="e.g., JavaScript"
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., javascript"
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Description (optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A brief description of this tag..."
                rows={3}
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 resize-none"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTag.isPending || updateTag.isPending}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
              >
                {createTag.isPending || updateTag.isPending ? 'Saving...' : editTag ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/[0.06] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Merge Tags</DialogTitle>
            <DialogDescription className="text-white/50">
              Select the target tag. All selected tags will be merged into this one, and posts will be updated accordingly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Merge into</Label>
              <Select value={mergeTargetId} onValueChange={setMergeTargetId}>
                <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                  <SelectValue placeholder="Select target tag" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                  {tags
                    .filter((t) => selectedTags.includes(t.id))
                    .map((tag) => (
                      <SelectItem
                        key={tag.id}
                        value={tag.id}
                        className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                      >
                        {tag.name} ({tag.postsCount} posts)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-400">
                {selectedTags.length - 1} tag(s) will be deleted and their posts will be assigned to the target tag.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMergeDialogOpen(false)}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMerge}
              disabled={mergeTags.isPending || !mergeTargetId}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-medium"
            >
              {mergeTags.isPending ? 'Merging...' : 'Merge Tags'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTag} onOpenChange={() => setDeleteTag(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Tag</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete &quot;{deleteTag?.name}&quot;? This tag will be removed from all associated posts.
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
    </div>
  );
}
