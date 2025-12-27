import { PrismaClient, Store, Customer, Product } from '@prisma/client';

// Order statuses matching @rendrix/types
type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'partially_refunded' | 'refunded' | 'failed';
type FulfillmentStatus = 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'returned';

interface OrderConfig {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  daysAgo: number;
}

// Predefined order configurations for variety
const orderConfigs: OrderConfig[] = [
  // Recent delivered orders
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 1 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 2 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 3 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 5 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 7 },
  // Processing orders
  { status: 'processing', paymentStatus: 'paid', fulfillmentStatus: 'unfulfilled', daysAgo: 0 },
  { status: 'processing', paymentStatus: 'paid', fulfillmentStatus: 'partially_fulfilled', daysAgo: 1 },
  // Pending orders
  { status: 'pending', paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled', daysAgo: 0 },
  { status: 'pending', paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled', daysAgo: 1 },
  // Confirmed orders
  { status: 'confirmed', paymentStatus: 'paid', fulfillmentStatus: 'unfulfilled', daysAgo: 0 },
  // Shipped orders
  { status: 'shipped', paymentStatus: 'paid', fulfillmentStatus: 'partially_fulfilled', daysAgo: 2 },
  // Older delivered orders
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 14 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 21 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 30 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 45 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 60 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 90 },
  // Cancelled orders
  { status: 'cancelled', paymentStatus: 'refunded', fulfillmentStatus: 'unfulfilled', daysAgo: 10 },
  { status: 'cancelled', paymentStatus: 'failed', fulfillmentStatus: 'unfulfilled', daysAgo: 25 },
  // Refunded orders
  { status: 'refunded', paymentStatus: 'refunded', fulfillmentStatus: 'returned', daysAgo: 15 },
  { status: 'refunded', paymentStatus: 'refunded', fulfillmentStatus: 'unfulfilled', daysAgo: 8 },
  // More variety in recent orders
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 4 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 6 },
  { status: 'processing', paymentStatus: 'paid', fulfillmentStatus: 'unfulfilled', daysAgo: 0 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 12 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 18 },
  { status: 'delivered', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled', daysAgo: 35 },
];

// Generate order number
function generateOrderNumber(storePrefix: string, index: number): string {
  const year = new Date().getFullYear();
  const paddedIndex = String(index + 1).padStart(5, '0');
  return `${storePrefix}-${year}-${paddedIndex}`;
}

// Get date from days ago
function getDateFromDaysAgo(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 12) + 8); // Business hours
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

export async function seedOrders(
  prisma: PrismaClient,
  stores: Record<string, Store>,
  customersByStore: Record<string, Customer[]>
) {
  console.log('  Creating orders for all stores...');

  let totalOrders = 0;
  const storePrefixes: Record<string, string> = {
    ramlit: 'RML',
    colorpark: 'CP',
    xcybersecurity: 'XCS',
  };

  for (const [storeKey, store] of Object.entries(stores)) {
    const customers = customersByStore[storeKey] || [];
    if (customers.length === 0) continue;

    // Get products for this store
    const products = await prisma.product.findMany({
      where: { storeId: store.id, status: 'active' },
      take: 20,
    });

    if (products.length === 0) continue;

    // Create orders using predefined configs
    for (let i = 0; i < orderConfigs.length; i++) {
      const config = orderConfigs[i];
      const customer = customers[i % customers.length];
      const orderDate = getDateFromDaysAgo(config.daysAgo);

      // Select 1-3 random products for the order
      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedProducts: Product[] = [];
      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        if (!selectedProducts.find(p => p.id === randomProduct.id)) {
          selectedProducts.push(randomProduct);
        }
      }

      // Calculate order totals
      let subtotal = 0;
      const orderItems = selectedProducts.map(product => {
        const quantity = Math.floor(Math.random() * 2) + 1;
        const price = Number(product.price) || 0;
        const total = price * quantity;
        subtotal += total;
        return {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          quantity,
          price,
          total,
          metadata: {},
        };
      });

      const taxRate = 0.0875; // 8.75% tax
      const taxTotal = subtotal * taxRate;
      const discountTotal = Math.random() > 0.7 ? subtotal * 0.1 : 0; // 30% chance of discount
      const orderTotal = subtotal + taxTotal - discountTotal;

      const orderNumber = generateOrderNumber(storePrefixes[storeKey] || 'ORD', totalOrders);

      // Get customer address for billing/shipping
      const customerWithAddress = await prisma.customer.findUnique({
        where: { id: customer.id },
        include: { addresses: true },
      });
      const defaultAddress = customerWithAddress?.addresses.find(a => a.isDefault) || customerWithAddress?.addresses[0];

      const addressJson = defaultAddress ? {
        firstName: defaultAddress.firstName,
        lastName: defaultAddress.lastName,
        address1: defaultAddress.address1,
        address2: defaultAddress.address2,
        city: defaultAddress.city,
        state: defaultAddress.state,
        postalCode: defaultAddress.postalCode,
        country: defaultAddress.country,
        phone: defaultAddress.phone,
      } : null;

      // Create the order
      const order = await prisma.order.create({
        data: {
          storeId: store.id,
          orderNumber,
          customerId: customer.id,
          email: customer.email,
          phone: customer.phone,
          status: config.status,
          paymentStatus: config.paymentStatus,
          fulfillmentStatus: config.fulfillmentStatus,
          currency: 'USD',
          subtotal,
          discountTotal,
          shippingTotal: 0, // Services typically don't have shipping
          taxTotal,
          total: orderTotal,
          billingAddress: addressJson,
          shippingAddress: addressJson,
          notes: config.status === 'cancelled' ? 'Customer requested cancellation' :
                 config.status === 'refunded' ? 'Refunded per customer request' : null,
          metadata: {
            source: 'seed',
            status: config.status,
            paymentStatus: config.paymentStatus,
            daysAgo: config.daysAgo,
          },
          placedAt: orderDate,
          createdAt: orderDate,
          items: {
            create: orderItems,
          },
        },
      });

      // Create transaction for paid/refunded orders
      if (config.paymentStatus === 'paid' || config.paymentStatus === 'refunded') {
        await prisma.orderTransaction.create({
          data: {
            orderId: order.id,
            type: config.paymentStatus === 'refunded' ? 'refund' : 'charge',
            status: 'completed',
            amount: config.paymentStatus === 'refunded' ? -orderTotal : orderTotal,
            currency: 'USD',
            gateway: 'stripe',
            gatewayTransactionId: `txn_seed_${order.id.substring(0, 8)}`,
            createdAt: orderDate,
          },
        });
      }

      // Create fulfillment for fulfilled orders
      if (config.fulfillmentStatus === 'fulfilled' || config.fulfillmentStatus === 'partial') {
        const fulfillment = await prisma.fulfillment.create({
          data: {
            orderId: order.id,
            status: config.fulfillmentStatus === 'fulfilled' ? 'delivered' : 'shipped',
            trackingNumber: config.fulfillmentStatus === 'fulfilled' ? `TRACK${order.id.substring(0, 8).toUpperCase()}` : null,
            carrier: 'Digital Delivery',
            shippedAt: orderDate,
            deliveredAt: config.fulfillmentStatus === 'fulfilled' ? new Date(orderDate.getTime() + 86400000) : null,
            createdAt: orderDate,
          },
        });

        // Get order items for fulfillment items
        const createdOrderItems = await prisma.orderItem.findMany({
          where: { orderId: order.id },
        });

        for (const item of createdOrderItems) {
          await prisma.fulfillmentItem.create({
            data: {
              fulfillmentId: fulfillment.id,
              orderItemId: item.id,
              quantity: config.fulfillmentStatus === 'partial' ? Math.ceil(item.quantity / 2) : item.quantity,
            },
          });
        }
      }

      totalOrders++;
    }
  }

  console.log(`  Created ${totalOrders} orders across all stores`);
}
