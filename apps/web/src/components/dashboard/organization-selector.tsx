'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { Building2, Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

export function OrganizationSelector() {
  const { organizations, currentOrganization, switchOrganization } = useAuthStore();
  const [open, setOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, handleClickOutside]);

  if (organizations.length === 0) {
    return (
      <Link href="/onboarding">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08]"
        >
          <Plus className="h-4 w-4" />
          Create Organization
        </Button>
      </Link>
    );
  }

  if (organizations.length === 1) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-white/80">
        <div className="w-6 h-6 rounded-md bg-white/[0.08] flex items-center justify-center">
          <Building2 className="h-3.5 w-3.5 text-white/60" />
        </div>
        {currentOrganization?.name}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        role="combobox"
        aria-expanded={open}
        className="gap-2 text-white/80 hover:text-white hover:bg-white/[0.04]"
        onClick={() => setOpen(!open)}
      >
        <div className="w-6 h-6 rounded-md bg-white/[0.08] flex items-center justify-center">
          <Building2 className="h-3.5 w-3.5 text-white/60" />
        </div>
        <span>{currentOrganization?.name || 'Select organization'}</span>
        <ChevronsUpDown className="h-4 w-4 text-white/40" />
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-1 shadow-elevated">
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                switchOrganization(org.id);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors',
                currentOrganization?.id === org.id
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
              )}
            >
              <div className="w-5 h-5 rounded bg-white/[0.08] flex items-center justify-center">
                <Building2 className="h-3 w-3 text-white/60" />
              </div>
              <span className="flex-1 truncate text-left">{org.name}</span>
              <span className="text-xs text-white/40 capitalize">{org.role}</span>
              {currentOrganization?.id === org.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
          <div className="mt-1 border-t border-white/[0.08] pt-1">
            <Link
              href="/organizations/new"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 outline-none hover:bg-white/[0.04] hover:text-white transition-colors"
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
