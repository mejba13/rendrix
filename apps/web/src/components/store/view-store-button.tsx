'use client';

import * as React from 'react';
import {
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  QrCode,
  Eye,
  Check,
  ChevronDown,
  Globe,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ViewStoreButtonProps {
  storeUrl: string;
  storeName: string;
  onPreview?: (device: 'desktop' | 'tablet' | 'mobile') => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showDropdown?: boolean;
  className?: string;
}

export function ViewStoreButton({
  storeUrl,
  storeName,
  onPreview,
  variant = 'outline',
  size = 'default',
  showDropdown = true,
  className,
}: ViewStoreButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast({
        title: 'URL copied',
        description: 'Store URL has been copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy URL to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenStore = () => {
    window.open(storeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeName,
          url: storeUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyUrl();
    }
  };

  if (!showDropdown) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenStore}
        className={cn(
          "gap-2 bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white",
          className
        )}
      >
        <ExternalLink className="w-4 h-4" />
        View Store
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn(
              "gap-2 bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white group",
              className
            )}
          >
            <ExternalLink className="w-4 h-4" />
            View Store
            <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-[#151515] border-white/[0.08]"
        >
          {/* Open in new tab */}
          <DropdownMenuItem
            onClick={handleOpenStore}
            className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer"
          >
            <Globe className="w-4 h-4 mr-3 text-white/60" />
            <div className="flex flex-col">
              <span>Open Live Store</span>
              <span className="text-xs text-white/40">Opens in new tab</span>
            </div>
          </DropdownMenuItem>

          {/* Preview submenu */}
          {onPreview && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer">
                <Eye className="w-4 h-4 mr-3 text-white/60" />
                <span>Preview Store</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-[#151515] border-white/[0.08]">
                <DropdownMenuItem
                  onClick={() => onPreview('desktop')}
                  className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer"
                >
                  <Monitor className="w-4 h-4 mr-3 text-white/60" />
                  Desktop
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPreview('tablet')}
                  className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer"
                >
                  <Tablet className="w-4 h-4 mr-3 text-white/60" />
                  Tablet
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPreview('mobile')}
                  className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 mr-3 text-white/60" />
                  Mobile
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}

          <DropdownMenuSeparator className="bg-white/[0.06]" />

          {/* Copy URL */}
          <DropdownMenuItem
            onClick={handleCopyUrl}
            className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-3 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 mr-3 text-white/60" />
            )}
            <div className="flex flex-col">
              <span>{copied ? 'Copied!' : 'Copy URL'}</span>
              <span className="text-xs text-white/40 truncate max-w-[160px]">
                {storeUrl.replace(/^https?:\/\//, '')}
              </span>
            </div>
          </DropdownMenuItem>

          {/* QR Code */}
          <DropdownMenuItem
            onClick={() => setShowQR(true)}
            className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer"
          >
            <QrCode className="w-4 h-4 mr-3 text-white/60" />
            <div className="flex flex-col">
              <span>QR Code</span>
              <span className="text-xs text-white/40">For mobile preview</span>
            </div>
          </DropdownMenuItem>

          {/* Share */}
          <DropdownMenuItem
            onClick={handleShare}
            className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08] cursor-pointer"
          >
            <Share2 className="w-4 h-4 mr-3 text-white/60" />
            Share Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeModal
          url={storeUrl}
          storeName={storeName}
          onClose={() => setShowQR(false)}
        />
      )}
    </>
  );
}

// QR Code Modal Component
function QRCodeModal({
  url,
  storeName,
  onClose,
}: {
  url: string;
  storeName: string;
  onClose: () => void;
}) {
  const qrSize = 200;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}&bgcolor=0a0a0a&color=ffffff`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Scan to Preview
          </h3>
          <p className="text-sm text-white/50 mb-6">
            Scan this QR code with your phone to preview {storeName}
          </p>

          <div className="bg-white rounded-xl p-4 inline-block mb-6">
            <img
              src={qrUrl}
              alt="QR Code"
              width={qrSize}
              height={qrSize}
              className="block"
            />
          </div>

          <p className="text-xs text-white/40 mb-6 break-all">{url}</p>

          <Button
            onClick={onClose}
            className="w-full bg-white/[0.06] hover:bg-white/[0.1] text-white border-0"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ViewStoreButton;
