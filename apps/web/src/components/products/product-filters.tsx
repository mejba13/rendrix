'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { ProductsParams } from '@/hooks/use-products';

interface ProductFiltersProps {
  filters: ProductsParams;
  onFiltersChange: (filters: ProductsParams) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [search, setSearch] = React.useState(filters.search || '');

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        onFiltersChange({ ...filters, search: search || undefined, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'all' ? undefined : (value as ProductsParams['status']),
      page: 1,
    });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      type: value === 'all' ? undefined : (value as ProductsParams['type']),
      page: 1,
    });
  };

  const handleStockChange = (value: string) => {
    onFiltersChange({
      ...filters,
      inStock: value === 'all' ? undefined : value === 'in_stock',
      page: 1,
    });
  };

  const activeFiltersCount = [filters.status, filters.type, filters.inStock, filters.search].filter(
    Boolean
  ).length;

  const clearFilters = () => {
    setSearch('');
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[280px]"
        />

        <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type || 'all'} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="variable">Variable</SelectItem>
            <SelectItem value="grouped">Grouped</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.inStock === undefined ? 'all' : filters.inStock ? 'in_stock' : 'out_of_stock'}
          onValueChange={handleStockChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stock</SelectItem>
            <SelectItem value="in_stock">In stock</SelectItem>
            <SelectItem value="out_of_stock">Out of stock</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3">
            <X className="mr-2 h-4 w-4" />
            Clear filters
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
}
