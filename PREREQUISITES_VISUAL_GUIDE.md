# Prerequisites Section — Visual & Interaction Guide

## UI Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ FORM: Buat Periode PPL Baru                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [Nama Periode Input]                                           │
│ [Jenis PPL Select]                                             │
│ [Rentang Waktu]                                                │
│                                                                 │
│ ══════════════════════════════════════════════════════════════│
│ MATA KULIAH PRASYARAT                                          │
│ ══════════════════════════════════════════════════════════════│
│                                                                 │
│ ℹ️ Atur mata kuliah prasyarat yang diperlukan...              │
│                                                                 │
│ ☑ Centang semua program studi                                 │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ ☑ Pendidikan Matematika                                   │ │
│ │                                                            │ │
│ │   Kode MK    | Tipe       | Nilai Min | ×                │ │
│ │   ┌─────┐    ┌─────────┐  ┌────────┐                     │ │
│ │   │MAT1 │ -> │Completed│  │   B    │  [×]              │ │
│ │   └─────┘    └─────────┘  └────────┘                     │ │
│ │                                                            │ │
│ │   Kode MK    | Tipe    | Nilai Min | ×                   │ │
│ │   ┌──────────┐ ┌────────┐ [hidden]                       │ │
│ │   │PPL-MAT2k │ │Enrolled│           [×]                 │ │
│ │   └──────────┘ └────────┘                                 │ │
│ │                                                            │ │
│ │   + Tambah Mata Kuliah Prasyarat                          │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ ☐ Pendidikan IPA                                          │ │
│ │                                                            │ │
│ │   (Belum ada mata kuliah prasyarat)                       │ │
│ │                                                            │ │
│ │   + Tambah Mata Kuliah Prasyarat                          │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ───────────────────────────────────────────────────────────── │
│ ☑ Atur sebagai default untuk "PPL Reguler" mendatang        │
│ ───────────────────────────────────────────────────────────── │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [Batal]                                     [Simpan Periode]   │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Diagrams

### Program Checkbox States

```
INITIAL STATE (No PPL type selected)
  All programs hidden
  "Centang semua" disabled
  "Set as default" checkbox disabled

AFTER LOADING DEFAULT (PPL type selected)
  All programs shown
  Programs with courses: ☑ (checked)
  Programs without courses: ☐ (unchecked)

AFTER USER CHECKS PROGRAM
  Courses container shows
  Empty row added if no courses exist

AFTER USER UNCHECKS PROGRAM
  Courses container hides
  All course rows removed
```

### Type Field - Grade Field Visibility

```
Type = "completed" (selected)
├─ Course Code field: VISIBLE & REQUIRED
├─ Type field: VISIBLE & REQUIRED
├─ Grade field: VISIBLE & REQUIRED
└─ Grade value: A, B, C, D, E

Type = "enrolled" (selected)
├─ Course Code field: VISIBLE & REQUIRED
├─ Type field: VISIBLE & REQUIRED
├─ Grade field: HIDDEN & DISABLED
└─ Grade value: not sent in payload
```

---

## User Flows

### Flow 1: Load Default Prerequisites

```
1. User opens modal
   └─> Form resets, prerequisites empty

2. User selects PPL type "PPL Reguler"
   └─> onPPLTypeChange() triggered
   └─> Show loading spinner
   └─> GET /ppl-types/uuid/default-prerequisites
   └─> Response received with programs & courses

3. renderPrerequisitesV2() executed
   ├─> Pendidikan Matematika (has 2 courses)
   │   └─> Auto-checked ☑
   │   └─> 2 course rows displayed
   │   └─> Type & grade pre-filled
   ├─> Pendidikan IPA (empty)
   │   └─> Unchecked ☐
   │   └─> Shows "No prerequisites" message
   └─> Hide loading spinner

4. Set default checkbox enabled
   └─> Label updated: "...untuk PPL Reguler mendatang"
```

### Flow 2: Add New Course to Checked Program

```
1. User sees unchecked "Pendidikan IPA"
2. User clicks checkbox ☑
   └─> Courses container shows
   └─> Empty state message displays

3. User clicks "+ Tambah Mata Kuliah"
   ├─> Empty state disappears
   └─> New blank course row added:
       ├─ Kode: [empty input]
       ├─ Tipe: [Pilih...]
       └─ Nilai: [hidden]

4. User fills in:
   ├─ Kode: "IPA101"
   ├─ Tipe: "completed"
   └─> Grade field auto-shows
       └─ Nilai: "B"

5. User clicks "+ Tambah" again
   └─> Another blank row added below
```

### Flow 3: Change Type and Watch Grade Field

```
Initial state:
  Type dropdown: [Completed ↓]
  Grade field: VISIBLE
  Grade value: "B"

User clicks Type dropdown:
  Options show:
  - Pilih...
  - Completed (currently selected)
  - Enrolled

User selects "Enrolled":
  └─> toggleGradeFieldV2() called
  └─> Grade field: HIDDEN
  └─> Grade select: DISABLED
  └─> Grade value: cleared to ""

User changes back to "Completed":
  └─> toggleGradeFieldV2() called
  └─> Grade field: VISIBLE
  └─> Grade select: ENABLED
  └─> Ready for grade input
```

### Flow 4: Delete Course Row

```
Program has 2 course rows:
  Row 1: MAT101 | Completed | B
  Row 2: PPL-MAT | Enrolled | [hidden]

User clicks × on Row 1
  └─> deletePrerequisiteRowV2() called
  └─> Row 1 removed
  └─> Row 2 now only row
  └─> No empty state (still has 1 row)

User clicks × on Row 2
  └─> deletePrerequisiteRowV2() called
  └─> Row 2 removed
  └─> Empty state message shows:
      "Belum ada mata kuliah prasyarat"
```

### Flow 5: Select/Deselect All Programs

```
Initial: Some programs checked
  ☑ Program A
  ☐ Program B
  ☑ Program C

User clicks "Centang semua" (indeterminate state)
  └─> updateSelectAllState() sets indeterminate

User clicks "Centang semua"
  └─> toggleAllPrograms(true) called
  └─> All programs checked:
      ☑ Program A
      ☑ Program B
      ☑ Program C

User clicks "Centang semua"
  └─> toggleAllPrograms(false) called
  └─> All programs unchecked:
      ☐ Program A
      ☐ Program B
      ☐ Program C
```

### Flow 6: Submit Form with Prerequisites

```
1. User fills form (name, type, dates, milestones)
2. User configures prerequisites:
   ☑ Program A: 2 courses
   ☑ Program B: 1 course
   ☐ Program C: not included
3. User checks "Atur sebagai default"
4. User clicks "Simpan Periode"
   └─> submitPeriod(e) called

5. Validation:
   └─> validateMilestones() ✓
   └─> validatePrerequisitesV2()
       ├─> Program A courses validated ✓
       ├─> Program B course validated ✓
       └─> Program C skipped (unchecked)

6. Data collection:
   └─> collectPrerequisitesDataV2()
       ├─> Program A: 2 courses collected
       ├─> Program B: 1 course collected
       └─> Program C: excluded

7. Payload built:
   {
     name: "PPL Ganjil...",
     ppl_type_id: "uuid",
     study_program_prerequisites: [
       {
         study_program_id: "program-a-id",
         courses: [
           { course_code: "...", type: "completed", minimum_grade: "B" },
           { course_code: "...", type: "enrolled" }
         ]
       },
       {
         study_program_id: "program-b-id",
         courses: [{ course_code: "...", type: "completed", minimum_grade: "A" }]
       }
     ],
     set_as_default: true
   }

8. Confirmation dialog shown
9. On confirm: POST /periods
```

---

## Validation States

### Valid Row
```
✓ Course Code: "MAT101" (not empty)
✓ Type: "completed" (selected)
✓ Grade: "B" (selected)
Row is valid and will be included in payload
```

### Invalid Row - Missing Grade
```
✓ Course Code: "MAT101" (not empty)
✓ Type: "completed" (selected)
✗ Grade: "" (empty)
  └─ Error: Field has red border
  └─ Message: "Nilai minimum harus dipilih..."
Row is invalid and will NOT be submitted
```

### Invalid Row - Enrolled without Grade
```
✓ Course Code: "PPL-MAT" (not empty)
✓ Type: "enrolled" (selected)
- Grade: [hidden]
Row is valid (grade not required for enrolled)
```

### Invalid Row - Duplicate Code
```
Row 1: "MAT101" | completed
Row 2: "MAT101" | completed
└─ Error: "Kode mata kuliah 'MAT101' duplikat..."
└─ First occurrence: has red border
└─ Second occurrence: has red border
Form submission blocked
```

---

## Responsiveness

### Desktop (800px+)
```
Course row grid: 1.5fr 1.2fr 1.2fr 40px
- Course Code: 30% width
- Type: 24% width
- Grade: 24% width
- Delete: 40px
```

### Tablet (600px - 800px)
```
Course row grid: 1.5fr 1.2fr 1.2fr 40px
- Same layout, slightly smaller padding
```

### Mobile (< 600px)
```
Course row grid: 1fr (stacked)
- Fields stack vertically
- Delete button below
- Labels always visible
```

---

## Accessibility

- Checkboxes labeled with adjacent text
- Form inputs have associated labels
- Error messages linked to fields via styling
- Tab order: top to bottom, left to right
- Disabled state for "set as default" when no PPL type
- Visual feedback for all interactions

---

## Color & Styling Reference

| Element | Color | Status |
|---------|-------|--------|
| Background | `#f9fafb` | Row background |
| Border | `#e8ecf1` | Normal border |
| Text Primary | `#1a202c` | Labels, titles |
| Text Muted | `#6b7280` | Hints, disabled |
| Primary | `#2563eb` | Buttons, focus |
| Danger | `#dc2626` | Delete button |
| Info | `#0369a1` | Info message |
| Info BG | `#dbeafe` | Info background |
| Error | `#ef4444` | Validation error |

---

## Performance Considerations

- Programs rendered once on PPL type change
- Courses rendered per program (not per all programs)
- Event delegation used for dynamic elements
- No unnecessary re-renders
- Checkboxes update only affected containers
