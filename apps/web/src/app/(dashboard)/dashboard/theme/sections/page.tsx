'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useStoreStore } from '@/store/store';
import { useStoreSections, useUpdateStoreSections } from '@/hooks/use-theme-sections';
import type { StoreSectionConfig, ThemeSection } from '@/hooks/use-theme-sections';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  Settings2,
  Trash2,
  Layout,
  Image,
  ShoppingBag,
  Star,
  MessageSquare,
  Mail,
  Layers,
  Grid,
  AlertCircle,
  Undo2,
  X,
  Check,
  Copy,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Section type icons
const sectionTypeIcons: Record<string, React.ElementType> = {
  hero: Layout,
  header: Layout,
  footer: Layout,
  products: ShoppingBag,
  featured: Star,
  gallery: Image,
  testimonials: MessageSquare,
  newsletter: Mail,
  collection: Grid,
  default: Layers,
};

// Generate unique ID
function generateId(): string {
  return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Section Card Component
function SectionCard({
  section,
  themeSection,
  onToggle,
  onSettings,
  onRemove,
  onDuplicate,
}: {
  section: StoreSectionConfig;
  themeSection?: ThemeSection;
  onToggle: () => void;
  onSettings: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const Icon = sectionTypeIcons[themeSection?.type || 'default'] || sectionTypeIcons.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
        section.enabled
          ? 'bg-white/[0.04] border-white/[0.08] hover:border-primary/30'
          : 'bg-white/[0.02] border-white/[0.05] opacity-60'
      }`}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Section Icon */}
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
          section.enabled ? 'bg-primary/10 text-primary' : 'bg-white/[0.05] text-white/40'
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Section Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${section.enabled ? 'text-white' : 'text-white/50'}`}>
          {themeSection?.name || section.sectionSlug}
        </h3>
        <p className="text-sm text-white/40 truncate capitalize">
          {themeSection?.type || 'Section'} • {section.sectionSlug}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDuplicate}
          className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={onSettings}
          className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-red-500/20 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          section.enabled
            ? 'bg-primary/20 text-primary hover:bg-primary/30'
            : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white'
        }`}
        title={section.enabled ? 'Disable section' : 'Enable section'}
      >
        {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </motion.div>
  );
}

// Available Section Card Component
function AvailableSectionCard({
  section,
  onAdd,
}: {
  section: ThemeSection;
  onAdd: () => void;
}) {
  const Icon = sectionTypeIcons[section.type] || sectionTypeIcons.default;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAdd}
      className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.04] transition-all text-center group"
    >
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] group-hover:bg-primary/10 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="font-medium text-white text-sm">{section.name}</p>
        <p className="text-xs text-white/40 capitalize mt-0.5">{section.type}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Plus className="w-4 h-4" />
      </div>
    </motion.button>
  );
}

// Section Settings Dialog
function SectionSettingsDialog({
  section,
  themeSection,
  onClose,
  onSave,
}: {
  section: StoreSectionConfig;
  themeSection?: ThemeSection;
  onClose: () => void;
  onSave: (settings: Record<string, unknown>) => void;
}) {
  const [settings, setSettings] = useState<Record<string, unknown>>(section.settings);
  const schema = themeSection?.schema as { settings?: Array<{ id: string; label: string; type: string; default?: unknown }> } | undefined;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0f0f0f] border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-white">{themeSection?.name || section.sectionSlug}</DialogTitle>
          <DialogDescription className="text-white/50">
            Configure this section's settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {schema?.settings && schema.settings.length > 0 ? (
            schema.settings.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-medium text-white/70">{field.label}</label>
                {field.type === 'text' || field.type === 'url' ? (
                  <input
                    type={field.type === 'url' ? 'url' : 'text'}
                    value={(settings[field.id] as string) || (field.default as string) || ''}
                    onChange={(e) => setSettings({ ...settings, [field.id]: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={(settings[field.id] as string) || (field.default as string) || ''}
                    onChange={(e) => setSettings({ ...settings, [field.id]: e.target.value })}
                    className="w-full h-24 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : field.type === 'number' || field.type === 'range' ? (
                  <input
                    type="number"
                    value={(settings[field.id] as number) || (field.default as number) || 0}
                    onChange={(e) => setSettings({ ...settings, [field.id]: parseInt(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : field.type === 'checkbox' ? (
                  <button
                    onClick={() => setSettings({ ...settings, [field.id]: !settings[field.id] })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      settings[field.id] ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-white/60'
                    }`}
                  >
                    {settings[field.id] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span className="text-sm">{settings[field.id] ? 'Enabled' : 'Disabled'}</span>
                  </button>
                ) : field.type === 'color' ? (
                  <input
                    type="color"
                    value={(settings[field.id] as string) || (field.default as string) || '#ffffff'}
                    onChange={(e) => setSettings({ ...settings, [field.id]: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer border-2 border-white/10 bg-transparent"
                  />
                ) : (
                  <input
                    type="text"
                    value={(settings[field.id] as string) || (field.default as string) || ''}
                    onChange={(e) => setSettings({ ...settings, [field.id]: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                <Settings2 className="w-6 h-6 text-white/30" />
              </div>
              <p className="text-white/50 text-sm">No configurable settings for this section</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/[0.1] text-white/70"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Section Editor Page
export default function SectionEditorPage() {
  const router = useRouter();
  const { currentStore } = useStoreStore();
  const storeId = currentStore?.id || '';

  const { data: sectionsData, isLoading } = useStoreSections(storeId);
  const updateSections = useUpdateStoreSections(storeId);

  const [localSections, setLocalSections] = useState<StoreSectionConfig[]>([]);
  const [originalSections, setOriginalSections] = useState<StoreSectionConfig[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [selectedSection, setSelectedSection] = useState<StoreSectionConfig | null>(null);

  const availableSections = sectionsData?.data?.availableSections || [];
  const themeSectionsMap = new Map(availableSections.map((s) => [s.slug, s]));

  // Initialize local sections from API data
  useEffect(() => {
    if (sectionsData?.data?.storeSections) {
      const sections = [...sectionsData.data.storeSections].sort((a, b) => a.sortOrder - b.sortOrder);
      setLocalSections(sections);
      setOriginalSections(sections);
    }
  }, [sectionsData]);

  // Check for changes
  useEffect(() => {
    setHasChanges(JSON.stringify(localSections) !== JSON.stringify(originalSections));
  }, [localSections, originalSections]);

  // Handle reorder
  const handleReorder = useCallback((reorderedSections: StoreSectionConfig[]) => {
    const updated = reorderedSections.map((section, index) => ({
      ...section,
      sortOrder: index,
    }));
    setLocalSections(updated);
  }, []);

  // Toggle section visibility
  const handleToggle = useCallback((sectionId: string) => {
    setLocalSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s))
    );
  }, []);

  // Remove section
  const handleRemove = useCallback((sectionId: string) => {
    setLocalSections((prev) => prev.filter((s) => s.id !== sectionId));
  }, []);

  // Duplicate section
  const handleDuplicate = useCallback((section: StoreSectionConfig) => {
    const newSection: StoreSectionConfig = {
      ...section,
      id: generateId(),
      sortOrder: localSections.length,
    };
    setLocalSections((prev) => [...prev, newSection]);
  }, [localSections.length]);

  // Add new section
  const handleAddSection = useCallback((themeSection: ThemeSection) => {
    const newSection: StoreSectionConfig = {
      id: generateId(),
      sectionSlug: themeSection.slug,
      enabled: true,
      settings: themeSection.defaults,
      sortOrder: localSections.length,
    };
    setLocalSections((prev) => [...prev, newSection]);
    setShowAddSection(false);
  }, [localSections.length]);

  // Update section settings
  const handleUpdateSettings = useCallback((sectionId: string, settings: Record<string, unknown>) => {
    setLocalSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, settings } : s))
    );
    setSelectedSection(null);
  }, []);

  // Save changes
  const handleSave = async () => {
    if (!storeId) return;
    setIsSaving(true);
    try {
      await updateSections.mutateAsync(localSections);
      setOriginalSections(localSections);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save sections:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    setLocalSections(originalSections);
  };

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-white/30 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Store Selected</h2>
        <p className="text-white/50 mb-6">Please select a store to manage sections</p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed Header */}
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
              <h1 className="text-xl font-semibold text-white">Section Editor</h1>
              <p className="text-sm text-white/40">Manage and organize your store sections</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSection(true)}
              className="border-white/[0.1] text-white/70 hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges}
              className="border-white/[0.1] text-white/70 hover:text-white disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 max-w-3xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : localSections.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Sections Yet</h3>
            <p className="text-white/50 mb-6">Add sections to build your store layout</p>
            <Button onClick={() => setShowAddSection(true)} className="bg-primary hover:bg-primary/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Section
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-white/50">
                {localSections.length} section{localSections.length !== 1 ? 's' : ''} • Drag to reorder
              </span>
            </div>

            <Reorder.Group
              axis="y"
              values={localSections}
              onReorder={handleReorder}
              className="space-y-3"
            >
              <AnimatePresence>
                {localSections.map((section) => (
                  <Reorder.Item key={section.id} value={section}>
                    <SectionCard
                      section={section}
                      themeSection={themeSectionsMap.get(section.sectionSlug)}
                      onToggle={() => handleToggle(section.id)}
                      onSettings={() => setSelectedSection(section)}
                      onRemove={() => handleRemove(section.id)}
                      onDuplicate={() => handleDuplicate(section)}
                    />
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>
        )}
      </div>

      {/* Add Section Dialog */}
      <Dialog open={showAddSection} onOpenChange={setShowAddSection}>
        <DialogContent className="max-w-2xl bg-[#0f0f0f] border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Section</DialogTitle>
            <DialogDescription className="text-white/50">
              Choose a section to add to your store layout
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {availableSections.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 text-white/30 mx-auto mb-3" />
                <p className="text-white/50">No sections available for this theme</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                {availableSections.map((section) => (
                  <AvailableSectionCard
                    key={section.id}
                    section={section}
                    onAdd={() => handleAddSection(section)}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Section Settings Dialog */}
      {selectedSection && (
        <SectionSettingsDialog
          section={selectedSection}
          themeSection={themeSectionsMap.get(selectedSection.sectionSlug)}
          onClose={() => setSelectedSection(null)}
          onSave={(settings) => handleUpdateSettings(selectedSection.id, settings)}
        />
      )}

      {/* Unsaved Changes Indicator */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#1a1a1a] border border-white/[0.1] shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm text-white/70">You have unsaved changes</span>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-black font-semibold rounded-full"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
