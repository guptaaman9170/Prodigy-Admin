# PulseStack PRO: Product Management Dashboard

A modern, enterprise-grade Product Admin Dashboard built with **Next.js (App Router)**, **React 19**, **Tailwind CSS**, and **Axios**, powered by the [DummyJSON](https://dummyjson.com) API. Styled with the clean, light **PulseStack PRO** enterprise design system.

Live Repository: [https://github.com/guptaaman9170/Prodigy-Admin](https://github.com/guptaaman9170/Prodigy-Admin)

---

## 🚀 Features Completed

### 1. Enterprise UI & Responsive Navigation (PulseStack PRO)
- [x] **Collapsible Sidebar**: Fixed desktop sidebar with collapsible mobile drawer, categorized into MAIN and MANAGEMENT sections.
- [x] **Top Header**: Breadcrumb navigation (`PulseStack > Store Catalog > Products`), global search with `⌘K` shortcut, unread notifications bell, "+ New Product" button, and user profile with sign-out.
- [x] **Executive Dashboard Overview**: Live revenue & inventory velocity charts, category share donut chart with taxonomy distribution, recent products snippet, and real-time system activity log.
- [x] **KPI Metrics Cards**: Top-level performance indicators for Total Products, Active Categories, Average Rating, and Critical Low Stock items.
- [x] **Dual View Modes**: Seamless toggle between Table View and Card/Grid View.

### 3. Custom Pagination (Zero Third-Party Libraries)
- [x] **Server Pagination**: Paginated data loading via `limit` and `skip`.
- [x] **Dynamic Range Text**: Accurately shows item range, e.g., `"Showing 21–40 of 194"`.
- [x] **Page Size Options**: Selectable page sizes (`10`, `20`, `50`).
- [x] **Navigation Controls**: Previous/Next buttons, first/last shortcuts, and smart numeric page numbers with ellipsis (`...`).

### 4. Debounced Search & Race-Condition Immunity
- [x] **Debounced Input**: Waits 400ms after the user stops typing before querying `/products/search?q=`.
- [x] **Automatic Reset**: Resets current page to 1 whenever search query changes.
- [x] **Race-Condition Protection**: Employs `AbortController` combined with a monotonic request sequence ID so older responses (even with artificial latency such as `&delay=2000`) never overwrite newer results.

### 5. Category Filtering & Multi-Field Sorting
- [x] **Category Filter**: Populated dynamically from `/products/categories`.
- [x] **Sort Capabilities**: Sort by **Title**, **Price**, **Rating**, or **Stock** in **Ascending** or **Descending** order.
- [x] **Sort Headers**: Interactive table column headers with ascending/descending toggle indicators.

### 6. Product Details (`/products/[id]`)
- [x] **Dynamic Detail Route**: Detailed page at `/products/[id]` featuring an interactive multi-image gallery.
- [x] **Full Specs & Policies**: Displays warranty information, shipping time, return policy, SKU, and discount percentages.
- [x] **Customer Reviews**: Lists all buyer reviews with star ratings, reviewer names, dates, and comments.
- [x] **Not Found Handling**: Graceful 404 screen when navigating to a non-existent or invalid product ID with a return link.

### 7. Simulated CRUD (Add, Edit, Delete)
- [x] **Create Product**: Modal form with strict validation (required fields, price > 0, stock ≥ 0) calling `POST /products/add`.
- [x] **Edit Product**: Pre-filled modal form calling `PUT /products/[id]`.
- [x] **Delete Product**: Confirmation dialog with destructive warning calling `DELETE /products/[id]`.
- [x] **Local State Overlay**: Because DummyJSON mock endpoints do not persist changes to the server database, an **Optimistic Local Storage Overlay** persists all created, modified, and deleted items across page reloads and detail views.
- [x] **Reset Demo Changes**: A reset button in the header allows evaluators to restore clean raw API data at any time.

### 8. Loading, Empty, and Error States
- [x] **Loading Skeletons**: Shimmer skeleton table rows on desktop and skeleton cards on mobile.
- [x] **Empty State**: Polished empty state with search icon and a "Clear Filters" action when 0 items match.
- [x] **Error State with Retry**: Clear error notification with an interactive **"Retry Request"** button.

### 9. URL State Synchronization & Safe Clamping
- [x] **URL as Single Source of Truth**: `page`, `limit`, `q`, `category`, `sortBy`, and `order` are synchronized with URL search parameters.
- [x] **Resilience**: Invalid query parameters like `?page=abc` or `?page=999` are safely parsed and clamped, preventing crashes.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [DummyJSON](https://dummyjson.com)

---

## ⚙️ Setup and Running Locally

### Prerequisites
- Node.js `v18+` (tested on Node v20/v24)
- npm `v9+`

### Installation
```bash
# Clone the repository
git clone https://github.com/guptaaman9170/Prodigy-Admin.git

# Enter project directory
cd Prodigy-Admin

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
# Verify TypeScript & compile production bundle
npm run build

# Start production server
npm run start
```

---

## 🔑 Demo Credentials

| Field | Value |
|---|---|
| **Username** | `emilys` |
| **Password** | `emilyspass` |

*(You can also click the **"Fill Demo"** button on the login screen to auto-fill)*

---

## 📝 Technical Note & Architecture Rationale

### 1. Architectural Decisions

#### A. Shared Axios Setup (`src/lib/axios.ts`)
A centralized Axios instance was created with `baseURL: 'https://dummyjson.com'`. A request interceptor reads the auth token from `localStorage` and injects `Authorization: Bearer <token>`. A response interceptor handles 401 Unauthorized responses by clearing stored credentials and redirecting to the login screen, while formatting server error messages consistently across the application.

#### B. Search & Category Concurrency Decision
The DummyJSON API provides separate endpoints: `/products/search?q={query}` and `/products/category/{category}`. DummyJSON does not natively support filtering by category and searching by keyword simultaneously (it ignores the category parameter when `q` is supplied, and vice-versa).
**Our solution**: When both a search keyword and a category filter are selected, our custom `useProducts` hook queries the search endpoint and performs client-side category filtering on the matching dataset. A transparent informative pill is displayed in the UI:
> *"Note: Compound search active. DummyJSON searches across catalog; results are filtered to category client-side."*

#### C. Local State Overlay for Simulated CRUD
DummyJSON simulates `POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id`, returning success payloads without mutating the server database. To give users a genuine CRUD dashboard experience:
- Created products are stored in a local overlay and prepended to catalog listings.
- Edited products have their modified fields overlaid onto the server data.
- Deleted products are added to a deletion set and filtered out of views and detail pages.
- This overlay persists in `localStorage` across page reloads and includes a **"Reset Demo Changes"** action for reviewers.

#### D. Race Condition Mitigation
When typing rapidly or when requests resolve out-of-order (testable with `&delay=2000`), outdated search queries can overwrite newer results. We solved this with a two-layer defense:
1. `AbortController`: Whenever a new search is initiated, any prior pending HTTP request is aborted immediately.
2. Monotonic Request ID: An incremental reference counter ensures that only responses matching the most recent request ID are processed by state updaters.

### 2. A Problem Faced and How It Was Fixed
**The Challenge**: Next.js App Router query synchronization with client state caused potential pagination out-of-bounds when changing search queries or page sizes. For example, if a user was on page 10 and searched for "phone" (which only has 23 items, or 3 pages), keeping page 10 produced an empty view and an inconsistent URL state.
**The Solution**: In `src/hooks/useProducts.ts`, we implemented automatic page resets on filter/search modifications (`setSearch` and `setLimit` automatically reset `page=1`). Additionally, we built safe page clamping that inspects `totalPages` against the active `page` parameter, automatically adjusting the URL without breaking browser history or causing infinite update loops.

### 3. How AI Assisted
AI accelerated the development workflow by:
- Quickly synthesizing the live DummyJSON API schemas and endpoint behaviors.
- Formulating clean TypeScript interfaces for products, categories, reviews, and query parameters.
- Scaffolding edge case test scenarios (such as compound search, aborted request handling, and safe query clamping).
- Generating responsive Tailwind CSS layout tokens and skeleton shimmer animations.
