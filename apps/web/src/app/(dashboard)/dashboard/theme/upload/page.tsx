'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
  Sparkles,
  ExternalLink,
  Trash2,
  Eye,
  Folder,
  File,
  Zap,
  Shield,
  HardDrive,
  Code2,
  FileJson,
  ImageIcon,
  FolderOpen,
  ChevronRight,
  Terminal,
  Cpu,
  Layers,
} from 'lucide-react';
import type {
  ThemeValidationError,
  ThemeValidationWarning,
} from '@rendrix/types';

// ==================== CONSTANTS ====================

type UploadState = 'idle' | 'uploading' | 'success' | 'error';
const MAX_FILE_SIZE = 50 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ==================== ANIMATION VARIANTS ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const floatVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const glowVariants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(255, 145, 0, 0.1)',
      '0 0 40px rgba(255, 145, 0, 0.2)',
      '0 0 20px rgba(255, 145, 0, 0.1)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

// ==================== FLOATING PARTICLES ====================

function FloatingParticles({ isActive }: { isActive: boolean }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {isActive && particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [0, -100],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute rounded-full bg-amber-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ==================== ANIMATED GRID BACKGROUND ====================

function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,145,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,145,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-amber-500/[0.07] blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] rounded-full bg-orange-500/[0.05] blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-amber-500/[0.04] to-orange-500/[0.04] blur-[150px]"
      />
    </div>
  );
}

// ==================== UPLOAD ZONE ====================

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const gradientX = useTransform(mouseX, [0, 400], [0, 100]);
  const gradientY = useTransform(mouseY, [0, 300], [0, 100]);

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

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

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
    <div className="space-y-5">
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="relative cursor-pointer group"
      >
        {/* Animated border */}
        <motion.div
          variants={isDragOver || selectedFile ? glowVariants : undefined}
          animate={isDragOver || selectedFile ? 'animate' : undefined}
          className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
            isDragOver
              ? 'bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/30'
              : selectedFile
                ? 'bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20'
                : fileError
                  ? 'bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20'
                  : 'bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-white/[0.08]'
          }`}
          style={{
            backgroundSize: '200% 100%',
            animation: isDragOver ? 'shimmer 2s linear infinite' : undefined,
          }}
        />

        {/* Inner content area */}
        <div className={`relative m-[1px] rounded-2xl transition-all duration-300 ${
          isDragOver
            ? 'bg-amber-500/5'
            : selectedFile
              ? 'bg-emerald-500/5'
              : fileError
                ? 'bg-red-500/5'
                : 'bg-[#0c0c0c]'
        }`}>
          {/* Hover gradient spotlight */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${gradientX}px ${gradientY}px, rgba(255, 145, 0, 0.06), transparent 40%)`,
            }}
          />

          {/* Floating particles */}
          <FloatingParticles isActive={isDragOver} />

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <div className="relative p-10 text-center">
            {/* Animated Icon */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className={`relative w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isDragOver
                  ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/20 scale-110'
                  : selectedFile
                    ? 'bg-gradient-to-br from-emerald-500/30 to-green-500/20'
                    : fileError
                      ? 'bg-gradient-to-br from-red-500/30 to-rose-500/20'
                      : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
              }`}
            >
              {/* Pulsing ring */}
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className={`absolute inset-0 rounded-2xl ${
                  isDragOver
                    ? 'bg-amber-500/20'
                    : selectedFile
                      ? 'bg-emerald-500/20'
                      : 'bg-white/[0.02]'
                }`}
              />

              <AnimatePresence mode="wait">
                {selectedFile ? (
                  <motion.div
                    key="file"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <FileArchive className="w-12 h-12 text-emerald-400" />
                  </motion.div>
                ) : fileError ? (
                  <motion.div
                    key="error"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <XCircle className="w-12 h-12 text-red-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="relative"
                  >
                    <Upload className={`w-12 h-12 transition-colors duration-300 ${
                      isDragOver ? 'text-amber-400' : 'text-white/40 group-hover:text-white/60'
                    }`} />
                    {/* Upload arrow animation */}
                    <motion.div
                      animate={{ y: isDragOver ? [0, -8, 0] : 0 }}
                      transition={{ duration: 0.5, repeat: isDragOver ? Infinity : 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {isDragOver && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-3"
                        >
                          <ChevronRight className="w-4 h-4 text-amber-400 -rotate-90" />
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Text */}
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <p className="text-xl font-semibold text-white">{selectedFile.name}</p>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="text-emerald-400 font-medium">{formatFileSize(selectedFile.size)}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-white/50">Ready to upload</span>
                  </div>
                </motion.div>
              ) : fileError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <p className="text-xl font-semibold text-red-400">{fileError}</p>
                  <p className="text-sm text-white/50">Please select a valid theme package</p>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-xl font-semibold text-white">
                    {isDragOver ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Release to upload
                      </motion.span>
                    ) : (
                      'Drag & drop your theme package'
                    )}
                  </p>
                  <p className="text-sm text-white/40">
                    or click to browse • ZIP files up to {formatFileSize(MAX_FILE_SIZE)}
                  </p>

                  {/* Format hints */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                      <FileArchive className="w-3.5 h-3.5 text-amber-400/70" />
                      <span className="text-xs text-white/40">.zip</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="flex items-center gap-3"
          >
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold h-12 rounded-xl shadow-lg shadow-amber-500/20"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Upload Theme
                </>
              )}
            </Button>
            <Button
              onClick={handleClear}
              disabled={isUploading}
              variant="outline"
              className="h-12 w-12 p-0 rounded-xl border-white/[0.1] bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-white/50"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== FILE TREE ====================

function AnimatedFileTree() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'sections', 'assets']));

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folder)) {
        next.delete(folder);
      } else {
        next.add(folder);
      }
      return next;
    });
  };

  const fileTree = [
    { type: 'folder', name: 'theme-name', id: 'root', depth: 0, color: 'text-amber-400' },
    { type: 'file', name: 'manifest.json', depth: 1, icon: FileJson, color: 'text-yellow-400', required: true },
    { type: 'file', name: 'settings.json', depth: 1, icon: FileCode, color: 'text-blue-400' },
    { type: 'folder', name: 'sections', id: 'sections', depth: 1, color: 'text-violet-400' },
    { type: 'file', name: '[section-name].json', depth: 2, icon: FileCode, color: 'text-white/40' },
    { type: 'folder', name: 'assets', id: 'assets', depth: 1, color: 'text-emerald-400' },
    { type: 'file', name: 'preview-desktop.png', depth: 2, icon: ImageIcon, color: 'text-green-400', required: true },
    { type: 'file', name: 'css/custom.css', depth: 2, icon: Code2, color: 'text-cyan-400' },
    { type: 'file', name: 'images/', depth: 2, icon: Folder, color: 'text-white/30' },
  ];

  const getParentFolder = (depth: number, index: number): string | null => {
    for (let i = index - 1; i >= 0; i--) {
      if (fileTree[i].depth < depth && fileTree[i].type === 'folder') {
        return fileTree[i].id || null;
      }
    }
    return 'root';
  };

  return (
    <div className="font-mono text-sm space-y-0.5">
      {fileTree.map((item, index) => {
        const parentFolder = getParentFolder(item.depth, index);
        const isVisible = item.depth === 0 || (parentFolder && expandedFolders.has(parentFolder));
        const Icon = item.type === 'folder'
          ? (expandedFolders.has(item.id || '') ? FolderOpen : Folder)
          : item.icon || File;

        if (!isVisible) return null;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{ paddingLeft: item.depth * 16 }}
            className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-colors ${
              item.type === 'folder' ? 'cursor-pointer hover:bg-white/[0.03]' : ''
            }`}
            onClick={() => item.type === 'folder' && item.id && toggleFolder(item.id)}
          >
            {item.type === 'folder' && (
              <motion.div
                animate={{ rotate: expandedFolders.has(item.id || '') ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-3 h-3 text-white/30" />
              </motion.div>
            )}
            <Icon className={`w-4 h-4 ${item.color}`} />
            <span className={item.color}>{item.name}</span>
            {item.required && (
              <span className="px-1.5 py-0.5 text-[10px] font-sans font-medium rounded bg-amber-500/20 text-amber-400">
                required
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ==================== REQUIREMENTS ====================

function RequirementsList() {
  const requirements = [
    { icon: HardDrive, text: 'ZIP file up to 50MB', color: 'text-blue-400' },
    { icon: FileJson, text: 'Valid manifest.json with theme metadata', color: 'text-yellow-400' },
    { icon: ImageIcon, text: 'Desktop preview image (PNG)', color: 'text-green-400' },
    { icon: Shield, text: 'No executable files (.js, .exe, .sh)', color: 'text-red-400' },
    { icon: Code2, text: 'CSS-only styling (no inline JavaScript)', color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-2">
      {requirements.map((req, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.08 }}
          whileHover={{ x: 4 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
        >
          <div className={`w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center ${req.color} group-hover:scale-110 transition-transform`}>
            <req.icon className="w-4 h-4" />
          </div>
          <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{req.text}</span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="ml-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ==================== VALIDATION RESULT ====================

function ValidationResult({
  errors,
  warnings,
}: {
  errors: ThemeValidationError[];
  warnings: ThemeValidationWarning[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {errors.length > 0 && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <span className="font-semibold text-red-400">
              {errors.length} Error{errors.length !== 1 ? 's' : ''} Found
            </span>
          </div>
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-2 text-sm text-white/70"
              >
                <span className="text-red-400/50 mt-0.5">•</span>
                <div>
                  <span className="font-mono text-xs text-red-400/70 mr-2">[{error.code}]</span>
                  {error.message}
                  {error.path && (
                    <span className="text-white/40 ml-2">in {error.path}</span>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-semibold text-amber-400">
              {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-2 text-sm text-white/70"
              >
                <span className="text-amber-400/50 mt-0.5">•</span>
                <div>
                  <span className="font-mono text-xs text-amber-400/70 mr-2">[{warning.code}]</span>
                  {warning.message}
                  {warning.path && (
                    <span className="text-white/40 ml-2">in {warning.path}</span>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

// ==================== SUCCESS STATE ====================

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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative w-32 h-32 mx-auto"
      >
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30"
        />
        {/* Middle ring */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/10"
        />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.4 }}
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-400" />
          </motion.div>
        </div>
        {/* Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((i * Math.PI * 2) / 8) * 60,
              y: Math.sin((i * Math.PI * 2) / 8) * 60,
            }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-emerald-400"
            style={{ marginLeft: -4, marginTop: -4 }}
          />
        ))}
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-white mb-3">Theme Uploaded!</h2>
        <p className="text-white/50 max-w-md mx-auto">
          Your custom theme has been successfully installed and is ready to customize your storefront.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-8"
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{version}</div>
          <div className="text-xs text-white/40 uppercase tracking-wider">Version</div>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{assetsUploaded}</div>
          <div className="text-xs text-white/40 uppercase tracking-wider">Assets</div>
        </div>
      </motion.div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-md mx-auto"
        >
          <ValidationResult errors={[]} warnings={warnings} />
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex items-center justify-center gap-4 pt-4"
      >
        <Button
          onClick={() => router.push('/dashboard/theme')}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold px-6 rounded-xl shadow-lg shadow-amber-500/20"
        >
          <Eye className="w-4 h-4 mr-2" />
          View in Theme Studio
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-xl border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Another
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ==================== PRO PLAN GATE ====================

function ProPlanGate() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl overflow-hidden"
    >
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/30 bg-[length:200%_100%] rounded-2xl blur-sm"
      />

      <div className="relative m-[1px] rounded-2xl bg-[#0c0c0c] p-10 text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center"
        >
          <Crown className="w-10 h-10 text-amber-400" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-3">Pro Plan Required</h2>
        <p className="text-white/50 max-w-md mx-auto mb-8">
          Custom theme uploads are available for Pro, Business, and Enterprise plans.
          Upgrade now to unlock custom themes and advanced customization features.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold px-6 rounded-xl shadow-lg shadow-amber-500/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
          <Link href="/dashboard/theme">
            <Button variant="outline" className="rounded-xl border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white">
              Browse Free Themes
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== MAIN PAGE ====================

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

  const hasProPlan = true;

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
      {/* Animated Background */}
      <AnimatedGridBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-8 max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Link
            href="/dashboard/theme"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6 group"
          >
            <motion.div whileHover={{ x: -4 }} transition={{ type: 'spring', stiffness: 400 }}>
              <ArrowLeft className="w-4 h-4" />
            </motion.div>
            <span>Back to Theme Studio</span>
          </Link>

          <div className="flex items-start gap-5">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10"
            >
              <Upload className="w-8 h-8 text-amber-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Upload Custom Theme</h1>
              <p className="text-white/50 text-lg">Import your own theme package to customize your storefront</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        {!hasProPlan ? (
          <motion.div variants={itemVariants}>
            <ProPlanGate />
          </motion.div>
        ) : uploadState === 'success' && uploadResult ? (
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-10 backdrop-blur-sm">
              <UploadSuccess
                themeId={uploadResult.themeId}
                slug={uploadResult.slug}
                version={uploadResult.version}
                assetsUploaded={uploadResult.assetsUploaded}
                warnings={uploadResult.warnings}
                onReset={handleReset}
              />
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-12">
            {/* Upload Zone - Large card spanning 7 columns */}
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <div className="h-full rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Theme Package</h2>
                    <p className="text-sm text-white/40">Upload your custom theme ZIP file</p>
                  </div>
                </div>

                <ThemeUploader
                  onUpload={handleUpload}
                  isUploading={uploadState === 'uploading'}
                />

                {/* Validation Errors */}
                <AnimatePresence>
                  {uploadState === 'error' && validationErrors && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6"
                    >
                      <ValidationResult
                        errors={validationErrors.errors}
                        warnings={validationErrors.warnings}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right column - 5 columns with stacked cards */}
            <div className="lg:col-span-5 space-y-5">
              {/* File Structure Card */}
              <motion.div variants={itemVariants}>
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Package Structure</h3>
                      <p className="text-xs text-white/40">Required file organization</p>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-xl p-4 border border-white/[0.04]">
                    <AnimatedFileTree />
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
                    <Terminal className="w-4 h-4" />
                    <span>View the</span>
                    <a href="#" className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                      theme development guide
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Requirements Card */}
              <motion.div variants={itemVariants}>
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Requirements</h3>
                  </div>

                  <RequirementsList />
                </div>
              </motion.div>

              {/* Pro Tip Card */}
              <motion.div variants={itemVariants}>
                <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-400 mb-1">Pro Tip</h4>
                      <p className="text-sm text-white/50 leading-relaxed">
                        Use our CLI tool for faster theme development with hot reload and instant validation.
                      </p>
                      <a href="#" className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 mt-2 transition-colors">
                        Learn more <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
