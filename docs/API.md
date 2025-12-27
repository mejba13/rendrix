# Rendrix API Documentation

**Version**: 1.0
**Base URL**: `http://localhost:4000` (Development) | `https://api.rendrix.com` (Production)
**API Prefix**: `/api/v1`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Standard Conventions](#standard-conventions)
3. [Error Handling](#error-handling)
4. [Auth Endpoints](#auth-endpoints)
5. [Organizations](#organizations)
6. [Stores](#stores)
7. [Products](#products)
8. [Categories](#categories)
9. [Orders](#orders)
10. [Customers](#customers)
11. [Coupons](#coupons)
12. [Media](#media)
13. [Blog](#blog)
14. [Pages](#pages)
15. [Analytics](#analytics)
16. [Themes](#themes)
17. [Subscriptions](#subscriptions)
18. [Storefront API](#storefront-api-public)

---

## Authentication

Rendrix uses JWT (JSON Web Token) based authentication with access and refresh tokens.

### Token Types

| Token Type | Expiry | Purpose |
|------------|--------|---------|
| Access Token | 15 minutes | API authentication |
| Refresh Token | 7 days | Obtain new access tokens |

### Authentication Flow

1. **Login**: POST `/api/v1/auth/login` with email/password
2. **Receive Tokens**: Get `accessToken` and `refreshToken`
3. **Use Access Token**: Include in Authorization header
4. **Refresh When Expired**: POST `/api/v1/auth/refresh`

### Required Headers

```http
Authorization: Bearer <access_token>
X-Organization-Id: <organization_uuid>  # Required for organization-scoped endpoints
Content-Type: application/json
```

### Permission Levels

| Role | Description |
|------|-------------|
| `owner` | Full access to organization and all stores |
| `admin` | Full access except billing and ownership transfer |
| `manager` | Manage products, orders, customers, content |
| `staff` | View and limited edit access |
| `viewer` | Read-only access |

---

## Standard Conventions

### Request Format

- **Method**: HTTP methods (GET, POST, PATCH, DELETE)
- **Content-Type**: `application/json` for all requests
- **Parameters**: URL params, query strings, or JSON body

### Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Pagination

Query parameters for paginated endpoints:

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | number | 1 | - | Page number |
| `limit` | number | 20 | 100 | Items per page |
| `sortBy` | string | varies | - | Field to sort by |
| `sortOrder` | string | desc | - | `asc` or `desc` |

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `409` | Conflict |
| `422` | Unprocessable Entity |
| `429` | Rate Limited |
| `500` | Internal Server Error |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request body validation failed |
| `UNAUTHORIZED` | Invalid or missing token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `RATE_LIMITED` | Too many requests |

---

## Auth Endpoints

Base path: `/api/v1/auth`

### Register User

```http
POST /auth/register
```

**Auth**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Login

```http
POST /auth/login
```

**Auth**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Refresh Token

```http
POST /auth/refresh
```

**Auth**: Public (requires valid refresh token)

**Request Body**:
```json
{
  "refreshToken": "eyJ..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Logout

```http
POST /auth/logout
```

**Auth**: JWT Required

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### Forgot Password

```http
POST /auth/forgot-password
```

**Auth**: Public

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "If an account exists, a reset email has been sent"
  }
}
```

### Reset Password

```http
POST /auth/reset-password
```

**Auth**: Public

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

### Get Current User

```http
GET /auth/me
```

**Auth**: JWT Required

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://...",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Organizations

Base path: `/api/v1/organizations`

### List Organizations

```http
GET /organizations
```

**Auth**: JWT Required

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Organization",
      "slug": "my-org",
      "role": "owner",
      "plan": "Pro",
      "storesCount": 3,
      "membersCount": 5,
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Organization

```http
POST /organizations
```

**Auth**: JWT Required

**Request Body**:
```json
{
  "name": "My New Organization",
  "slug": "my-new-org"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My New Organization",
    "slug": "my-new-org"
  }
}
```

### Get Organization

```http
GET /organizations/:id
```

**Auth**: JWT Required, Organization Member

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Organization",
    "slug": "my-org",
    "settings": {},
    "role": "owner",
    "subscription": {
      "plan": "Pro",
      "status": "active",
      "currentPeriodEnd": "2024-02-01T00:00:00Z"
    },
    "stats": {
      "stores": 3,
      "members": 5
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Organization

```http
PATCH /organizations/:id
```

**Auth**: JWT Required, Permission: `organization:update`

**Request Body**:
```json
{
  "name": "Updated Name",
  "settings": { "timezone": "America/New_York" }
}
```

### Delete Organization

```http
DELETE /organizations/:id
```

**Auth**: JWT Required, Owner Only

**Note**: All stores must be deleted first.

### List Members

```http
GET /organizations/:id/members
```

**Auth**: JWT Required, Organization Member

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "member-uuid",
      "user": {
        "id": "user-uuid",
        "email": "member@example.com",
        "firstName": "Jane",
        "lastName": "Doe"
      },
      "role": "admin",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Invite Member

```http
POST /organizations/:id/members/invite
```

**Auth**: JWT Required, Permission: `organization:members:manage`

**Request Body**:
```json
{
  "email": "newmember@example.com",
  "role": "staff"
}
```

### Update Member Role

```http
PATCH /organizations/:id/members/:userId
```

**Auth**: JWT Required, Permission: `organization:members:manage`

**Request Body**:
```json
{
  "role": "manager"
}
```

### Remove Member

```http
DELETE /organizations/:id/members/:userId
```

**Auth**: JWT Required, Permission: `organization:members:manage`

---

## Stores

Base path: `/api/v1/stores`

### Required Headers

```http
Authorization: Bearer <token>
X-Organization-Id: <organization_uuid>
```

### List Stores

```http
GET /stores
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `search` | string | Search by name |
| `status` | string | Filter by status |

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Store",
      "slug": "my-store",
      "subdomain": "mystore",
      "status": "active",
      "industry": "fashion",
      "productsCount": 150,
      "ordersCount": 1234,
      "revenue": 45678.90,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": { "total": 3, "page": 1, "limit": 20, "totalPages": 1 }
}
```

### Create Store

```http
POST /stores
```

**Auth**: JWT Required, Permission: `stores:create`

**Request Body**:
```json
{
  "name": "New Store",
  "slug": "new-store",
  "subdomain": "newstore",
  "industry": "fashion",
  "currency": "USD",
  "timezone": "America/New_York"
}
```

### Get Store

```http
GET /stores/:storeId
```

### Update Store

```http
PATCH /stores/:storeId
```

**Auth**: JWT Required, Permission: `stores:update`

### Delete Store

```http
DELETE /stores/:storeId
```

**Auth**: JWT Required, Permission: `stores:delete`

### Update Store Settings

```http
PATCH /stores/:storeId/settings
```

**Auth**: JWT Required, Permission: `stores:settings`

**Request Body**:
```json
{
  "settings": {
    "checkout": {
      "requireShipping": true,
      "requirePhone": false
    },
    "notifications": {
      "orderConfirmation": true,
      "lowStock": true
    }
  }
}
```

---

## Products

Base path: `/api/v1/stores/:storeId/products`

### List Products

```http
GET /stores/:storeId/products
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page (max 100) |
| `status` | string | `active`, `draft`, `archived` |
| `category` | string | Category ID |
| `search` | string | Search term |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `sortBy` | string | `name`, `price`, `createdAt`, `quantity` |
| `sortOrder` | string | `asc`, `desc` |

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Product description",
      "price": 29.99,
      "compareAtPrice": 39.99,
      "sku": "PROD-001",
      "quantity": 100,
      "status": "active",
      "images": [
        { "id": "img-uuid", "url": "https://...", "position": 0 }
      ],
      "categories": [
        { "id": "cat-uuid", "name": "Category" }
      ],
      "variants": [],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": { "total": 150, "page": 1, "limit": 20, "totalPages": 8 }
}
```

### Create Product

```http
POST /stores/:storeId/products
```

**Auth**: JWT Required, Permission: `products:create`

**Request Body**:
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "compareAtPrice": 39.99,
  "sku": "PROD-001",
  "quantity": 100,
  "status": "active",
  "trackInventory": true,
  "categoryIds": ["uuid1", "uuid2"],
  "images": [
    { "url": "https://...", "altText": "Image description" }
  ],
  "variants": [
    {
      "name": "Small",
      "sku": "PROD-001-S",
      "price": 29.99,
      "quantity": 50,
      "options": { "size": "S" }
    }
  ],
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description"
}
```

### Get Product

```http
GET /stores/:storeId/products/:productId
```

### Update Product

```http
PATCH /stores/:storeId/products/:productId
```

**Auth**: JWT Required, Permission: `products:update`

### Delete Product

```http
DELETE /stores/:storeId/products/:productId
```

**Auth**: JWT Required, Permission: `products:delete`

### Bulk Operations

```http
POST /stores/:storeId/products/bulk
```

**Auth**: JWT Required, Permission: `products:update`

**Request Body**:
```json
{
  "action": "activate",
  "productIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Actions**: `activate`, `deactivate`, `archive`, `delete`, `updatePrice`

---

## Categories

Base path: `/api/v1/stores/:storeId/categories`

### List Categories

```http
GET /stores/:storeId/categories
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `parentId` | string | Filter by parent category |
| `includeChildren` | boolean | Include child categories |
| `flat` | boolean | Return flat list (no hierarchy) |

### Create Category

```http
POST /stores/:storeId/categories
```

**Auth**: JWT Required, Permission: `products:create`

**Request Body**:
```json
{
  "name": "Category Name",
  "slug": "category-name",
  "description": "Category description",
  "parentId": null,
  "imageUrl": "https://...",
  "sortOrder": 0,
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description"
}
```

### Get Category

```http
GET /stores/:storeId/categories/:categoryId
```

### Update Category

```http
PATCH /stores/:storeId/categories/:categoryId
```

**Auth**: JWT Required, Permission: `products:update`

### Delete Category

```http
DELETE /stores/:storeId/categories/:categoryId
```

**Auth**: JWT Required, Permission: `products:delete`

**Note**: Category must have no subcategories.

### Reorder Categories

```http
POST /stores/:storeId/categories/reorder
```

**Auth**: JWT Required, Permission: `products:update`

**Request Body**:
```json
{
  "categories": [
    { "id": "uuid1", "sortOrder": 0, "parentId": null },
    { "id": "uuid2", "sortOrder": 1, "parentId": null }
  ]
}
```

---

## Orders

Base path: `/api/v1/stores/:storeId/orders`

### List Orders

```http
GET /stores/:storeId/orders
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `status` | string | `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled` |
| `paymentStatus` | string | `pending`, `paid`, `failed`, `refunded` |
| `fulfillmentStatus` | string | `unfulfilled`, `partial`, `fulfilled` |
| `search` | string | Order number or email |
| `startDate` | string | Filter by date range |
| `endDate` | string | Filter by date range |

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-000001",
      "email": "customer@example.com",
      "status": "confirmed",
      "paymentStatus": "paid",
      "fulfillmentStatus": "unfulfilled",
      "subtotal": 99.99,
      "shippingTotal": 9.99,
      "taxTotal": 8.80,
      "discountTotal": 10.00,
      "total": 108.78,
      "currency": "USD",
      "itemsCount": 3,
      "placedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Order

```http
GET /stores/:storeId/orders/:orderId
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-000001",
    "email": "customer@example.com",
    "status": "confirmed",
    "paymentStatus": "paid",
    "fulfillmentStatus": "unfulfilled",
    "subtotal": 99.99,
    "shippingTotal": 9.99,
    "taxTotal": 8.80,
    "discountTotal": 10.00,
    "total": 108.78,
    "currency": "USD",
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    },
    "billingAddress": { ... },
    "items": [
      {
        "id": "item-uuid",
        "productId": "prod-uuid",
        "name": "Product Name",
        "quantity": 2,
        "price": 29.99,
        "total": 59.98
      }
    ],
    "transactions": [
      {
        "id": "trans-uuid",
        "type": "charge",
        "status": "success",
        "amount": 108.78,
        "gateway": "stripe",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "placedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Order Status

```http
PATCH /stores/:storeId/orders/:orderId
```

**Auth**: JWT Required, Permission: `orders:update`

**Request Body**:
```json
{
  "status": "processing",
  "notes": "Order is being prepared"
}
```

### Update Fulfillment

```http
PATCH /stores/:storeId/orders/:orderId/fulfillment
```

**Auth**: JWT Required, Permission: `orders:update`

**Request Body**:
```json
{
  "fulfillmentStatus": "fulfilled",
  "trackingNumber": "1Z999AA10123456784",
  "trackingUrl": "https://...",
  "carrier": "ups"
}
```

### Cancel Order

```http
DELETE /stores/:storeId/orders/:orderId
```

**Auth**: JWT Required, Permission: `orders:delete`

---

## Customers

Base path: `/api/v1/stores/:storeId/customers`

### List Customers

```http
GET /stores/:storeId/customers
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `search` | string | Email, name, phone |
| `acceptsMarketing` | boolean | Filter by marketing opt-in |
| `sortBy` | string | `email`, `createdAt`, `totalSpent`, `totalOrders` |

### Create Customer

```http
POST /stores/:storeId/customers
```

**Auth**: JWT Required, Permission: `customers:create`

**Request Body**:
```json
{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "acceptsMarketing": true,
  "notes": "VIP customer",
  "tags": ["vip", "wholesale"]
}
```

### Get Customer

```http
GET /stores/:storeId/customers/:customerId
```

### Update Customer

```http
PATCH /stores/:storeId/customers/:customerId
```

**Auth**: JWT Required, Permission: `customers:update`

### Delete Customer

```http
DELETE /stores/:storeId/customers/:customerId
```

**Auth**: JWT Required, Permission: `customers:delete`

---

## Coupons

Base path: `/api/v1/stores/:storeId/coupons`

### List Coupons

```http
GET /stores/:storeId/coupons
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `active`, `inactive`, `expired` |
| `type` | string | `percentage`, `fixed_amount` |

### Create Coupon

```http
POST /stores/:storeId/coupons
```

**Auth**: JWT Required, Permission: `coupons:create`

**Request Body**:
```json
{
  "code": "SAVE20",
  "type": "percentage",
  "value": 20,
  "description": "20% off your order",
  "minimumOrderAmount": 50,
  "usageLimit": 100,
  "usageLimitPerCustomer": 1,
  "startsAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-12-31T23:59:59Z",
  "applicableProductIds": [],
  "applicableCategoryIds": []
}
```

### Get Coupon

```http
GET /stores/:storeId/coupons/:couponId
```

### Update Coupon

```http
PATCH /stores/:storeId/coupons/:couponId
```

**Auth**: JWT Required, Permission: `coupons:update`

### Delete Coupon

```http
DELETE /stores/:storeId/coupons/:couponId
```

**Auth**: JWT Required, Permission: `coupons:delete`

---

## Media

Base path: `/api/v1/stores/:storeId/media`

### List Media

```http
GET /stores/:storeId/media
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `folder` | string | Filter by folder |
| `mimeType` | string | Filter by type (e.g., `image/*`) |
| `search` | string | Search filename or alt text |

### Upload Media

```http
POST /stores/:storeId/media/upload
```

**Auth**: JWT Required, Permission: `media:create`

**Content-Type**: `multipart/form-data`

**Form Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `file` | file | The file to upload |
| `folder` | string | Optional folder name |
| `altText` | string | Optional alt text |

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "image.jpg",
    "mimeType": "image/jpeg",
    "size": 102400,
    "url": "https://...",
    "altText": "Product image",
    "folder": "products",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Media

```http
GET /stores/:storeId/media/:mediaId
```

### Update Media

```http
PATCH /stores/:storeId/media/:mediaId
```

**Auth**: JWT Required, Permission: `media:update`

### Delete Media

```http
DELETE /stores/:storeId/media/:mediaId
```

**Auth**: JWT Required, Permission: `media:delete`

### Bulk Delete

```http
POST /stores/:storeId/media/bulk-delete
```

**Request Body**:
```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

### Move Media

```http
POST /stores/:storeId/media/move
```

**Request Body**:
```json
{
  "ids": ["uuid1", "uuid2"],
  "folder": "new-folder"
}
```

### Get Folders

```http
GET /stores/:storeId/media/folders
```

### Get Storage Usage

```http
GET /stores/:storeId/media/usage
```

---

## Blog

Base path: `/api/v1/stores/:storeId/blog`

### List Posts

```http
GET /stores/:storeId/blog/posts
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `draft`, `published`, `scheduled` |
| `categoryId` | string | Filter by category |
| `isFeatured` | boolean | Filter featured posts |
| `tag` | string | Filter by tag |

### Create Post

```http
POST /stores/:storeId/blog/posts
```

**Auth**: JWT Required, Permission: `content:create`

**Request Body**:
```json
{
  "title": "Blog Post Title",
  "slug": "blog-post-title",
  "excerpt": "Short description",
  "content": "<p>Full content here...</p>",
  "featuredImage": "https://...",
  "authorName": "John Doe",
  "status": "published",
  "visibility": "public",
  "allowComments": true,
  "isFeatured": false,
  "tags": ["news", "updates"],
  "categoryIds": ["uuid"],
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description"
}
```

### Get Post

```http
GET /stores/:storeId/blog/posts/:postId
```

### Update Post

```http
PATCH /stores/:storeId/blog/posts/:postId
```

**Auth**: JWT Required, Permission: `content:update`

### Delete Post

```http
DELETE /stores/:storeId/blog/posts/:postId
```

**Auth**: JWT Required, Permission: `content:delete`

### Bulk Operations

```http
POST /stores/:storeId/blog/posts/bulk
```

**Request Body**:
```json
{
  "action": "publish",
  "postIds": ["uuid1", "uuid2"]
}
```

**Actions**: `publish`, `unpublish`, `delete`, `feature`, `unfeature`

### List Blog Categories

```http
GET /stores/:storeId/blog/categories
```

### Create Blog Category

```http
POST /stores/:storeId/blog/categories
```

### Update Blog Category

```http
PATCH /stores/:storeId/blog/categories/:categoryId
```

### Delete Blog Category

```http
DELETE /stores/:storeId/blog/categories/:categoryId
```

---

## Pages

Base path: `/api/v1/stores/:storeId/pages`

### List Pages

```http
GET /stores/:storeId/pages
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `draft`, `published` |
| `template` | string | `default`, `full-width`, `sidebar`, `landing`, `contact`, `faq` |
| `showInNav` | boolean | Filter by navigation visibility |

### Get Pages Tree

```http
GET /stores/:storeId/pages/tree
```

Returns hierarchical page structure for navigation.

### Create Page

```http
POST /stores/:storeId/pages
```

**Auth**: JWT Required, Permission: `content:create`

**Request Body**:
```json
{
  "title": "About Us",
  "slug": "about-us",
  "content": "<p>Page content...</p>",
  "template": "default",
  "status": "published",
  "visibility": "public",
  "showInNav": true,
  "navOrder": 1,
  "parentId": null,
  "featuredImage": "https://...",
  "seoTitle": "About Us",
  "seoDescription": "Learn more about us"
}
```

### Get Page

```http
GET /stores/:storeId/pages/:pageId
```

### Update Page

```http
PATCH /stores/:storeId/pages/:pageId
```

**Auth**: JWT Required, Permission: `content:update`

### Delete Page

```http
DELETE /stores/:storeId/pages/:pageId
```

**Auth**: JWT Required, Permission: `content:delete`

**Note**: Page must have no child pages.

### Reorder Pages

```http
POST /stores/:storeId/pages/reorder
```

### Duplicate Page

```http
POST /stores/:storeId/pages/:pageId/duplicate
```

---

## Analytics

Base path: `/api/v1/stores/:storeId/analytics`

**Auth**: JWT Required, Permission: `analytics:read`

### Dashboard Analytics

```http
GET /stores/:storeId/analytics
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `range` | string | `7d`, `30d`, `90d`, `12m` |

**Response** (200):
```json
{
  "success": true,
  "data": {
    "overview": {
      "revenue": {
        "total": 45678.90,
        "change": 12.5,
        "previousTotal": 40589.24
      },
      "orders": {
        "total": 234,
        "change": 8.2,
        "previousTotal": 216
      },
      "customers": {
        "total": 156,
        "change": 15.3,
        "previousTotal": 135
      },
      "averageOrderValue": {
        "total": 195.21,
        "change": 3.8,
        "previousTotal": 188.00
      }
    },
    "revenueChart": {
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "data": [1234.56, 2345.67, 3456.78, ...]
    },
    "topProducts": [
      {
        "id": "uuid",
        "name": "Product Name",
        "sku": "SKU-001",
        "imageUrl": "https://...",
        "revenue": 5678.90,
        "quantity": 45
      }
    ],
    "topCustomers": [...],
    "recentOrders": [...]
  }
}
```

### Revenue Analytics

```http
GET /stores/:storeId/analytics/revenue
```

### Products Analytics

```http
GET /stores/:storeId/analytics/products
```

### Customers Analytics

```http
GET /stores/:storeId/analytics/customers
```

---

## Themes

Base path: `/api/v1/themes`

### List Themes (Public)

```http
GET /themes
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `industry` | string | Filter by industry |
| `isPremium` | boolean | Filter by premium status |

### Get Theme (Public)

```http
GET /themes/:themeIdOrSlug
```

### Apply Theme to Store

```http
POST /themes/stores/:storeId/apply
```

**Auth**: JWT Required

**Request Body**:
```json
{
  "themeId": "theme-uuid"
}
```

### Get Store's Current Theme

```http
GET /themes/stores/:storeId/current
```

**Auth**: JWT Required

### Update Theme Settings

```http
PATCH /themes/stores/:storeId/settings
```

**Auth**: JWT Required

**Request Body**:
```json
{
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#1e40af"
  },
  "typography": {
    "headingFont": "Inter",
    "bodyFont": "Inter"
  },
  "layout": {
    "containerWidth": "wide",
    "headerStyle": "minimal"
  },
  "customCss": ".custom { ... }"
}
```

### Reset Theme Settings

```http
POST /themes/stores/:storeId/reset
```

**Auth**: JWT Required

---

## Subscriptions

Base path: `/api/v1/subscriptions`

### List Plans

```http
GET /subscriptions/plans
```

**Auth**: JWT Required

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Pro",
      "slug": "pro",
      "description": "For growing businesses",
      "priceMonthly": 29,
      "priceYearly": 290,
      "features": ["Unlimited products", "5 staff accounts", ...],
      "limits": {
        "maxStores": 3,
        "maxProducts": 1000,
        "maxStorage": 5120
      }
    }
  ]
}
```

### Get Current Subscription

```http
GET /subscriptions/current
```

**Auth**: JWT Required, X-Organization-Id Required

### Create Checkout Session

```http
POST /subscriptions/checkout
```

**Auth**: JWT Required, Permission: `organization:billing:manage`

**Request Body**:
```json
{
  "planSlug": "pro",
  "billingInterval": "monthly"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

### Create Billing Portal Session

```http
POST /subscriptions/portal
```

**Auth**: JWT Required, Permission: `organization:billing:manage`

### Cancel Subscription

```http
DELETE /subscriptions/current
```

**Auth**: JWT Required, Permission: `organization:billing:manage`

---

## Storefront API (Public)

The Storefront API provides public endpoints for customer-facing applications.

Base path: `/api/v1/storefront`

### Get Store Info

```http
GET /storefront/stores/:identifier
```

**Auth**: Public

Lookup store by slug or subdomain.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Store",
    "slug": "my-store",
    "subdomain": "mystore",
    "description": "Store description",
    "logo": "https://...",
    "currency": "USD",
    "theme": {}
  }
}
```

### Get Store by ID

```http
GET /storefront/:storeId/info
```

### List Products

```http
GET /storefront/:storeId/products
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `category` | string | Category slug |
| `search` | string | Search term |
| `sort` | string | `newest`, `price-asc`, `price-desc`, `name-asc`, `name-desc` |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |

### Get Product by Slug

```http
GET /storefront/:storeId/products/:slug
```

### Get Product by ID

```http
GET /storefront/:storeId/products/id/:productId
```

### List Categories

```http
GET /storefront/:storeId/categories
```

### Create Checkout

```http
POST /storefront/:storeId/checkout
```

**Auth**: Public

**Request Body**:
```json
{
  "email": "customer@example.com",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  },
  "sameAsShipping": true,
  "couponCode": "SAVE10",
  "items": [
    { "productId": "uuid", "variantId": "uuid", "quantity": 2 }
  ]
}
```

### Create Payment

```http
POST /storefront/:storeId/checkout/payment
```

**Request Body**:
```json
{
  "orderId": "order-uuid",
  "paymentMethod": "stripe",
  "returnUrl": "https://...",
  "cancelUrl": "https://..."
}
```

**Response** (Stripe):
```json
{
  "success": true,
  "data": {
    "paymentMethod": "stripe",
    "clientSecret": "pi_..._secret_...",
    "paymentIntentId": "pi_..."
  }
}
```

**Response** (PayPal):
```json
{
  "success": true,
  "data": {
    "paymentMethod": "paypal",
    "paypalOrderId": "...",
    "approvalUrl": "https://..."
  }
}
```

### Capture PayPal Payment

```http
POST /storefront/:storeId/checkout/paypal/capture
```

**Request Body**:
```json
{
  "orderId": "order-uuid",
  "paypalOrderId": "paypal-order-id"
}
```

### Validate Coupon

```http
POST /storefront/:storeId/coupons/validate
```

**Request Body**:
```json
{
  "code": "SAVE10",
  "cartTotal": 99.99
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "valid": true,
    "discount": 9.99,
    "coupon": {
      "type": "percentage",
      "value": 10
    }
  }
}
```

### Customer Registration

```http
POST /storefront/:storeId/auth/register
```

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Customer Login

```http
POST /storefront/:storeId/auth/login
```

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "securepassword"
}
```

### Get Customer Profile

```http
GET /storefront/:storeId/account/profile
```

**Auth**: Customer JWT Required (Bearer token)

### Get Customer Orders

```http
GET /storefront/:storeId/account/orders
```

**Auth**: Customer JWT Required (Bearer token)

---

## Rate Limiting

The API implements rate limiting to ensure fair usage:

| Endpoint Type | Limit |
|--------------|-------|
| Authentication | 10 requests/minute |
| API (Authenticated) | 1000 requests/minute |
| Storefront (Public) | 100 requests/minute |

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1704067200
```

---

## Webhooks

Rendrix supports webhooks for real-time event notifications.

### Supported Events

| Event | Description |
|-------|-------------|
| `order.created` | New order placed |
| `order.updated` | Order status changed |
| `order.paid` | Payment received |
| `order.fulfilled` | Order shipped |
| `order.cancelled` | Order cancelled |
| `customer.created` | New customer registered |
| `product.created` | New product added |
| `product.updated` | Product modified |
| `product.deleted` | Product removed |

### Webhook Payload

```json
{
  "id": "webhook-uuid",
  "event": "order.created",
  "createdAt": "2024-01-01T00:00:00Z",
  "data": {
    "storeId": "store-uuid",
    "orderId": "order-uuid",
    ...
  }
}
```

### Webhook Signature

Verify webhook authenticity using the signature header:
```http
X-Rendrix-Signature: sha256=...
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { RendrixClient } from '@rendrix/sdk';

const client = new RendrixClient({
  accessToken: 'your-access-token',
  organizationId: 'your-org-id',
});

// List products
const products = await client.products.list('store-id', {
  page: 1,
  limit: 20,
  status: 'active',
});

// Create order
const order = await client.orders.create('store-id', {
  email: 'customer@example.com',
  items: [{ productId: 'prod-id', quantity: 2 }],
  shippingAddress: { ... },
});
```

---

## Changelog

### Version 1.0 (Current)
- Initial API release
- Full CRUD operations for all resources
- JWT authentication with refresh tokens
- Role-based access control
- Multi-tenant organization support
- Stripe and PayPal payment integration
- Media upload with S3/MinIO support

---

*Last Updated: December 2024*
