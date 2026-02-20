# Specification

## Summary
**Goal:** Add a Daily Production Report system to track operation-wise production data with 17 predefined manufacturing operations.

**Planned changes:**
- Create Daily_Production_Report data structure with fields: id, date, operation_name, today_production, total_completed, despatched, in_hand
- Populate with 17 default operation names: Boxing, Welding/Finishing, Rear Wall, Front Wall, Side Wall, Roof, Rear Door, Blasting & Primer, Final Paint, Gasket, DLM, Plywood, Floor Screw, Decal, Data Plate, Sikha, Black Paint
- Implement backend CRUD operations for production report management
- Build frontend form for entering/editing daily production data with date picker and operation dropdown
- Create sortable, filterable table view displaying all production records with edit and delete actions
- Add "Daily Production Report" navigation menu item

**User-visible outcome:** Administrators can track daily production metrics for each operation through a dedicated page with form entry and table management, accessible via the main navigation menu.
