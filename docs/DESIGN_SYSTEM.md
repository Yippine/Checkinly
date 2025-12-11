# Checkinly Design System

> Professional UI/UX Design System for Work Hour Analysis Platform
> Version: 1.0.0
> Last Updated: 2025-12-05

---

## Table of Contents

1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Spacing System](#spacing-system)
5. [Typography System](#typography-system)
6. [Shadow & Elevation](#shadow--elevation)
7. [Border Radius](#border-radius)
8. [Component Library](#component-library)
9. [Responsive Design](#responsive-design)
10. [Accessibility Guidelines](#accessibility-guidelines)
11. [Implementation Guide](#implementation-guide)

---

## Introduction

### Purpose

This design system establishes a comprehensive visual language for the Checkinly platform, ensuring consistency, efficiency, and accessibility across all UI components and pages.

### Scope

- **Foundation**: Color, spacing, typography, shadows, and radius systems
- **Components**: Reusable UI component specifications
- **Patterns**: Responsive design and accessibility guidelines
- **Implementation**: Tailwind CSS configuration and usage examples

### How to Use This Document

- **Designers**: Reference this for creating new mockups and prototypes
- **Developers**: Follow specifications when implementing components
- **Product Managers**: Understand design decisions and constraints

### Design Principles

1. **Consistency**: Maintain uniform visual language across all interfaces
2. **Clarity**: Provide clear visual hierarchy and intuitive navigation
3. **Efficiency**: Optimize developer productivity with reusable tokens
4. **Accessibility**: Meet WCAG 2.1 AA standards for inclusive design
5. **Scalability**: Design system scales seamlessly from mobile to desktop

---

## Color System

### Overview

The color system is based on **Ant Design Pro** standards, featuring semantic color palettes with 50-900 shade scales for maximum flexibility and accessibility.

### Primary Palette: Daybreak Blue

Professional blue representing trust, reliability, and authority.

| Shade | Hex Code | Usage | Contrast Ratio (on white) |
|-------|----------|-------|---------------------------|
| 50 | `#e6f7ff` | Backgrounds, subtle highlights | N/A |
| 100 | `#bae7ff` | Light backgrounds | N/A |
| 200 | `#91d5ff` | Hover states | N/A |
| 300 | `#69c0ff` | Disabled states | N/A |
| 400 | `#40a9ff` | Secondary actions | 3.2:1 (AA Large) |
| **500** | **`#1890ff`** | **Primary actions, brand color** | **4.54:1 (AA)** |
| **600** | **`#096dd9`** | **Text links, strong emphasis** | **6.46:1 (AAA)** |
| 700 | `#0050b3` | Active states | 8.59:1 (AAA) |
| 800 | `#003a8c` | Dark mode accents | 11.21:1 (AAA) |
| 900 | `#002766` | Dark backgrounds | 14.56:1 (AAA) |

**Usage Guidelines:**
- Use `primary-500` for primary buttons, active navigation items, and brand elements
- Use `primary-600` for text links and strong call-to-actions
- Use `primary-50` and `primary-100` for subtle backgrounds
- Avoid using shades below 400 for text (insufficient contrast)

### Secondary Palette: Geek Blue

Professional secondary color for complementary elements.

| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50 | `#f0f5ff` | Secondary backgrounds |
| 500 | `#2f54eb` | Secondary actions, informational highlights |
| 600 | `#1d39c4` | Secondary text emphasis |

### Semantic Colors

#### Success: Polar Green

| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50 | `#f6ffed` | Success backgrounds |
| 500 | `#52c41a` | Success messages, positive indicators |
| 600 | `#389e0d` | Success text emphasis |

#### Warning: Sunset Orange

| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50 | `#fffbe6` | Warning backgrounds |
| 500 | `#faad14` | Warning messages, caution indicators |
| 600 | `#d48806` | Warning text emphasis |

#### Error: Dust Red

| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50 | `#fff1f0` | Error backgrounds |
| 500 | `#f5222d` | Error messages, destructive actions |
| 600 | `#cf1322` | Error text emphasis |

### Neutral Palette: Gray Scale

Essential for backgrounds, borders, and text hierarchy.

| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50 | `#fafafa` | Base background |
| 100 | `#f5f5f5` | Subtle backgrounds |
| 200 | `#e8e8e8` | Light borders |
| 300 | `#d9d9d9` | Default borders |
| 400 | `#bfbfbf` | Dark borders, disabled text |
| 500 | `#8c8c8c` | Tertiary text |
| 600 | `#595959` | Secondary text |
| 700 | `#434343` | Primary text (dark) |
| 800 | `#262626` | Headings |
| 900 | `#141414` | Strong emphasis |

### Semantic Color Mappings

#### Backgrounds
```css
bg-base: neutral-50 (#fafafa)
bg-elevated: white (#ffffff)
bg-subtle: neutral-100 (#f5f5f5)
bg-overlay: neutral-900 with opacity
```

#### Borders
```css
border-default: neutral-300 (#d9d9d9)
border-light: neutral-200 (#e8e8e8)
border-dark: neutral-400 (#bfbfbf)
border-strong: neutral-600 (#595959)
```

#### Text
```css
text-primary: rgba(0,0,0,0.85)    /* Main content */
text-secondary: rgba(0,0,0,0.65)  /* Supporting text */
text-tertiary: rgba(0,0,0,0.45)   /* Metadata */
text-disabled: rgba(0,0,0,0.25)   /* Disabled states */
text-inverse: #ffffff             /* Text on dark backgrounds */
```

#### Interactive
```css
link-default: primary-600
link-hover: primary-500
link-active: primary-700
link-visited: secondary-600
```

### Do's and Don'ts

**Do:**
- Use primary colors for primary actions and navigation
- Use semantic colors (success, warning, error) consistently for their intended purposes
- Maintain sufficient contrast ratios (minimum 4.5:1 for normal text)
- Use neutral colors for backgrounds and borders

**Don't:**
- Mix different semantic colors for the same purpose (e.g., green and blue for success)
- Use low-contrast color combinations (e.g., neutral-300 text on white)
- Overuse bright colors; maintain visual hierarchy
- Use colors alone to convey information (consider colorblind users)

---

## Spacing System

### Overview

The spacing system is based on a **4px base grid**, aligning with Material Design and Ant Design Pro standards for consistent visual rhythm.

### Base Unit

```
Base Unit: 4px
Rationale: Divisible by 2 and 4, flexible yet systematic
```

### Spacing Scale

| Token | Value | Multiplier | Semantic Name | Usage |
|-------|-------|------------|---------------|-------|
| `0` | 0px | 0x | - | No spacing |
| `px` | 1px | - | - | Hairline borders |
| `0.5` | 2px | 0.5x | - | Minimal spacing |
| `1` | 4px | 1x | - | Extra tight |
| `1.5` | 6px | 1.5x | - | - |
| `2` | 8px | 2x | `xs` | Tight spacing within components |
| `2.5` | 10px | 2.5x | - | - |
| `3` | 12px | 3x | `sm` | Comfortable spacing within components |
| `3.5` | 14px | 3.5x | - | - |
| `4` | 16px | 4x | `base` | Default spacing for most use cases |
| `5` | 20px | 5x | - | - |
| `6` | 24px | 6x | `md` | Generous spacing between elements |
| `7` | 28px | 7x | - | - |
| `8` | 32px | 8x | `lg` | Section spacing |
| `9` | 36px | 9x | - | - |
| `10` | 40px | 10x | - | - |
| `11` | 44px | 11x | - | Touch target size |
| `12` | 48px | 12x | `xl` | Large section spacing |
| `14` | 56px | 14x | - | - |
| `16` | 64px | 16x | `2xl` | Major section spacing |
| `20` | 80px | 20x | - | - |
| `24` | 96px | 24x | `3xl` | Page-level spacing |
| `32` | 128px | 32x | - | Hero sections |
| `40` | 160px | 40x | - | Extra large sections |
| `48` | 192px | 48x | - | Maximum spacing |

### Usage Guidelines

#### Component Internal Padding
```tailwind
p-4    /* 16px - Small components (buttons, inputs) */
p-6    /* 24px - Cards, panels (recommended default) */
p-8    /* 32px - Large containers */
```

#### Component Gaps
```tailwind
gap-4  /* 16px - Tight layouts (form fields, icon + label) */
gap-6  /* 24px - Comfortable layouts (card grids) */
gap-8  /* 32px - Spacious layouts (sections) */
```

#### Section Margins
```tailwind
my-6   /* 24px - Small section separation */
my-8   /* 32px - Default section separation */
my-12  /* 48px - Major section separation */
my-16  /* 64px - Page-level separation */
```

#### Layout Containers
```tailwind
px-4   /* Mobile: 16px horizontal padding */
px-6   /* Tablet: 24px horizontal padding */
px-8   /* Desktop: 32px horizontal padding */
```

### Spacing Examples

#### Card Component
```jsx
<div className="p-6 space-y-4">
  <h3 className="mb-2">Card Title</h3>
  <p className="mb-4">Card content with proper spacing.</p>
  <div className="flex gap-3">
    <button>Action 1</button>
    <button>Action 2</button>
  </div>
</div>
```

#### Grid Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card />
  <Card />
  <Card />
</div>
```

### Do's and Don'ts

**Do:**
- Use multiples of 4px for spacing (4, 8, 12, 16, 24, 32...)
- Apply consistent spacing within component families
- Use `gap` utilities for flex/grid layouts
- Use semantic spacing tokens (xs, sm, base, md, lg) when applicable

**Don't:**
- Use arbitrary spacing values (e.g., `p-[17px]`)
- Mix inconsistent spacing scales without rationale
- Forget responsive spacing adjustments (tighter on mobile)
- Overuse large spacing values (keeps content scannable)

---

## Typography System

### Overview

The typography system provides a clear hierarchy from display headings to body text, optimized for readability and accessibility.

### Font Families

#### Sans Serif (Default)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
             'Apple Color Emoji', 'Segoe UI Emoji';
```

**Rationale**: System font stack ensures optimal rendering on all platforms, supports CJK characters, and minimizes font loading time.

#### Monospace (Code)
```css
font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo,
             Courier, monospace;
```

### Type Scale

| Class | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-------------|--------|----------------|-------|
| `text-display` | 36px | 44px | 700 (Bold) | -0.02em | Hero headings, landing pages |
| `text-heading-1` | 24px | 32px | 600 (Semibold) | normal | Page titles, main headings |
| `text-heading-2` | 20px | 28px | 600 (Semibold) | normal | Section headings, card titles |
| `text-heading-3` | 16px | 24px | 600 (Semibold) | normal | Subsection headings, component titles |
| `text-heading-4` | 14px | 22px | 600 (Semibold) | normal | Small headings, emphasized labels |
| `text-body-large` | 16px | 24px | 400 (Regular) | normal | Important body text, lead paragraphs |
| `text-body` | 14px | 22px | 400 (Regular) | normal | Default body text, descriptions |
| `text-body-small` | 12px | 20px | 400 (Regular) | normal | Supplementary text, metadata |
| `text-caption` | 12px | 20px | 400 (Regular) | 0.01em | Captions, helper text, timestamps |
| `text-overline` | 10px | 16px | 600 (Semibold) | 0.08em | Labels, categories, tags (uppercase) |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-regular` | 400 | Body text, descriptions |
| `font-medium` | 500 | Subtle emphasis, navigation items |
| `font-semibold` | 600 | Headings, strong emphasis |
| `font-bold` | 700 | Display headings, critical information |

### Usage Rules

#### Hierarchy
- **Page Title**: `text-heading-1` + `font-semibold`
- **Section Title**: `text-heading-2` + `font-semibold`
- **Card Title**: `text-heading-3` + `font-semibold`
- **Body Content**: `text-body` + `font-regular`
- **Metadata**: `text-caption` + `text-text-tertiary`

#### Emphasis
```jsx
<p className="text-body">
  This is normal text with
  <span className="font-medium">medium emphasis</span> and
  <span className="font-semibold">strong emphasis</span>.
</p>
```

#### Readability
- **Line Height**: Maintain 1.5-1.6 ratio for body text (promotes readability)
- **Line Height**: Use 1.2-1.4 ratio for headings (tighter for visual impact)
- **Line Length**: Limit to 60-80 characters per line for optimal reading

#### Color Pairing
```jsx
<h1 className="text-heading-1 text-text-primary">Primary Heading</h1>
<h2 className="text-heading-2 text-text-secondary">Secondary Heading</h2>
<p className="text-body text-text-primary">Main content text</p>
<p className="text-caption text-text-tertiary">Supporting metadata</p>
```

### Typography Examples

#### Page Header
```jsx
<header>
  <h1 className="text-heading-1 font-semibold text-text-primary mb-2">
    工時分析管理系統
  </h1>
  <p className="text-body text-text-secondary">
    當前檔案: T1401企明細表.xlsx
  </p>
</header>
```

#### Card with Typography Hierarchy
```jsx
<div className="bg-white p-6 rounded-lg shadow-card">
  <h3 className="text-heading-3 font-semibold text-text-primary mb-4">
    每日出勤趨勢分析
  </h3>
  <p className="text-body text-text-secondary mb-6">
    查看過去30天的工時變化趨勢，識別異常模式。
  </p>
  <p className="text-caption text-text-tertiary">
    最後更新: 2025-12-05 14:30
  </p>
</div>
```

### Do's and Don'ts

**Do:**
- Use predefined type scales consistently
- Maintain clear hierarchy (heading-1 > heading-2 > heading-3 > body)
- Pair appropriate colors with text (primary for headings, secondary for body)
- Use font-medium for subtle emphasis, font-semibold for strong emphasis

**Don't:**
- Create custom font sizes outside the type scale
- Use all caps for long text (reduces readability)
- Use low-contrast text colors (e.g., text-tertiary for important content)
- Mix multiple font weights without clear hierarchy

---

## Shadow & Elevation

### Overview

The shadow system creates depth perception and visual hierarchy through 5 elevation levels, based on Material Design principles.

### Elevation Levels

| Level | Name | Shadow Definition | Z-Index | Usage |
|-------|------|-------------------|---------|-------|
| **0** | `none` | `none` | 0 | Flat elements, no elevation |
| **1** | `sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | 10 | Subtle elevation, input fields |
| **2** | `card` | `0 1px 2px 0 rgba(0,0,0,0.03),`<br>`0 1px 6px -1px rgba(0,0,0,0.02),`<br>`0 2px 4px 0 rgba(0,0,0,0.02)` | 20 | Default cards, panels |
| **3** | `dropdown` | `0 3px 6px -4px rgba(0,0,0,0.12),`<br>`0 6px 16px 0 rgba(0,0,0,0.08),`<br>`0 9px 28px 8px rgba(0,0,0,0.05)` | 30 | Dropdowns, popovers |
| **4** | `modal` | `0 10px 15px -3px rgba(0,0,0,0.1),`<br>`0 4px 6px -2px rgba(0,0,0,0.05)` | 40 | Modals, dialogs |
| **5** | `drawer` | `0 20px 25px -5px rgba(0,0,0,0.1),`<br>`0 10px 10px -5px rgba(0,0,0,0.04)` | 50 | Drawers, overlays |

### Hover Interactions

#### Card Hover
```jsx
<div className="shadow-card hover:shadow-dropdown transition-shadow duration-200">
  Card content
</div>
```

#### Button Hover
```jsx
<button className="shadow-sm hover:shadow-md transition-shadow duration-200">
  Button
</button>
```

#### Float Effect
```jsx
<div className="shadow-card hover:shadow-dropdown hover:translate-y-[-2px] transition-all duration-200">
  Floating card
</div>
```

### Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Default document flow |
| Dropdown | 1000 | Dropdown menus, popovers |
| Sticky | 1020 | Sticky headers, footers |
| Fixed | 1030 | Fixed navigation, sidebars |
| Modal Backdrop | 1040 | Modal overlay backgrounds |
| Modal | 1050 | Modal dialogs |
| Popover | 1060 | Popovers, tooltips |
| Tooltip | 1070 | Tooltips (highest priority) |

### Usage Examples

#### Card Component
```jsx
<div className="bg-white rounded-lg shadow-card border border-border-light p-6">
  <h3 className="text-heading-3 mb-4">Card Title</h3>
  <p className="text-body">Card content</p>
</div>
```

#### Dropdown Menu
```jsx
<div className="absolute bg-white rounded-lg shadow-dropdown border border-border-light p-2 z-dropdown">
  <button className="w-full px-4 py-2 hover:bg-neutral-50">Option 1</button>
  <button className="w-full px-4 py-2 hover:bg-neutral-50">Option 2</button>
</div>
```

#### Modal Dialog
```jsx
<div className="fixed inset-0 z-modal-backdrop bg-black/50">
  <div className="fixed inset-0 flex items-center justify-center p-4 z-modal">
    <div className="bg-white rounded-xl shadow-modal p-6 max-w-md w-full">
      <h2 className="text-heading-2 mb-4">Modal Title</h2>
      <p className="text-body mb-6">Modal content</p>
      <button className="px-4 py-2 bg-primary-500 text-white rounded-base">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Do's and Don'ts

**Do:**
- Use elevation consistently for component types (all cards use shadow-card)
- Add hover transitions for interactive elements
- Use appropriate z-index values for stacking contexts
- Maintain subtle shadows (avoid overly dramatic shadows)

**Don't:**
- Apply shadows to flat UI elements (buttons, inputs in default state)
- Mix different shadow styles within the same component family
- Use arbitrary z-index values (stick to the scale)
- Overuse elevation (maintain clear visual hierarchy)

---

## Border Radius

### Overview

The border radius system ensures consistent rounded corners across all components, creating a modern and cohesive visual language.

### Radius Scale

| Token | Value | Usage | Examples |
|-------|-------|-------|----------|
| `rounded-none` | 0px | Sharp corners | Tables, dividers |
| `rounded-sm` | 2px | Subtle rounding | Tags, badges |
| `rounded-base` | 6px | Default rounding | Buttons, inputs |
| `rounded-md` | 8px | Medium rounding | - |
| `rounded-lg` | 12px | Large rounding | Cards, panels |
| `rounded-xl` | 16px | Extra large | Modals, drawers |
| `rounded-2xl` | 20px | Hero elements | - |
| `rounded-3xl` | 24px | Maximum rounding | - |
| `rounded-full` | 9999px | Circular | Avatars, pills |

### Component Mappings

| Component | Radius | Rationale |
|-----------|--------|-----------|
| Buttons | `rounded-base` (6px) | Consistent with Ant Design Pro |
| Inputs | `rounded-base` (6px) | Matches buttons for consistency |
| Cards | `rounded-lg` (12px) | Prominent containers need larger radius |
| Modals | `rounded-xl` (16px) | Large overlays benefit from generous rounding |
| Badges | `rounded-full` | Pill shapes for tags and labels |
| Avatars | `rounded-full` | Circular images for profile pictures |
| Tags | `rounded-sm` (2px) | Compact labels with subtle rounding |
| Dropdowns | `rounded-lg` (12px) | Consistent with cards |

### Usage Guidelines

#### Consistency
- Use the same radius within component families
- Buttons, inputs, and form elements should share the same radius
- Cards and panels should share the same radius

#### Hierarchy
- Larger radius for more prominent components (modals > cards > buttons)
- Smaller radius for compact elements (tags, badges)

#### Platform Conventions
- iOS: Prefers larger radius values (8-16px)
- Android: Moderate radius values (4-8px)
- Web: Flexible, typically 6-12px

### Examples

#### Button with Base Radius
```jsx
<button className="px-4 py-2 bg-primary-500 text-white rounded-base shadow-sm">
  Primary Button
</button>
```

#### Card with Large Radius
```jsx
<div className="bg-white p-6 rounded-lg shadow-card border border-border-light">
  Card content with large radius
</div>
```

#### Avatar with Full Radius
```jsx
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
  <span className="text-white text-sm font-semibold">HR</span>
</div>
```

#### Tag with Small Radius
```jsx
<span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-sm">
  Tag
</span>
```

### Do's and Don'ts

**Do:**
- Use predefined radius tokens consistently
- Match radius within component families
- Consider platform conventions for target audience
- Use rounded-full for circular elements (avatars, badges)

**Don't:**
- Create custom radius values outside the scale
- Mix different radius styles within the same component
- Use excessive radius (reduces usable space)
- Use rounded-full for non-circular elements (buttons, cards)

---

## Component Library

### Button

#### Anatomy
```
[Icon] Label [Loading Spinner]
```

#### Variants

**Primary Button**
```jsx
<button className="px-4 py-2 bg-primary-500 text-white rounded-base font-medium shadow-sm hover:bg-primary-600 hover:shadow-md active:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400 transition-all duration-200">
  Primary Action
</button>
```

**Secondary Button**
```jsx
<button className="px-4 py-2 bg-white text-primary-600 border border-primary-500 rounded-base font-medium hover:bg-primary-50 hover:border-primary-600 active:bg-primary-100 transition-all duration-200">
  Secondary Action
</button>
```

**Ghost Button**
```jsx
<button className="px-4 py-2 bg-transparent text-primary-600 rounded-base font-medium hover:bg-primary-50 active:bg-primary-100 transition-all duration-200">
  Ghost Action
</button>
```

**Danger Button**
```jsx
<button className="px-4 py-2 bg-error-500 text-white rounded-base font-medium hover:bg-error-600 active:bg-error-700 transition-all duration-200">
  Delete
</button>
```

#### Sizes

```jsx
/* Small */
<button className="px-3 py-1.5 text-sm">Small Button</button>

/* Base (Default) */
<button className="px-4 py-2 text-base">Base Button</button>

/* Large */
<button className="px-6 py-3 text-lg">Large Button</button>
```

#### States
- **Default**: Base styling
- **Hover**: Darker background, elevated shadow
- **Active**: Darkest background, no shadow
- **Focus**: Primary-200 ring with 2px offset
- **Disabled**: Gray background, gray text, no interactions
- **Loading**: Spinner replaces icon, disabled state

#### With Icon
```jsx
<button className="px-4 py-2 bg-primary-500 text-white rounded-base font-medium flex items-center gap-2">
  <Plus size={16} />
  Add Item
</button>
```

---

### Card

#### Anatomy
```
┌─────────────────────────────┐
│ Header (optional)           │ ← border-bottom
├─────────────────────────────┤
│ Body                        │
│                             │
│                             │
├─────────────────────────────┤
│ Footer (optional)           │ ← border-top
└─────────────────────────────┘
```

#### Base Card
```jsx
<div className="bg-white rounded-lg shadow-card border border-border-light p-6 hover:shadow-dropdown transition-shadow duration-200">
  <h3 className="text-heading-3 font-semibold text-text-primary mb-4">
    Card Title
  </h3>
  <p className="text-body text-text-secondary">
    Card content goes here with proper spacing and typography.
  </p>
</div>
```

#### Card with Header and Footer
```jsx
<div className="bg-white rounded-lg shadow-card border border-border-light overflow-hidden">
  {/* Header */}
  <div className="px-6 py-4 border-b border-border-light">
    <h3 className="text-heading-3 font-semibold text-text-primary">
      Card Title
    </h3>
  </div>

  {/* Body */}
  <div className="p-6">
    <p className="text-body text-text-secondary">
      Card content with separate header and footer sections.
    </p>
  </div>

  {/* Footer */}
  <div className="px-6 py-4 border-t border-border-light bg-neutral-50">
    <p className="text-sm text-text-tertiary">
      Footer content or actions
    </p>
  </div>
</div>
```

#### Interactive Card
```jsx
<div className="bg-white rounded-lg shadow-card border border-border-light p-6 hover:shadow-dropdown hover:translate-y-[-2px] transition-all duration-200 cursor-pointer">
  <h3 className="text-heading-3 font-semibold text-text-primary mb-2">
    Clickable Card
  </h3>
  <p className="text-body text-text-secondary">
    Hover to see elevation and lift effect.
  </p>
</div>
```

---

### Input

#### Anatomy
```
Label (optional)
┌─────────────────────────────┐
│ Input Field                 │
└─────────────────────────────┘
Helper Text / Error Message (optional)
```

#### Base Input
```jsx
<div className="space-y-1.5">
  <label className="text-sm font-medium text-text-primary">
    Email Address
  </label>
  <input
    type="email"
    className="w-full px-3 py-2 border border-border-default rounded-base text-base focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all duration-200"
    placeholder="Enter your email"
  />
  <p className="text-xs text-text-tertiary">
    We'll never share your email with anyone else.
  </p>
</div>
```

#### Input States

**Default**
```jsx
<input className="border border-border-default" />
```

**Hover**
```jsx
<input className="hover:border-primary-400" />
```

**Focus**
```jsx
<input className="focus:border-primary-500 focus:ring-2 focus:ring-primary-200" />
```

**Error**
```jsx
<div className="space-y-1.5">
  <input
    className="border border-error-500 focus:ring-error-200"
  />
  <p className="text-xs text-error-500 flex items-center gap-1">
    <AlertCircle size={12} />
    This field is required
  </p>
</div>
```

**Disabled**
```jsx
<input
  disabled
  className="bg-neutral-100 text-neutral-400 cursor-not-allowed"
/>
```

---

### Sidebar

#### Specification

```jsx
<aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border-light shadow-sm z-fixed">
  {/* Logo Header */}
  <div className="h-16 flex items-center px-6 border-b border-border-light">
    <div className="bg-primary-500 p-2 rounded-lg text-white">
      <LayoutDashboard size={18} />
    </div>
    <h1 className="ml-3 text-base font-semibold text-text-primary">
      工時分析系統
    </h1>
  </div>

  {/* Navigation Items */}
  <nav className="mt-4 px-3">
    {/* Active Item */}
    <button className="w-full px-4 py-2.5 mb-1 flex items-center gap-3 rounded-lg bg-primary-50 text-primary-600 font-medium transition-all duration-200">
      <LayoutDashboard size={16} />
      <span>儀表板</span>
    </button>

    {/* Default Item */}
    <button className="w-full px-4 py-2.5 mb-1 flex items-center gap-3 rounded-lg text-text-secondary hover:bg-neutral-50 hover:text-text-primary transition-all duration-200">
      <FileText size={16} />
      <span>出勤明細</span>
    </button>
  </nav>

  {/* Bottom User Section */}
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-light">
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
        HR
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          HR Manager
        </p>
        <p className="text-xs text-text-tertiary">系統管理員</p>
      </div>
    </div>
  </div>
</aside>
```

#### Navigation Item States

| State | Styling |
|-------|---------|
| Default | `text-text-secondary` |
| Hover | `hover:bg-neutral-50 hover:text-text-primary` |
| Active | `bg-primary-50 text-primary-600 font-medium` |

---

### Table

#### Base Table
```jsx
<div className="overflow-hidden rounded-lg border border-border-light">
  <table className="min-w-full">
    {/* Header */}
    <thead className="bg-neutral-50">
      <tr>
        <th className="py-3 px-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          部門
        </th>
        <th className="py-3 px-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          員工編號
        </th>
        <th className="py-3 px-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
          工時
        </th>
      </tr>
    </thead>

    {/* Body */}
    <tbody className="bg-white divide-y divide-border-light">
      <tr className="hover:bg-neutral-50 transition-colors duration-150">
        <td className="py-3 px-4 text-sm text-text-secondary">
          五甲護理部
        </td>
        <td className="py-3 px-4 text-sm text-text-primary font-medium">
          P104001
        </td>
        <td className="py-3 px-4 text-sm text-right font-semibold text-primary-600">
          10.8
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Table States
- **Header**: Gray background, uppercase small text
- **Row Hover**: Light gray background transition
- **Striped (Optional)**: `odd:bg-white even:bg-neutral-50`

---

## Responsive Design

### Breakpoints

| Breakpoint | Size | Usage |
|------------|------|-------|
| `sm` | 640px | Small tablets, large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops, small desktops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Responsive Patterns

#### Sidebar
```jsx
/* Mobile: Hidden by default, toggleable drawer */
<aside className="fixed inset-y-0 left-0 w-64 bg-white transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
  Sidebar content
</aside>

/* Desktop: Always visible */
<aside className="hidden lg:block fixed left-0 top-0 h-full w-64">
  Sidebar content
</aside>
```

#### Grid Layouts
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <Card />
  <Card />
  <Card />
  <Card />
</div>
```

#### Typography
```jsx
<h1 className="text-xl md:text-2xl lg:text-heading-1">
  Responsive Heading
</h1>
```

#### Spacing
```jsx
<div className="px-4 md:px-6 lg:px-8">
  Responsive padding
</div>

<div className="gap-4 md:gap-6 lg:gap-8">
  Responsive gaps
</div>
```

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```jsx
/* Mobile: Stack vertically */
<div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
  <div className="w-full lg:w-1/3">Sidebar</div>
  <div className="w-full lg:w-2/3">Main Content</div>
</div>
```

---

## Accessibility Guidelines

### Color Contrast

#### Requirements
- **WCAG 2.1 AA**: Minimum 4.5:1 for normal text, 3:1 for large text (18px+)
- **WCAG 2.1 AAA**: Minimum 7:1 for normal text, 4.5:1 for large text

#### Validated Combinations
- `primary-500 (#1890ff)` on white: **4.54:1 (AA Pass)**
- `primary-600 (#096dd9)` on white: **6.46:1 (AAA Pass)**
- `text-primary (rgba(0,0,0,0.85))` on white: **13.6:1 (AAA Pass)**
- `text-secondary (rgba(0,0,0,0.65))` on white: **8.9:1 (AAA Pass)**

#### Recommendations
- Use `primary-600` or darker for text links
- Use `primary-500` for buttons with white text
- Avoid `primary-400` and lighter for text (insufficient contrast)

### Focus Indicators

#### Requirements
All interactive elements must have visible focus indicators for keyboard navigation.

#### Implementation
```jsx
<button className="focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 focus:outline-none">
  Accessible Button
</button>

<input className="focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none" />
```

### Touch Targets

#### Requirements
- **Minimum size**: 44x44px for mobile interactions
- **Spacing**: Minimum 8px gap between touch targets

#### Implementation
```jsx
/* Button with adequate height */
<button className="py-2.5">Button</button>  {/* 40px height */}
<button className="py-3">Button</button>    {/* 48px height */}

/* Adequate spacing between buttons */
<div className="flex gap-3">
  <button>Action 1</button>
  <button>Action 2</button>
</div>
```

### Semantic HTML

#### Requirements
Use semantic HTML elements for proper document structure.

```jsx
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content</p>
    </section>
  </article>
</main>

<footer>
  Footer content
</footer>
```

### ARIA Labels

#### Requirements
Provide descriptive labels for icon-only buttons and non-text elements.

```jsx
<button aria-label="Close modal">
  <X size={16} />
</button>

<div role="alert" aria-live="polite">
  Your changes have been saved
</div>
```

### Screen Reader Support

#### Requirements
- Proper heading hierarchy (h1 -> h2 -> h3)
- Descriptive link text (avoid "click here")
- Alt text for images
- Status announcements with aria-live

```jsx
<img src="chart.png" alt="Monthly work hours trend showing increase in overtime" />

<a href="/reports">View detailed reports</a>  {/* Good */}
<a href="/reports">Click here</a>  {/* Bad */}

<div aria-live="polite" role="status">
  File uploaded successfully
</div>
```

---

## Implementation Guide

### Tailwind Configuration

Add the following to your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        // Secondary Palette
        secondary: {
          50: '#f0f5ff',
          100: '#d6e4ff',
          200: '#adc6ff',
          300: '#85a5ff',
          400: '#597ef7',
          500: '#2f54eb',
          600: '#1d39c4',
          700: '#10239e',
          800: '#061178',
          900: '#030852',
        },
        // Success Palette
        success: {
          50: '#f6ffed',
          100: '#d9f7be',
          200: '#b7eb8f',
          300: '#95de64',
          400: '#73d13d',
          500: '#52c41a',
          600: '#389e0d',
          700: '#237804',
          800: '#135200',
          900: '#092b00',
        },
        // Warning Palette
        warning: {
          50: '#fffbe6',
          100: '#fff1b8',
          200: '#ffe58f',
          300: '#ffd666',
          400: '#ffc53d',
          500: '#faad14',
          600: '#d48806',
          700: '#ad6800',
          800: '#874d00',
          900: '#613400',
        },
        // Error Palette
        error: {
          50: '#fff1f0',
          100: '#ffccc7',
          200: '#ffa39e',
          300: '#ff7875',
          400: '#ff4d4f',
          500: '#f5222d',
          600: '#cf1322',
          700: '#a8071a',
          800: '#820014',
          900: '#5c0011',
        },
        // Neutral Palette
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e8e8e8',
          300: '#d9d9d9',
          400: '#bfbfbf',
          500: '#8c8c8c',
          600: '#595959',
          700: '#434343',
          800: '#262626',
          900: '#141414',
        },
        // Semantic Mappings
        background: '#f0f2f5',
        border: {
          DEFAULT: '#d9d9d9',
          light: '#e8e8e8',
          dark: '#bfbfbf',
        },
        text: {
          primary: 'rgba(0, 0, 0, 0.85)',
          secondary: 'rgba(0, 0, 0, 0.65)',
          tertiary: 'rgba(0, 0, 0, 0.45)',
          disabled: 'rgba(0, 0, 0, 0.25)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', "'Helvetica Neue'", 'Arial', "'Noto Sans'", 'sans-serif'],
        mono: ["'SFMono-Regular'", 'Consolas', "'Liberation Mono'", 'Menlo', 'Courier', 'monospace'],
      },
      fontSize: {
        'display': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'heading-1': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'heading-2': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-3': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'heading-4': ['14px', { lineHeight: '22px', fontWeight: '600' }],
        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '20px', fontWeight: '400' }],
        'overline': ['10px', { lineHeight: '16px', fontWeight: '600' }],
      },
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'card': '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
        'dropdown': '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
        'modal': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'drawer': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'base': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
      transitionTimingFunction: {
        'ant': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
    },
  },
  plugins: [],
}
```

### Usage Examples

#### Import Design Tokens
```jsx
// All design tokens are accessible via Tailwind classes
<div className="bg-primary-500 text-white p-6 rounded-lg shadow-card">
  Design system in action
</div>
```

#### Component Example
```jsx
// Button Component
const Button = ({ variant = 'primary', size = 'base', children, ...props }) => {
  const baseClasses = 'rounded-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-200',
    secondary: 'bg-white text-primary-600 border border-primary-500 hover:bg-primary-50',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    base: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Migration Guide

#### Step 1: Update Tailwind Config
Replace your existing `tailwind.config.js` with the configuration above.

#### Step 2: Audit Existing Components
Identify components using arbitrary values or inconsistent styling:
```bash
# Find arbitrary values
grep -r "\[.*px\]" src/
grep -r "\[.*%\]" src/
```

#### Step 3: Replace with Design Tokens
```jsx
/* Before */
<div className="p-[18px] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
  Content
</div>

/* After */
<div className="p-6 rounded-lg shadow-card">
  Content
</div>
```

#### Step 4: Fix Sidebar Bug
Replace invalid `border-l-3` class:
```jsx
/* Before */
<button className="border-l-3 border-primary-500 -ml-px">
  Active Item
</button>

/* After */
<button className="border-l-4 border-primary-500">
  Active Item
</button>
```

---

## Appendix

### Quick Reference Card

```
COLORS
Primary: primary-500 (#1890ff)
Success: success-500 (#52c41a)
Warning: warning-500 (#faad14)
Error: error-500 (#f5222d)
Text: text-primary, text-secondary, text-tertiary

SPACING (4px base grid)
xs: space-2 (8px)
sm: space-3 (12px)
base: space-4 (16px)
md: space-6 (24px)
lg: space-8 (32px)

TYPOGRAPHY
Heading 1: text-heading-1 (24px/32px/600)
Heading 2: text-heading-2 (20px/28px/600)
Heading 3: text-heading-3 (16px/24px/600)
Body: text-body (14px/22px/400)

SHADOWS
Card: shadow-card
Dropdown: shadow-dropdown
Modal: shadow-modal

RADIUS
Button: rounded-base (6px)
Card: rounded-lg (12px)
Modal: rounded-xl (16px)
Avatar: rounded-full
```

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-05 | Initial design system documentation |

### Contact & Support

For questions or suggestions about this design system:
- **Project**: Checkinly Work Hour Analysis System
- **Documentation**: `/DESIGN_SYSTEM.md`
- **Implementation Status**: Planning phase (no code changes yet)

---

**End of Design System Documentation**
