import { PrismaClient, Store } from '@prisma/client';

interface MenuItemData {
  type: 'link' | 'page' | 'category' | 'product' | 'divider';
  title: string;
  url?: string;
  target?: '_self' | '_blank';
  icon?: string;
  pageSlug?: string;
  categorySlug?: string;
  sortOrder: number;
  isVisible?: boolean;
  highlight?: boolean;
  badge?: string;
  children?: MenuItemData[];
}

interface MenuData {
  name: string;
  slug: string;
  location: 'header' | 'footer' | 'mobile' | 'utility';
  description: string;
  items: MenuItemData[];
}

// Common menu structure for all stores
const getMenusForStore = (storeKey: string, storeName: string): MenuData[] => [
  {
    name: 'Main Navigation',
    slug: 'main-navigation',
    location: 'header',
    description: 'Primary navigation menu for the header',
    items: [
      {
        type: 'link',
        title: 'Home',
        url: '/',
        icon: 'home',
        sortOrder: 0,
      },
      {
        type: 'link',
        title: 'Products',
        url: '/products',
        icon: 'shopping-bag',
        sortOrder: 1,
        badge: 'New',
        children: [
          {
            type: 'link',
            title: 'All Products',
            url: '/products',
            sortOrder: 0,
          },
          {
            type: 'link',
            title: 'Featured',
            url: '/products?featured=true',
            sortOrder: 1,
            highlight: true,
          },
          {
            type: 'link',
            title: 'On Sale',
            url: '/products?sale=true',
            sortOrder: 2,
            badge: 'Sale',
          },
          {
            type: 'divider',
            title: '',
            sortOrder: 3,
          },
          {
            type: 'link',
            title: 'Categories',
            url: '/categories',
            sortOrder: 4,
          },
        ],
      },
      {
        type: 'page',
        title: 'Services',
        pageSlug: 'services',
        icon: 'briefcase',
        sortOrder: 2,
      },
      {
        type: 'link',
        title: 'Blog',
        url: '/blog',
        icon: 'file-text',
        sortOrder: 3,
      },
      {
        type: 'page',
        title: 'About',
        pageSlug: 'about',
        icon: 'info',
        sortOrder: 4,
      },
      {
        type: 'page',
        title: 'Contact',
        pageSlug: 'contact',
        icon: 'mail',
        sortOrder: 5,
        highlight: true,
      },
    ],
  },
  {
    name: 'Footer Navigation',
    slug: 'footer-navigation',
    location: 'footer',
    description: 'Navigation links for the footer section',
    items: [
      {
        type: 'link',
        title: 'Company',
        url: '#',
        sortOrder: 0,
        children: [
          {
            type: 'page',
            title: 'About Us',
            pageSlug: 'about',
            sortOrder: 0,
          },
          {
            type: 'page',
            title: 'Our Services',
            pageSlug: 'services',
            sortOrder: 1,
          },
          {
            type: 'link',
            title: 'Blog',
            url: '/blog',
            sortOrder: 2,
          },
          {
            type: 'page',
            title: 'Contact',
            pageSlug: 'contact',
            sortOrder: 3,
          },
        ],
      },
      {
        type: 'link',
        title: 'Shop',
        url: '#',
        sortOrder: 1,
        children: [
          {
            type: 'link',
            title: 'All Products',
            url: '/products',
            sortOrder: 0,
          },
          {
            type: 'link',
            title: 'Categories',
            url: '/categories',
            sortOrder: 1,
          },
          {
            type: 'link',
            title: 'Featured Items',
            url: '/products?featured=true',
            sortOrder: 2,
          },
          {
            type: 'link',
            title: 'New Arrivals',
            url: '/products?new=true',
            sortOrder: 3,
          },
        ],
      },
      {
        type: 'link',
        title: 'Support',
        url: '#',
        sortOrder: 2,
        children: [
          {
            type: 'page',
            title: 'FAQ',
            pageSlug: 'faq',
            sortOrder: 0,
          },
          {
            type: 'page',
            title: 'Contact Us',
            pageSlug: 'contact',
            sortOrder: 1,
          },
          {
            type: 'link',
            title: 'Help Center',
            url: '/help',
            sortOrder: 2,
          },
        ],
      },
      {
        type: 'link',
        title: 'Legal',
        url: '#',
        sortOrder: 3,
        children: [
          {
            type: 'page',
            title: 'Privacy Policy',
            pageSlug: 'privacy-policy',
            sortOrder: 0,
          },
          {
            type: 'page',
            title: 'Terms of Service',
            pageSlug: 'terms-of-service',
            sortOrder: 1,
          },
          {
            type: 'page',
            title: 'Refund Policy',
            pageSlug: 'refund-policy',
            sortOrder: 2,
          },
        ],
      },
    ],
  },
  {
    name: 'Mobile Navigation',
    slug: 'mobile-navigation',
    location: 'mobile',
    description: 'Navigation menu optimized for mobile devices',
    items: [
      {
        type: 'link',
        title: 'Home',
        url: '/',
        icon: 'home',
        sortOrder: 0,
      },
      {
        type: 'link',
        title: 'Shop',
        url: '/products',
        icon: 'shopping-bag',
        sortOrder: 1,
        children: [
          {
            type: 'link',
            title: 'All Products',
            url: '/products',
            sortOrder: 0,
          },
          {
            type: 'link',
            title: 'Categories',
            url: '/categories',
            sortOrder: 1,
          },
          {
            type: 'link',
            title: 'Featured',
            url: '/products?featured=true',
            sortOrder: 2,
          },
          {
            type: 'link',
            title: 'On Sale',
            url: '/products?sale=true',
            sortOrder: 3,
            badge: 'Sale',
          },
        ],
      },
      {
        type: 'page',
        title: 'Services',
        pageSlug: 'services',
        icon: 'briefcase',
        sortOrder: 2,
      },
      {
        type: 'link',
        title: 'Blog',
        url: '/blog',
        icon: 'file-text',
        sortOrder: 3,
      },
      {
        type: 'page',
        title: 'About',
        pageSlug: 'about',
        icon: 'info',
        sortOrder: 4,
      },
      {
        type: 'page',
        title: 'Contact',
        pageSlug: 'contact',
        icon: 'mail',
        sortOrder: 5,
      },
      {
        type: 'divider',
        title: '',
        sortOrder: 6,
      },
      {
        type: 'link',
        title: 'My Account',
        url: '/account',
        icon: 'user',
        sortOrder: 7,
      },
      {
        type: 'link',
        title: 'Wishlist',
        url: '/wishlist',
        icon: 'heart',
        sortOrder: 8,
      },
      {
        type: 'link',
        title: 'Cart',
        url: '/cart',
        icon: 'shopping-cart',
        sortOrder: 9,
      },
    ],
  },
  {
    name: 'Utility Navigation',
    slug: 'utility-navigation',
    location: 'utility',
    description: 'Utility links for search, cart, account',
    items: [
      {
        type: 'link',
        title: 'Search',
        url: '/search',
        icon: 'search',
        sortOrder: 0,
      },
      {
        type: 'link',
        title: 'Account',
        url: '/account',
        icon: 'user',
        sortOrder: 1,
        children: [
          {
            type: 'link',
            title: 'My Profile',
            url: '/account/profile',
            sortOrder: 0,
          },
          {
            type: 'link',
            title: 'Orders',
            url: '/account/orders',
            sortOrder: 1,
          },
          {
            type: 'link',
            title: 'Addresses',
            url: '/account/addresses',
            sortOrder: 2,
          },
          {
            type: 'divider',
            title: '',
            sortOrder: 3,
          },
          {
            type: 'link',
            title: 'Sign In',
            url: '/login',
            sortOrder: 4,
          },
          {
            type: 'link',
            title: 'Register',
            url: '/register',
            sortOrder: 5,
          },
        ],
      },
      {
        type: 'link',
        title: 'Wishlist',
        url: '/wishlist',
        icon: 'heart',
        sortOrder: 2,
      },
      {
        type: 'link',
        title: 'Cart',
        url: '/cart',
        icon: 'shopping-cart',
        sortOrder: 3,
        badge: '0',
      },
    ],
  },
];

// Store name mapping
const storeNames: Record<string, string> = {
  ramlit: 'Ramlit Limited',
  colorpark: 'ColorPark',
  xcybersecurity: 'xCyberSecurity',
};

export async function seedMenus(prisma: PrismaClient, stores: Record<string, Store>) {
  console.log('  Creating menus for all stores...');

  let totalMenus = 0;
  let totalItems = 0;

  for (const [storeKey, store] of Object.entries(stores)) {
    const storeName = storeNames[storeKey] || store.name;
    const menus = getMenusForStore(storeKey, storeName);

    // Get existing pages for this store to link menu items
    const pages = await prisma.page.findMany({
      where: { storeId: store.id },
      select: { id: true, slug: true },
    });
    const pageMap = new Map(pages.map((p) => [p.slug, p.id]));

    // Get existing categories for this store to link menu items
    const categories = await prisma.category.findMany({
      where: { storeId: store.id },
      select: { id: true, slug: true },
    });
    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

    for (const menuData of menus) {
      // Upsert the menu
      const menu = await prisma.menu.upsert({
        where: {
          storeId_location: {
            storeId: store.id,
            location: menuData.location,
          },
        },
        update: {
          name: menuData.name,
          slug: menuData.slug,
          description: menuData.description,
          isActive: true,
        },
        create: {
          storeId: store.id,
          name: menuData.name,
          slug: menuData.slug,
          location: menuData.location,
          description: menuData.description,
          isActive: true,
        },
      });
      totalMenus++;

      // Delete existing menu items for this menu to avoid duplicates
      await prisma.menuItem.deleteMany({
        where: { menuId: menu.id },
      });

      // Create menu items recursively
      const createMenuItem = async (
        item: MenuItemData,
        parentId: string | null = null
      ): Promise<void> => {
        // Resolve page or category IDs
        let pageId: string | null = null;
        let categoryId: string | null = null;
        let url = item.url || null;

        if (item.type === 'page' && item.pageSlug) {
          pageId = pageMap.get(item.pageSlug) || null;
          if (pageId) {
            url = `/${item.pageSlug}`;
          }
        }

        if (item.type === 'category' && item.categorySlug) {
          categoryId = categoryMap.get(item.categorySlug) || null;
          if (categoryId) {
            url = `/categories/${item.categorySlug}`;
          }
        }

        const menuItem = await prisma.menuItem.create({
          data: {
            menuId: menu.id,
            parentId,
            type: item.type,
            title: item.title,
            url,
            target: item.target || '_self',
            icon: item.icon || null,
            pageId,
            categoryId,
            sortOrder: item.sortOrder,
            isVisible: item.isVisible !== false,
            highlight: item.highlight || false,
            badge: item.badge || null,
          },
        });
        totalItems++;

        // Create children if any
        if (item.children && item.children.length > 0) {
          for (const child of item.children) {
            await createMenuItem(child, menuItem.id);
          }
        }
      };

      // Create all top-level menu items
      for (const item of menuData.items) {
        await createMenuItem(item);
      }
    }
  }

  console.log(`  Created ${totalMenus} menus with ${totalItems} menu items across all stores`);
}
