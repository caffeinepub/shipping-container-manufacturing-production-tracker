# Specification

## Summary
**Goal:** Implement a fixed 17-operation system with locked operation list that cannot be modified by users.

**Planned changes:**
- Create Operations data structure in backend with 17 predefined operations (Boxing, Welding/Finishing, Rear Wall, Front Wall, Side Wall, Roof, Rear Door, Blasting & Primer, Final Paint, Gasket, DLM, Plywood, Floor Screw, Decal, Data Plate, Sikha, Black Paint) stored in stable variables
- Add getAllOperations backend query function to return all 17 operations in sequential order
- Remove any backend functions that allow adding, deleting, or modifying operations
- Update createDailyProductionReport to validate operation_id is between 1-17
- Update updateDailyProductionReport to prevent changes to operation_id field
- Update ContainerDailyReportEntryPage to display all 17 operations in sequential order using getAllOperations
- Update ContainerDailyReportPage to show all 17 operations with zero/empty values for operations without data
- Update all production dashboard and history components to display operations in predefined sequential order 1-17
- Ensure useGetAllOperations hook fetches and returns all 17 operations in correct order
- Add validation in ContainerDailyReportEntryPage save functionality to ensure all operation_ids are valid (1-17)

**User-visible outcome:** Admin users can view and enter production data for exactly 17 predefined operations in a fixed sequential order. The operations list cannot be added to, deleted from, or modified, ensuring consistent reporting across all production views.
