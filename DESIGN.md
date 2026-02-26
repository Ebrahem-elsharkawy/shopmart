# Design & Figma

This app is built to be **responsive** and **layout-ready** so you can match your Figma design with minimal changes.

## Responsive breakpoints (Tailwind)

- **Mobile first**: base styles apply to all screens.
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

## Sticking to Figma

1. **Spacing**: Container padding uses `px-4 sm:px-6`, section padding `py-6 sm:py-10`. Adjust in `tailwind.config` or components to match Figma spacing (e.g. 16px / 24px).
2. **Typography**: Headings use `text-2xl sm:text-4xl` etc. Align font sizes and weights with your Figma type scale.
3. **Colors**: Replace Tailwind classes (e.g. `bg-zinc-900`, `text-primary`) with your Figma palette. Define CSS variables in `globals.css` or extend Tailwind theme.
4. **Components**: Navbar, cards, buttons, and forms live in `src/components`. Update border radius, shadows, and sizes to match Figma components.
5. **Max widths**: Main content uses `max-w-7xl` (1280px). Auth forms use `max-w-md` / `max-w-lg`. Change these to match Figma frame widths.

If you have a Figma link or export, share the spec (spacing, colors, typography) and the UI can be aligned precisely.
