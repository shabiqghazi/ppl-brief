# Changelog — Periode Modal UI Improvements

## Date: 2026-05-26

### Summary
Applied UI/UX improvements to the Create Period modal (`admin/periode/index.html`) based on the mockup design to enhance the Prerequisites section with better functionality and styling.

---

## Changes Made

### 1. **Prerequisites Table Structure**
- **Before**: 3 columns (Program Studi, Kode Mata Kuliah, Nilai Minimum)
- **After**: 5 columns (Program Studi, Kode Mata Kuliah, **Tipe Prasyarat**, Nilai Minimum, Aksi)

### 2. **New "Tipe Prasyarat" Field**
Added a new prerequisite type selector with two options:
- `completed` — Mata kuliah harus sudah lulus dengan nilai minimum tertentu
- `enrolled` — Mahasiswa cukup terdaftar dalam mata kuliah tersebut (nilai minimum tidak diperlukan)

**Field Behavior**:
- When type = `completed` → Nilai Minimum field is **visible and required**
- When type = `enrolled` → Nilai Minimum field is **hidden and disabled**

### 3. **Enhanced Styling**
- Improved column widths for better visual hierarchy (20%, 30%, 20%, 20%, 10%)
- Better label sizing and spacing
- Delete button now has `delete-prereq-btn` class with hover effects:
  - Light red background on hover (#fee2e2)
  - Smooth transitions

### 4. **JavaScript Functions Added**
- **`toggleGradeField(programId, courseIdx, typeValue)`**
  - Handles show/hide logic for Nilai Minimum field based on prerequisite type
  - Disables select field when type = "enrolled"
  - Clears field value when toggling to "enrolled"

### 5. **Updated Validation Logic**
- `validatePrerequisites()` now validates:
  - Course code is required
  - Prerequisite type is required
  - Nilai Minimum is required **only when type = "completed"**
  - Detects and prevents duplicate course codes per program

### 6. **Updated Data Collection**
- `collectPrerequisitesData()` now collects:
  - `course_code` (string)
  - `prerequisite_type` (string: "completed" | "enrolled")
  - `minimum_grade` (only when prerequisite_type = "completed")

### 7. **CSS Enhancements**
```css
/* Grid template updated for 4 input columns */
.course-row {
  grid-template-columns: 1.5fr 1.2fr 1.2fr 40px; /* was: 1fr 1fr 32px */
}

/* New classes added */
.prerequisite-type-hidden { display: none; }
.delete-prereq-btn { /* styled delete button */ }
```

---

## UI/UX Improvements

### Mockup Features Implemented
✅ Show/hide Nilai Minimum based on Tipe Prasyarat selection
✅ Dynamic row management (add/delete prerequisites)
✅ Better visual hierarchy with improved spacing
✅ Responsive button styling
✅ Form validation specific to prerequisite type
✅ Enhanced error messaging

### Not Yet Implemented (Future)
- Tab-based navigation (Informasi Dasar | Mata Kuliah Prasyarat | Milestone)
- More advanced styling consistent with mockup design
- Animation effects for show/hide transitions

---

## Backward Compatibility
✅ Existing code remains functional
✅ New fields are optional in validation
✅ Mock data structures updated to support `prerequisite_type` field
✅ Graceful fallback for empty prerequisites

---

## Testing Recommendations
- Test selecting different prerequisite types and verify Nilai Minimum visibility
- Validate error messages for partially filled rows
- Test add/delete row functionality with mixed prerequisite types
- Verify form submission with various prerequisite combinations
- Test duplicate course code detection

---

## Files Modified
- `/admin/periode/index.html` — Main updates to modal functionality and styling

## Related Files
- `/create-period-modal.html` — Standalone mockup reference (CSS structure example)
