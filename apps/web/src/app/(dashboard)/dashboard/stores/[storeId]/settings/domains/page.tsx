'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Check,
  AlertCircle,
  Info,
  Globe,
  ExternalLink,
  CheckCircle,
  RefreshCw,
  Trash2,
  Copy,
  Link2,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useToast } from '@/hooks/use-toast';
import {
  useStore,
  useUpdateSubdomain,
  useSetCustomDomain,
  useVerifyDomain,
  useRemoveCustomDomain,
} from '@/hooks/use-stores';
import { cn } from '@/lib/utils';

const subdomainSchema = z.object({
  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(63, 'Subdomain must be at most 63 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Subdomain can only contain lowercase letters, numbers, and hyphens'
    ),
});

const customDomainSchema = z.object({
  domain: z
    .string()
    .min(4, 'Domain must be at least 4 characters')
    .regex(
      /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i,
      'Please enter a valid domain name'
    ),
});

type SubdomainFormData = z.infer<typeof subdomainSchema>;
type CustomDomainFormData = z.infer<typeof customDomainSchema>;

// Settings card component
function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {description && (
              <p className="text-sm text-white/50 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Form field component
function FormField({
  label,
  description,
  error,
  children,
  required,
}: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-white/80">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </Label>
      {children}
      {description && !error && (
        <p className="text-xs text-white/40 flex items-center gap-1.5">
          <Info className="w-3 h-3" />
          {description}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// DNS Record component
function DNSRecord({
  type,
  name,
  value,
  onCopy,
}: {
  type: string;
  name: string;
  value: string;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
          {type}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onCopy(value)}
          className="h-7 px-2 text-white/50 hover:text-white hover:bg-white/[0.08]"
        >
          <Copy className="h-3.5 w-3.5 mr-1.5" />
          Copy
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-white/40 text-xs mb-1">Name / Host</p>
          <p className="font-mono text-white/80">{name}</p>
        </div>
        <div>
          <p className="text-white/40 text-xs mb-1">Value / Target</p>
          <p className="font-mono text-white/80 break-all">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DomainsSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const storeId = params.storeId as string;

  const { data: store, isLoading } = useStore(storeId);
  const updateSubdomain = useUpdateSubdomain();
  const setCustomDomain = useSetCustomDomain();
  const verifyDomain = useVerifyDomain();
  const removeCustomDomain = useRemoveCustomDomain();

  const [showRemoveDialog, setShowRemoveDialog] = React.useState(false);

  const subdomainForm = useForm<SubdomainFormData>({
    resolver: zodResolver(subdomainSchema),
    defaultValues: {
      subdomain: '',
    },
  });

  const customDomainForm = useForm<CustomDomainFormData>({
    resolver: zodResolver(customDomainSchema),
    defaultValues: {
      domain: '',
    },
  });

  React.useEffect(() => {
    if (store) {
      subdomainForm.reset({
        subdomain: store.subdomain || '',
      });
    }
  }, [store, subdomainForm]);

  const handleSubdomainSubmit = async (data: SubdomainFormData) => {
    try {
      await updateSubdomain.mutateAsync({
        storeId,
        subdomain: data.subdomain,
      });
      toast({
        title: 'Subdomain updated',
        description: `Your store is now available at ${data.subdomain}.rendrix.store`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subdomain.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCustomDomainSubmit = async (data: CustomDomainFormData) => {
    try {
      await setCustomDomain.mutateAsync({
        storeId,
        domain: data.domain,
      });
      toast({
        title: 'Domain added',
        description: 'Configure your DNS records to complete setup.',
      });
      customDomainForm.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add domain.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleVerifyDomain = async () => {
    try {
      const result = await verifyDomain.mutateAsync(storeId);
      if (result.verified) {
        toast({
          title: 'Domain verified',
          description: 'Your custom domain is now active.',
        });
      } else {
        toast({
          title: 'Verification pending',
          description: result.message || 'DNS records not yet propagated.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to verify domain.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveDomain = async () => {
    try {
      await removeCustomDomain.mutateAsync(storeId);
      toast({
        title: 'Domain removed',
        description: 'Custom domain has been removed.',
      });
      setShowRemoveDialog(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to remove domain.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-96 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  const subdomainUrl = store?.subdomain
    ? `https://${store.subdomain}.rendrix.store`
    : null;

  return (
    <div className="space-y-6">
      {/* Subdomain */}
      <form onSubmit={subdomainForm.handleSubmit(handleSubdomainSubmit)}>
        <SettingsCard
          title="Rendrix Subdomain"
          description="Your free .rendrix.store subdomain for your storefront."
          icon={Link2}
        >
          <div className="space-y-6">
            <FormField
              label="Subdomain"
              description="This is your store's default URL."
              error={subdomainForm.formState.errors.subdomain?.message}
            >
              <div className="flex items-center gap-0">
                <Input
                  {...subdomainForm.register('subdomain')}
                  placeholder="my-store"
                  className="h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 rounded-r-none border-r-0"
                />
                <div className="h-11 px-4 flex items-center bg-white/[0.02] border border-white/[0.08] rounded-r-lg text-white/50 text-sm">
                  .rendrix.store
                </div>
              </div>
            </FormField>

            {subdomainUrl && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Store is live</p>
                    <a
                      href={subdomainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      {subdomainUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(subdomainUrl)}
                  className="text-white/50 hover:text-white hover:bg-white/[0.08]"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={!subdomainForm.formState.isDirty || updateSubdomain.isPending}
                className="bg-primary hover:bg-primary/90 text-black font-medium"
              >
                {updateSubdomain.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Subdomain
                  </>
                )}
              </Button>
            </div>
          </div>
        </SettingsCard>
      </form>

      {/* Custom Domain */}
      <SettingsCard
        title="Custom Domain"
        description="Connect your own domain name to your store."
        icon={Globe}
      >
        {store?.customDomain ? (
          <div className="space-y-6">
            {/* Domain Status */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-xl border",
              store.domainVerified
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-amber-500/5 border-amber-500/20"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  store.domainVerified ? "bg-emerald-500/20" : "bg-amber-500/20"
                )}>
                  {store.domainVerified ? (
                    <Shield className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{store.customDomain}</p>
                  <p className={cn(
                    "text-xs",
                    store.domainVerified ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {store.domainVerified ? 'Verified & Active' : 'Pending DNS verification'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!store.domainVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleVerifyDomain}
                    disabled={verifyDomain.isPending}
                    className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] text-white/70"
                  >
                    {verifyDomain.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Verify
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRemoveDialog(true)}
                  className="bg-white/[0.02] border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>

            {/* DNS Configuration */}
            {!store.domainVerified && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-xs text-white/40 px-2">DNS CONFIGURATION</span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                <p className="text-sm text-white/60">
                  Add the following DNS record to your domain provider:
                </p>

                <DNSRecord
                  type="CNAME"
                  name="@"
                  value="cname.rendrix.store"
                  onCopy={copyToClipboard}
                />

                <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <Info className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <p className="text-xs text-white/50">
                    DNS changes can take up to 48 hours to propagate. Once configured,
                    click "Verify" to check the status.
                  </p>
                </div>
              </div>
            )}

            {/* SSL Status */}
            {store.domainVerified && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">SSL Certificate Active</p>
                  <p className="text-xs text-white/50">
                    Your domain is secured with HTTPS encryption.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={customDomainForm.handleSubmit(handleCustomDomainSubmit)}
            className="space-y-6"
          >
            <FormField
              label="Domain Name"
              description="Enter your domain without http:// or https://"
              error={customDomainForm.formState.errors.domain?.message}
            >
              <Input
                {...customDomainForm.register('domain')}
                placeholder="www.example.com"
                className="h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50"
              />
            </FormField>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <Info className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
              <p className="text-xs text-white/50">
                After adding your domain, you'll need to configure DNS records with your
                domain provider. SSL certificates are automatically provisioned once verified.
              </p>
            </div>

            <Button
              type="submit"
              disabled={setCustomDomain.isPending}
              className="bg-primary hover:bg-primary/90 text-black font-medium"
            >
              {setCustomDomain.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Add Domain
                </>
              )}
            </Button>
          </form>
        )}
      </SettingsCard>

      {/* Remove Domain Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remove custom domain?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This will disconnect <span className="text-white font-medium">{store?.customDomain}</span> from
              your store. Your store will still be available at your subdomain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.02] border-white/[0.08] text-white hover:bg-white/[0.06] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveDomain}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {removeCustomDomain.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Remove Domain
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
