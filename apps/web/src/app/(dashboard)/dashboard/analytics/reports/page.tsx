'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileBarChart,
  Download,
  Calendar,
  Clock,
  Plus,
  Search,
  MoreVertical,
  Share2,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Globe,
  Mail,
  BarChart3,
  FileText,
  Star,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStoreStore } from '@/store/store';

type ReportCategory = 'all' | 'sales' | 'customers' | 'products' | 'marketing' | 'custom';

// Report templates
const reportTemplates = [
  {
    id: 'sales-overview',
    name: 'Sales Overview',
    description: 'Comprehensive sales metrics including revenue, orders, and AOV',
    category: 'sales',
    icon: DollarSign,
    metrics: ['Revenue', 'Orders', 'AOV', 'Refunds'],
    popular: true,
  },
  {
    id: 'customer-acquisition',
    name: 'Customer Acquisition',
    description: 'Track new vs returning customers and acquisition channels',
    category: 'customers',
    icon: Users,
    metrics: ['New Customers', 'Return Rate', 'LTV', 'CAC'],
    popular: true,
  },
  {
    id: 'product-performance',
    name: 'Product Performance',
    description: 'Best and worst performing products by revenue and units',
    category: 'products',
    icon: Package,
    metrics: ['Top Products', 'Revenue by SKU', 'Inventory', 'Views'],
    popular: true,
  },
  {
    id: 'traffic-analysis',
    name: 'Traffic Analysis',
    description: 'Visitor sources, landing pages, and engagement metrics',
    category: 'marketing',
    icon: Globe,
    metrics: ['Sessions', 'Sources', 'Bounce Rate', 'Pages/Session'],
    popular: false,
  },
  {
    id: 'marketing-roi',
    name: 'Marketing ROI',
    description: 'Campaign performance and return on ad spend',
    category: 'marketing',
    icon: TrendingUp,
    metrics: ['ROAS', 'CPA', 'Conversions', 'Ad Spend'],
    popular: true,
  },
  {
    id: 'email-performance',
    name: 'Email Performance',
    description: 'Email campaign metrics and subscriber engagement',
    category: 'marketing',
    icon: Mail,
    metrics: ['Open Rate', 'Click Rate', 'Conversions', 'Revenue'],
    popular: false,
  },
  {
    id: 'inventory-status',
    name: 'Inventory Status',
    description: 'Stock levels, reorder alerts, and inventory turnover',
    category: 'products',
    icon: Package,
    metrics: ['Stock Levels', 'Low Stock', 'Turnover', 'Dead Stock'],
    popular: false,
  },
  {
    id: 'conversion-funnel',
    name: 'Conversion Funnel',
    description: 'Step-by-step conversion analysis from visit to purchase',
    category: 'sales',
    icon: BarChart3,
    metrics: ['Funnel Steps', 'Drop-off', 'Conversion Rate', 'Time to Convert'],
    popular: false,
  },
];

// Saved/generated reports
const savedReports = [
  {
    id: 'rep_1',
    name: 'Monthly Sales Report - November 2024',
    template: 'Sales Overview',
    dateRange: 'Nov 1 - Nov 30, 2024',
    generatedAt: '2024-12-01 09:00',
    status: 'ready',
    format: 'PDF',
    size: '2.4 MB',
    starred: true,
  },
  {
    id: 'rep_2',
    name: 'Q3 Customer Insights',
    template: 'Customer Acquisition',
    dateRange: 'Jul 1 - Sep 30, 2024',
    generatedAt: '2024-10-02 14:30',
    status: 'ready',
    format: 'PDF',
    size: '3.1 MB',
    starred: true,
  },
  {
    id: 'rep_3',
    name: 'Black Friday Campaign Analysis',
    template: 'Marketing ROI',
    dateRange: 'Nov 24 - Nov 27, 2024',
    generatedAt: '2024-11-28 10:15',
    status: 'ready',
    format: 'Excel',
    size: '1.8 MB',
    starred: false,
  },
  {
    id: 'rep_4',
    name: 'Weekly Product Performance',
    template: 'Product Performance',
    dateRange: 'Dec 1 - Dec 7, 2024',
    generatedAt: '2024-12-08 08:00',
    status: 'ready',
    format: 'PDF',
    size: '1.2 MB',
    starred: false,
  },
  {
    id: 'rep_5',
    name: 'Holiday Season Traffic Report',
    template: 'Traffic Analysis',
    dateRange: 'Dec 1 - Dec 15, 2024',
    generatedAt: 'Processing...',
    status: 'processing',
    format: 'PDF',
    size: '-',
    starred: false,
  },
];

// Scheduled reports
const scheduledReports = [
  { name: 'Weekly Sales Summary', frequency: 'Weekly', nextRun: 'Monday 9:00 AM', recipients: 2 },
  { name: 'Monthly Performance Review', frequency: 'Monthly', nextRun: 'Jan 1, 9:00 AM', recipients: 4 },
  { name: 'Daily Inventory Alerts', frequency: 'Daily', nextRun: 'Tomorrow 6:00 AM', recipients: 1 },
];

export default function ReportsPage() {
  const { currentStore } = useStoreStore();
  const [category, setCategory] = React.useState<ReportCategory>('all');

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <FileBarChart className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store to view and generate reports.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  const filteredTemplates = reportTemplates.filter((template) =>
    category === 'all' ? true : template.category === category
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate and schedule detailed analytics reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{savedReports.length}</p>
                <p className="text-sm text-white/40">Saved Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{scheduledReports.length}</p>
                <p className="text-sm text-white/40">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Download className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">48</p>
                <p className="text-sm text-white/40">Downloads (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a0a0a] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{reportTemplates.length}</p>
                <p className="text-sm text-white/40">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Report Templates</CardTitle>
              <CardDescription>Choose a template to generate a new report</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'sales', label: 'Sales' },
                { value: 'customers', label: 'Customers' },
                { value: 'products', label: 'Products' },
                { value: 'marketing', label: 'Marketing' },
              ].map((tab) => (
                <Button
                  key={tab.value}
                  variant={category === tab.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCategory(tab.value as ReportCategory)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {template.popular && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                        Popular
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">{template.name}</h4>
                  <p className="text-xs text-white/40 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.metrics.slice(0, 3).map((metric) => (
                      <span
                        key={metric}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/[0.04] text-white/60"
                      >
                        {metric}
                      </span>
                    ))}
                    {template.metrics.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/[0.04] text-white/40">
                        +{template.metrics.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Saved Reports & Scheduled */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Saved Reports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Saved Reports</CardTitle>
                <CardDescription>Previously generated reports</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{report.name}</p>
                      {report.starred && (
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                      <span>{report.template}</span>
                      <span>•</span>
                      <span>{report.dateRange}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {report.status === 'ready' ? (
                      <>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/[0.04] text-white/60 mb-1">
                          {report.format} • {report.size}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-white/40">Processing...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scheduled Reports</CardTitle>
            <CardDescription>Automated report delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledReports.map((schedule, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-white">{schedule.name}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-white/40">
                      <span>Frequency</span>
                      <span className="text-white">{schedule.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/40">
                      <span>Next run</span>
                      <span className="text-white">{schedule.nextRun}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/40">
                      <span>Recipients</span>
                      <span className="text-white">{schedule.recipients} people</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-white/[0.08]">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common reporting tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: Download, label: 'Export All Data', description: 'Download complete analytics data' },
              { icon: Calendar, label: 'Schedule Report', description: 'Set up automated delivery' },
              { icon: Copy, label: 'Duplicate Template', description: 'Create custom template' },
              { icon: Share2, label: 'Share Dashboard', description: 'Send dashboard link' },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/50 cursor-pointer transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-5 w-5 text-white/60" />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{action.label}</p>
                  <p className="text-xs text-white/40">{action.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
