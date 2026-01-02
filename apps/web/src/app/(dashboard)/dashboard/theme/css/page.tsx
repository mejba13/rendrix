'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useStoreStore } from '@/store/store';
import { useStoreCustomCss, useUpdateCustomCss, useCreateBackup } from '@/hooks/use-theme-backups';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Save,
  Loader2,
  Undo2,
  Copy,
  Download,
  Upload,
  Wand2,
  AlertCircle,
  Check,
  FileCode,
  Sparkles,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Dynamically import Monaco Editor (client-side only)
const Editor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }
);

// CSS Templates
const cssTemplates = [
  {
    id: 'reset',
    name: 'CSS Reset',
    description: 'Basic CSS reset for consistent styling',
    code: `/* CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}
`,
  },
  {
    id: 'buttons',
    name: 'Custom Buttons',
    description: 'Styled button variations',
    code: `/* Custom Button Styles */
.btn-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-custom:active {
  transform: translateY(0);
}

.btn-gradient {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  color: white;
  border: none;
}
`,
  },
  {
    id: 'cards',
    name: 'Product Cards',
    description: 'Enhanced product card styling',
    code: `/* Product Card Enhancements */
.product-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.product-card img {
  transition: transform 0.5s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}

.product-card .badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  background: var(--primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}
`,
  },
  {
    id: 'animations',
    name: 'Animations',
    description: 'Reusable animation utilities',
    code: `/* Animation Utilities */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.animate-slide-up {
  animation: slideUp 0.5s ease forwards;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

/* Staggered animations */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
`,
  },
  {
    id: 'typography',
    name: 'Typography',
    description: 'Custom typography styles',
    code: `/* Typography Enhancements */
.heading-gradient {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-outline {
  -webkit-text-stroke: 1px currentColor;
  color: transparent;
}

.prose-lg {
  font-size: 1.125rem;
  line-height: 1.75;
  letter-spacing: -0.01em;
}

.drop-cap::first-letter {
  float: left;
  font-size: 3.5rem;
  line-height: 1;
  font-weight: 700;
  margin-right: 0.5rem;
  color: var(--primary);
}
`,
  },
];

// Template Dialog Component
function TemplateDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0f0f0f] border-white/[0.08]">
        <DialogHeader>
          <DialogTitle className="text-white">CSS Templates</DialogTitle>
          <DialogDescription className="text-white/50">
            Insert a pre-built CSS template to get started quickly
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4 max-h-[400px] overflow-y-auto">
          {cssTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onSelect(template.code);
                onClose();
              }}
              className="flex flex-col items-start gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.04] transition-all text-left group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  <FileCode className="w-4 h-4" />
                </div>
                <span className="font-medium text-white">{template.name}</span>
              </div>
              <p className="text-sm text-white/40">{template.description}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main CSS Editor Page
export default function CssEditorPage() {
  const router = useRouter();
  const { currentStore } = useStoreStore();
  const storeId = currentStore?.id || '';
  const editorRef = useRef<unknown>(null);

  const { data: cssData, isLoading } = useStoreCustomCss(storeId);
  const updateCss = useUpdateCustomCss(storeId);
  const createBackup = useCreateBackup(storeId);

  const [css, setCss] = useState('');
  const [originalCss, setOriginalCss] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Initialize CSS from API
  useEffect(() => {
    if (cssData?.data?.customCss !== undefined) {
      const customCss = cssData.data.customCss || '';
      setCss(customCss);
      setOriginalCss(customCss);
    }
  }, [cssData]);

  // Check for changes
  useEffect(() => {
    setHasChanges(css !== originalCss);
  }, [css, originalCss]);

  // Handle editor mount
  const handleEditorMount = useCallback((editor: unknown) => {
    editorRef.current = editor;
  }, []);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [css]);

  // Download CSS
  const handleDownload = useCallback(() => {
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStore?.slug || 'store'}-custom.css`;
    a.click();
    URL.revokeObjectURL(url);
  }, [css, currentStore?.slug]);

  // Upload CSS
  const handleUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.css,text/css';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        setCss(text);
      }
    };
    input.click();
  }, []);

  // Insert template
  const handleInsertTemplate = useCallback((templateCode: string) => {
    setCss((prev) => (prev ? `${prev}\n\n${templateCode}` : templateCode));
  }, []);

  // Format CSS (basic)
  const handleFormat = useCallback(() => {
    // Basic CSS formatting
    let formatted = css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\n  }/g, '\n}')
      .replace(/\n\n+/g, '\n\n')
      .trim();
    setCss(formatted);
  }, [css]);

  // Save changes
  const handleSave = async () => {
    if (!storeId) return;
    setIsSaving(true);
    try {
      // Create backup before saving
      await createBackup.mutateAsync('manual');
      await updateCss.mutateAsync(css);
      setOriginalCss(css);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save CSS:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    setCss(originalCss);
  };

  // Clear all
  const handleClearAll = () => {
    setCss('');
  };

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-white/30 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Store Selected</h2>
        <p className="text-white/50 mb-6">Please select a store to edit custom CSS</p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0a0a0a]' : 'min-h-screen'}`}>
      {/* Fixed Header */}
      <div className={`sticky top-0 z-40 ${isFullscreen ? '' : '-mx-6 -mt-6'} px-6 py-4 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.05]`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isFullscreen && (
              <button
                onClick={() => router.push('/dashboard/theme')}
                className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-white">Custom CSS Editor</h1>
              <p className="text-sm text-white/40">Add custom styles to your store</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Copy CSS"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Download CSS"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleUpload}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Upload CSS"
              >
                <Upload className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button
                onClick={handleFormat}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Format CSS"
              >
                <Wand2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTemplates(true)}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Insert Template"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded-lg transition-colors ${showPreview ? 'text-primary bg-primary/10' : 'text-white/50 hover:text-white hover:bg-white/[0.08]'}`}
                title={showPreview ? 'Hide Preview' : 'Show Preview'}
              >
                {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="border-white/[0.1] text-white/70 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
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
      <div className={`flex gap-0 mt-0 ${isFullscreen ? 'h-[calc(100vh-73px)]' : 'h-[calc(100vh-180px)]'}`}>
        {/* Editor Panel */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} h-full border-r border-white/[0.05]`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <Editor
              height="100%"
              defaultLanguage="css"
              value={css}
              onChange={(value) => setCss(value || '')}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'line',
                bracketPairColorization: { enabled: true },
              }}
            />
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 h-full flex flex-col bg-white/[0.02]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
              <span className="text-sm font-medium text-white/70">Live Preview</span>
              <span className="text-xs text-white/40">{css.length} characters</span>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {/* Preview Frame */}
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                {/* Browser Chrome */}
                <div className="h-8 bg-gray-100 flex items-center px-3 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="h-5 rounded-full bg-gray-200 max-w-sm mx-auto flex items-center justify-center">
                      <span className="text-xs text-gray-400">{currentStore?.subdomain || currentStore?.slug}.rendrix.com</span>
                    </div>
                  </div>
                </div>

                {/* Preview Content with Custom CSS */}
                <div className="p-6">
                  <style>{css}</style>

                  {/* Sample Content */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h1 className="heading-gradient text-3xl font-bold mb-2">
                        {currentStore?.name || 'Your Store'}
                      </h1>
                      <p className="text-gray-600 prose-lg">
                        Preview your custom CSS styles in real-time
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="product-card bg-gray-50 rounded-lg overflow-hidden">
                          <div className="aspect-square bg-gray-200" />
                          <div className="p-3">
                            <p className="font-medium text-gray-900">Product {i}</p>
                            <p className="text-sm text-primary font-semibold">$99.00</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-4">
                      <button className="btn-custom bg-gray-900 text-white px-6 py-2 rounded-lg">
                        Default Button
                      </button>
                      <button className="btn-custom btn-gradient px-6 py-2 rounded-lg">
                        Gradient Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Dialog */}
      <TemplateDialog
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={handleInsertTemplate}
      />

      {/* Unsaved Changes Indicator */}
      {hasChanges && !isFullscreen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
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
        </div>
      )}
    </div>
  );
}
