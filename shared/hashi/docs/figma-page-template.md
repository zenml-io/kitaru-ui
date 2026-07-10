# Hashi Component Page Template — Build Spec

A reusable presentation template for component pages in the "Hashi Design System" Figma file.
One template, two stacked zones plus the live component set:

1. **Spec header card** (identity + prose, one flat card split by a hairline)
2. **Showcase stage** (a display panel the real COMPONENT_SET is positioned over)

Replaces the current ad-hoc layout (bare title, paragraph, and a variant set floating in a
void). Reads as a design-system spec sheet, not a marketing page.

---

## 0. Design intent (why it looks the way it does)

- **Docs-column + showcase pattern.** The header is a fixed 640px reading column. The stage
  grows to whatever the component set needs (170px → 1296px). Both left-align to one origin.
  A narrow docs column above a wide artifact is a real documentation idiom, and it removes the
  "empty right half" problem a full-width header would create over a huge matrix.
- **Hierarchy by weight + color + mono/sans contrast, never size explosion.** The name tops out
  at `text/xl-semibold`; separation comes from the uppercase eyebrow, the muted summary, and the
  monospace import path — not from a giant title.
- **One accent, spent deliberately.** `brand/primary` (ZenML green) appears in exactly two small
  places: the tier eyebrow and the Code Connect status dot. No green bars, no green panels, no
  gradients, no shadows. Depth comes from three flat fill layers only:
  page `surface/background` < stage `surface/muted` < card `surface/card`.
- **Signature element.** The monospace import-path chip + green Code Connect dot. It makes
  "this design is linked to code" visible, which is the entire premise of the file.

---

## 1. Tokens (use these variable names only)

### Color (bind every fill/stroke to a variable — never a raw hex)

| Role | Variable | Applied to |
|---|---|---|
| Page canvas | `surface/background` | the page background behind the whole template |
| Card fill | `surface/card` | header card fill |
| Stage fill | `surface/muted` | showcase stage fill |
| Chip fill | `surface/secondary` | import-path chip fill |
| Primary text | `text/foreground` | component name, import path text |
| Secondary text | `text/muted-foreground` | eyebrow, summary, meta, description, caption |
| Hairlines / strokes | `border/border` | card stroke, stage stroke, chip stroke, divider |
| Accent | `brand/primary` | eyebrow text, Code Connect status dot |

Status dot when NOT code-connected: fill `text/muted-foreground` (not green).

### Typography (existing text styles only — bind, never set raw font/size)

| Element | Text style | Fill |
|---|---|---|
| Tier eyebrow (`PRIMITIVE` / `COMPONENT`) | `label/section` | `brand/primary` |
| Component name | `text/xl-semibold` | `text/foreground` |
| One-line summary | `text/base` | `text/muted-foreground` |
| Import path (in chip) | `mono/xs` | `text/foreground` |
| Meta cluster ("Code Connect linked · 12 variants") | `text/xs` | `text/muted-foreground` |
| Divider | — (no text) | — |
| Description prose | `text/sm` | `text/muted-foreground` |
| Caption label (`VARIANTS` / `PREVIEW`) | `label/section` | `text/muted-foreground` |
| Caption axis (`emphasis · size`) | `mono/2xs` | `text/muted-foreground` |

---

## 2. Layout constants

```
CARD_WIDTH            = 640      (fixed reading column)
CARD_PADDING          = 32       (all sides)
CARD_INNER            = 576      (= CARD_WIDTH − 2·CARD_PADDING)
CARD_ITEM_GAP         = 20       (between identity / meta / divider / description)
IDENTITY_ITEM_GAP     = 8        (eyebrow → name → summary)
DIVIDER_HEIGHT        = 1

CHIP_PAD_Y            = 6
CHIP_PAD_X            = 10
CHIP_RADIUS           = 6
META_DOT_SIZE         = 6
META_ITEM_GAP         = 8

CARD_TO_STAGE_GAP     = 32       (vertical gap, card bottom → stage top)

STAGE_PADDING         = 48       (all sides)
STAGE_MIN_WIDTH       = 640      (= CARD_WIDTH; tiny sets still match the column)
STAGE_MIN_SHOWCASE_H  = 160      (min height of the set's display area)
CAPTION_HEIGHT        = 20
CAPTION_TO_SET_GAP    = 32

CORNER_RADIUS         = 8        (card + stage; max allowed)

ALIGN_LEFT_THRESHOLD  = 480      (setW ≥ 480 → left-align set; else center)
TOP_ALIGN_THRESHOLD   = 480      (setH ≥ 480 → top-align set; else vertical-center)
```

All fills/strokes = the variables in §1. Card, stage, chip, divider: 1px stroke `border/border`.
No drop shadows anywhere.

---

## 3. Frame tree

Everything anchors at a template origin `(originX, originY)` the implementer chooses per page.
The header card and the stage are two top-level frames; the COMPONENT_SET is a **third
top-level canvas sibling** (it cannot be nested — Figma requires component sets on the page
canvas), positioned to overlap the stage and ordered above it.

```
Page (fill: surface/background)
│
├─ FRAME "Spec Header" ─────────────────────────  @ (originX, originY)
│     width 640 (fixed) · height HUG
│     autolayout: VERTICAL · padding 32 · itemGap 20 · align MIN (left)
│     fill surface/card · stroke 1 border/border · radius 8
│  │
│  ├─ FRAME "Identity"      autolayout VERTICAL · gap 8 · width FILL (576) · height HUG
│  │   ├─ TEXT  eyebrow      style label/section     · fill brand/primary        (slot: TIER)
│  │   ├─ TEXT  name         style text/xl-semibold  · fill text/foreground      (slot: NAME)
│  │   └─ TEXT  summary      style text/base         · fill text/muted-foreground(slot: SUMMARY)
│  │             width FILL (576) · height HUG (wraps)
│  │
│  ├─ FRAME "Meta Row"      autolayout HORIZONTAL · width FILL (576) · justify SPACE_BETWEEN · align CENTER
│  │   ├─ FRAME "Import Chip"  autolayout HORIZONTAL · padding 6/10 · radius 6
│  │   │     fill surface/secondary · stroke 1 border/border · height HUG
│  │   │     └─ TEXT importPath   style mono/xs · fill text/foreground          (slot: IMPORT_PATH)
│  │   └─ FRAME "Meta"        autolayout HORIZONTAL · gap 8 · align CENTER · height HUG
│  │         ├─ ELLIPSE dot   6×6 · fill brand/primary (or text/muted-foreground if not linked)
│  │         └─ TEXT  meta    style text/xs · fill text/muted-foreground
│  │                          text = "Code Connect linked · {N} variants"       (slots: CC_STATUS, VARIANT_COUNT)
│  │
│  ├─ LINE/RECT "Divider"   width FILL (576) · height 1 · fill border/border
│  │
│  └─ FRAME "Description"   autolayout VERTICAL · width FILL (576) · height HUG
│        └─ TEXT description  style text/sm · fill text/muted-foreground         (slot: DESCRIPTION)
│              width FILL (576) · height HUG (wraps)
│
├─ FRAME "Showcase Stage" ──────────────────────  @ (originX, stageY)     [stageY computed §4]
│     width stageW (fixed) · height stageH (fixed)   [both computed §4]
│     autolayout NONE (children absolutely positioned)
│     fill surface/muted · stroke 1 border/border · radius 8
│  │
│  └─ FRAME "Caption"       @ (48, 48) inside stage · width (stageW−96) · height 20
│        autolayout HORIZONTAL · justify SPACE_BETWEEN · align CENTER
│        ├─ TEXT captionLabel  style label/section · fill text/muted-foreground  (slot: CAPTION_LABEL)
│        └─ TEXT axis          style mono/2xs      · fill text/muted-foreground  (slot: AXIS_LABELS)
│
└─ COMPONENT_SET  (the real set — top-level canvas sibling, z-ordered ABOVE the stage)
      positioned at (setX, setY)  [computed §4]
```

---

## 4. Sizing & positioning algorithm

Measure the component set's bounding box first: `setW`, `setH`.

**Header card**
- Fixed width 640. Height hugs its content — after creating it, read the rendered height as
  `cardH`.

**Stage size**
```
stageInnerW = max(setW, STAGE_MIN_WIDTH − 2·STAGE_PADDING)     // = max(setW, 544)
stageW      = stageInnerW + 2·STAGE_PADDING                    // = max(setW+96, 640)
showcaseH   = max(setH, STAGE_MIN_SHOWCASE_H)                  // = max(setH, 160)
stageH      = STAGE_PADDING + CAPTION_HEIGHT + CAPTION_TO_SET_GAP + showcaseH + STAGE_PADDING
            // = 148 + showcaseH
```

**Stage position**
```
stageY = originY + cardH + CARD_TO_STAGE_GAP
stageX = originX
```

**Component set position over the stage**
```
contentLeft = stageX + STAGE_PADDING                                   // 48 in
contentTop  = stageY + STAGE_PADDING + CAPTION_HEIGHT + CAPTION_TO_SET_GAP   // 100 in

// horizontal
if setW >= ALIGN_LEFT_THRESHOLD:   setX = contentLeft                  // matrices read as a table
else:                              setX = stageX + (stageW − setW) / 2 // small sets: spotlight center

// vertical
if setH >= TOP_ALIGN_THRESHOLD:    setY = contentTop                   // tall matrices anchor to top
else:                              setY = contentTop + (showcaseH − setH) / 2  // compact sets center
```

Then bring the COMPONENT_SET to front so it paints above the stage fill.

**Worked examples**
- BrandMarkTile (setW≈120, setH≈52): stageW 640, showcaseH 160, stageH 308. setW<480 → centered
  horizontally; setH<480 → centered vertically. Two tiles sit as a spotlight, not floating in a void.
- Badge matrix (setW≈1200, setH≈560): stageW 1296, showcaseH 560, stageH 708. setW≥480 → left-aligned
  under the caption; setH≥480 → top-aligned. Reads as a titled display table.

---

## 5. Content slots (what changes per page)

| Slot | Example | Notes |
|---|---|---|
| `TIER` | `PRIMITIVE` | uppercase; `PRIMITIVE` for `.../primitives/*`, `COMPONENT` for `.../components/*` |
| `NAME` | `Progress` | component name |
| `SUMMARY` | `Linear determinate progress indicator.` | one line, ≤ ~64 chars |
| `IMPORT_PATH` | `@zenml/hashi/primitives/progress` | exact code import path |
| `CC_STATUS` | `Code Connect linked` | if unlinked: text `Code Connect not linked` + dot uses `text/muted-foreground` |
| `VARIANT_COUNT` | `12 variants` | for a single component: `Single component` |
| `DESCRIPTION` | 2–4 sentences | anatomy + usage; the text already written per page |
| `CAPTION_LABEL` | `VARIANTS` | use `PREVIEW` when the node is a single COMPONENT, not a set |
| `AXIS_LABELS` | `emphasis · size` | the set's variant axes, joined by ` · ` (e.g. `emphasis · radius · size`) |

Meta text is assembled as `"{CC_STATUS} · {VARIANT_COUNT}"` after the green dot.

---

## 6. Implementation notes & edge cases

- **Component set fill.** For the cleanest result the set itself should have a transparent fill so
  only the stage provides the surface. If a set carries its own background fill (double-panel look),
  drop `STAGE_PADDING` to 32 for that page so the two borders don't crowd.
- **Z-order.** Create/move the COMPONENT_SET last, or explicitly send it to front; it must paint
  above `surface/muted`.
- **Stage is a plain frame, not auto-layout.** Because the set overlaps it as a sibling, auto-layout
  would collapse the stage to caption height. Keep it a fixed-size frame with absolutely-positioned
  children (only the caption row lives inside it).
- **Reading measure.** Summary and description fill the 576px inner width and hug height (wrap
  naturally). Do not let them exceed the card — never widen the card to fit long prose; edit the copy.
- **Single-component pages** (no variant set): set `CAPTION_LABEL = PREVIEW`, `VARIANT_COUNT =
  Single component`, and `AXIS_LABELS = default` (or omit the axis text, leaving the caption label alone).
- **Alignment.** Header card and stage share `originX`; they are left-aligned. When the set is small,
  `stageW` clamps to 640 so the stage matches the card width for a tidy aligned column.

---

## 7. Wireframe

```
originX
│
▼
┌───────────────────────────────────────────────────────────┐  Spec Header · surface/card · border · r8 · pad 32
│ PRIMITIVE                                                  │  label/section · brand/primary
│ Progress                                                   │  text/xl-semibold · text/foreground
│ Linear determinate progress indicator for uploads.         │  text/base · text/muted-foreground  (wraps ≤576)
│                                                            │
│ ┌───────────────────────────────────┐   ● Code Connect linked · 12 variants │  Meta Row · space-between
│ │ @zenml/hashi/primitives/progress  │   └dot brand/primary   text/xs muted   │
│ └ surface/secondary · border · r6 ──┘                                        │
│ ────────────────────────────────────────────────────────  │  Divider · 1px border/border
│ A track and an indicator fill. Use for determinate         │  text/sm · text/muted-foreground  (wraps ≤576)
│ progress only; pair with a label. Do not use for           │
│ indeterminate loading.                                     │
└───────────────────────────────────────────────────────────┘
                          ↕ 32
┌─────────────────────────────────────────────────────────────────────────┐  Showcase Stage · surface/muted · border · r8
│ VARIANTS                                                    size · state  │  Caption · label/section  |  mono/2xs · space-between
│                                                                          │
│                                                                          │
│            [  COMPONENT_SET  — canvas sibling, z-above stage  ]           │  left-align if setW≥480, else center
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```
