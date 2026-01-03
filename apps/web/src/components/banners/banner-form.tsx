'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Monitor,
  Tablet,
  Smartphone,
  Link as LinkIcon,
  Calendar,
  Eye,
  Palette,
  LayoutTemplate,
  Megaphone,
  Layers,
  Target,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  useCreateBanner,
  useUpdateBanner,
  Banner,
  BannerPlacement,
  BannerStatus,
  CreateBannerInput,
} from '@/hooks/use-banners';

const placementConfig: Record<
  BannerPlacement,
  { label: string; icon: React.ElementType; description: string; color: string }
> = {
  homepage_hero: {
    label: 'Homepage Hero',
    icon: LayoutTemplate,
    description: 'Full-width hero banner on homepage',
    color: 'from-violet-500/20 to-purple-500/10',
  },
  section_banner: {
    label: 'Section Banner',
    icon: Layers,
    description: 'Promotional banners within page sections',
    color: 'from-blue-500/20 to-cyan-500/10',
  },
  collection_banner: {
    label: 'Collection Banner',
    icon: Target,
    description: 'Banners for product collections',
    color: 'from-emerald-500/20 to-green-500/10',
  },
  announcement_bar: {
    label: 'Announcement Bar',
    icon: Megaphone,
    description: 'Top bar for announcements & promos',
    color: 'from-amber-500/20 to-orange-500/10',
  },
};

interface BannerFormProps {
  banner?: Banner;
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!banner;

  const [formData, setFormData] = useState<CreateBannerInput>({
    title: banner?.title || '',
    description: banner?.description || '',
    imageUrl: banner?.imageUrl || '',
    imageUrlTablet: banner?.imageUrlTablet || '',
    imageUrlMobile: banner?.imageUrlMobile || '',
    ctaText: banner?.ctaText || '',
    ctaUrl: banner?.ctaUrl || '',
    ctaTarget: banner?.ctaTarget || '_self',
    placement: banner?.placement || 'homepage_hero',
    status: banner?.status || 'draft',
    startDate: banner?.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
    endDate: banner?.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
    priority: banner?.priority || 0,
    backgroundColor: banner?.backgroundColor || '',
    textColor: banner?.textColor || '',
    overlayOpacity: banner?.overlayOpacity || 0,
  });

  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for the banner.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const data: CreateBannerInput = {
        ...formData,
        title: formData.title?.trim(),
        description: formData.description?.trim() || null,
        imageUrl: formData.imageUrl?.trim() || null,
        imageUrlTablet: formData.imageUrlTablet?.trim() || null,
        imageUrlMobile: formData.imageUrlMobile?.trim() || null,
        ctaText: formData.ctaText?.trim() || null,
        ctaUrl: formData.ctaUrl?.trim() || null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        backgroundColor: formData.backgroundColor?.trim() || null,
        textColor: formData.textColor?.trim() || null,
      };

      if (isEditing) {
        await updateBanner.mutateAsync({ bannerId: banner.id, data });
        toast({
          title: 'Banner updated',
          description: 'Your banner has been updated successfully.',
        });
      } else {
        await createBanner.mutateAsync(data);
        toast({
          title: 'Banner created',
          description: 'Your banner has been created successfully.',
        });
      }
      router.push('/dashboard/banners');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} banner.`,
        variant: 'destructive',
      });
    }
  };

  const isPending = createBanner.isPending || updateBanner.isPending;
  const selectedPlacement = placementConfig[formData.placement as BannerPlacement];
  const PlacementIcon = selectedPlacement?.icon;

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.02] blur-[80px]" />
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              asChild
              className="text-white/50 hover:text-white hover:bg-white/[0.08]"
            >
              <Link href="/dashboard/banners">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedPlacement?.color || 'from-primary/20 to-orange-500/10'} flex items-center justify-center`}>
                {PlacementIcon ? <PlacementIcon className="w-5 h-5 text-white" /> : <ImageIcon className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Banner' : 'New Banner'}
                </h1>
                <p className="text-white/50 text-sm mt-0.5">
                  {isEditing ? banner.title : 'Create a new promotional banner'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/banners')}
              className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-black font-medium gap-2"
            >
              <Save className="w-4 h-4" />
              {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Banner'}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
              <div className="flex items-center gap-2 text-white/70 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Basic Information</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Title *</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Summer Sale 2024"
                    className="bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/70">Description</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the banner..."
                    className="bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 resize-none min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
              <div className="flex items-center gap-2 text-white/70 mb-2">
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">Banner Images</span>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Desktop Image */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-white/50" />
                    <Label className="text-white/70">Desktop</Label>
                  </div>
                  <div className="relative aspect-video rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] overflow-hidden group">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Desktop preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
                        <Monitor className="w-8 h-8 mb-2" />
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <Input
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Image URL..."
                    className="bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 text-sm h-9"
                  />
                </div>

                {/* Tablet Image */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tablet className="w-4 h-4 text-white/50" />
                    <Label className="text-white/70">Tablet</Label>
                  </div>
                  <div className="relative aspect-video rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] overflow-hidden">
                    {formData.imageUrlTablet ? (
                      <img
                        src={formData.imageUrlTablet}
                        alt="Tablet preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
                        <Tablet className="w-8 h-8 mb-2" />
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <Input
                    value={formData.imageUrlTablet || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, imageUrlTablet: e.target.value }))}
                    placeholder="Image URL..."
                    className="bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 text-sm h-9"
                  />
                </div>

                {/* Mobile Image */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-white/50" />
                    <Label className="text-white/70">Mobile</Label>
                  </div>
                  <div className="relative aspect-video rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] overflow-hidden">
                    {formData.imageUrlMobile ? (
                      <img
                        src={formData.imageUrlMobile}
                        alt="Mobile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
                        <Smartphone className="w-8 h-8 mb-2" />
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <Input
                    value={formData.imageUrlMobile || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, imageUrlMobile: e.target.value }))}
                    placeholder="Image URL..."
                    className="bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 text-sm h-9"
                  />
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
              <div className="flex items-center gap-2 text-white/70 mb-2">
                <LinkIcon className="w-5 h-5" />
                <span className="font-medium">Call to Action</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white/70">Button Text</Label>
                  <Input
                    value={formData.ctaText || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ctaText: e.target.value }))}
                    placeholder="e.g., Shop Now"
                    className="bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Link URL</Label>
                  <Input
                    value={formData.ctaUrl || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ctaUrl: e.target.value }))}
                    placeholder="https://..."
                    className="bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 h-11"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-white/50" />
                  <div>
                    <p className="text-sm text-white/70">Open in new tab</p>
                    <p className="text-xs text-white/40">Link opens in a new browser tab</p>
                  </div>
                </div>
                <Switch
                  checked={formData.ctaTarget === '_blank'}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, ctaTarget: checked ? '_blank' : '_self' }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Placement Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center gap-2 text-white/70 mb-2">
                <LayoutTemplate className="w-5 h-5" />
                <span className="font-medium">Placement</span>
              </div>

              <Select
                value={formData.placement}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, placement: value as BannerPlacement }))}
              >
                <SelectTrigger className="bg-white/[0.02] border-white/[0.08] text-white h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                  {(Object.entries(placementConfig) as [BannerPlacement, typeof placementConfig[BannerPlacement]][]).map(
                    ([placement, config]) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem
                          key={placement}
                          value={placement}
                          className="text-white/70 focus:bg-white/[0.06] focus:text-white"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      );
                    }
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-white/40">{selectedPlacement?.description}</p>
            </div>

            {/* Status Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center gap-2 text-white/70 mb-2">
                <Eye className="w-5 h-5" />
                <span className="font-medium">Status</span>
              </div>

              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as BannerStatus }))}
              >
                <SelectTrigger className="bg-white/[0.02] border-white/[0.08] text-white h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
                  <SelectItem value="draft" className="text-white/70 focus:bg-white/[0.06] focus:text-white">
                    Draft
                  </SelectItem>
                  <SelectItem value="active" className="text-white/70 focus:bg-white/[0.06] focus:text-white">
                    Active
                  </SelectItem>
                  <SelectItem value="scheduled" className="text-white/70 focus:bg-white/[0.06] focus:text-white">
                    Scheduled
                  </SelectItem>
                  <SelectItem value="inactive" className="text-white/70 focus:bg-white/[0.06] focus:text-white">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center gap-2 text-white/70 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Schedule</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Start Date</Label>
                  <Input
                    type="datetime-local"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="bg-white/[0.02] border-white/[0.08] text-white h-10 [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">End Date</Label>
                  <Input
                    type="datetime-local"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="bg-white/[0.02] border-white/[0.08] text-white h-10 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Priority Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/70">
                  <Layers className="w-5 h-5" />
                  <span className="font-medium">Priority</span>
                </div>
                <span className="text-lg font-bold text-primary">{formData.priority}</span>
              </div>
              <Slider
                value={[formData.priority || 0]}
                onValueChange={([value]) => setFormData((prev) => ({ ...prev, priority: value }))}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-primary"
              />
              <p className="text-xs text-white/40">Higher priority banners appear first</p>
            </div>

            {/* Style Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
              <div className="flex items-center gap-2 text-white/70 mb-2">
                <Palette className="w-5 h-5" />
                <span className="font-medium">Styling</span>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Background</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.backgroundColor || '#000000'}
                      onChange={(e) => setFormData((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-10 h-10 p-1 bg-transparent border-white/[0.08] rounded-lg cursor-pointer"
                    />
                    <Input
                      value={formData.backgroundColor || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#000000"
                      className="flex-1 bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 h-10 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.textColor || '#ffffff'}
                      onChange={(e) => setFormData((prev) => ({ ...prev, textColor: e.target.value }))}
                      className="w-10 h-10 p-1 bg-transparent border-white/[0.08] rounded-lg cursor-pointer"
                    />
                    <Input
                      value={formData.textColor || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, textColor: e.target.value }))}
                      placeholder="#ffffff"
                      className="flex-1 bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/30 h-10 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/70 text-sm">Overlay Opacity</Label>
                  <span className="text-sm text-white/50">{formData.overlayOpacity}%</span>
                </div>
                <Slider
                  value={[formData.overlayOpacity || 0]}
                  onValueChange={([value]) => setFormData((prev) => ({ ...prev, overlayOpacity: value }))}
                  max={100}
                  step={5}
                  className="[&_[role=slider]]:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
