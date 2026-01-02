'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Menu as MenuIcon,
  RefreshCw,
  LayoutPanelTop,
  PanelBottom,
  Smartphone,
  LayoutGrid,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useMenus,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
  MenuLocation,
} from '@/hooks/use-menus';

const locationConfig: Record<
  MenuLocation,
  { label: string; icon: React.ElementType; description: string; color: string }
> = {
  header: {
    label: 'Header',
    icon: LayoutPanelTop,
    description: 'Main navigation at the top of your store',
    color: 'from-blue-500/20 to-cyan-500/10',
  },
  footer: {
    label: 'Footer',
    icon: PanelBottom,
    description: 'Links at the bottom of every page',
    color: 'from-purple-500/20 to-pink-500/10',
  },
  mobile: {
    label: 'Mobile',
    icon: Smartphone,
    description: 'Navigation for mobile devices',
    color: 'from-emerald-500/20 to-green-500/10',
  },
  utility: {
    label: 'Utility',
    icon: LayoutGrid,
    description: 'Secondary links like help, account, etc.',
    color: 'from-amber-500/20 to-orange-500/10',
  },
};

// Menu Card Component
function MenuCard({
  menu,
  onEdit,
  onDelete,
}: {
  menu: { id: string; name: string; slug: string; location: MenuLocation; description: string | null; isActive: boolean; itemCount?: number };
  onEdit: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const config = locationConfig[menu.location];
  const Icon = config.icon;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 cursor-pointer"
      onClick={() => router.push(`/dashboard/menus/${menu.id}`)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-50`} />

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {menu.isActive ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
                <Eye className="w-3 h-3" />
                Active
              </Badge>
            ) : (
              <Badge className="bg-white/[0.06] text-white/50 border-0 gap-1">
                <EyeOff className="w-3 h-3" />
                Inactive
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
                <DropdownMenuLabel className="text-white/50 text-xs">Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  onClick={onEdit}
                  className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Menu
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">{menu.name}</h3>
          <p className="text-sm text-white/50 line-clamp-2">
            {menu.description || config.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-white/30" />
              <span className="text-sm text-white/50">
                {menu.itemCount || 0} items
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/50 hover:text-white hover:bg-white/[0.06] gap-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/menus/${menu.id}`);
            }}
          >
            Manage
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Empty State
function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
      <div className="relative flex flex-col items-center justify-center py-20 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-6">
          <MenuIcon className="w-10 h-10 text-amber-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No menus yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Create navigation menus for your store header, footer, mobile view, and more.
        </p>
        <Button
          onClick={onCreateClick}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2"
        >
          <Plus className="w-4 h-4" />
          Create your first menu
        </Button>
      </div>
    </div>
  );
}

// Skeleton Loader
function MenusSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-12 w-12 rounded-xl bg-white/[0.06]" />
            <Skeleton className="h-6 w-16 rounded-full bg-white/[0.06]" />
          </div>
          <Skeleton className="h-5 w-32 bg-white/[0.06] mb-2" />
          <Skeleton className="h-4 w-full bg-white/[0.06] mb-1" />
          <Skeleton className="h-4 w-3/4 bg-white/[0.06]" />
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06]">
            <Skeleton className="h-4 w-16 bg-white/[0.06]" />
            <Skeleton className="h-8 w-20 rounded-lg bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MenusPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<MenuLocation | 'all'>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<{ id: string; name: string; description: string | null; isActive: boolean } | null>(null);
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: 'header' as MenuLocation,
    description: '',
    isActive: true,
  });

  const { data, isLoading, refetch } = useMenus({
    search: search || undefined,
    location: locationFilter !== 'all' ? locationFilter : undefined,
  });

  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenu = useDeleteMenu();

  const resetForm = () => {
    setFormData({
      name: '',
      location: 'header',
      description: '',
      isActive: true,
    });
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for the menu.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const menu = await createMenu.mutateAsync({
        name: formData.name.trim(),
        location: formData.location,
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      });
      toast({
        title: 'Menu created',
        description: 'Your menu has been created successfully.',
      });
      setCreateDialogOpen(false);
      resetForm();
      router.push(`/dashboard/menus/${menu.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create menu. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingMenu) return;

    try {
      await updateMenu.mutateAsync({
        menuId: editingMenu.id,
        data: {
          name: editingMenu.name.trim(),
          description: editingMenu.description?.trim() || undefined,
          isActive: editingMenu.isActive,
        },
      });
      toast({
        title: 'Menu updated',
        description: 'Your menu has been updated successfully.',
      });
      setEditingMenu(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update menu. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteMenuId) return;

    try {
      await deleteMenu.mutateAsync(deleteMenuId);
      toast({
        title: 'Menu deleted',
        description: 'The menu has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete menu. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteMenuId(null);
    }
  };

  // Check which locations are already used
  const usedLocations = new Set(data?.data.map((m) => m.location) || []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
            <MenuIcon className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Menus</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Manage navigation menus for your storefront
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
            onClick={() => setCreateDialogOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2"
          >
            <Plus className="w-4 h-4" />
            New Menu
          </Button>
        </div>
      </div>

      {/* Location Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(locationConfig) as [MenuLocation, typeof locationConfig[MenuLocation]][]).map(
          ([location, config]) => {
            const Icon = config.icon;
            const hasMenu = usedLocations.has(location);
            return (
              <div
                key={location}
                className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                  hasMenu
                    ? 'bg-white/[0.02] border-white/[0.06]'
                    : 'bg-white/[0.01] border-dashed border-white/[0.04] hover:border-white/[0.08] cursor-pointer'
                }`}
                onClick={() => {
                  if (!hasMenu) {
                    setFormData((prev) => ({ ...prev, location }));
                    setCreateDialogOpen(true);
                  }
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-30`} />
                <div className="relative flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white">{config.label}</h4>
                    <p className="text-xs text-white/40 truncate">
                      {hasMenu ? 'Menu configured' : 'Not configured'}
                    </p>
                  </div>
                  {hasMenu ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  ) : (
                    <Plus className="w-4 h-4 text-white/30" />
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search menus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
            />
          </div>
          <Select
            value={locationFilter}
            onValueChange={(value) => setLocationFilter(value as MenuLocation | 'all')}
          >
            <SelectTrigger className="w-[160px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <LayoutGrid className="mr-2 h-4 w-4 text-white/40" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">
                All Locations
              </SelectItem>
              {(Object.entries(locationConfig) as [MenuLocation, typeof locationConfig[MenuLocation]][]).map(
                ([location, config]) => (
                  <SelectItem
                    key={location}
                    value={location}
                    className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                  >
                    {config.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Menus Grid */}
      {isLoading ? (
        <MenusSkeleton />
      ) : data?.data.length === 0 ? (
        <EmptyState onCreateClick={() => setCreateDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {data?.data.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              onEdit={() =>
                setEditingMenu({
                  id: menu.id,
                  name: menu.name,
                  description: menu.description,
                  isActive: menu.isActive,
                })
              }
              onDelete={() => setDeleteMenuId(menu.id)}
            />
          ))}
        </div>
      )}

      {/* Create Menu Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/[0.06] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Menu</DialogTitle>
            <DialogDescription className="text-white/50">
              Create a navigation menu for your storefront.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/70">Name</Label>
              <Input
                placeholder="e.g., Main Navigation"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value as MenuLocation }))}
              >
                <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                  {(Object.entries(locationConfig) as [MenuLocation, typeof locationConfig[MenuLocation]][]).map(
                    ([location, config]) => {
                      const Icon = config.icon;
                      const isUsed = usedLocations.has(location);
                      return (
                        <SelectItem
                          key={location}
                          value={location}
                          disabled={isUsed}
                          className="text-white/70 focus:bg-white/[0.06] focus:text-white disabled:opacity-50"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {config.label}
                            {isUsed && <span className="text-xs text-white/40">(In use)</span>}
                          </div>
                        </SelectItem>
                      );
                    }
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-white/40">{locationConfig[formData.location].description}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Description (optional)</Label>
              <Textarea
                placeholder="Brief description of this menu..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 resize-none"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/70">Active</Label>
                <p className="text-xs text-white/40">Show this menu on your storefront</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMenu.isPending}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
            >
              {createMenu.isPending ? 'Creating...' : 'Create Menu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog */}
      <Dialog open={!!editingMenu} onOpenChange={() => setEditingMenu(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/[0.06] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Menu</DialogTitle>
            <DialogDescription className="text-white/50">
              Update menu settings.
            </DialogDescription>
          </DialogHeader>
          {editingMenu && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-white/70">Name</Label>
                <Input
                  value={editingMenu.name}
                  onChange={(e) => setEditingMenu((prev) => prev && { ...prev, name: e.target.value })}
                  className="bg-white/[0.02] border-white/[0.06] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Description (optional)</Label>
                <Textarea
                  value={editingMenu.description || ''}
                  onChange={(e) => setEditingMenu((prev) => prev && { ...prev, description: e.target.value })}
                  className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-white/70">Active</Label>
                  <p className="text-xs text-white/40">Show this menu on your storefront</p>
                </div>
                <Switch
                  checked={editingMenu.isActive}
                  onCheckedChange={(checked) => setEditingMenu((prev) => prev && { ...prev, isActive: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingMenu(null)}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMenu.isPending}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
            >
              {updateMenu.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteMenuId} onOpenChange={() => setDeleteMenuId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Menu</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete this menu? This will also delete all menu items. This action cannot be undone.
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
