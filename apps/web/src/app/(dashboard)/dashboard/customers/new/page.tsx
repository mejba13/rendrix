'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateCustomer } from '@/hooks/use-customers';
import { CustomerForm } from '@/components/customers/customer-form';
import type { CreateCustomerInput } from '@rendrix/types';

export default function NewCustomerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createCustomer = useCreateCustomer();

  const handleSubmit = async (data: CreateCustomerInput) => {
    try {
      const customer = await createCustomer.mutateAsync(data);
      toast({
        title: 'Customer created',
        description: `${data.firstName ? `${data.firstName} ` : ''}${data.lastName || data.email} has been added to your customers.`,
      });
      router.push(`/dashboard/customers/${customer.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create customer. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Add Customer</h1>
          <p className="text-muted-foreground mt-1">
            Create a new customer record for your store.
          </p>
        </div>
      </div>

      <CustomerForm onSubmit={handleSubmit} isLoading={createCustomer.isPending} />
    </div>
  );
}
