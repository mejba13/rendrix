'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

// Mock authenticated state - in production, this would come from auth context
const mockCustomer = {
  id: '1',
  email: 'customer@example.com',
  firstName: 'John',
  lastName: 'Doe',
};

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-ABC123',
    date: '2024-01-15',
    status: 'Delivered',
    total: 149.99,
    items: 3,
  },
  {
    id: '2',
    orderNumber: 'ORD-DEF456',
    date: '2024-01-10',
    status: 'Processing',
    total: 79.99,
    items: 1,
  },
];

export default function AccountPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Login:', data);
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Register:', data);
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Show auth forms if not logged in
  if (!isLoggedIn) {
    return (
      <div className="container-wide py-16">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold text-center">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            {mode === 'login'
              ? 'Sign in to view your orders and manage your account.'
              : 'Create an account to track your orders and save your info.'}
          </p>

          {/* Tab switcher */}
          <div className="mt-8 flex rounded-lg border p-1">
            <button
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
                mode === 'login'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
                mode === 'register'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setMode('register')}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  {...loginForm.register('email')}
                  className="mt-1"
                  placeholder="you@example.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  {...loginForm.register('password')}
                  className="mt-1"
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/account/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="mt-6 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input {...registerForm.register('firstName')} className="mt-1" />
                  {registerForm.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-destructive">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input {...registerForm.register('lastName')} className="mt-1" />
                  {registerForm.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-destructive">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  {...registerForm.register('email')}
                  className="mt-1"
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  {...registerForm.register('password')}
                  className="mt-1"
                />
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  {...registerForm.register('confirmPassword')}
                  className="mt-1"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  className="font-medium text-foreground hover:underline"
                  onClick={() => setMode('register')}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  className="font-medium text-foreground hover:underline"
                  onClick={() => setMode('login')}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Logged in view
  return (
    <div className="container-wide py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="text-lg font-semibold">
                {mockCustomer.firstName} {mockCustomer.lastName}
              </p>
            </div>

            <nav className="space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-sm font-medium"
              >
                <User className="h-4 w-4" />
                Account Overview
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Package className="h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MapPin className="h-4 w-4" />
                Addresses
              </Link>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="mt-8 lg:col-span-9 lg:mt-0">
          <h1 className="text-2xl font-bold">Account Overview</h1>

          {/* Quick stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="mt-1 text-2xl font-bold">{mockOrders.length}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="mt-1 text-2xl font-bold">
                {mockOrders.filter((o) => o.status !== 'Delivered').length}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Saved Addresses</p>
              <p className="mt-1 text-2xl font-bold">2</p>
            </div>
          </div>

          {/* Recent orders */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <Link
                href="/account/orders"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {mockOrders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date} · {order.items} item
                      {order.items !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <p
                        className={cn(
                          'text-sm',
                          order.status === 'Delivered'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        )}
                      >
                        {order.status}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Account info */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Account Information</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Contact Info</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mockCustomer.firstName} {mockCustomer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {mockCustomer.email}
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  Edit
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Default Shipping Address</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  123 Main Street
                  <br />
                  San Francisco, CA 94102
                  <br />
                  United States
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  Edit
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
