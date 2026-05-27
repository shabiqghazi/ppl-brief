# Prerequisites Configuration — Testing Guide

## How to Test the Implementation

### Prerequisites
- Open `/admin/periode/index.html` in a web browser
- JavaScript console available for debugging
- No backend API needed (uses mock data)

---

## Test Scenarios

### Test 1: Load Prerequisites on PPL Type Selection

**Steps:**
1. Click "Buat Periode Baru" button
2. Modal opens with empty prerequisites section
3. Select "PPL-PLP Reguler" from "Jenis PPL" dropdown

**Expected Results:**
- ✓ Loading spinner appears briefly
- ✓ Prerequisites section becomes visible
- ✓ "Pendidikan Matematika" shows as checked ☑
- ✓ "Pendidikan IPA" shows as unchecked ☐
- ✓ "Centang semua" option visible
- ✓ "Set as default" checkbox enabled with label:
  - "Atur sebagai default... untuk 'PPL-PLP Reguler' mendatang"

**Data Displayed:**
- Pendidikan Matematika (checked):
  - MAT101 | Completed | B | ×
  - PPL-MAT-2024 | Enrolled | [hidden] | ×
- Pendidikan IPA (unchecked):
  - (Belum ada mata kuliah prasyarat)

---

### Test 2: Change PPL Type and Verify Reset

**Steps:**
1. Keep previous state
2. Change "Jenis PPL" to "PPL-PLP Internasional"

**Expected Results:**
- ✓ Loading spinner appears
- ✓ Prerequisites reload with new data
- ✓ Different programs may be checked/unchecked
- ✓ Course data differs from previous selection
- ✓ "Set as default" label updates:
  - "...untuk 'PPL-PLP Internasional' mendatang"

**Data Displayed:**
- Pendidikan Matematika (unchecked)
- Pendidikan IPA (checked):
  - IPA101 | Completed | B | ×
  - IPA102 | Enrolled | [hidden] | ×
- Pendidikan Agama Islam (unchecked)

---

### Test 3: Program Checkbox Behavior

**Steps:**
1. PPL type already selected (see Test 1 state)
2. Click checkbox on "Pendidikan IPA" to check it

**Expected Results:**
- ✓ Courses container becomes visible
- ✓ Empty state message shows:
  - "Belum ada mata kuliah prasyarat"
- ✓ "+ Tambah Mata Kuliah Prasyarat" button visible

**Steps (continued):**
3. Uncheck "Pendidikan Matematika"

**Expected Results:**
- ✓ Courses container hides
- ✓ All course rows disappear
- ✓ Empty state message shows

---

### Test 4: Select All / Deselect All

**Steps:**
1. PPL type selected with mixed programs checked/unchecked
2. Click "☑ Centang semua program studi"

**Expected Results:**
- ✓ All program checkboxes become checked ☑
- ✓ All courses containers become visible
- ✓ Checkbox shows: ☑ (not indeterminate)

**Steps (continued):**
3. Click "Centang semua" again

**Expected Results:**
- ✓ All program checkboxes become unchecked ☐
- ✓ All courses containers become hidden
- ✓ Checkbox shows: ☐

**Steps (continued):**
4. Manually check 1-2 programs
5. Click "Centang semua"

**Expected Results:**
- ✓ Checkbox shows: ☐ (indeterminate state)
- ✓ Next click checks all remaining programs

---

### Test 5: Add New Course Row

**Steps:**
1. Check "Pendidikan IPA" (which starts with no courses)
2. Click "+ Tambah Mata Kuliah Prasyarat" button

**Expected Results:**
- ✓ Empty state message disappears
- ✓ New blank row appears:
  - Kode: [empty input]
  - Tipe: [Pilih... dropdown]
  - Nilai: [hidden]
  - × delete button

**Steps (continued):**
3. Fill in the row:
   - Kode: "IPA201"
   - Tipe: "completed"

**Expected Results:**
- ✓ Grade field becomes visible as type changes
- ✓ Grade dropdown appears with options A-E
- ✓ Can select grade value

---

### Test 6: Delete Course Row

**Steps:**
1. Prerequisite rows exist (from previous tests)
2. Click × button on any row

**Expected Results:**
- ✓ That row is removed
- ✓ Other rows remain intact

**Steps (continued):**
3. Delete all rows from a program
4. Wait for empty state

**Expected Results:**
- ✓ Empty state message appears:
  - "Belum ada mata kuliah prasyarat"

---

### Test 7: Type Field - Grade Visibility Toggle

**Starting state:**
- Row with Type: "completed"
- Grade field visible with value "B"

**Steps:**
1. Click Type dropdown on a "completed" row
2. Select "enrolled"

**Expected Results:**
- ✓ Grade field immediately hides
- ✓ Grade select becomes disabled
- ✓ Grade value clears to empty

**Steps (continued):**
3. Click Type dropdown
4. Select "completed" again

**Expected Results:**
- ✓ Grade field reappears
- ✓ Grade select becomes enabled
- ✓ Can now select grade value

---

### Test 8: Duplicate Course Code Detection

**Steps:**
1. Program has or create 2 rows
2. First row: Kode = "MAT101", Type = "completed"
3. Second row: Kode = "MAT101", Type = "completed"
4. Try to submit form

**Expected Results:**
- ✓ Form submission blocked
- ✓ Error message in console:
  - "Kode mata kuliah 'MAT101' duplikat dalam program..."
- ✓ Both rows with duplicate codes get red border

---

### Test 9: Validation - Missing Course Code

**Steps:**
1. Create row with empty course code
2. Type: "completed"
3. Grade: "B"
4. Try to submit form

**Expected Results:**
- ✓ Form submission blocked
- ✓ Course code field gets red border
- ✓ Error message logged
- ✓ Other valid rows not affected

---

### Test 10: Validation - Missing Type

**Steps:**
1. Create row with:
   - Kode: "MAT101"
   - Tipe: [Pilih...] (not selected)
   - Grade: "B"
2. Try to submit form

**Expected Results:**
- ✓ Form submission blocked
- ✓ Type field gets red border
- ✓ Error message logged

---

### Test 11: Validation - Missing Grade (Completed Type)

**Steps:**
1. Create row with:
   - Kode: "MAT101"
   - Tipe: "completed"
   - Nilai: [not selected]
2. Try to submit form

**Expected Results:**
- ✓ Form submission blocked
- ✓ Grade field gets red border
- ✓ Error message logged

---

### Test 12: Validation - Enrolled Type (No Grade Required)

**Steps:**
1. Create row with:
   - Kode: "PPL-MAT"
   - Tipe: "enrolled"
   - Nilai: [hidden, not required]
2. Try to submit form with this row

**Expected Results:**
- ✓ Form submission succeeds (for this row)
- ✓ Grade field stays hidden (no need to fill)
- ✓ No error for missing grade

---

### Test 13: Set as Default Checkbox

**Steps:**
1. Prerequisites loaded and configured
2. Locate checkbox: "☐ Atur sebagai default..."
3. Check the checkbox

**Expected Results:**
- ✓ Checkbox becomes checked ☑
- ✓ Submit form (see payload)

**Steps (continued):**
4. Open browser console (F12)
5. Look at mock form submission
6. Check for `set_as_default: true`

**Expected Results:**
- ✓ Payload includes `set_as_default: true`

**Steps (continued):**
7. Uncheck the checkbox
8. Try to submit again

**Expected Results:**
- ✓ Payload includes `set_as_default: false`

---

### Test 14: Payload Structure Verification

**Steps:**
1. Configure prerequisites:
   - ☑ Program A: 2 courses (completed + enrolled)
   - ☑ Program B: 1 course (completed)
   - ☐ Program C: not checked
2. Check "Set as default" checkbox
3. Fill form fields (name, type, dates)
4. Click "Simpan Periode"
5. Check browser console

**Expected Results:**
```javascript
{
  name: "...",
  ppl_type_id: "...",
  study_program_prerequisites: [
    {
      study_program_id: "program-a-id",
      courses: [
        { course_code: "...", type: "completed", minimum_grade: "B" },
        { course_code: "...", type: "enrolled" }
        // Note: no minimum_grade for enrolled
      ]
    },
    {
      study_program_id: "program-b-id",
      courses: [
        { course_code: "...", type: "completed", minimum_grade: "A" }
      ]
    }
    // Program C not included (unchecked)
  ],
  set_as_default: true
}
```

---

### Test 15: Responsive Design

**Desktop (1200px+):**
- Course rows display in 4-column grid
- All fields visible side-by-side
- Smooth layout

**Tablet (768px - 1200px):**
- Same 4-column layout
- Slightly tighter spacing
- Still readable

**Mobile (< 768px):**
- Fields stack vertically
- Labels above inputs
- Delete button below
- Full width inputs

---

## Quick Checklist

### Prerequisites Loading ✓
- [ ] Load defaults on PPL type selection
- [ ] Auto-check programs with courses
- [ ] Pre-fill course data
- [ ] Show loading state
- [ ] Reset on PPL type change

### Program Management ✓
- [ ] Check/uncheck programs
- [ ] "Select all" works
- [ ] Show/hide courses containers
- [ ] Indeterminate state shows correctly

### Course Management ✓
- [ ] Add new courses
- [ ] Delete courses
- [ ] Empty state displays
- [ ] Row indices correct

### Type & Grade ✓
- [ ] Grade field hides for "enrolled"
- [ ] Grade field shows for "completed"
- [ ] Value clears on toggle
- [ ] Select is disabled/enabled

### Validation ✓
- [ ] Course code required
- [ ] Type required
- [ ] Grade required (completed only)
- [ ] Duplicate detection works
- [ ] Only checked programs validated

### Set as Default ✓
- [ ] Label updates with PPL type
- [ ] Disabled until PPL selected
- [ ] Included in payload

### Form Integration ✓
- [ ] Payload correct structure
- [ ] Only checked programs included
- [ ] Validation runs before submit
- [ ] Grade omitted for enrolled type

---

## Browser Console Output

When form is submitted, check console (F12) for:

**Success:**
- No errors logged
- Confirmation dialog appears
- Payload shows correct structure

**Issues:**
- Error messages logged for validation failures
- Field references in error messages
- Details about duplicate or missing fields

---

## Debug Tips

1. **View Payload**: Check console when form submitted
2. **Check States**: Inspect element to see checkbox states
3. **Trace Events**: Use DevTools to monitor checkbox changes
4. **Validate Data**: Manually check collected data matches input

---

## Known Test Limitations

- No actual API calls (uses mock data)
- No database persistence
- Form submit is mock (no actual POST)
- Confirmation dialog is mockup only
- No actual file uploads tested

---

## Test Results Template

```
TEST DATE: [DATE]
TESTER: [NAME]
BROWSER: [BROWSER/VERSION]
STATUS: [PASS/FAIL]

✓ Test 1: [Result]
✓ Test 2: [Result]
...
✗ Test N: [Issue Description]

NOTES:
- [Any observations]
- [Edge cases found]
- [Suggestions]
```

---

## Additional Testing Resources

- **Implementation Details**: See PREREQUISITES_IMPLEMENTATION.md
- **Visual Reference**: See PREREQUISITES_VISUAL_GUIDE.md
- **Summary**: See PREREQUISITES_SUMMARY.md
- **Source Code**: See admin/periode/index.html

---

**Last Updated**: May 27, 2026
