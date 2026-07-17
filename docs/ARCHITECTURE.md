# Help Hive - Architecture Documentation

This document explains the core systems established in Phase 2 for Help Hive. This ensures future developers can maintain and extend the platform safely.

## Folder Responsibilities
- `src/app/`: Application entry points, router configuration, and protected route wrappers.
- `src/features/`: Feature modules (e.g., Auth, Profile). Each feature owns its UI components.
- `src/services/`: Abstractions for external interactions. UI components never call Supabase or external APIs directly; they call the services layer.
- `src/hooks/`: Global, reusable custom React hooks (e.g., `useAuth`, `useProfile`).
- `src/contexts/`: React Contexts for global app state (e.g., `AuthContext`).
- `src/utils/`: Pure helper functions, specifically centralized error handling and Zod validation schemas.

## Service Architecture
We abstract all backend communication. For instance:
- `AuthService` handles all Supabase Auth interactions.
- `ProfileService` queries the `profiles` table.
- **Why?** If we ever switch backends, or if Supabase changes their SDK, we only update the Service classes, not our UI components.

## Authentication Flow & Profile Lifecycle
1. **Role Selection**: Guests land on `/role-selection` to pick 'requester' or 'volunteer'.
2. **Registration**: They sign up on `/register` (passing the selected role). The role is stored in Supabase Auth metadata.
3. **Session Context**: `AuthProvider` listens to auth state changes and stores the current session.
4. **Profile Creation**: When the user logs in, `useProfile` uses `ProfileService.ensureProfileExists()`. If no profile exists in the `profiles` table, it creates one using the metadata captured during signup.

## Role System
Roles are stored directly in the `profiles` table.
- `'requester'`: Can post help requests.
- `'volunteer'`: Can accept and complete help requests.
- `'admin'`: Can moderate the platform.
The `useRole` hook exposes boolean flags (`isRequester`, `isVolunteer`) for UI logic.
The `ProtectedRoute` wrapper enforces role-based access at the routing level, intercepting unauthorized access and redirecting gracefully.

## Error Handling
We intercept all Supabase and network errors through `handleApiError` in `src/utils/errors.ts`. This translates scary cryptographic backend errors (or network failures) into friendly, human-readable instructions suitable for senior citizens.
