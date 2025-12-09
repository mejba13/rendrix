'use client';

import React from 'react';
import { Building2, Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

export function OrganizationSelector() {
  const { organizations, currentOrganization, switchOrganization } = useAuthStore();
  const [open, setOpen] = React.useState(false);

  if (organizations.length === 0) {
    return (
      <Link href="/onboarding">
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Organization
        </Button>
      </Link>
    );
  }

  if (organizations.length === 1) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        {currentOrganization?.name}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        role="combobox"
        aria-expanded={open}
        className="gap-2"
        onClick={() => setOpen(!open)}
      >
        <Building2 className="h-4 w-4" />
        <span>{currentOrganization?.name || 'Select organization'}</span>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-md border bg-popover p-1 shadow-md">
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                switchOrganization(org.id);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent',
                currentOrganization?.id === org.id && 'bg-accent'
              )}
            >
              <Building2 className="h-4 w-4" />
              <span className="flex-1 truncate text-left">{org.name}</span>
              <span className="text-xs text-muted-foreground">{org.role}</span>
              {currentOrganization?.id === org.id && <Check className="h-4 w-4" />}
            </button>
          ))}
          <div className="mt-1 border-t pt-1">
            <Link
              href="/organizations/new"
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <Plus className="h-4 w-4" />
              Create new organization
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
