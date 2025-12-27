import { PrismaClient, Store } from '@prisma/client';
import { hash } from 'bcryptjs';

// Customer segments and their characteristics
type CustomerSegment = 'new' | 'returning' | 'vip' | 'subscribed';

interface CustomerData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  segment: CustomerSegment;
  acceptsMarketing: boolean;
  totalOrders: number;
  totalSpent: number;
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// Generate synthetic customers for each store
const generateCustomersForStore = (storeType: string): CustomerData[] => {
  const baseCustomers: CustomerData[] = [
    // New customers (recently acquired, 1-2 orders)
    {
      email: 'sarah.johnson@techcorp.io',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1 555-234-5678',
      segment: 'new',
      acceptsMarketing: true,
      totalOrders: 1,
      totalSpent: 499.00,
      address: {
        address1: '123 Tech Boulevard',
        address2: 'Suite 400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'US',
      },
    },
    {
      email: 'michael.chen@startup.com',
      firstName: 'Michael',
      lastName: 'Chen',
      phone: '+1 555-345-6789',
      segment: 'new',
      acceptsMarketing: false,
      totalOrders: 1,
      totalSpent: 999.00,
      address: {
        address1: '456 Innovation Way',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'US',
      },
    },
    {
      email: 'emma.davis@enterprise.co',
      firstName: 'Emma',
      lastName: 'Davis',
      phone: '+1 555-456-7890',
      segment: 'new',
      acceptsMarketing: true,
      totalOrders: 2,
      totalSpent: 1499.00,
      address: {
        address1: '789 Business Park Drive',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'US',
      },
    },
    // Returning customers (3-5 orders, moderate value)
    {
      email: 'james.wilson@growthco.net',
      firstName: 'James',
      lastName: 'Wilson',
      phone: '+1 555-567-8901',
      segment: 'returning',
      acceptsMarketing: true,
      totalOrders: 4,
      totalSpent: 8999.00,
      address: {
        address1: '321 Commerce Street',
        address2: 'Floor 12',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
      },
    },
    {
      email: 'olivia.martinez@scalable.io',
      firstName: 'Olivia',
      lastName: 'Martinez',
      phone: '+1 555-678-9012',
      segment: 'returning',
      acceptsMarketing: true,
      totalOrders: 3,
      totalSpent: 5499.00,
      address: {
        address1: '654 Digital Avenue',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'US',
      },
    },
    {
      email: 'david.brown@techhub.org',
      firstName: 'David',
      lastName: 'Brown',
      phone: '+1 555-789-0123',
      segment: 'returning',
      acceptsMarketing: false,
      totalOrders: 5,
      totalSpent: 12999.00,
      address: {
        address1: '987 Innovation Circle',
        city: 'Denver',
        state: 'CO',
        postalCode: '80202',
        country: 'US',
      },
    },
    {
      email: 'sophia.anderson@cloudnative.io',
      firstName: 'Sophia',
      lastName: 'Anderson',
      phone: '+1 555-890-1234',
      segment: 'returning',
      acceptsMarketing: true,
      totalOrders: 4,
      totalSpent: 7499.00,
      address: {
        address1: '246 Startup Lane',
        city: 'Portland',
        state: 'OR',
        postalCode: '97201',
        country: 'US',
      },
    },
    // VIP customers (high value, 6+ orders)
    {
      email: 'robert.taylor@enterprise-solutions.com',
      firstName: 'Robert',
      lastName: 'Taylor',
      phone: '+1 555-901-2345',
      segment: 'vip',
      acceptsMarketing: true,
      totalOrders: 12,
      totalSpent: 89999.00,
      address: {
        address1: '100 Executive Plaza',
        address2: 'Suite 2500',
        city: 'Boston',
        state: 'MA',
        postalCode: '02110',
        country: 'US',
      },
    },
    {
      email: 'jennifer.white@globaltech.com',
      firstName: 'Jennifer',
      lastName: 'White',
      phone: '+1 555-012-3456',
      segment: 'vip',
      acceptsMarketing: true,
      totalOrders: 8,
      totalSpent: 54999.00,
      address: {
        address1: '500 Corporate Center',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90017',
        country: 'US',
      },
    },
    {
      email: 'william.harris@fintech-inc.com',
      firstName: 'William',
      lastName: 'Harris',
      phone: '+1 555-123-4567',
      segment: 'vip',
      acceptsMarketing: true,
      totalOrders: 15,
      totalSpent: 124999.00,
      address: {
        address1: '750 Finance Tower',
        address2: 'Floor 40',
        city: 'Miami',
        state: 'FL',
        postalCode: '33131',
        country: 'US',
      },
    },
    // Subscribed customers (newsletter subscribers, various order levels)
    {
      email: 'amanda.clark@creative-agency.co',
      firstName: 'Amanda',
      lastName: 'Clark',
      phone: '+1 555-234-5679',
      segment: 'subscribed',
      acceptsMarketing: true,
      totalOrders: 2,
      totalSpent: 2999.00,
      address: {
        address1: '888 Design District',
        city: 'Atlanta',
        state: 'GA',
        postalCode: '30303',
        country: 'US',
      },
    },
    {
      email: 'christopher.lee@innovate.tech',
      firstName: 'Christopher',
      lastName: 'Lee',
      phone: '+1 555-345-6780',
      segment: 'subscribed',
      acceptsMarketing: true,
      totalOrders: 3,
      totalSpent: 4499.00,
      address: {
        address1: '333 Research Park',
        city: 'Raleigh',
        state: 'NC',
        postalCode: '27601',
        country: 'US',
      },
    },
    {
      email: 'jessica.thomas@digital-first.io',
      firstName: 'Jessica',
      lastName: 'Thomas',
      phone: '+1 555-456-7891',
      segment: 'subscribed',
      acceptsMarketing: true,
      totalOrders: 1,
      totalSpent: 799.00,
      address: {
        address1: '222 Market Street',
        city: 'Philadelphia',
        state: 'PA',
        postalCode: '19103',
        country: 'US',
      },
    },
    {
      email: 'daniel.jackson@nexgen.solutions',
      firstName: 'Daniel',
      lastName: 'Jackson',
      phone: '+1 555-567-8902',
      segment: 'subscribed',
      acceptsMarketing: true,
      totalOrders: 6,
      totalSpent: 18999.00,
      address: {
        address1: '444 Technology Way',
        address2: 'Building B',
        city: 'Phoenix',
        state: 'AZ',
        postalCode: '85004',
        country: 'US',
      },
    },
    {
      email: 'ashley.moore@secure-ops.io',
      firstName: 'Ashley',
      lastName: 'Moore',
      phone: '+1 555-678-9013',
      segment: 'subscribed',
      acceptsMarketing: true,
      totalOrders: 4,
      totalSpent: 9999.00,
      address: {
        address1: '555 Security Boulevard',
        city: 'San Diego',
        state: 'CA',
        postalCode: '92101',
        country: 'US',
      },
    },
  ];

  // Adjust email domains slightly based on store type for variety
  const domainSuffix = storeType === 'ramlit' ? '.tech' : storeType === 'colorpark' ? '.design' : '.security';

  return baseCustomers.map((customer, index) => ({
    ...customer,
    email: customer.email.replace(/@.*$/, `${index}@synthetic${domainSuffix}`),
  }));
};

export async function seedCustomers(prisma: PrismaClient, stores: Record<string, Store>) {
  console.log('  Creating customers for all stores...');

  let totalCustomers = 0;
  const customersByStore: Record<string, any[]> = {};

  for (const [storeKey, store] of Object.entries(stores)) {
    const customers = generateCustomersForStore(storeKey);
    customersByStore[storeKey] = [];

    for (const customerData of customers) {
      // Generate a simple password hash for demo purposes
      const passwordHash = await hash('Customer@123', 12);

      const customer = await prisma.customer.upsert({
        where: {
          storeId_email: {
            storeId: store.id,
            email: customerData.email,
          },
        },
        update: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          acceptsMarketing: customerData.acceptsMarketing,
          totalOrders: customerData.totalOrders,
          totalSpent: customerData.totalSpent,
          tags: JSON.stringify([customerData.segment]),
          metadata: JSON.stringify({ segment: customerData.segment }),
        },
        create: {
          storeId: store.id,
          email: customerData.email,
          passwordHash,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          acceptsMarketing: customerData.acceptsMarketing,
          totalOrders: customerData.totalOrders,
          totalSpent: customerData.totalSpent,
          tags: JSON.stringify([customerData.segment]),
          metadata: JSON.stringify({ segment: customerData.segment }),
          addresses: {
            create: [
              {
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                address1: customerData.address.address1,
                address2: customerData.address.address2 || null,
                city: customerData.address.city,
                state: customerData.address.state,
                postalCode: customerData.address.postalCode,
                country: customerData.address.country,
                phone: customerData.phone,
                isDefault: true,
              },
            ],
          },
        },
        include: {
          addresses: true,
        },
      });

      customersByStore[storeKey].push(customer);
      totalCustomers++;
    }
  }

  console.log(`  Created ${totalCustomers} customers across all stores`);
  return customersByStore;
}
