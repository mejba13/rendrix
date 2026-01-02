'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUploadTheme } from '@/hooks/use-theme-upload';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Upload,
  FileArchive,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Package,
  Crown,
  FileCode,
  Image,
  Settings,
  Sparkles,
  ExternalLink,
  Trash2,
  Eye,
} from 'lucide-react';
import type {
  ThemeValidationError,
  ThemeValidationWarning,
} from '@rendrix/types';

// Upload states
type UploadState = 'idle' | 'uploading' | 'success' | 'error';

// File validation
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Drag and Drop Upload Component
function ThemeUploader({
  onUpload,
  isUploading,
}: {
  onUpload: (file: File) => void;
  isUploading: boolean;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith('.zip')) {
      return 'File must be a ZIP archive';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
    } else {
      setFileError(null);
      setSelectedFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragOver
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-white/[0.1] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.04]'
          }
          ${selectedFile ? 'border-green-500/50 bg-green-500/5' : ''}
          ${fileError ? 'border-red-500/50 bg-red-500/5' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {/* Icon */}
        <div className={`
          w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center
          transition-all duration-300
          ${isDragOver
            ? 'bg-amber-500/20 scale-110'
            : selectedFile
              ? 'bg-green-500/20'
              : fileError
                ? 'bg-red-500/20'
                : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
          }
        `}>
          {selectedFile ? (
            <FileArchive className="w-10 h-10 text-green-400" />
          ) : fileError ? (
            <XCircle className="w-10 h-10 text-red-400" />
          ) : (
            <Upload className={`w-10 h-10 transition-all duration-300 ${isDragOver ? 'text-amber-400 scale-110' : 'text-white/40 group-hover:text-white/60'}`} />
          )}
        </div>

        {/* Text */}
        {selectedFile ? (
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">{selectedFile.name}</p>
            <p className="text-sm text-white/50">{formatFileSize(selectedFile.size)}</p>
          </div>
        ) : fileError ? (
          <div className="space-y-2">
            <p className="text-lg font-semibold text-red-400">{fileError}</p>
            <p className="text-sm text-white/50">Please select a valid theme package</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">
              {isDragOver ? 'Drop your theme package here' : 'Drag & drop your theme package'}
            </p>
            <p className="text-sm text-white/50">
              or click to browse • ZIP files up to {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold h-12"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Theme
              </>
            )}
          </Button>
          <Button
            onClick={handleClear}
            disabled={isUploading}
            variant="outline"
            className="h-12 border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Validation Result Component
function ValidationResult({
  errors,
  warnings,
}: {
  errors: ThemeValidationError[];
  warnings: ThemeValidationWarning[];
}) {
  return (
    <div className="space-y-4">
      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-red-400">
              {errors.length} Error{errors.length !== 1 ? 's' : ''} Found
            </span>
          </div>
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-red-400/50 mt-0.5">•</span>
                <div>
                  <span className="font-mono text-xs text-red-400/70 mr-2">[{error.code}]</span>
                  {error.message}
                  {error.path && (
                    <span className="text-white/40 ml-2">in {error.path}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-amber-400">
              {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-amber-400/50 mt-0.5">•</span>
                <div>
                  <span className="font-mono text-xs text-amber-400/70 mr-2">[{warning.code}]</span>
                  {warning.message}
                  {warning.path && (
                    <span className="text-white/40 ml-2">in {warning.path}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Success Result Component
function UploadSuccess({
  version,
  assetsUploaded,
  warnings,
  onReset,
}: {
  themeId: string;
  slug: string;
  version: string;
  assetsUploaded: number;
  warnings?: ThemeValidationWarning[];
  onReset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Success Icon */}
      <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-green-400" />
      </div>

      {/* Message */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Theme Uploaded Successfully!</h2>
        <p className="text-white/50">Your custom theme has been installed and is ready to use.</p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{version}</p>
          <p className="text-xs text-white/40">Version</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{assetsUploaded}</p>
          <p className="text-xs text-white/40">Assets</p>
        </div>
      </div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="max-w-md mx-auto">
          <ValidationResult errors={[]} warnings={warnings} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <Button
          onClick={() => router.push('/dashboard/theme')}
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
        >
          <Eye className="w-4 h-4 mr-2" />
          View in Theme Studio
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Another
        </Button>
      </div>
    </div>
  );
}

// Package Structure Guide
function PackageGuide() {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-amber-400" />
        Theme Package Structure
      </h3>

      <div className="font-mono text-sm text-white/60 space-y-1 bg-black/30 rounded-lg p-4">
        <div className="text-amber-400">theme-name/</div>
        <div className="pl-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-3 h-3" />
            <span className="text-green-400">manifest.json</span>
            <span className="text-white/30 text-xs">required</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCode className="w-3 h-3" />
            <span>settings.json</span>
          </div>
          <div className="text-white/40">sections/</div>
          <div className="pl-4 text-white/30">[section-name].json</div>
          <div className="text-white/40">assets/</div>
          <div className="pl-4">
            <div className="flex items-center gap-2">
              <Image className="w-3 h-3" />
              <span className="text-green-400">preview-desktop.png</span>
              <span className="text-white/30 text-xs">required</span>
            </div>
            <div className="text-white/30">css/custom.css</div>
            <div className="text-white/30">images/</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
        <Settings className="w-4 h-4" />
        <span>View the</span>
        <a href="#" className="text-amber-400 hover:underline flex items-center gap-1">
          theme development guide
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// Plan Gate Component
function ProPlanGate() {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-amber-500/50 bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite] rounded-2xl blur-sm" />

      <div className="relative m-[1px] rounded-2xl bg-[#0c0c0c] p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Crown className="w-8 h-8 text-amber-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Pro Plan Required</h2>
        <p className="text-white/50 max-w-md mx-auto mb-6">
          Custom theme uploads are available for Pro, Business, and Enterprise plans.
          Upgrade now to unlock custom themes and advanced customization features.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
          <Link href="/dashboard/theme">
            <Button variant="outline" className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white">
              Browse Free Themes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function ThemeUploadPage() {
  const { toast } = useToast();
  const uploadMutation = useUploadTheme();

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadResult, setUploadResult] = useState<{
    themeId: string;
    slug: string;
    version: string;
    assetsUploaded: number;
    warnings?: ThemeValidationWarning[];
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    errors: ThemeValidationError[];
    warnings: ThemeValidationWarning[];
  } | null>(null);

  // TODO: Check if user has Pro+ plan
  const hasProPlan = true; // Placeholder - implement actual check

  const handleUpload = useCallback(async (file: File) => {
    setUploadState('uploading');
    setValidationErrors(null);

    try {
      const result = await uploadMutation.mutateAsync(file);
      setUploadResult(result);
      setUploadState('success');
      toast({
        title: 'Theme uploaded!',
        description: `"${file.name}" has been installed successfully.`,
      });
    } catch (error) {
      const validationError = error as { errors: ThemeValidationError[]; warnings: ThemeValidationWarning[] };
      setValidationErrors(validationError);
      setUploadState('error');
      toast({
        title: 'Upload failed',
        description: 'Please fix the validation errors and try again.',
        variant: 'destructive',
      });
    }
  }, [uploadMutation, toast]);

  const handleReset = useCallback(() => {
    setUploadState('idle');
    setUploadResult(null);
    setValidationErrors(null);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/[0.02] blur-[100px]" />
      </div>

      <div className="relative space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <Link
            href="/dashboard/theme"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Theme Studio
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
              <Upload className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Upload Custom Theme</h1>
              <p className="text-white/50">Import your own theme package to customize your storefront</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!hasProPlan ? (
          <ProPlanGate />
        ) : uploadState === 'success' && uploadResult ? (
          <UploadSuccess
            themeId={uploadResult.themeId}
            slug={uploadResult.slug}
            version={uploadResult.version}
            assetsUploaded={uploadResult.assetsUploaded}
            warnings={uploadResult.warnings}
            onReset={handleReset}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload Area */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <FileArchive className="w-5 h-5 text-amber-400" />
                  Theme Package
                </h2>

                <ThemeUploader
                  onUpload={handleUpload}
                  isUploading={uploadState === 'uploading'}
                />

                {/* Validation Errors */}
                {uploadState === 'error' && validationErrors && (
                  <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                    <ValidationResult
                      errors={validationErrors.errors}
                      warnings={validationErrors.warnings}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Guide */}
            <div className="space-y-6">
              <PackageGuide />

              {/* Requirements */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {[
                    'ZIP file up to 50MB',
                    'Valid manifest.json with theme metadata',
                    'Desktop preview image (PNG)',
                    'No executable files (.js, .exe, .sh)',
                    'CSS-only styling (no inline JavaScript)',
                  ].map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-green-400/70 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
