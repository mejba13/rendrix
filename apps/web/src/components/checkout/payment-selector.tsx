'use client';

import * as React from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type PaymentMethod = 'stripe' | 'paypal';

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  availableMethods?: PaymentMethod[];
  disabled?: boolean;
}

const methodConfig: Record<
  PaymentMethod,
  { name: string; description: string; icon: React.ReactNode }
> = {
  stripe: {
    name: 'Credit or Debit Card',
    description: 'Pay securely with your card',
    icon: <CreditCard className="h-5 w-5" />,
  },
  paypal: {
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: <Wallet className="h-5 w-5" />,
  },
};

export function PaymentSelector({
  value,
  onChange,
  availableMethods = ['stripe', 'paypal'],
  disabled = false,
}: PaymentSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as PaymentMethod)}
      disabled={disabled}
      className="space-y-3"
    >
      {availableMethods.map((method) => {
        const config = methodConfig[method];
        const isSelected = value === method;

        return (
          <div key={method}>
            <Label
              htmlFor={method}
              className={cn(
                'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground/30',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RadioGroupItem value={method} id={method} className="sr-only" />
              <div
                className={cn(
                  'flex items-center justify-center h-10 w-10 rounded-lg',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {config.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{config.name}</p>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                  isSelected ? 'border-primary' : 'border-muted-foreground/30'
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

// PayPal Button Component (for embedding PayPal checkout)
interface PayPalButtonProps {
  orderId: string;
  onApprove: (paypalOrderId: string) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
}

export function PayPalButton({ orderId, onApprove, onError, disabled }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // This is a placeholder. In production, you would use the official PayPal SDK:
  // https://developer.paypal.com/sdk/js/reference/
  // The SDK handles rendering the PayPal button and the checkout flow.

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          // In a real implementation, this would open the PayPal popup
          // using the PayPal SDK. For now, we'll redirect to the approval URL
          // that was returned from our API.
          console.log('PayPal button clicked for order:', orderId);
          // The actual PayPal flow would be handled by the SDK
        } catch (error) {
          onError(error instanceof Error ? error : new Error('PayPal error'));
        } finally {
          setIsLoading(false);
        }
      }}
      className={cn(
        'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
        'bg-[#0070ba] hover:bg-[#003087] text-white font-medium',
        'transition-colors',
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.048a.965.965 0 0 0-.953.812L6.58 21.337h.496Z" />
            <path d="m18.62 6.932-.04.224C17.55 12.204 14.014 14 9.717 14H7.2a.965.965 0 0 0-.953.812l-1.273 8.525H7.42l.872-5.527a.641.641 0 0 1 .633-.537h1.42c4.058 0 7.236-1.65 8.164-6.424.034-.18.064-.352.09-.517.342-2.194-.01-3.69-1.17-5.04-.328-.373-.738-.683-1.21-.936.11.195.213.402.305.621.204.486.354 1.029.43 1.627.017.134.03.268.037.404Z" />
          </svg>
          <span>Pay with PayPal</span>
        </>
      )}
    </button>
  );
}
