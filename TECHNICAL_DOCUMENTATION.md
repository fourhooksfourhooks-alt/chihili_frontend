# Chihili Frontend - Technical Documentation

**Version:** 0.1.0  
**Last Updated:** October 17, 2025  
**Framework:** Next.js 15.4.6 with React 19  
**Language:** TypeScript 5.x

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Architecture](#core-architecture)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Authentication & Authorization](#authentication--authorization)
8. [Key Features](#key-features)
9. [Routing Structure](#routing-structure)
10. [Component Library](#component-library)
11. [Styling & Theming](#styling--theming)
12. [Configuration](#configuration)
13. [Development Guide](#development-guide)
14. [Build & Deployment](#build--deployment)
15. [Best Practices](#best-practices)
16. [Troubleshooting](#troubleshooting)

---

## 1. Overview

**Chihili** is a modern e-commerce platform dedicated to Odia fashion heritage. The frontend application is built using Next.js 15 with the App Router architecture, providing a seamless shopping experience with features including:

- User authentication with social login (Firebase)
- Product browsing and filtering
- Shopping cart and wishlist management
- Secure payment integration
- Order tracking and management
- User profile and address management
- Review and rating system

### Key Highlights

- **Server-Side Rendering (SSR):** Enhanced SEO and performance
- **TypeScript:** Type-safe codebase for better maintainability
- **Zustand:** Lightweight state management
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Secure Authentication:** JWT-based auth with refresh token rotation

---

## 2. Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.4.6 | React framework with App Router |
| React | 19.1.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.1.11 | Utility-first CSS framework |

### State Management & Data Fetching

- **Zustand** (5.0.8) - Lightweight state management
- **Axios** (1.11.0) - HTTP client with interceptors

### Authentication & Security

- **Firebase** (12.1.0) - Social authentication (Google, Facebook)
- **cookies-next** (6.1.0) - Cookie management for auth tokens

### UI Components & Libraries

- **Lucide React** (0.537.0) - Icon library
- **React Slick** (0.31.0) - Carousel/slider component

### Development Tools

- **Turbopack** - Fast bundler for development
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 3. Project Structure

```
chihill-frontend/
├── public/                      # Static assets
│   ├── Measuring/              # Size measurement guides
│   ├── products/               # Product images
│   ├── video/                  # Video content
│   └── Logo.svg                # Brand logo
│
├── src/
│   ├── api/                    # API integration layer
│   │   ├── axiosInstance.ts    # Configured axios instance
│   │   ├── auth.api.ts         # Authentication endpoints
│   │   ├── product.api.ts      # Product endpoints
│   │   ├── cart.api.ts         # Cart management
│   │   ├── order.api.ts        # Order processing
│   │   ├── payment.api.ts      # Payment gateway
│   │   ├── address.api.ts      # Address management
│   │   ├── category.api.ts     # Category data
│   │   ├── review.api.ts       # Product reviews
│   │   ├── wishlist.api.ts     # Wishlist operations
│   │   ├── user.api.ts         # User profile
│   │   ├── home.api.ts         # Homepage data
│   │   └── shipment.api.ts     # Shipping info
│   │
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   │
│   │   ├── (site)/            # Public pages group
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── about-us/       # About page
│   │   │   ├── contact-us/     # Contact page
│   │   │   ├── categoryPage/   # Category listing
│   │   │   ├── product-details/ # Product detail page
│   │   │   ├── cart-details/   # Shopping cart
│   │   │   ├── wishlist/       # Wishlist page
│   │   │   ├── profile/        # User profile
│   │   │   ├── order-details/  # Order tracking
│   │   │   ├── payment/        # Payment page
│   │   │   ├── payment-status/ # Payment result
│   │   │   ├── search/         # Search results
│   │   │   └── ...             # Other pages
│   │   │
│   │   └── auth/              # Authentication pages
│   │       ├── login/          # Login page
│   │       ├── signup/         # Registration
│   │       └── forgot-password/ # Password reset
│   │
│   ├── components/            # React components
│   │   ├── Navbar.tsx         # Main navigation
│   │   ├── Footer.tsx         # Footer component
│   │   ├── ProductCard.tsx    # Product display card
│   │   ├── ProductDetails.tsx # Product detail view
│   │   ├── AuthGuard.tsx      # Auth protection HOC
│   │   ├── RouteProtect.tsx   # Route protection
│   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   ├── FilterSidebar.tsx  # Product filters
│   │   ├── ReviewSection.tsx  # Reviews display
│   │   ├── OrderDetails.tsx   # Order information
│   │   ├── cart/              # Cart components
│   │   ├── home/              # Homepage components
│   │   ├── profile/           # Profile components
│   │   └── ...                # Modals & utilities
│   │
│   ├── store/                 # Zustand state stores
│   │   ├── authStore.ts       # Authentication state
│   │   ├── cartStore.ts       # Shopping cart state
│   │   ├── ProductStore.ts    # Product data state
│   │   ├── CategoryStore.ts   # Category state
│   │   ├── wishlistStore.ts   # Wishlist state
│   │   ├── addressStore.ts    # Address management
│   │   ├── paymentStore.ts    # Payment state
│   │   ├── reviewStore.ts     # Reviews state
│   │   └── homeStore.ts       # Homepage state
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuthGuard.ts    # Auth protection hook
│   │   ├── useProductFilters.ts # Product filtering
│   │   └── usePageSpecificStore.ts # Store selector
│   │
│   ├── config/                # Configuration files
│   │   └── firebaseConfig.ts  # Firebase setup
│   │
│   └── lib/                   # Utility functions
│       └── utils.ts           # Helper functions
│
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── .env.local                 # Environment variables
```

---

## 4. Core Architecture

### App Router Pattern

Chihili uses Next.js 15's App Router with the following architecture:

#### Route Groups

- **(site)**: Public-facing pages accessible to all users
- **auth**: Authentication-related pages (login, signup, forgot password)

#### Layouts

```typescript
// Root Layout (app/layout.tsx)
- Defines global HTML structure
- Imports Google Fonts (Geist, Lato, Crimson Pro, Dancing Script)
- Sets up metadata and SEO
- Applies global styles

// Site Layout (app/(site)/layout.tsx)
- Includes Navbar and Footer
- Wraps all public pages

// Auth Layout (app/auth/layout.tsx)
- Minimal layout for authentication pages
- No navigation components
```

### Data Flow Architecture

```
User Interaction
    ↓
Component (React)
    ↓
Zustand Store (State Management)
    ↓
API Layer (axios)
    ↓
Backend Server (REST API)
    ↓
Response → Store Update → Component Re-render
```

---

## 5. State Management

### Zustand Store Architecture

Chihili uses **Zustand** for state management, providing a simple and performant solution.

#### Store Structure

Each store follows a consistent pattern:

```typescript
interface StoreState {
  // State properties
  data: DataType | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchData: () => Promise<void>;
  setData: (data: DataType) => void;
  clearData: () => void;
}
```

### Key Stores

#### 1. Auth Store (`authStore.ts`)

**Purpose:** Manages user authentication state and session

**State:**
```typescript
{
  user: AuthUser | null;          // Current user data
  token: string | null;           // JWT access token
  isAuthenticated: boolean;       // Auth status
  loading: boolean;               // Loading state
}
```

**Key Actions:**
- `login(identifier, password)` - User login
- `logout()` - Clear session and redirect
- `refreshToken()` - Refresh access token using HttpOnly cookie
- `getCurrentUser()` - Fetch current user details
- `setAuth(user, token)` - Set authentication state
- `clearAuth()` - Clear authentication data

**Usage Example:**
```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

---

#### 2. Cart Store (`cartStore.ts`)

**Purpose:** Manages shopping cart and save-for-later items

**State:**
```typescript
{
  cart: Cart | null;                  // Current cart
  summary: CartSummary | null;        // Cart totals
  saveForLater: any[];                // Saved items
  saveForLaterSummary: CartSummary | null;
  loading: boolean;
  error: string | null;
}
```

**Key Actions:**
- `fetchCart()` - Load user's cart
- `addToCart(data)` - Add product to cart
- `updateCartItem(productId, variantSku, quantity)` - Update quantity
- `removeFromCart(productId, variantSku)` - Remove item
- `clearCart()` - Empty cart
- `moveToSaveForLater(productId, variantSku)` - Save for later
- `moveToCart(productId, variantSku)` - Move back to cart

**Features:**
- Automatic cart summary computation
- Save for later functionality
- Real-time cart count for navbar badge
- Optimistic UI updates

---

#### 3. Product Store (`ProductStore.ts`)

**Purpose:** Manages product listings, filtering, and product details

**State:**
```typescript
{
  products: Product[];                  // Product list
  bestSellingProducts: Product[];       // Best sellers
  festivalFavorites: Product[];         // Featured products
  relatedProducts: Product[];           // Related items
  currentProduct: Product | null;       // Active product
  total: number;                        // Total count
  page: number;                         // Current page
  limit: number;                        // Items per page
  totalPages: number;                   // Total pages
  loading: boolean;                     // Various loading states
  error: string | null;
  currentParams: ProductListParams;     // Active filters
}
```

**Key Actions:**
- `fetchProducts(params)` - Get product list with filters
- `fetchBestSelling(params)` - Get best sellers
- `fetchFestivalFavorites(params)` - Get featured products
- `fetchProductById(id)` - Get single product details
- `fetchRelatedProducts(productId)` - Get related items
- `setCurrentParams(params)` - Update filter state

---

#### 4. Category Store (`CategoryStore.ts`)

**Purpose:** Manages product categories and hierarchy

**State:**
```typescript
{
  categories: Category[];           // All categories
  rootCategories: Category[];       // Top-level categories
  loading: boolean;
  error: string | null;
}
```

**Key Actions:**
- `fetchCategories()` - Load all categories
- `fetchRootCategories()` - Load top-level only

---

#### 5. Wishlist Store (`wishlistStore.ts`)

**Purpose:** Manages user's wishlist items

**Key Actions:**
- `fetchWishlist()` - Load wishlist
- `addToWishlist(productId)` - Add item
- `removeFromWishlist(productId)` - Remove item
- `isInWishlist(productId)` - Check if item exists

---

#### 6. Address Store (`addressStore.ts`)

**Purpose:** Manages user delivery addresses

**Key Actions:**
- `fetchAddresses()` - Load all addresses
- `createAddress(data)` - Add new address
- `updateAddress(id, data)` - Edit address
- `deleteAddress(id)` - Remove address
- `setDefaultAddress(id)` - Set as default

---

## 6. API Integration

### Axios Instance Configuration

The application uses a centralized axios instance with interceptors.

**File:** `src/api/axiosInstance.ts`

#### Features

1. **Base URL Configuration**
   ```typescript
   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://chihili-backend.onrender.com/api"
   ```

2. **Credentials Support**
   ```typescript
   withCredentials: true  // Enables HttpOnly cookie transmission
   ```

3. **Request Interceptor**
   - Automatically attaches JWT token to all requests
   - Reads token from auth store
   - Adds `Authorization: Bearer <token>` header

4. **Response Interceptor**
   - Handles 401 (Unauthorized) errors
   - Implements automatic token refresh
   - Retries failed requests with new token
   - Prevents refresh token loop
   - Automatic logout on refresh failure

#### Token Refresh Flow

```
Request → 401 Error
    ↓
Check if already refreshing
    ↓ No
Call refreshToken()
    ↓
Get new access token
    ↓
Update token in store
    ↓
Retry original request
    ↓ On Failure
Clear auth & redirect to login
```

### API Modules

#### Authentication API (`auth.api.ts`)

**Endpoints:**
- `POST /auth/login` - Standard login
- `POST /auth/login` (with Firebase token) - Social login
- `POST /auth/signup` - User registration
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/create-password` - Set password after verification
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

---

#### Product API (`Product.api.ts`)

**Endpoints:**
- `GET /products` - List products (with filters)
- `GET /products/:id` - Get product details
- `GET /products/best-selling` - Best sellers
- `GET /products/festival-favorites` - Featured products
- `GET /products/:id/related` - Related products

**Query Parameters:**
```typescript
interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
```

---

#### Cart API (`cart.api.ts`)

**Endpoints:**
- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart
- `PATCH /cart/item` - Update cart item
- `DELETE /cart/item` - Remove from cart
- `DELETE /cart/clear` - Clear entire cart
- `GET /cart/save-for-later` - Get saved items
- `POST /cart/move-to-save-for-later` - Save item
- `POST /cart/move-to-cart` - Move to cart

**Request Types:**
```typescript
interface AddToCartRequest {
  productId: string;
  variantSku: string;
  quantity: number;
  customSize?: object;
}
```

---

#### Order API (`order.api.ts`)

**Endpoints:**
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `POST /orders/create` - Create order
- `GET /orders/:id/track` - Track shipment

---

#### Payment API (`payment.api.ts`)

**Endpoints:**
- `POST /payment/initiatePayment` - Start payment process
- `GET /payment/verify/:orderId` - Verify payment status
- `POST /payment/webhook` - Handle payment callbacks

**Request:**
```typescript
interface InitiatePaymentRequest {
  cartId: string;
  addressId: string;
  couponCode?: string;
}
```

---

#### Other APIs

- **Category API** - Category hierarchy and data
- **Address API** - CRUD for delivery addresses
- **Review API** - Product reviews and ratings
- **Wishlist API** - Wishlist management
- **User API** - User profile updates
- **Home API** - Homepage banners and content
- **Shipment API** - Shipping information

---

## 7. Authentication & Authorization

### Authentication Flow

#### 1. Login Flow

```
User enters credentials
    ↓
Call authStore.login()
    ↓
POST /auth/login
    ↓
Backend validates credentials
    ↓
Returns: { accessToken, refreshToken (HttpOnly cookie) }
    ↓
Store accessToken in Zustand
    ↓
Redirect to dashboard/home
```

#### 2. Social Login (Firebase)

```
User clicks "Login with Google/Facebook"
    ↓
Firebase authentication popup
    ↓
Get Firebase ID token
    ↓
Call loginWithFirebaseToken(idToken)
    ↓
Backend validates Firebase token
    ↓
Returns access token + refresh cookie
    ↓
Store auth state
```

**Implementation:**
```typescript
import { loginWithFirebaseToken } from '@/api/auth.api';

const handleSocialLogin = async (firebaseToken: string) => {
  try {
    const response = await loginWithFirebaseToken(firebaseToken);
    const { accessToken, user } = response.data;
    useAuthStore.getState().setAuth(user, accessToken);
    router.push('/');
  } catch (error) {
    console.error('Social login failed:', error);
  }
};
```

#### 3. Token Refresh Mechanism

**Automatic Refresh:**
- Triggered on 401 responses
- Uses HttpOnly refresh token cookie
- No manual token management needed

**Manual Refresh:**
```typescript
const { refreshToken } = useAuthStore();
await refreshToken();
```

#### 4. Session Persistence

```
Page Load/Refresh
    ↓
Check if accessToken exists
    ↓ No
Call refreshToken()
    ↓
Backend validates refresh cookie
    ↓
Returns new accessToken
    ↓
Call getCurrentUser()
    ↓
Update auth state
```

### Route Protection

#### Protected Routes

Use `RouteProtect` component to protect routes:

```typescript
// app/(site)/profile/page.tsx
import ProtectedRoute from '@/components/RouteProtect';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
```

#### Auth Guard Hook

```typescript
// hooks/useAuthGuard.ts
const useAuthGuard = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading]);
  
  return { isAuthenticated, loading };
};
```

### Security Features

1. **JWT Access Tokens** - Short-lived (15 min)
2. **HttpOnly Refresh Tokens** - Cannot be accessed by JavaScript
3. **CORS Configuration** - Restricted origins
4. **CSRF Protection** - Token-based validation
5. **Secure Cookie Flags** - SameSite, Secure attributes

---

## 8. Key Features

### 8.1 Product Browsing & Discovery

#### Product Listing
- **Grid/List View** - Toggle display modes
- **Infinite Scroll** - Lazy loading for performance
- **Quick View** - Preview without navigation
- **Filters** - Category, price range, size, color, brand
- **Sorting** - By price, popularity, newest, rating

#### Product Details
- **Image Gallery** - Multiple product images with zoom
- **Size Chart** - Interactive measurement guide
- **Custom Sizing** - Upload measurements for tailored items
- **Variant Selection** - Color, size, material options
- **Stock Status** - Real-time availability
- **Related Products** - Suggestions based on current item
- **Reviews & Ratings** - Customer feedback display

**Component:** `ProductDetails.tsx`

---

### 8.2 Shopping Cart

#### Features
- **Add to Cart** - From product page or quick add
- **Quantity Management** - Increment/decrement
- **Variant Updates** - Change size/color in cart
- **Price Calculation** - Automatic subtotal, discounts, taxes
- **Save for Later** - Move items without losing them
- **Guest Cart** - Cart persistence without login
- **Cart Badge** - Real-time item count in navbar

**Store:** `cartStore.ts`  
**Components:** `cart/` directory

#### Cart Summary Computation

```typescript
const computeCartSummary = (cart: Cart) => {
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
  const discount = 0; // Apply coupon logic
  const total = subtotal - discount;
  return { itemCount, subtotal, discount, total };
};
```

---

### 8.3 Wishlist

#### Features
- **Add to Wishlist** - Heart icon on product cards
- **Wishlist Page** - View all saved items
- **Move to Cart** - Quick add from wishlist
- **Remove Items** - Delete unwanted items
- **Persistence** - Saved across sessions

**Store:** `wishlistStore.ts`

---

### 8.4 Checkout & Payment

#### Checkout Flow

```
Cart → Address Selection → Payment Method → Order Confirmation
```

#### Address Management
- **Multiple Addresses** - Save home, office, etc.
- **Default Address** - Auto-select for checkout
- **Edit/Delete** - Manage saved addresses
- **Address Validation** - Verify postal codes

#### Payment Integration
- **Payment Gateway** - Secure payment processing
- **Multiple Methods** - Credit card, debit card, UPI, wallets
- **Payment Status** - Real-time updates
- **Order Tracking** - Post-payment order details

**API:** `payment.api.ts`, `order.api.ts`

---

### 8.5 Order Management

#### Features
- **Order History** - View past orders
- **Order Details** - Item list, pricing, shipping info
- **Order Tracking** - Shipment status updates
- **Invoice Download** - PDF generation
- **Reorder** - Quick repeat purchase
- **Cancel Order** - Before shipment

**Components:** `OrderDetails.tsx`, `OrderHistory.tsx`

---

### 8.6 User Profile

#### Profile Management
- **Personal Information** - Name, email, phone
- **Profile Picture** - Upload/update avatar
- **Password Change** - Secure password update
- **Account Deletion** - Soft delete with recovery option

#### Profile Sections
1. **My Orders** - Order history and tracking
2. **My Addresses** - Saved delivery addresses
3. **My Wishlist** - Saved products
4. **My Reviews** - Written reviews
5. **Account Settings** - Preferences and notifications

**Components:** `profile/` directory

---

### 8.7 Reviews & Ratings

#### Features
- **Star Rating** - 1-5 star system
- **Written Reviews** - Detailed feedback
- **Image Upload** - Add product photos
- **Helpful Votes** - Community validation
- **Verified Purchase** - Badge for confirmed buyers
- **Reply System** - Vendor responses

**Store:** `reviewStore.ts`  
**Components:** `ReviewSection.tsx`, `ReviewCard.tsx`

---

### 8.8 Search & Filtering

#### Search Features
- **Global Search** - Search from navbar
- **Autocomplete** - Suggestions as you type
- **Recent Searches** - Quick access to past queries
- **Search Results** - Paginated product listing

#### Filters
- **Category Filter** - Multi-level hierarchy
- **Price Range** - Slider for min/max
- **Size Filter** - Available sizes only
- **Color Filter** - Visual color picker
- **Brand Filter** - Multiple brand selection
- **Availability** - In stock / Out of stock

**Components:** `FilterSidebar.tsx`, `MobileFilterModal.tsx`

---

### 8.9 Category Navigation

#### Features
- **Mega Menu** - Multi-column category display
- **Category Pages** - Dedicated listing per category
- **Breadcrumb Navigation** - Path from home to current
- **Category Filters** - Specific to category
- **Featured Categories** - Highlighted on homepage

**Store:** `CategoryStore.ts`  
**Component:** `CategoryHeader.tsx`

---

### 8.10 Responsive Design

#### Mobile Optimization
- **Mobile Menu** - Hamburger navigation
- **Touch Gestures** - Swipe, tap, pinch-to-zoom
- **Mobile Filters** - Bottom sheet modal
- **Mobile Sort** - Quick sort options
- **Optimized Images** - Next.js image optimization

**Components:** 
- `MobileFilterModal.tsx`
- `MobileSortModal.tsx`

---

## 9. Routing Structure

### Public Routes (No Authentication Required)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/` | `app/(site)/page.tsx` | Homepage |
| `/about-us` | `app/(site)/about-us/page.tsx` | About page |
| `/contact-us` | `app/(site)/contact-us/page.tsx` | Contact page |
| `/categoryPage/[slug]` | `app/(site)/categoryPage/[slug]/page.tsx` | Category listing |
| `/product-details/[id]` | `app/(site)/product-details/[id]/page.tsx` | Product details |
| `/search` | `app/(site)/search/page.tsx` | Search results |
| `/cart-details` | `app/(site)/cart-details/page.tsx` | Shopping cart |
| `/auth/login` | `app/auth/login/page.tsx` | Login page |
| `/auth/signup` | `app/auth/signup/page.tsx` | Registration |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Password reset |

### Protected Routes (Authentication Required)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/profile` | `app/(site)/profile/page.tsx` | User profile |
| `/profile/orders` | `app/(site)/profile/orders/page.tsx` | Order history |
| `/profile/addresses` | `app/(site)/profile/addresses/page.tsx` | Address management |
| `/wishlist` | `app/(site)/wishlist/page.tsx` | Wishlist |
| `/order-details/[id]` | `app/(site)/order-details/[id]/page.tsx` | Order tracking |
| `/payment` | `app/(site)/payment/page.tsx` | Payment page |
| `/payment-status` | `app/(site)/payment-status/page.tsx` | Payment result |
| `/order-confirmation/[id]` | `app/(site)/order-confirmation/[id]/page.tsx` | Order success |

### Dynamic Routes

**Category Pages:**
```
/categoryPage/[slug] → /categoryPage/women-wear
/categoryPage/[slug] → /categoryPage/accessories
```

**Product Details:**
```
/product-details/[id] → /product-details/12345
```

**Order Details:**
```
/order-details/[id] → /order-details/ORD-2025-001
```

---

## 10. Component Library

### Layout Components

#### 1. Navbar (`Navbar.tsx`)

**Features:**
- Logo and brand name
- Category mega menu
- Search bar with autocomplete
- User authentication status
- Cart icon with badge count
- Wishlist icon
- Mobile hamburger menu
- Sticky positioning

**Props:** None (uses global state)

**State Dependencies:**
- `useAuthStore` - User authentication
- `useCartStore` - Cart item count
- `CategoryStore` - Category navigation

---

#### 2. Footer (`Footer.tsx`)

**Features:**
- Company information
- Quick links
- Social media links
- Newsletter subscription
- Contact details
- Copyright notice

---

### Product Components

#### 3. ProductCard (`ProductCard.tsx`)

**Purpose:** Reusable product card for listings

**Props:**
```typescript
interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}
```

**Features:**
- Product image
- Title and description
- Price display
- Rating stars
- Add to cart button
- Add to wishlist button
- Quick view trigger

---

#### 4. ProductDetails (`ProductDetails.tsx`)

**Purpose:** Detailed product view

**Features:**
- Image gallery with thumbnails
- Product information
- Variant selection (size, color)
- Quantity selector
- Add to cart button
- Size chart modal
- Custom size option
- Product description tabs
- Related products section
- Reviews section

---

#### 5. VariantSelector (`VariantSelector.tsx`)

**Purpose:** Select product variants

**Props:**
```typescript
interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
}
```

---

### Cart Components

#### 6. CartItem (`cart/CartItem.tsx`)

**Purpose:** Display cart item with controls

**Features:**
- Product image and name
- Variant details
- Quantity controls
- Price calculation
- Remove button
- Save for later option

---

### Modal Components

#### 7. SizeChartModal (`SizeChartModal.tsx`)

**Purpose:** Display measurement guide

**Features:**
- Size conversion tables
- Measurement instructions
- Visual guides

---

#### 8. CustomSizeModal (`customSizeModal.tsx`)

**Purpose:** Collect custom measurements

**Features:**
- Input fields for measurements
- Measurement units
- Visual diagram
- Save for profile option

---

### Authentication Components

#### 9. AuthGuard (`AuthGuard.tsx`)

**Purpose:** HOC for protected routes

**Usage:**
```typescript
<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

---

#### 10. RouteProtect (`RouteProtect.tsx`)

**Purpose:** Page-level route protection

**Features:**
- Authentication check
- Token refresh
- Loading state
- Redirect to login

---

### UI Components

#### 11. LoadingSpinner (`LoadingSpinner.tsx`)

**Props:**
```typescript
interface LoadingSpinnerProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

---

#### 12. FilterSidebar (`FilterSidebar.tsx`)

**Purpose:** Product filtering UI

**Features:**
- Category filter
- Price range slider
- Size checkboxes
- Color picker
- Brand selection
- Apply/Clear buttons

---

#### 13. MobileFilterModal (`MobileFilterModal.tsx`)

**Purpose:** Mobile-optimized filter sheet

**Features:**
- Bottom sheet animation
- Same filters as sidebar
- Touch-friendly UI

---

### Review Components

#### 14. ReviewSection (`ReviewSection.tsx`)

**Purpose:** Display product reviews

**Features:**
- Average rating display
- Rating distribution chart
- Review list
- Sort options
- Filter by rating
- Write review button

---

#### 15. ReviewCard (`ReviewCard.tsx`)

**Purpose:** Individual review display

**Props:**
```typescript
interface ReviewCardProps {
  review: Review;
  showProductInfo?: boolean;
}
```

---

### Order Components

#### 16. OrderDetails (`OrderDetails.tsx`)

**Purpose:** Display order information

**Features:**
- Order ID and date
- Product list
- Pricing breakdown
- Shipping address
- Payment status
- Tracking information

---

#### 17. OrderHistory (`OrderHistory.tsx`)

**Purpose:** List user's orders

**Features:**
- Order list with filters
- Status badges
- Quick reorder
- View details link

---

## 11. Styling & Theming

### Tailwind CSS Configuration

**File:** `tailwind.config.ts`

#### Custom Colors

```typescript
colors: {
  primary: "#CB0342",      // Main brand color
  primary1: "#830A0C",     // Darker primary
  primary2: "#540608",     // Darkest primary
  secondary: "#FAF8F0",    // Light background
  secondary1: "#F0EAD2",   // Cream background
}
```

#### Usage in Components

```tsx
// Primary button
<button className="bg-primary hover:bg-primary1 text-white">
  Add to Cart
</button>

// Secondary background
<div className="bg-secondary rounded-lg p-4">
  Content
</div>
```

### Typography

#### Custom Fonts

```typescript
// Google Fonts imported in layout.tsx
- Geist Sans (--font-geist-sans)
- Geist Mono (--font-geist-mono)
- Lato (--font-lato)
- Crimson Pro (--font-crimson-pro)
- Dancing Script (--font-dancing-script)
```

#### Usage

```tsx
<h1 className="font-crimson-pro text-4xl font-bold">
  Chihili Fashion
</h1>

<p className="font-lato text-base">
  Description text
</p>
```

### Responsive Breakpoints

```css
sm:  640px   /* Tablet portrait */
md:  768px   /* Tablet landscape */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

#### Example Usage

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

### Global Styles

**File:** `app/globals.css`

```css
/* Custom scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { background: #830A0C; }

/* Navbar height variable */
:root {
  --navbar-height: 80px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
```

---

## 12. Configuration

### Environment Variables

**File:** `.env.local`

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://chihili-backend.onrender.com/api

# Firebase Configuration (already in firebaseConfig.ts)
# These are public as they're client-side
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDvqX5d_Mt813_qjJVEVVhaWkizIl100Vw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=chihili-92f01.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=chihili-92f01
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=chihili-92f01.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=870392136127
NEXT_PUBLIC_FIREBASE_APP_ID=1:870392136127:web:5aed50bdc60efe6199210a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CT4NL0X1W2

# Optional: Analytics, logging, etc.
```

### Next.js Configuration

**File:** `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  // Image domains for Next/Image component
  images: {
    domains: [
      "via.placeholder.com",
      "chihili-bucket.s3.ap-south-1.amazonaws.com",
    ],
  },
  
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // CORS headers for Firebase Auth
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          { 
            key: "Cross-Origin-Embedder-Policy", 
            value: "unsafe-none" 
          },
        ],
      },
    ];
  },
};
```

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]  // Path alias
    }
  }
}
```

**Usage:**
```typescript
// Instead of: import { useAuthStore } from '../../../store/authStore'
import { useAuthStore } from '@/store/authStore';
```

---

## 13. Development Guide

### Getting Started

#### 1. Prerequisites

```bash
- Node.js 20.x or higher
- npm or yarn package manager
- Git
```

#### 2. Installation

```bash
# Clone repository
git clone https://github.com/your-org/chihill-frontend.git

# Navigate to project
cd chihill-frontend

# Install dependencies
npm install
# or
yarn install
```

#### 3. Environment Setup

```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local with your values
vim .env.local
```

#### 4. Run Development Server

```bash
# Start dev server with Turbopack
npm run dev

# Server runs on http://localhost:3000
```

### Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run export           # Export static site

# Tailwind
npm run tailwind:init    # Initialize Tailwind config
```

### Code Structure Guidelines

#### 1. Component Creation

```typescript
// components/MyComponent.tsx
'use client';  // If using hooks or browser APIs

import React from 'react';
import { useMyStore } from '@/store/myStore';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="container mx-auto">
      <h2>{title}</h2>
    </div>
  );
}
```

#### 2. API Function Creation

```typescript
// api/feature.api.ts
import axios from './axiosInstance';

export interface FeatureRequest {
  id: string;
  data: any;
}

export interface FeatureResponse {
  success: boolean;
  data: any;
}

export const getFeature = async (id: string): Promise<FeatureResponse> => {
  const response = await axios.get(`/feature/${id}`);
  return response.data;
};

export const createFeature = async (data: FeatureRequest): Promise<FeatureResponse> => {
  const response = await axios.post('/feature', data);
  return response.data;
};
```

#### 3. Store Creation

```typescript
// store/featureStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as featureApi from '@/api/feature.api';

interface FeatureState {
  data: any | null;
  loading: boolean;
  error: string | null;
  
  fetchData: () => Promise<void>;
  setData: (data: any) => void;
  clearData: () => void;
}

export const useFeatureStore = create<FeatureState>()(
  devtools(
    (set) => ({
      data: null,
      loading: false,
      error: null,
      
      fetchData: async () => {
        set({ loading: true, error: null });
        try {
          const response = await featureApi.getFeature('123');
          set({ data: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      
      setData: (data) => set({ data }),
      clearData: () => set({ data: null, error: null }),
    }),
    { name: 'FeatureStore' }
  )
);
```

#### 4. Page Creation

```typescript
// app/(site)/feature/page.tsx
import MyComponent from '@/components/MyComponent';

export const metadata = {
  title: 'Feature Page | Chihili',
  description: 'Feature description',
};

export default function FeaturePage() {
  return (
    <div className="container mx-auto py-8">
      <MyComponent title="Feature" />
    </div>
  );
}
```

### Debugging

#### 1. Redux DevTools (Zustand)

Zustand stores are configured with devtools:

```typescript
// Open Redux DevTools in browser
// View state changes in real-time
```

#### 2. React DevTools

```bash
# Install React DevTools extension
# Inspect component tree
# View props and state
```

#### 3. Network Debugging

```typescript
// Add console logs in axios interceptors
instance.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});
```

---

## 14. Build & Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Output: .next/ directory
```

### Build Output

```
.next/
├── static/              # Static assets
├── server/              # Server-side code
├── cache/               # Build cache
└── standalone/          # Standalone server (if enabled)
```

### Deployment Options

#### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Configuration:**
- Auto-detects Next.js
- Zero configuration
- Automatic HTTPS
- Global CDN

#### 2. Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

**Build & Run:**
```bash
docker build -t chihill-frontend .
docker run -p 3000:3000 chihill-frontend
```

#### 3. Static Export

```bash
# Generate static HTML
npm run export

# Output: out/ directory
# Deploy to any static host (Netlify, S3, etc.)
```

### Environment Variables in Production

```bash
# Set in hosting platform
NEXT_PUBLIC_API_BASE_URL=https://chihili-backend.onrender.com/api

# Vercel
vercel env add NEXT_PUBLIC_API_BASE_URL

# Docker
docker run -e NEXT_PUBLIC_API_BASE_URL=https://chihili-backend.onrender.com/api ...
```

### Performance Optimization

#### 1. Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/products/image.jpg"
  alt="Product"
  width={500}
  height={500}
  loading="lazy"
  placeholder="blur"
/>
```

#### 2. Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

#### 3. Caching Strategy

```typescript
// Revalidate data every 60 seconds
export const revalidate = 60;

// Or per request
fetch('https://chihili-backend.onrender.com/products', {
  next: { revalidate: 3600 } // 1 hour
});
```

---

## 15. Best Practices

### Code Quality

1. **TypeScript Strict Mode**
   - Always define interfaces/types
   - Avoid `any` type
   - Use proper type annotations

2. **Component Structure**
   - Keep components small and focused
   - Extract reusable logic to hooks
   - Use composition over inheritance

3. **State Management**
   - Use Zustand for global state
   - Local state with useState for UI-only state
   - Avoid prop drilling

4. **Performance**
   - Memoize expensive computations (useMemo)
   - Prevent unnecessary re-renders (React.memo)
   - Lazy load heavy components
   - Optimize images with Next/Image

### Security

1. **Authentication**
   - Store tokens securely (HttpOnly cookies for refresh)
   - Use short-lived access tokens
   - Implement token refresh
   - Clear auth on logout

2. **API Security**
   - Never expose API keys in frontend
   - Use environment variables
   - Validate all user inputs
   - Sanitize data before rendering

3. **XSS Prevention**
   - Use React's built-in escaping
   - Avoid dangerouslySetInnerHTML
   - Validate external URLs

### Accessibility

1. **Semantic HTML**
   ```tsx
   <nav>, <main>, <aside>, <footer>
   ```

2. **ARIA Labels**
   ```tsx
   <button aria-label="Add to cart">
     <ShoppingCart />
   </button>
   ```

3. **Keyboard Navigation**
   - Tab order
   - Focus indicators
   - Keyboard shortcuts

4. **Screen Reader Support**
   - Alt text for images
   - Descriptive link text
   - Form labels

### Testing

1. **Unit Tests** (Recommended setup)
   ```bash
   npm install --save-dev jest @testing-library/react
   ```

2. **Integration Tests**
   - Test user flows
   - API integration
   - State management

3. **E2E Tests**
   - Playwright or Cypress
   - Critical paths (checkout, login)

---

## 16. Troubleshooting

### Common Issues

#### 1. Build Errors

**Issue:** TypeScript errors during build

**Solution:**
```bash
# Check tsconfig.json
# Run type check
npx tsc --noEmit

# Ignore build errors (not recommended for production)
# Set in next.config.ts: typescript.ignoreBuildErrors = true
```

---

#### 2. Authentication Issues

**Issue:** Token refresh fails

**Solution:**
```typescript
// Check axios interceptor
// Verify refresh endpoint
// Check cookie settings (HttpOnly, SameSite, Secure)
```

**Issue:** User logged out unexpectedly

**Solution:**
```typescript
// Check token expiration times
// Verify refresh token rotation
// Check browser console for errors
```

---

#### 3. CORS Errors

**Issue:** Cross-origin request blocked

**Solution:**
```typescript
// Backend must allow origin
Access-Control-Allow-Origin: https://chihili.com
Access-Control-Allow-Credentials: true

// Next.js config headers
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "*" },
      ],
    },
  ];
}
```

---

#### 4. Image Loading Issues

**Issue:** Images not displaying

**Solution:**
```typescript
// Add domain to next.config.ts
images: {
  domains: ['your-cdn.com'],
}

// Check image paths
// Verify S3 bucket permissions
```

---

#### 5. State Not Updating

**Issue:** Zustand store not reflecting changes

**Solution:**
```typescript
// Ensure you're using the store correctly
const { data } = useMyStore(); // ✓ Correct
const data = useMyStore.getState().data; // ✗ Won't re-render

// Check if action is called
console.log('Calling action');

// Use devtools to inspect state
```

---

#### 6. Hydration Errors

**Issue:** "Text content does not match server-rendered HTML"

**Solution:**
```typescript
// Use useEffect for client-only rendering
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

// Or use dynamic import with ssr: false
const ClientComponent = dynamic(() => import('./Client'), {
  ssr: false
});
```

---

#### 7. Slow Performance

**Issue:** Page loads slowly

**Solution:**
```typescript
// Enable bundle analyzer
npm install @next/bundle-analyzer

// Check bundle size
npm run build
npm run analyze

// Optimize:
// 1. Lazy load components
// 2. Reduce image sizes
// 3. Enable caching
// 4. Use CDN
```

---

### Getting Help

#### Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **React Documentation:** https://react.dev
- **Zustand Documentation:** https://docs.pmnd.rs/zustand
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs

#### Internal Support

- **Development Team:** dev@chihili.com
- **Code Reviews:** Create PR and request review
- **Slack Channel:** #chihill-frontend
- **Issue Tracker:** GitHub Issues

---

## Appendix

### A. API Response Types

```typescript
// Standard API Response
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Paginated Response
interface PaginatedResponse<T> {
  statusCode: number;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

// Error Response
interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  success: false;
}
```

### B. Common Types

```typescript
// User Type
interface User {
  _id: string;
  mobile?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  role: 'user' | 'admin' | 'vendor';
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

// Product Type
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  discountPrice?: number;
  category: string | Category;
  variants: Variant[];
  stock: number;
  rating: number;
  reviewCount: number;
}

// Variant Type
interface Variant {
  sku: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  images?: string[];
}

// Cart Item Type
interface CartItem {
  productId: string | Product;
  variantSku: string;
  quantity: number;
  priceAtAdd: number;
  customSize?: object;
}
```

### C. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search bar |
| `Esc` | Close modal/drawer |
| `Arrow Keys` | Navigate carousel |
| `Enter` | Submit form |
| `Tab` | Navigate form fields |

### D. Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### E. Git Workflow

```bash
# Feature branch
git checkout -b feature/your-feature

# Commit with conventional commits
git commit -m "feat: add product filtering"
git commit -m "fix: resolve cart calculation bug"
git commit -m "docs: update API documentation"

# Push and create PR
git push origin feature/your-feature
```

---

## Changelog

### Version 0.1.0 (Current)

**Added:**
- Initial project setup with Next.js 15
- User authentication with JWT
- Product browsing and filtering
- Shopping cart functionality
- Wishlist feature
- Order management
- Payment integration
- Review system
- Responsive design

**In Progress:**
- Admin dashboard
- Vendor portal
- Advanced analytics
- Push notifications

**Planned:**
- PWA support
- Offline mode
- Live chat support
- AR try-on feature

---

## Contributors

- **Frontend Team Lead:** [Name]
- **Senior Developers:** [Names]
- **Developers:** [Names]
- **UI/UX Designer:** [Name]
- **QA Engineer:** [Name]

---

## License

© 2025 Chihili. All rights reserved.

---

**Document Version:** 1.0  
**Last Updated:** October 17, 2025  
**Maintained By:** Chihili Development Team

For any questions or clarifications about this documentation, please contact the development team at dev@chihili.com
