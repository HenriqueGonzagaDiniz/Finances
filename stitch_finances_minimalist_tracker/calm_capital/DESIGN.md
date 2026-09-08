---
name: Calm Capital
colors:
  surface: '#f8faf8'
  surface-dim: '#d8dad9'
  surface-bright: '#f8faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f2'
  surface-container: '#eceeec'
  surface-container-high: '#e6e9e7'
  surface-container-highest: '#e1e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#40493d'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#eff1ef'
  outline: '#707a6c'
  outline-variant: '#bfcaba'
  surface-tint: '#1b6d24'
  primary: '#0d631b'
  on-primary: '#ffffff'
  primary-container: '#2e7d32'
  on-primary-container: '#cbffc2'
  inverse-primary: '#88d982'
  secondary: '#286b33'
  on-secondary: '#ffffff'
  secondary-container: '#abf4ac'
  on-secondary-container: '#2e7238'
  tertiary: '#4d5950'
  on-tertiary: '#ffffff'
  tertiary-container: '#657167'
  on-tertiary-container: '#e8f5e9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f69c'
  primary-fixed-dim: '#88d982'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005312'
  secondary-fixed: '#abf4ac'
  secondary-fixed-dim: '#90d792'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#07521d'
  tertiary-fixed: '#d9e6da'
  tertiary-fixed-dim: '#bdcabe'
  on-tertiary-fixed: '#131e17'
  on-tertiary-fixed-variant: '#3e4a41'
  background: '#f8faf8'
  on-background: '#191c1b'
  surface-variant: '#e1e3e1'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The brand personality of the design system is centered on "Calm Confidence." Finance is often a source of anxiety; this design system aims to replace that stress with a sense of order, clarity, and encouragement. Drawing inspiration from the utility of Notion and the emotional mindfulness of Headspace, the aesthetic is **Minimalist-Modern**.

The target audience is individuals seeking a mindful approach to their money—users who value simplicity over complex data density. The UI evokes an emotional response of being "held"—safe, organized, and clear. It avoids the aggressive "growth" tropes of traditional fintech in favor of a sustainable, organic feel. 

**Design Style: Minimalist & Tactile**
- **Clarity:** Heavy use of whitespace to reduce cognitive load.
- **Warmth:** Soft green tints in neutral surfaces to avoid "clinical" coldness.
- **Approachability:** Softened corners and friendly typography that feels human, not institutional.

## Colors

The palette is rooted in nature to promote a sense of growth and stability. 

- **Primary (Soft Green):** Used for key actions and progress indicators. It is deep enough to provide high contrast against light backgrounds.
- **Secondary (Light Green):** Used for decorative elements, success states, and secondary visual interest.
- **Neutrals:** The background system avoids pure grey. Instead, it uses a very light grey-green (#F5F7F5) for the main app canvas to create a softer, more cohesive environment.
- **Text:** Dark Grey (#1F2937) is used instead of pure black to maintain a softer reading experience while ensuring accessibility compliance.

## Typography

The design system utilizes **Inter** for all levels to leverage its modern, systematic, and highly legible characteristics. 

The type scale is intentionally generous. Headlines use a slightly tighter letter-spacing and heavier weights to feel grounded and authoritative. Body text prioritizes "breathability" with a slightly increased line-height to ensure that even complex financial data feels easy to digest. 

For mobile-specific views, large display sizes are capped to ensure titles do not wrap awkwardly, maintaining the minimalist aesthetic.

## Layout & Spacing

This design system uses a **fluid layout model** for mobile, centered around an 8px grid system. 

- **Margins:** A standard 20px or 24px side margin is used to give the content "air," preventing the UI from feeling cramped.
- **Vertical Rhythm:** Content blocks are separated by 24px (md) or 40px (lg) to clearly demarcate different financial sections (e.g., Spending vs. Savings).
- **Safe Areas:** Adhere strictly to mobile safe areas for navigation bars and island-style notches.
- **Grids:** For cards within the dashboard, a 2-column grid with a 16px gutter is preferred for high-level stats, while single-column lists are used for transaction histories.

## Elevation & Depth

To maintain a "friendly and clean" feel, the design system avoids harsh, dark shadows. Instead, it utilizes **Ambient Tonal Shadows**.

- **Surface Layers:** The main background is the Neutral Grey-Green (#F5F7F5). Primary cards sit on top of this in pure White (#FFFFFF).
- **Shadow Profile:** Shadows are highly diffused (large blur radius) with very low opacity (5-10%). They are tinted with the primary color (#2E7D32) rather than pure black to create a "glow" effect that feels integrated into the environment.
- **Depth Levels:**
    - **Level 0 (Flat):** Used for background and secondary input fields.
    - **Level 1 (Low):** Standard cards and navigation bars.
    - **Level 2 (High):** Floating action buttons (FABs) and active modal sheets.

## Shapes

The shape language is defined by **Rounded** geometry. 

- **Cards:** Standard cards use a 16px (1rem) corner radius. This softens the interface and makes the app feel like a modern lifestyle tool rather than a rigid bank app.
- **Buttons:** Primary buttons use a 12px or fully rounded (pill) style to encourage interaction.
- **Inputs:** Input fields follow the 8px base roundedness to provide a structured but soft container for user data.
- **Icons:** Use icons with rounded terminals and consistent stroke weights to match the typeface.

## Components

### Buttons
- **Primary:** Large, 56px height, Soft Green background with White text. Bold weight.
- **Secondary:** Outlined with Primary Green or Pale Green background with Primary Green text.
- **Tertiary:** Text-only for less frequent actions like "Cancel" or "View All."

### Cards
- **Style:** Pure white background, Level 1 ambient shadow, 16px padding.
- **Usage:** Used for account balances, monthly summaries, and individual budget categories.

### Inputs
- **Style:** 48px-56px height. Background color set to Pale Green (#E8F5E9) for "inactive" and White with a Soft Green border for "active."
- **Labels:** Always placed above the field in `label-md` for maximum clarity.

### Chips & Tags
- **Style:** Small, pill-shaped elements with 50% opacity primary green backgrounds. Used for transaction categories (e.g., "Groceries," "Rent").

### Progress Bars
- **Style:** Thick, 8px height, fully rounded tracks. Use the Secondary Green for progress and Neutral Grey-Green for the track background.

### Navigation
- **Bottom Bar:** Soft-blurred (Glassmorphism effect) or solid White with Level 2 elevation. Icons are accompanied by `label-sm` text.