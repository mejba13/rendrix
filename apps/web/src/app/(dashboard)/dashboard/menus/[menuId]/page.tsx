'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Link as LinkIcon,
  FileText,
  FolderOpen,
  Package,
  Minus,
  ExternalLink,
  Star,
  Save,
  RefreshCw,
  LayoutPanelTop,
  PanelBottom,
  Smartphone,
  LayoutGrid,
  Sparkles,
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
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useMenu,
  useAddMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useReorderMenuItems,
  MenuItem,
  MenuItemType,
  MenuLocation,
  CreateMenuItemInput,
} from '@/hooks/use-menus';
import { usePages } from '@/hooks/use-pages';

const locationIcons: Record<MenuLocation, React.ElementType> = {
  header: LayoutPanelTop,
  footer: PanelBottom,
  mobile: Smartphone,
  utility: LayoutGrid,
};

const itemTypeConfig: Record<
  MenuItemType,
  { label: string; icon: React.ElementType; description: string }
> = {
  link: {
    label: 'Custom Link',
    icon: LinkIcon,
    description: 'Link to any URL',
  },
  page: {
    label: 'Page',
    icon: FileText,
    description: 'Link to a store page',
  },
  category: {
    label: 'Category',
    icon: FolderOpen,
    description: 'Link to a product category',
  },
  product: {
    label: 'Product',
    icon: Package,
    description: 'Link to a specific product',
  },
  divider: {
    label: 'Divider',
    icon: Minus,
    description: 'Visual separator',
  },
};

// Recursive Menu Item Component
function MenuItemRow({
  item,
  depth = 0,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleExpand,
  expandedItems,
}: {
  item: MenuItem;
  depth?: number;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleVisibility: (item: MenuItem) => void;
  onToggleExpand: (itemId: string) => void;
  expandedItems: Set<string>;
}) {
  const TypeIcon = itemTypeConfig[item.type]?.icon || LinkIcon;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.id);

  return (
    <>
      <div
        className={`group flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
          depth > 0 ? 'bg-white/[0.01]' : ''
        }`}
        style={{ paddingLeft: `${16 + depth * 24}px` }}
      >
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/50">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Expand/Collapse for items with children */}
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(item.id)}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white/70"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Type Icon */}
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
          <TypeIcon className="w-4 h-4 text-white/50" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{item.title}</span>
            {item.highlight && (
              <Badge className="bg-amber-500/20 text-amber-400 border-0 gap-1 text-xs">
                <Sparkles className="w-3 h-3" />
                Highlight
              </Badge>
            )}
            {item.badge && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="capitalize">{item.type}</span>
            {item.url && (
              <>
                <span>·</span>
                <span className="truncate max-w-[200px]">{item.url}</span>
              </>
            )}
            {item.page && (
              <>
                <span>·</span>
                <span className="truncate">{item.page.title}</span>
              </>
            )}
            {item.category && (
              <>
                <span>·</span>
                <span className="truncate">{item.category.name}</span>
              </>
            )}
            {item.product && (
              <>
                <span>·</span>
                <span className="truncate">{item.product.name}</span>
              </>
            )}
            {item.target === '_blank' && (
              <ExternalLink className="w-3 h-3 text-white/30" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]"
            onClick={() => onToggleVisibility(item)}
          >
            {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]"
            onClick={() => onEdit(item)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.06]">
              <DropdownMenuLabel className="text-white/50 text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                onClick={() => onEdit(item)}
                className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Item
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleVisibility(item)}
                className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.06]"
              >
                {item.isVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide Item
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Item
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <>
          {item.children!.map((child) => (
            <MenuItemRow
              key={child.id}
              item={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
              onToggleExpand={onToggleExpand}
              expandedItems={expandedItems}
            />
          ))}
        </>
      )}
    </>
  );
}

// Empty State for Menu Items
function EmptyItemsState({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
        <LinkIcon className="w-8 h-8 text-white/30" />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">No menu items</h3>
      <p className="text-white/50 text-center max-w-sm mb-6">
        Add links, pages, categories, or products to build your navigation menu.
      </p>
      <Button
        onClick={onAddClick}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium gap-2"
      >
        <Plus className="w-4 h-4" />
        Add First Item
      </Button>
    </div>
  );
}

// Skeleton Loader
function MenuDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl bg-white/[0.06]" />
        <div>
          <Skeleton className="h-6 w-48 bg-white/[0.06] mb-2" />
          <Skeleton className="h-4 w-32 bg-white/[0.06]" />
        </div>
      </div>
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-white/[0.04]">
            <Skeleton className="h-4 w-4 bg-white/[0.06]" />
            <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 bg-white/[0.06] mb-1" />
              <Skeleton className="h-3 w-24 bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const menuId = params.menuId as string;

  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Form state for add/edit
  const [itemForm, setItemForm] = useState<CreateMenuItemInput>({
    type: 'link',
    title: '',
    url: '',
    target: '_self',
    isVisible: true,
    highlight: false,
    badge: '',
    parentId: null,
  });

  const { data: menu, isLoading, refetch } = useMenu(menuId);
  const { data: pagesData } = usePages({ status: 'published', limit: 100 });
  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  const resetForm = useCallback(() => {
    setItemForm({
      type: 'link',
      title: '',
      url: '',
      target: '_self',
      isVisible: true,
      highlight: false,
      badge: '',
      parentId: null,
    });
  }, []);

  const handleAddItem = async () => {
    if (!itemForm.title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for the menu item.',
        variant: 'destructive',
      });
      return;
    }

    if (itemForm.type === 'link' && !itemForm.url?.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter a URL for the link.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addMenuItem.mutateAsync({
        menuId,
        data: {
          ...itemForm,
          title: itemForm.title.trim(),
          url: itemForm.url?.trim() || undefined,
          badge: itemForm.badge?.trim() || undefined,
        },
      });
      toast({
        title: 'Item added',
        description: 'Menu item has been added successfully.',
      });
      setAddItemDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      await updateMenuItem.mutateAsync({
        menuId,
        itemId: editingItem.id,
        data: {
          title: itemForm.title.trim(),
          url: itemForm.url?.trim() || undefined,
          target: itemForm.target,
          isVisible: itemForm.isVisible,
          highlight: itemForm.highlight,
          badge: itemForm.badge?.trim() || undefined,
          pageId: itemForm.pageId,
        },
      });
      toast({
        title: 'Item updated',
        description: 'Menu item has been updated successfully.',
      });
      setEditingItem(null);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;

    try {
      await deleteMenuItem.mutateAsync({ menuId, itemId: deleteItemId });
      toast({
        title: 'Item deleted',
        description: 'Menu item has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleToggleVisibility = async (item: MenuItem) => {
    try {
      await updateMenuItem.mutateAsync({
        menuId,
        itemId: item.id,
        data: { isVisible: !item.isVisible },
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update visibility.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      type: item.type,
      title: item.title,
      url: item.url || '',
      target: item.target,
      isVisible: item.isVisible,
      highlight: item.highlight,
      badge: item.badge || '',
      pageId: item.pageId,
      categoryId: item.categoryId,
      productId: item.productId,
      parentId: item.parentId,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <MenuDetailSkeleton />
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/50 mb-4">Menu not found</p>
        <Button asChild variant="outline" className="bg-transparent border-white/10 text-white/70">
          <Link href="/dashboard/menus">Back to Menus</Link>
        </Button>
      </div>
    );
  }

  const LocationIcon = locationIcons[menu.location];
  const flatItems = menu.items || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-10 w-10 text-white/50 hover:text-white hover:bg-white/[0.06] shrink-0"
          >
            <Link href="/dashboard/menus">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-white tracking-tight">{menu.name}</h1>
              <Badge className="bg-white/[0.06] text-white/60 border-0 gap-1">
                <LocationIcon className="w-3 h-3" />
                {menu.location.charAt(0).toUpperCase() + menu.location.slice(1)}
              </Badge>
              {menu.isActive ? (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Active</Badge>
              ) : (
                <Badge className="bg-white/[0.06] text-white/50 border-0">Inactive</Badge>
              )}
            </div>
            <p className="text-white/50 text-sm">
              {menu.description || 'Manage menu items and navigation structure'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-14 sm:ml-0">
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
            onClick={() => setAddItemDialogOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
          <div className="text-2xl font-semibold text-white">{flatItems.length}</div>
          <div className="text-sm text-white/50">Total Items</div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
          <div className="text-2xl font-semibold text-white">
            {flatItems.filter((i) => i.isVisible).length}
          </div>
          <div className="text-sm text-white/50">Visible</div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
          <div className="text-2xl font-semibold text-white">
            {flatItems.filter((i) => i.highlight).length}
          </div>
          <div className="text-sm text-white/50">Highlighted</div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
          <div className="text-2xl font-semibold text-white">
            {flatItems.filter((i) => !i.parentId).length}
          </div>
          <div className="text-sm text-white/50">Top Level</div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <h3 className="font-medium text-white">Menu Items</h3>
          <span className="text-sm text-white/40">{flatItems.length} items</span>
        </div>

        {flatItems.length === 0 ? (
          <EmptyItemsState onAddClick={() => setAddItemDialogOpen(true)} />
        ) : (
          <div>
            {flatItems
              .filter((item) => !item.parentId)
              .map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  onEdit={openEditDialog}
                  onDelete={(item) => setDeleteItemId(item.id)}
                  onToggleVisibility={handleToggleVisibility}
                  onToggleExpand={handleToggleExpand}
                  expandedItems={expandedItems}
                />
              ))}
          </div>
        )}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/[0.06] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Add Menu Item</DialogTitle>
            <DialogDescription className="text-white/50">
              Add a new item to your navigation menu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Item Type */}
            <div className="space-y-2">
              <Label className="text-white/70">Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(itemTypeConfig) as [MenuItemType, typeof itemTypeConfig[MenuItemType]][]).map(
                  ([type, config]) => {
                    const Icon = config.icon;
                    const isSelected = itemForm.type === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setItemForm((prev) => ({ ...prev, type }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/30 text-white'
                            : 'bg-white/[0.02] border-white/[0.06] text-white/60 hover:text-white hover:border-white/[0.1]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{config.label}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-white/70">Title</Label>
              <Input
                placeholder="e.g., Shop All"
                value={itemForm.title}
                onChange={(e) => setItemForm((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
              />
            </div>

            {/* URL (for link type) */}
            {itemForm.type === 'link' && (
              <div className="space-y-2">
                <Label className="text-white/70">URL</Label>
                <Input
                  placeholder="https://example.com or /products"
                  value={itemForm.url || ''}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, url: e.target.value }))}
                  className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
                />
              </div>
            )}

            {/* Page selector (for page type) */}
            {itemForm.type === 'page' && (
              <div className="space-y-2">
                <Label className="text-white/70">Select Page</Label>
                <Select
                  value={itemForm.pageId || ''}
                  onValueChange={(value) => setItemForm((prev) => ({ ...prev, pageId: value || null }))}
                >
                  <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                    <SelectValue placeholder="Choose a page" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                    {pagesData?.data.map((page) => (
                      <SelectItem
                        key={page.id}
                        value={page.id}
                        className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                      >
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Target */}
            {itemForm.type !== 'divider' && (
              <div className="space-y-2">
                <Label className="text-white/70">Open In</Label>
                <Select
                  value={itemForm.target}
                  onValueChange={(value) =>
                    setItemForm((prev) => ({ ...prev, target: value as '_self' | '_blank' }))
                  }
                >
                  <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                    <SelectItem
                      value="_self"
                      className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                    >
                      Same Window
                    </SelectItem>
                    <SelectItem
                      value="_blank"
                      className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                    >
                      New Tab
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Badge */}
            <div className="space-y-2">
              <Label className="text-white/70">Badge (optional)</Label>
              <Input
                placeholder="e.g., New, Sale, Hot"
                value={itemForm.badge || ''}
                onChange={(e) => setItemForm((prev) => ({ ...prev, badge: e.target.value }))}
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
              />
              <p className="text-xs text-white/40">
                Add a small label next to the menu item
              </p>
            </div>

            {/* Highlight */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/70">Highlight</Label>
                <p className="text-xs text-white/40">Make this item stand out</p>
              </div>
              <Switch
                checked={itemForm.highlight}
                onCheckedChange={(checked) => setItemForm((prev) => ({ ...prev, highlight: checked }))}
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/70">Visible</Label>
                <p className="text-xs text-white/40">Show this item on the storefront</p>
              </div>
              <Switch
                checked={itemForm.isVisible}
                onCheckedChange={(checked) => setItemForm((prev) => ({ ...prev, isVisible: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddItemDialogOpen(false);
                resetForm();
              }}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={addMenuItem.isPending}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
            >
              {addMenuItem.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/[0.06] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Menu Item</DialogTitle>
            <DialogDescription className="text-white/50">
              Update this menu item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-white/70">Title</Label>
              <Input
                value={itemForm.title}
                onChange={(e) => setItemForm((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-white/[0.02] border-white/[0.06] text-white"
              />
            </div>

            {/* URL (for link type) */}
            {itemForm.type === 'link' && (
              <div className="space-y-2">
                <Label className="text-white/70">URL</Label>
                <Input
                  value={itemForm.url || ''}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, url: e.target.value }))}
                  className="bg-white/[0.02] border-white/[0.06] text-white"
                />
              </div>
            )}

            {/* Target */}
            {itemForm.type !== 'divider' && (
              <div className="space-y-2">
                <Label className="text-white/70">Open In</Label>
                <Select
                  value={itemForm.target}
                  onValueChange={(value) =>
                    setItemForm((prev) => ({ ...prev, target: value as '_self' | '_blank' }))
                  }
                >
                  <SelectTrigger className="bg-white/[0.02] border-white/[0.06] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                    <SelectItem
                      value="_self"
                      className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                    >
                      Same Window
                    </SelectItem>
                    <SelectItem
                      value="_blank"
                      className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                    >
                      New Tab
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Badge */}
            <div className="space-y-2">
              <Label className="text-white/70">Badge (optional)</Label>
              <Input
                value={itemForm.badge || ''}
                onChange={(e) => setItemForm((prev) => ({ ...prev, badge: e.target.value }))}
                className="bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
              />
            </div>

            {/* Highlight */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/70">Highlight</Label>
                <p className="text-xs text-white/40">Make this item stand out</p>
              </div>
              <Switch
                checked={itemForm.highlight}
                onCheckedChange={(checked) => setItemForm((prev) => ({ ...prev, highlight: checked }))}
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/70">Visible</Label>
                <p className="text-xs text-white/40">Show this item on the storefront</p>
              </div>
              <Switch
                checked={itemForm.isVisible}
                onCheckedChange={(checked) => setItemForm((prev) => ({ ...prev, isVisible: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingItem(null);
                resetForm();
              }}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateItem}
              disabled={updateMenuItem.isPending}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium"
            >
              {updateMenuItem.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete this menu item? If it has children, they will also be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
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
