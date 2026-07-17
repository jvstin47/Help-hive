# Help Hive — Architectural Data Boundaries Documentation

This document clarifies the responsibilities of the state management libraries used in Help Hive, specifically distinguishing between React Context (`useContext`) and TanStack Query (`@tanstack/react-query`).

## Intent & Core Separation

Help Hive aims to separate **server-sourced data** from **client-only UI state**. This reduces sync bugs, eliminates duplicate caches, and ensures high availability of fresh data.

### 1. Server State (TanStack Query)
- **Responsibility**: Owning, caching, fetching, synchronizing, and updating any data that originates from a database or external backend server (Supabase).
- **Entities Covered**:
  - User Profiles (currently managed via the `useProfile` hook, which uses TanStack Query).
  - Request data (the list of requests, detailed request objects, active workflow states, and completion notes).
- **Target Architecture**: All read requests (lists, details) and mutations (creating a request, accepting a request, advancing request workflow stages) should be queried/mutated using TanStack Query hooks.

### 2. Client UI State (React Context)
- **Responsibility**: Managing ephemeral, local, UI-only states that do not persist to a database or do not need automatic server cache synchronization.
- **Entities Covered**:
  - Authentication sessions (currently managed via `AuthContext.tsx`).
  - Active theme modes (light/dark mode toggles).
  - Multi-step wizard drafts (e.g., intermediate form data as a requester is composing a request).
  - UI navigation states (e.g., active navigation tabs or open side drawers).

## Current Mappings & Technical Debt

Currently, the requests state is managed inside `RequestsContext.tsx`. This contains a hybrid of local mock state and active server fetching logic that runs in an effect on auth change. 

To avoid regressions, the components continue to read from the Context. However, the boundary has been flagged in:
- `RequestsContext.tsx`
- `NewRequest.tsx`
- `RequesterDashboard.tsx`
- `RequestDetails.tsx`
- `VolunteerDashboard.tsx`
- `VolunteerRequestDetails.tsx`
- `RequestDiscovery.tsx`

Future refactoring should migrate the server logic inside `RequestsContext.tsx` and these components to custom TanStack Query hooks.
