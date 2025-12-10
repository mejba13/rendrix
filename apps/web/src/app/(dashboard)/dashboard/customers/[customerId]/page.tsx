'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  Plus,
  Loader2,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  useCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useAddCustomerAddress,
  useUpdateCustomerAddress,
  useDeleteCustomerAddress,
} from '@/hooks/use-customers';
import { AddressFormDialog, AddressCard } from '@/components/customers/address-form';
import { formatCurrency, formatDate, formatFullName } from '@rendrix/utils';
import type { CustomerAddress, UpdateCustomerInput } from '@rendrix/types';

const customerSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  acceptsMarketing: z.boolean(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const customerId = params.customerId as string;

  const { data: customer, isLoading } = useCustomer(customerId);
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const addAddress = useAddCustomerAddress();
  const updateAddress = useUpdateCustomerAddress();
  const deleteAddress = useDeleteCustomerAddress();

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showAddressDialog, setShowAddressDialog] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | undefined>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      acceptsMarketing: false,
      tags: '',
      notes: '',
    },
  });

  // Update form when customer loads
  React.useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        acceptsMarketing: customer.acceptsMarketing,
        tags: customer.tags?.join(', ') || '',
        notes: customer.notes || '',
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    const tags = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;

    try {
      await updateCustomer.mutateAsync({
        customerId,
        data: {
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined,
          phone: data.phone || undefined,
          acceptsMarketing: data.acceptsMarketing,
          tags,
          notes: data.notes || undefined,
        },
      });
      toast({
        title: 'Customer updated',
        description: 'Customer information has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update customer. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer.mutateAsync(customerId);
      toast({
        title: 'Customer deleted',
        description: 'The customer has been deleted.',
      });
      router.push('/dashboard/customers');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddAddress = async (data: Omit<CustomerAddress, 'id' | 'customerId'>) => {
    try {
      await addAddress.mutateAsync({ customerId, data });
      toast({
        title: 'Address added',
        description: 'The address has been added.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add address. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAddress = async (data: Omit<CustomerAddress, 'id' | 'customerId'>) => {
    if (!editingAddress) return;
    try {
      await updateAddress.mutateAsync({
        customerId,
        addressId: editingAddress.id,
        data,
      });
      toast({
        title: 'Address updated',
        description: 'The address has been updated.',
      });
      setEditingAddress(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update address. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress.mutateAsync({ customerId, addressId });
      toast({
        title: 'Address deleted',
        description: 'The address has been deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete address. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await updateAddress.mutateAsync({
        customerId,
        addressId,
        data: { isDefault: true },
      });
      toast({
        title: 'Default address updated',
        description: 'The default address has been changed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update default address.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[200px]" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[250px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Customer not found.</p>
        <Button asChild>
          <Link href="/dashboard/customers">Back to customers</Link>
        </Button>
      </div>
    );
  }

  const customerName = formatFullName(customer.firstName, customer.lastName);
  const initials = customerName
    ? customerName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : customer.email[0].toUpperCase();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/customers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {customerName || 'Anonymous'}
            </h1>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => window.location.href = `mailto:${customer.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Send email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                    <CardDescription>
                      Update the customer's contact information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email address</Label>
                      <Input value={customer.email} disabled className="bg-muted" />
                      <p className="text-sm text-muted-foreground">
                        Email address cannot be changed
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" {...register('firstName')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" {...register('lastName')} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" type="tel" {...register('phone')} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="acceptsMarketing">Email marketing</Label>
                        <p className="text-sm text-muted-foreground">
                          Customer has agreed to receive marketing emails
                        </p>
                      </div>
                      <Switch
                        id="acceptsMarketing"
                        checked={watch('acceptsMarketing')}
                        onCheckedChange={(checked) => setValue('acceptsMarketing', checked, { shouldDirty: true })}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="VIP, Wholesale, Returning"
                        {...register('tags')}
                      />
                      <p className="text-sm text-muted-foreground">
                        Separate multiple tags with commas
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add notes about this customer..."
                        rows={4}
                        {...register('notes')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={!isDirty || updateCustomer.isPending}>
                    {updateCustomer.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save changes
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Addresses</CardTitle>
                    <CardDescription>
                      Saved addresses for this customer.
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddressDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add address
                  </Button>
                </CardHeader>
                <CardContent>
                  {customer.addresses && customer.addresses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {customer.addresses.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          onEdit={() => {
                            setEditingAddress(address);
                            setShowAddressDialog(true);
                          }}
                          onDelete={() => handleDeleteAddress(address.id)}
                          onSetDefault={() => handleSetDefaultAddress(address.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No addresses saved</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setShowAddressDialog(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    Recent orders from this customer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {customer.recentOrders && customer.recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {customer.recentOrders.map((order) => (
                        <Link
                          key={order.id}
                          href={`/dashboard/orders/${order.id}`}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <span className="font-medium text-primary">
                              #{order.orderNumber}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.placedAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{order.status}</Badge>
                            <p className="font-medium mt-1">
                              {formatCurrency(order.total, 'USD')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-semibold">{customer.totalOrders}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(customer.totalSpent, 'USD')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Since</p>
                  <p className="text-xl font-semibold">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Status */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Marketing</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.acceptsMarketing ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success">Subscribed</Badge>
                  <span className="text-sm text-muted-foreground">
                    to email marketing
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Not subscribed</Badge>
                  <span className="text-sm text-muted-foreground">
                    to email marketing
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="ghost">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-primary hover:underline"
                >
                  {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-primary hover:underline"
                  >
                    {customer.phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Address Dialog */}
      <AddressFormDialog
        address={editingAddress}
        open={showAddressDialog}
        onOpenChange={(open) => {
          setShowAddressDialog(open);
          if (!open) setEditingAddress(undefined);
        }}
        onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
        isLoading={addAddress.isPending || updateAddress.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this customer and all their associated data,
              including addresses. Orders will be preserved but won't be linked to this
              customer. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCustomer.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
