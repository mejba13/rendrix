'use client';

import * as React from 'react';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface StorePreviewModalProps {
  url: string;
  storeName: string;
  initialDevice?: DeviceType;
  onClose: () => void;
}

const deviceDimensions = {
  desktop: { width: '100%', height: '100%', maxWidth: '100%' },
  tablet: { width: '768px', height: '1024px', maxWidth: '768px' },
  mobile: { width: '375px', height: '812px', maxWidth: '375px' },
};

const deviceLabels = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

export function StorePreviewModal({
  url,
  storeName,
  initialDevice = 'desktop',
  onClose,
}: StorePreviewModalProps) {
  const [device, setDevice] = React.useState<DeviceType>(initialDevice);
  const [isRotated, setIsRotated] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [key, setKey] = React.useState(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((k) => k + 1);
  };

  const handleRotate = () => {
    if (device !== 'desktop') {
      setIsRotated(!isRotated);
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Get current dimensions based on device and rotation
  const getDimensions = () => {
    const dims = deviceDimensions[device];
    if (device === 'desktop') return dims;

    if (isRotated) {
      return {
        width: dims.height,
        height: dims.width,
        maxWidth: dims.height,
      };
    }
    return dims;
  };

  const dimensions = getDimensions();

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-[#0a0a0a] shrink-0">
        {/* Left: Store info */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="h-5 w-px bg-white/[0.08]" />
          <div>
            <h2 className="text-sm font-medium text-white">{storeName}</h2>
            <p className="text-xs text-white/40 truncate max-w-[200px]">
              {url.replace(/^https?:\/\//, '')}
            </p>
          </div>
        </div>

        {/* Center: Device selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDevice(d);
                setIsRotated(false);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                device === d
                  ? "bg-primary text-black"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06]"
              )}
            >
              {d === 'desktop' && <Monitor className="w-4 h-4" />}
              {d === 'tablet' && <Tablet className="w-4 h-4" />}
              {d === 'mobile' && <Smartphone className="w-4 h-4" />}
              <span className="hidden sm:inline">{deviceLabels[d]}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {device !== 'desktop' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRotate}
              className={cn(
                "w-8 h-8 text-white/60 hover:text-white hover:bg-white/[0.06]",
                isRotated && "text-primary"
              )}
              title="Rotate device"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/[0.06]"
            title="Refresh"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFullscreen}
            className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/[0.06]"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          <div className="h-5 w-px bg-white/[0.08] mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenExternal}
            className="gap-2 text-white/60 hover:text-white hover:bg-white/[0.06]"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open</span>
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-hidden bg-[#1a1a1a] flex items-center justify-center p-4">
        <div
          className={cn(
            "relative bg-[#0a0a0a] transition-all duration-300 ease-out overflow-hidden",
            device === 'desktop'
              ? "w-full h-full rounded-none"
              : "rounded-[2rem] shadow-2xl border-[8px] border-[#2a2a2a]"
          )}
          style={{
            width: device === 'desktop' ? '100%' : dimensions.width,
            height: device === 'desktop' ? '100%' : dimensions.height,
            maxWidth: dimensions.maxWidth,
          }}
        >
          {/* Device frame details for mobile/tablet */}
          {device !== 'desktop' && (
            <>
              {/* Notch for mobile */}
              {device === 'mobile' && !isRotated && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2a2a2a] rounded-b-2xl z-10" />
              )}
              {/* Home indicator */}
              <div
                className={cn(
                  "absolute bg-white/20 rounded-full z-10",
                  isRotated
                    ? "right-1 top-1/2 -translate-y-1/2 w-1 h-24"
                    : "bottom-2 left-1/2 -translate-x-1/2 w-24 h-1"
                )}
              />
            </>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-white/40">Loading preview...</p>
              </div>
            </div>
          )}

          {/* iframe */}
          <iframe
            key={key}
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            title={`${storeName} preview`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>

      {/* Footer status bar */}
      <div className="flex items-center justify-between px-4 h-10 border-t border-white/[0.06] bg-[#0a0a0a] text-xs text-white/40 shrink-0">
        <div className="flex items-center gap-4">
          <span>
            {device === 'desktop'
              ? 'Responsive'
              : `${isRotated ? dimensions.height : dimensions.width} × ${isRotated ? dimensions.width : dimensions.height}`}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isLoading ? "bg-amber-400" : "bg-emerald-400"
              )}
            />
            {isLoading ? 'Loading' : 'Ready'}
          </span>
        </div>
        <div>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}

export default StorePreviewModal;
