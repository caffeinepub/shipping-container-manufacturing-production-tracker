# Specification

## Summary
**Goal:** Implement dynamic cumulative Total Completed tracking and optional batch dispatch entry for daily production reports.

**Planned changes:**
- Change Total Completed field to read-only calculated field that automatically computes cumulative running total from all previous production records for the selected operation
- Update backend to automatically calculate and store cumulative total_completed value when creating or updating daily production reports
- Change In Hand field to read-only calculated field (Total Completed - Despatch) that updates automatically
- Add optional Batch Dispatch Entry field at top of form that auto-populates Despatch field for all 17 operations when filled
- Update ContainerDailyReportPage to display calculated In Hand values for each operation row

**User-visible outcome:** Users see Total Completed as an automatically calculated cumulative total (no manual entry), In Hand calculated automatically as the difference between Total Completed and Despatch, and can optionally enter a single dispatch value that applies to all operations at once.
