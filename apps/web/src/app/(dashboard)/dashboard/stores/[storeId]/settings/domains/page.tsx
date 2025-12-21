'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Save,
  Globe,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
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

  // Update forms when store loads
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subdomain.',
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add domain.',
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
    } catch (error) {
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
    } catch (error) {
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
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[300px]" />
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
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Subdomain
            </CardTitle>
            <CardDescription>
              Your free .rendrix.store subdomain for your storefront.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="subdomain"
                  placeholder="my-store"
                  {...subdomainForm.register('subdomain')}
                  className="max-w-xs"
                />
                <span className="text-muted-foreground">.rendrix.store</span>
              </div>
              {subdomainForm.formState.errors.subdomain && (
                <p className="text-sm text-destructive">
                  {subdomainForm.formState.errors.subdomain.message}
                </p>
              )}
            </div>

            {subdomainUrl && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Your store is live at</span>
                <a
                  href={subdomainUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {subdomainUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!subdomainForm.formState.isDirty || updateSubdomain.isPending}
              >
                {updateSubdomain.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Save className="mr-2 h-4 w-4" />
                Save subdomain
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Custom Domain */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Domain
          </CardTitle>
          <CardDescription>
            Connect your own domain name to your store.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {store?.customDomain ? (
            <>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  {store.domainVerified ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <p className="font-medium">{store.customDomain}</p>
                    <Badge
                      variant={store.domainVerified ? 'success' : 'warning'}
                      className="mt-1"
                    >
                      {store.domainVerified ? 'Verified' : 'Pending verification'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!store.domainVerified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVerifyDomain}
                      disabled={verifyDomain.isPending}
                    >
                      {verifyDomain.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Verify
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRemoveDialog(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>

              {!store.domainVerified && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">DNS Configuration</h4>
                    <p className="text-sm text-muted-foreground">
                      Add the following DNS records to your domain provider:
                    </p>
                    <div className="space-y-3">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">CNAME Record</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard('cname.rendrix.store')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-mono">CNAME</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-mono">@</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Value</p>
                            <p className="font-mono">cname.rendrix.store</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      DNS changes can take up to 48 hours to propagate.
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <form
              onSubmit={customDomainForm.handleSubmit(handleCustomDomainSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="domain">Domain name</Label>
                <Input
                  id="domain"
                  placeholder="www.example.com"
                  {...customDomainForm.register('domain')}
                />
                {customDomainForm.formState.errors.domain && (
                  <p className="text-sm text-destructive">
                    {customDomainForm.formState.errors.domain.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Enter your domain without http:// or https://
                </p>
              </div>
              <Button type="submit" disabled={setCustomDomain.isPending}>
                {setCustomDomain.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add domain
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Remove Domain Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove custom domain?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect {store?.customDomain} from your store. Your store
              will still be available at your subdomain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveDomain}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeCustomDomain.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove domain
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
