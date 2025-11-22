# RGB Test – Client (Next.js Frontend)

Frontend part of the RGB test task: a minimal CRM UI for managing **Clients** and **Deals**, built on top of the NestJS API.

---

## Tech Stack

- **Next.js** (App Router, `app/` directory)
- **React** / **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** for base components
- **TanStack Query v5** for server state
- **axios** for HTTP
- **React Hook Form** + **zod** for forms & validation
- Custom `useKeyboardShortcuts` hook

---

## Features

- **Clients page**:

  - Create client (name, email, phone)
  - Paginated list of clients (`?page=` in URL)
  - Link to client details
  - Delete client
  - Keyboard shortcuts (single-key, no modifiers)

- **Client detail page**:

  - Client info (name, email, phone)
  - List of client deals
  - Create new deal (title, amount, status)
  - Keyboard shortcuts

- **Deals page**:

  - List of all deals
  - Filters:
    - by status (`NEW | IN_PROGRESS | WON | LOST | ALL`)
    - by client
  - Filters are stored in query string (`?status=&clientId=`)
  - Keyboard shortcuts

- **Dark, minimalistic UI**:
  - `bg-slate-950` background
  - Cards `bg-slate-900/80` with subtle borders & shadow
  - Soft grayscale palette, subtle hover states

---

## Environment Variables

Create `.env.local` in the **client** root:

```env
NEXT_PUBLIC_API_URL=http://localhost:4200
```

This is the base URL used by the `axios` instance in `lib/api/*`.

---

## Project Structure (client)

```txt
.
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx         # maybe a simple landing / redirect
│  │  ├─ clients/
│  │  │  ├─ page.tsx      # list + create client
│  │  │  └─ [id]/
│  │  │     └─ page.tsx   # client detail + deals
│  │  └─ deals/
│  │     └─ page.tsx      # deals list + filters
│  ├─ components/
│  │  ├─ clients/
│  │  │  ├─ clients-header.tsx
│  │  │  ├─ clients-create-form.tsx
│  │  │  ├─ clients-table.tsx
│  │  │  ├─ clients-pagination.tsx
│  │  │  ├─ client-header.tsx
│  │  │  ├─ client-deals-form.tsx
│  │  │  └─ client-deals-table.tsx
│  │  ├─ deals/
│  │  │  ├─ deals-header.tsx
│  │  │  ├─ deals-filters.tsx
│  │  │  └─ deals-table.tsx
│  │  └─ ui/
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ input.tsx
│  │     ├─ table.tsx
│  │     ├─ badge.tsx
│  │     └─ select.tsx
│  ├─ hooks/
│  │  └─ use-keyboard-shortcuts.ts
│  ├─ lib/
│  │  ├─ api/
│  │  │  ├─ clients.ts
│  │  │  └─ deals.ts
│  │  ├─ axios-instance.ts
│  │  └─ query-keys.ts
│  └─ types/
│     ├─ client.ts
│     └─ deal.ts
├─ tailwind.config.ts
└─ package.json
```

---

## Installation & Scripts

Install dependencies:

```bash
# with pnpm
pnpm install

# or with npm
npm install
```

Run the development server:

```bash
pnpm dev
# or
npm run dev
```

By default:

- Client runs at: `http://localhost:3000`
- It expects API at: `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:4200`)

---

## API Integration

All API calls go through small wrappers in `src/lib/api`.

### `src/lib/api/clients.ts`

- `fetchClients(page: number, limit: number)`  
  Calls `GET /clients?page=&limit=` and expects:

  ```ts
  export interface PaginatedClientsResponse {
  	data: Client[]
  	meta: {
  		total: number
  		page: number
  		limit: number
  		totalPages: number
  	}
  }
  ```

- `fetchClient(id: string)`  
  Calls `GET /clients/:id` and returns a `Client` with `deals`.

- `createClient(payload: { name: string; email: string; phone?: string })`  
  Calls `POST /clients`.

- `deleteClient(id: string)`  
  Calls `DELETE /clients/:id`.

### `src/lib/api/deals.ts`

- `fetchDeals(filters?: { status?: DealStatus; clientId?: string })`  
  Calls `GET /deals?status=&clientId=` and returns `Deal[]`.

- `createDeal(payload: { title: string; amount: number; status: DealStatus; clientId: string })`  
  Calls `POST /deals`.

---

## State Management & Data Fetching

### TanStack Query v5

- **Query keys** are centralized in `src/lib/query-keys.ts`, e.g.:

  ```ts
  queryKeys.clients(page, limit)
  queryKeys.client(id)
  queryKeys.deals(filters)
  ```

- `ClientsPage` uses:

  ```ts
  const { data, isLoading, isError } = useQuery({
  	queryKey: queryKeys.clients(page, PAGE_SIZE),
  	queryFn: () => fetchClients(page, PAGE_SIZE),
  	placeholderData: keepPreviousData,
  })
  ```

  So when paginating, previous page data is kept while new page loads.

- Client and deal mutations call `invalidateQueries` to refresh affected queries.

---

## Forms & Validation

Forms use **React Hook Form** + **zod** via `zodResolver`.

### Client create form

Schema:

```ts
const createClientSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email'),
	phone: z.string().optional(),
})
```

Handled in `ClientsCreateForm`:

- Inline error messages under each input
- After successful create:
  - Invalidates clients query
  - Resets the form
  - Focuses the name input again

### Deal create form

Schema:

```ts
const statusOptions = ['NEW', 'IN_PROGRESS', 'WON', 'LOST'] as const

const createDealSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	amount: z.number().min(1, 'Amount must be at least 1'),
	status: z.enum(statusOptions),
})
```

Handled in `ClientDealsForm`:

- Amount field uses `valueAsNumber` to map input string to number
- After success: invalidate client + deals queries and reset form

---

## URL State (Pagination & Filters)

### Clients page

Route: `/clients`

- Uses query param `?page=` for pagination.
- Pagination is fully synced with URL:
  - When you go to page 2, URL becomes `/clients?page=2`
  - Refresh keeps you on the same page

### Deals page

Route: `/deals`

Query parameters:

- `status`: `"ALL" | "NEW" | "IN_PROGRESS" | "WON" | "LOST"`
- `clientId`: `"ALL" | <client-uuid>`

Examples:

- `/deals` → all deals, all statuses, all clients
- `/deals?status=NEW` → only NEW deals
- `/deals?clientId=<uuid>` → only deals for that client
- `/deals?status=WON&clientId=<uuid>` → combined filter

Filters UI is driven by these query params, so refresh preserves the current filter.

---

## Keyboard Shortcuts

All shortcuts are implemented via a reusable hook:

### `src/hooks/use-keyboard-shortcuts.ts`

- Attaches a `keydown` listener on `window`
- Takes a map of keys → callbacks
- Normalizes both lowercase & uppercase (`"n"` triggers on `N`, etc.)
- Does **not** override input fields unnecessarily

### Clients page – `/clients`

Implemented in `ClientsPage` and `ClientsCreateForm`:

- `N` – focus the **"Name"** field in the create client form
- `D` – navigate to **Deals** page (`/deals`)
- `ArrowLeft` – previous page (if `page > 1`)
- `ArrowRight` – next page (if `page < totalPages`)

### Client detail page – `/clients/[id]`

- `N` – focus the **"Deal title"** field
- `B` – go **back to clients** (`/clients`)

### Deals page – `/deals`

- `C` – go to **Clients** page (`/clients`)

---

## UI & Styling

- Global background: `bg-slate-950`
- Cards: `rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm`
- Text:
  - primary: `text-slate-50`
  - secondary: `text-slate-400`
- Buttons:
  - main: `bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200`
- Tables:
  - subtle row hover: `hover:bg-slate-900/70`
  - headers: `text-slate-400`
- Inputs:
  - `bg-slate-950 text-slate-50 border border-slate-700 placeholder:text-slate-500`

Overall look: **minimal dark dashboard**, fully grayscale with soft contrasts.

---

## How to Run Everything Together

1. **Start the server** (in server project):

   ```bash
   docker-compose up -d        # start Postgres
   pnpm install                # or npm install
   pnpm run typeorm -- migration:run -d db/data-source.ts
   pnpm start:dev
   ```

   Server at: `http://localhost:4200`

2. **Start the client** (in client project):

   ```bash
   pnpm install                # or npm install
   # ensure NEXT_PUBLIC_API_URL=http://localhost:4200
   pnpm dev
   ```

   Client at: `http://localhost:3000`

Now you have:

- `/clients` – manage clients
- `/clients/:id` – client detail + deals
- `/deals` – manage deals with filters
