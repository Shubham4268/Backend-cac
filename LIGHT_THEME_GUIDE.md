# Light Theme Implementation Guide

## Overview
This document outlines the changes needed to fully support light theme across the TwiTube application.

## Theme System
- **Redux Slice**: `src/features/slices/themeSlice.js`
- **State**: `theme.theme` - values: `"dark"` or `"light"`
- **Default**: Dark theme
- **Toggle**: Available in Header component

## Components Updated ✅

### 1. ProfileDropdown (`components/Header/ProfileDropdown.jsx`)
**Status**: ✅ COMPLETE
- Dropdown background: White in light mode, gradient gray in dark mode
- Text colors: Gray-900/700 in light, white/gray-300 in dark
- Borders: Gray-200 in light, white/10 in dark
- Hover states: Gray-100 in light, white/5 in dark
- Icons: Indigo-600 hover in light, indigo-400 in dark

## Components Needing Updates 🔄

### 2. VideoComponent (`components/video/VideoComponent.jsx`)
**Priority**: HIGH
**Changes Needed**:
```jsx
// Add theme selector
const theme = useSelector((state) => state.theme.theme);

// Update card background (line ~157)
className={`
  relative rounded-2xl overflow-hidden
  shadow-lg hover:shadow-2xl
  transition-all duration-300
  ${theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"}
`}

// Update text colors (line ~200+)
${theme === "dark" ? "text-white" : "text-gray-900"}
${theme === "dark" ? "text-gray-400" : "text-gray-600"}
```

### 3. Navbar (`components/Navbar.jsx`)
**Priority**: HIGH
**Changes Needed**:
```jsx
// Background (line ~85)
${theme === "dark" 
  ? "bg-gray-900 border-gray-800" 
  : "bg-white border-gray-200"
}

// Text colors
${theme === "dark" ? "text-white" : "text-gray-900"}

// Hover states
${theme === "dark" 
  ? "hover:bg-gray-800" 
  : "hover:bg-gray-100"
}
```

### 4. Header (`components/Header/Header.jsx`)
**Priority**: HIGH
**Changes Needed**:
```jsx
// Background
${theme === "dark" ? "bg-gray-800" : "bg-white border-b border-gray-200"}

// Search input
${theme === "dark" 
  ? "bg-gray-700 text-white border-gray-600" 
  : "bg-gray-100 text-gray-900 border-gray-300"
}
```

### 5. Settings Forms
**Priority**: MEDIUM

#### ChangePassword.jsx
```jsx
// Container
${theme === "dark" 
  ? "bg-slate-800 border-white/10" 
  : "bg-white border-gray-200"
}

// Inputs
${theme === "dark" 
  ? "bg-gray-950/60 text-gray-100 border-white/10" 
  : "bg-gray-50 text-gray-900 border-gray-300"
}
```

#### UpdateAccount.jsx
- Same pattern as ChangePassword

### 6. AddVideoForm (`components/VideoComponents/AddVideoForm.jsx`)
**Priority**: MEDIUM
- Same pattern as Settings forms

### 7. Subscription Page (`pages/Subscription.jsx`)
**Priority**: MEDIUM
**Changes Needed**:
- Background colors
- Tab buttons (already have some theme support)
- Video grid cards
- Tweet cards

### 8. Profile Page (`pages/Profile.jsx`)
**Priority**: MEDIUM
**Changes Needed**:
- Hero section background
- Tab buttons
- Content cards

### 9. Home Page (`pages/Home.jsx`)
**Priority**: MEDIUM
**Status**: ⚠️ PARTIAL (has some theme support)
**Additional Changes**:
- Video grid background
- Pagination buttons
- Sort/filter dropdowns

### 10. Modals
**Priority**: LOW

#### PlaylistModal.jsx
- Already has `dark:` classes
- May need refinement

#### VideoMenu.jsx
```jsx
${theme === "dark" 
  ? "bg-gray-700" 
  : "bg-white border border-gray-200"
}
```

## Color Palette Reference

### Dark Theme
- **Background**: `bg-gray-900`, `bg-gray-800`
- **Surface**: `bg-gray-800/80`, `bg-gray-700`
- **Text Primary**: `text-white`
- **Text Secondary**: `text-gray-300`, `text-gray-400`
- **Border**: `border-white/10`, `border-gray-800`
- **Hover**: `hover:bg-white/5`, `hover:bg-gray-800`

### Light Theme
- **Background**: `bg-white`, `bg-gray-50`
- **Surface**: `bg-white`, `bg-gray-100`
- **Text Primary**: `text-gray-900`
- **Text Secondary**: `text-gray-700`, `text-gray-600`
- **Border**: `border-gray-200`, `border-gray-300`
- **Hover**: `hover:bg-gray-100`, `hover:bg-gray-50`

### Accent Colors (Both Themes)
- **Primary**: `indigo-600` (light), `indigo-500` (dark)
- **Gradient**: `from-indigo-600 to-blue-500`

## Implementation Pattern

### Standard Pattern for Theme Support:
```jsx
import { useSelector } from "react-redux";

function Component() {
  const theme = useSelector((state) => state.theme.theme);
  
  return (
    <div className={`
      base-classes
      ${theme === "dark" 
        ? "dark-specific-classes" 
        : "light-specific-classes"
      }
    `}>
      {/* content */}
    </div>
  );
}
```

## Testing Checklist
- [ ] Toggle theme in Header
- [ ] Check all pages in both themes
- [ ] Verify text readability
- [ ] Check hover states
- [ ] Test modals and dropdowns
- [ ] Verify form inputs
- [ ] Check video cards
- [ ] Test navigation elements

## Notes
- Always ensure sufficient contrast for accessibility
- Use semantic color names (primary, secondary, etc.)
- Test with actual content, not just empty states
- Consider adding a system preference detection option
- Maintain consistent spacing and sizing across themes

## Priority Order
1. ✅ ProfileDropdown (DONE)
2. VideoComponent (Most visible)
3. Navbar (Always visible)
4. Header (Always visible)
5. Home Page
6. Settings Forms
7. Other pages
8. Modals and minor components
