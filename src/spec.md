# Specification

## Summary
**Goal:** Implement role-based access control with Admin and Viewer roles, and ensure all production data is securely stored in backend stable storage.

**Planned changes:**
- Add role field ('admin' or 'viewer') to UserProfile, defaulting new users to 'viewer'
- Restrict all data modification operations (add/edit/delete) to admin role only
- Create backend query function to retrieve caller's role
- Create frontend hook to fetch and cache user role
- Update AuthGuard to enforce role-based route access (admin: all routes, viewer: dashboard only)
- Update Layout navigation menu to show only dashboard links for viewer users
- Hide or disable all data entry forms and edit/delete buttons for viewer users
- Add backend function for admins to update other users' roles
- Verify all production data uses stable storage for persistence across canister upgrades

**User-visible outcome:** Admin users can add, edit, and delete production data with full access to all features. Viewer users can only view dashboards and production data without any edit capabilities. The navigation menu and available actions automatically adjust based on user role.
