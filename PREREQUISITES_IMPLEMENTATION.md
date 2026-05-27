# Prerequisites Configuration Implementation
## Modal Create Period — Mata Kuliah Prasyarat

**Date**: 2026-05-27  
**Status**: Complete (UI/UX Implementation)

---

## Overview

Implemented comprehensive prerequisites configuration system for the Create Period modal. Admin can now:
- Load default prerequisites based on selected PPL type
- Manually manage prerequisites per program studi
- Mark configurations as default for future PPL types
- Support two prerequisite types: `completed` (with minimum grade) and `enrolled` (without grade)

---

## Implementation Details

### 1. HTML Structure Changes

#### Prerequisites Section
```html
<div id="prerequisites-container">
  <!-- Info message -->
  <div class="prerequisites-info">
    ℹ️ Atur mata kuliah prasyarat...
  </div>

  <!-- Select all -->
  <div class="prerequisites-select-all">
    <input type="checkbox" id="select-all-programs" onchange="toggleAllPrograms(this)">
    <label>Centang semua program studi</label>
  </div>

  <!-- Programs list -->
  <div id="study-programs-list"></div>

  <!-- Set as default -->
  <div class="set-default-checkbox-group">
    <input type="checkbox" id="set-default-checkbox" disabled>
    <label id="set-default-label">...</label>
  </div>
</div>
```

#### Program Section Structure
Each program studi has:
- **Checkbox** — Toggle inclusion in payload
- **Title** — Program studi name (read-only)
- **Courses Container** — Visible only when checked
  - Dynamic rows for each prerequisite course
  - "+" button to add new prerequisites
  - Empty state message when no courses

#### Course Row Structure
Each course row has:
- **Kode Mata Kuliah** (input text) — Required
- **Tipe Prasyarat** (select) — `completed` | `enrolled`
- **Nilai Minimum** (select A-E) — Conditional visibility
- **Delete button** (×) — Remove row

---

### 2. CSS Enhancements

**New Classes**:
```css
.prerequisites-program-section { }
.prerequisites-program-header { }
.prerequisites-program-courses { }
.prerequisites-program-courses.active { }
.prerequisite-course-rows { }
.prerequisite-course-row { }
.prerequisite-course-row.empty-state { }
.prerequisite-course-field { }
.add-prerequisite-row-btn { }
.prerequisites-select-all { }
.prerequisites-info { }
.set-default-checkbox-group { }
```

**Grid Layout**:
```css
.prerequisite-course-row {
  grid-template-columns: 1.5fr 1.2fr 1.2fr 40px;
  /* Course Code | Type | Grade | Delete */
}
```

---

### 3. JavaScript Functions

#### Core Functions

**`renderPrerequisitesV2(prerequisites, pplTypeId)`**
- Renders all programs with checkboxes
- Auto-checks programs with non-empty courses
- Creates course rows dynamically
- Updates "set as default" label

**`createCourseRow(programId, index, course = {})`**
- Creates single course row DOM element
- Handles conditional grade field visibility
- Binds event handlers for type changes
- Pre-fills data from course object

**`toggleProgramCourses(programId, isChecked)`**
- Shows/hides courses container when checkbox changes
- Adds empty row when checked with no courses
- Clears all courses when unchecked
- Updates "select all" state

#### Row Management

**`addPrerequisiteRowV2(programId)`**
- Adds new blank course row
- Removes empty state message
- Assigns correct index

**`deletePrerequisiteRowV2(programId, index)`**
- Removes course row
- Shows empty state if no rows remain

#### Field Logic

**`toggleGradeFieldV2(programId, courseIndex, typeValue)`**
- Shows/hides Nilai Minimum based on type
- Disables/enables grade select
- Clears value on toggle to "enrolled"

**`toggleAllPrograms(checkbox)`**
- Checks/unchecks all program checkboxes
- Triggers change event for each

**`updateSelectAllState()`**
- Updates "select all" checkbox state:
  - Checked if all programs checked
  - Unchecked if no programs checked
  - Indeterminate if some checked

#### Data Handling

**`collectPrerequisitesDataV2()`**
Returns payload structure:
```javascript
[
  {
    study_program_id: "sp-001",
    courses: [
      {
        course_code: "MAT101",
        type: "completed",
        minimum_grade: "B"
      },
      {
        course_code: "PPL-MAT-2024",
        type: "enrolled"
        // minimum_grade omitted for enrolled
      }
    ]
  }
]
```

**`validatePrerequisitesV2()`**
Validates:
- ✓ Course code not empty
- ✓ Type must be selected
- ✓ Grade required only if type = "completed"
- ✓ No duplicate course codes per program
- ✓ Only validates checked programs

#### Configuration

**`updateSetDefaultLabel(pplTypeId)`**
- Updates label text with PPL type name
- Enables/disables checkbox

---

### 4. Data Flow

#### Load Prerequisites (On PPL Type Change)

```
1. Admin selects PPL type
2. onPPLTypeChange() triggered
3. Show loading state
4. loadPrerequisites(pplTypeId) called
5. Mock API returns default prerequisites
6. renderPrerequisitesV2() displays:
   - All programs listed
   - Programs with courses auto-checked
   - Courses pre-filled with data
   - Types and grades pre-selected
7. Hide loading state
```

#### Submit Form

```
1. Admin clicks "Simpan Periode"
2. submitPeriod(e) called
3. validateMilestones() - validate milestone data
4. validatePrerequisitesV2() - validate prerequisites
5. collectPrerequisitesDataV2() - gather prerequisite data
6. Build payload with:
   {
     name, ppl_type_id, start_date, end_date,
     milestones, registration_requirements,
     study_program_prerequisites,
     set_as_default
   }
7. Show confirmation dialog
8. On confirm: [Would submit to API]
```

---

### 5. Functional Requirements Status

#### Load Default Prerequisites
- ✅ Auto-load when PPL type selected
- ✅ Display all programs
- ✅ Auto-check programs with courses
- ✅ Pre-fill course data
- ✅ Support both completed and enrolled types
- ✅ Show/hide grade field based on type
- ✅ Reset on PPL type change
- ✅ Show loading state

#### Checkbox per Program Studi
- ✅ Checkbox per program
- ✅ "Select all" option available
- ✅ Add empty row on check
- ✅ Clear rows on uncheck
- ✅ Only checked programs in payload

#### Input Mata Kuliah Prasyarat
- ✅ Add row button ("+")
- ✅ Course code field (required)
- ✅ Type field (required)
- ✅ Conditional grade field
- ✅ Delete button ("×")
- ✅ Empty state message

#### "Set as Default" Checkbox
- ✅ Label with PPL type name
- ✅ Disabled when no PPL type selected
- ✅ Included in payload as `set_as_default`

#### Submit
- ✅ Only includes checked programs
- ✅ Only includes filled prerequisite fields
- ✅ Omits `minimum_grade` for enrolled type
- ✅ Form validation before submit

---

### 6. Validation Rules

| Rule | Status |
|------|--------|
| Course code required | ✅ |
| Type must be selected | ✅ |
| Grade required if type=completed | ✅ |
| Grade hidden if type=enrolled | ✅ |
| No duplicate codes per program | ✅ |
| Only validate checked programs | ✅ |

---

### 7. Mock Data Structure

```javascript
mockDefaultPrerequisites = {
  1: [
    {
      study_program_id: "sp-001",
      study_program_name: "Pendidikan Matematika",
      courses: [
        { course_code: "MAT101", type: "completed", minimum_grade: "B" },
        { course_code: "PPL-MAT-2024", type: "enrolled", minimum_grade: null }
      ]
    },
    {
      study_program_id: "sp-002",
      study_program_name: "Pendidikan IPA",
      courses: [] // Empty - not auto-checked
    }
  ]
}
```

---

### 8. Payload Structure

#### POST /periods

```javascript
{
  name: "PPL Ganjil 2026/2027",
  ppl_type_id: "uuid",
  start_date: "2026-08-01",
  end_date: "2026-11-30",
  milestones: [...],
  registration_requirements: "{...}",
  study_program_prerequisites: [
    {
      study_program_id: "sp-001",
      courses: [
        { course_code: "MAT101", type: "completed", minimum_grade: "B" },
        { course_code: "PPL-MAT-2024", type: "enrolled" }
      ]
    }
  ],
  set_as_default: true
}
```

---

### 9. User Interactions

1. **Load Defaults**: Select PPL type → Prerequisites auto-load
2. **Include Program**: Check program checkbox → Show empty course row
3. **Exclude Program**: Uncheck checkbox → Hide courses, remove from payload
4. **Add Course**: Click "+" → Add new blank row
5. **Delete Course**: Click "×" → Remove row
6. **Type Change**: Select "enrolled" → Hide grade field
7. **Select All**: Check "centang semua" → Check all programs
8. **Set Default**: Check checkbox → Include `set_as_default: true` in payload

---

### 10. Error Handling

- Empty course code → Field highlighted, error message logged
- Empty type → Field highlighted, error message logged
- Missing grade (completed) → Field highlighted, error message logged
- Duplicate codes → Error message logged
- No validation errors → Form can be submitted

---

## Files Modified

- `/admin/periode/index.html`
  - Added CSS for prerequisites styling
  - Added V2 JavaScript functions
  - Updated HTML structure for prerequisites section
  - Updated form submission and validation

---

## Testing Checklist

- [ ] Load different PPL types and verify prerequisites load correctly
- [ ] Check program with courses auto-checks
- [ ] Uncheck program and verify courses disappear
- [ ] Add course row and verify fields appear
- [ ] Change type from completed to enrolled and verify grade field hides
- [ ] Change type from enrolled to completed and verify grade field shows
- [ ] Delete course row and verify empty state shows when no rows left
- [ ] Use "select all" to check/uncheck all programs
- [ ] Verify "set as default" label updates with PPL type name
- [ ] Submit form and verify payload structure in console
- [ ] Verify validation errors show for incomplete rows
- [ ] Test with different combinations of programs and courses

---

## Notes

- All functionality is mockup/UI-only
- No actual API calls are made
- Data validation is client-side only
- Payload is logged but not submitted
- Grade field uses `dataset.gradeField` for visibility control
- Program sections use `data-program-id` for identification
- Course rows use `data-course-index` for row management

---

## Future Integration Points

When integrating with actual backend:

1. Replace `loadPrerequisites()` mock with actual API call to:
   ```
   GET /ppl-types/{ppl_type_id}/default-prerequisites
   ```

2. Update `submitPeriod()` to make actual API call:
   ```
   POST /periods
   ```

3. Add real error handling and response processing

4. Add loading spinners and actual async/await

5. Add success/error notifications from API responses
