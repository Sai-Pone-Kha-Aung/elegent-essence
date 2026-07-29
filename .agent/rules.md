# Next.js, React TypeScript Agent Rules

## Project Context

- Use React 19+ and Next.js 16+ with TypeScript strict mode enabled in `tsconfig.json`.
- Use functional components exclusively — never class components.
- Use TypeScript strictly and safely with proper type annotations and interfaces. Avoid `any` type.
- Use modern React 19+ features like Server Components, Client Components, and Transitions where appropriate.

## General Coding Standards

- Use Tailwind CSS for all styling — avoid CSS-in-JS libraries or custom CSS files unless strictly necessary.
- Compose dynamic Tailwind classes safely using utility functions like `clsx` or `tailwind-merge` (`cn()`).
- Use semantic HTML5 elements (article, section, aside, nav, header, footer, main).
- Apply accessibility (a11y) best practices: use ARIA roles, proper heading structure, alt text for images, focus management.
- Use modern JavaScript ES6+ features (arrow functions, destructuring, spread syntax, promises, async/await).
- Apply reusable components instead of duplicating code.
- Keep component files under 200–300 lines of code. Split larger components into smaller sub-components.
- Keep non-component utility or module files under 500 lines.
- Never use `any` type. Always use proper type annotations and interfaces.
- Prefer named exports. Use default exports only for page-level route components.
- Co-locate tests, stories, and styles with the component file.

## TypeScript Patterns

- Enable `strict: true`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` in `tsconfig.json`.
- Never use `any` — use `unknown` with type guards: `if (typeof val === 'string') { processString(val) }`.
- Use discriminated unions for component state machines: `type State = { status: 'idle' } | { status: 'error'; message: string }`.
- Use generic types for reusable hooks: `function useList<T>(initial: T[]): { items: T[]; add: (item: T) => void }`.
- Annotate all exported function return types explicitly — never rely on inference for public APIs.
- Use `React.ComponentProps<typeof Component>` to derive prop types when extending existing components.
- In React 19, `ref` is a regular prop — no `forwardRef` needed. Accept it directly in the props interface.

## App Router Conventions

- Use `app/` for all routes. Use route groups `(group)/` for layout sharing without URL segments.
- Co-locate `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx` per route segment.
- Use `template.tsx` instead of `layout.tsx` when you need fresh state on each navigation.
- Use parallel routes (`@slot`) for independent page sections with their own loading/error states.
- Use intercepting routes (`(.)`, `(..)`) for modal patterns that retain the background page URL.

## React Server Components

- Default every component to a Server Component. Add `'use client'` only when unavoidable.
- Reasons to use `'use client'`: event handlers (`onClick`), React hooks (`useState`, `useEffect`), browser APIs (`localStorage`, `ResizeObserver`).
- Never import server-only modules (Prisma, DB clients, `'server-only'`) in Client Components.
- Compose RSC and Client Components by passing RSC output as `children` to a Client Component wrapper.
- Use `React.Suspense` boundaries to stream parts of the page. Provide meaningful `fallback` skeletons.

## Data Fetching

- Fetch data in `async` Server Components directly. No `useEffect`, no client-side `fetch` to internal APIs.
- Deduplicate identical fetch calls with `React.cache()`: `const getUser = cache(async (id: string) => prisma.user.findUnique(...))`.
- Use the `'use cache'` directive or `unstable_cache(fn, ['cache-key'], { revalidate: 60, tags: ['users'] })` for long-lived cached data.
- Use `connection()` from `next/server` inside functions that must opt out of static rendering and always return fresh data.
- Waterfall fetches are blocked during SSR — parallelize with `Promise.all([fetchUser(id), fetchPosts(id)])`.

## Server Actions

- Declare Server Actions with `'use server'` at the top of a server-only file or inline in RSC.
- Validate all inputs with Zod at the start of every Server Action. Return early with error details on failure.
- Return typed results: `{ success: true, data: T } | { success: false, error: string }`. Never throw from Server Actions.
- Call `revalidatePath('/path')` or `revalidateTag('tag')` after successful mutations.
- Bind Server Actions to forms with the `action` prop: `<form action={createPostAction}>`.
- Use `useActionState` (React 19) for progressive enhancement with pending, error, and result state.

## Hooks

- Follow the Rules of Hooks strictly. Never call hooks inside conditions, loops, or nested functions.
- Use `useState` for simple local state; `useReducer` for complex state with multiple transitions.
- Use `useMemo` for expensive computations that depend on changing inputs — not for every value.
- Use `useCallback` for functions passed as props to memoized child components.
- Clean up effects properly — return a cleanup function from `useEffect` for subscriptions and timers.
- Avoid `useEffect` for derived state — compute during render instead.

## Component Patterns

- Use composition over configuration — prefer `children` over boolean props like `isLarge` or `isRound`.
- Use compound components with shared context for complex UI like `<Select>`, `<Tabs>`, and `<Accordion>`.
- Use `use(Context)` in React 19 instead of `useContext` — it can be called conditionally.
- Extract repeated JSX patterns into sub-components rather than helper render functions.
- Use `React.memo()` on components that receive stable primitive props and render frequently.

## Forms & Validation

- Use React Hook Form for form state management with Zod schemas for validation.
- Share Zod schemas between client validation and server-side parsing to guarantee consistency.
- Use `resolver: zodResolver(schema)` in `useForm` to connect RHF with Zod validation.
- Show inline error messages from `formState.errors`. Disable the submit button while `isSubmitting`.
- Use `useFormContext` from RHF for deeply nested form inputs to avoid prop drilling.

## State Management

- Keep state as close to its usage as possible — do not lift unnecessarily.
- Use React Context for cross-cutting concerns (theme, auth, locale) — not for frequently updating state.
- Use Zustand for global client state. Use TanStack Query for server-fetched data.
- Never store derived data in state — compute during render or in a selector.

## Routing & Navigation

- Use `next/link` for all internal navigation. Use `router.push()` from `useRouter` only for programmatic navigation.
- Use `next/navigation`'s `useSearchParams`, `usePathname`, `useParams` in Client Components. Read them server-side from page props.
- Implement dynamic routes with `[param]` for single segments and `[...params]` for catch-all segments.
- Prefetch links automatically with `next/link`. Use `prefetch={false}` for links the user is unlikely to follow.

## Error Handling

- Add `error.tsx` at each route segment that may fail. Accept `error: Error` and `reset: () => void` props.
- Add `not-found.tsx` for 404 states. Call `notFound()` from `next/navigation` to trigger it.
- Log errors in `error.tsx` to an external service (Sentry, Axiom) before rendering the fallback UI.
- Validate all user inputs with Zod on the server in Server Actions. Return structured field errors.

## Performance

- Use `next/image` for all raster images. Set `sizes` to match the rendered layout.
- Use `next/font` with `display: 'swap'` for web fonts. Use CSS variable mode for Tailwind integration.
- Lazy-load Client Components with `dynamic(() => import(...), { loading: () => <Skeleton /> })`.
- Set cache policies with `export const revalidate = 3600` at the route segment level.
- Use `export const dynamic = 'force-static'` on pages that have no dynamic data.

## Security

- Validate and sanitize all data in Server Actions and Route Handlers before processing.
- Add Content Security Policy headers in `next.config.ts` via `headers()`.
- Use `NEXT_PUBLIC_` prefix only for env vars that are safe to expose to the browser.
- Never perform authorization checks only on the client — always verify on the server.
- Protect Server Actions with auth checks: read the session and verify the user owns the resource.

## Testing Requirements

- Test Server Components with `vitest` by rendering them as async functions: `const result = await MyPage({ params })`.
- Test Client Components with React Testing Library. Mock `next/navigation` hooks with `vi.mock`.
- Write Playwright end-to-end tests for critical user flows: auth, checkout, form submission.
- Test Server Actions directly: call the function with typed inputs, assert returned results and side effects.
