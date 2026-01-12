# TrueNAS Docs-Shared Module (TrueShared2026)

## Overview

The `docs-shared` module provides a shared theme and components for TrueNAS documentation sites. This `TrueShared2026` branch contains the improved theme extracted from `connect-docs`, built on Docsy v0.13.0.

**This branch will eventually replace the `main` branch when legacy documentation sites are retired.**

## What's Included

### Theme Components

#### Layouts & Partials
- **Navbar** (`/layouts/partials/navbar.html`) - Custom TrueNAS navigation with docs-hub dropdown
- **Footer** (`/layouts/partials/footer.html`) - Modern footer matching TrueNAS branding
- **TrueNAS Header** (`/layouts/partials/truenas-header.html`) - Site header with responsive menu
- **Theme Toggle** (`/layouts/partials/navbar-theme-toggle.html`) - Light/dark mode switcher
- **Search** (`/layouts/partials/search-pagefind.html`, `search-simple.html`) - Pagefind integration
- **Hooks** (`/layouts/partials/hooks/head-end.html`, `body-start.html`) - CSS/JS injection points (2178 lines!)
- **Print** (`/layouts/partials/print/render.html`) - Print-optimized layouts
- **Utilities** (`/layouts/partials/utils/doctype-label.html`) - Document type badges

#### Shortcodes (18 total)
- **Layout**: `blocks/feature.html`, `doc-card.html` - Card grids for landing pages
- **Content**: `codeblock.html`, `expand.html`, `trueimage.html`, `truetable.html`
- **Navigation**: `children.html`, `changelog-navigator.html`
- **Documentation**: `field.html`, `enterprise.html`, `hint.html`, `include.html`, `pageinfo.html`
- **Rendering**: `render-screen.html`, `render-section.html`, `screen.html`, `section.html`
- **Utilities**: `themed-icon.html`

#### Styling
- **SCSS Variables** (`/assets/scss/_variables_project.scss`) - TrueNAS colors and theme (2810 lines)
  - Primary: `#0095d5` (TrueNAS Blue)
  - Secondary: `#71BF44` (TrueNAS Green)
- **Bootstrap Overrides** (`/assets/scss/_variables_project_after_bs.scss`) - Table styling
- **Utilities** (`/assets/scss/support/_utilities.scss`) - Helper classes

#### Assets
- **Icons** (`/assets/icons/`) - SVG icons (API, apps, TrueNAS mark)
- **Brand Images** (`/static/images/`) - Docs hub wordmarks, logos

## How to Use This Module

### Import in Hugo Site

Add to your `hugo.toml` or `config.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/truenas/docs-shared"
    # For local development:
    # replace = "../docs-shared"

  [[module.imports]]
    path = "github.com/google/docsy"
    disable = false
```

**Important**: Import `docs-shared` BEFORE Docsy to ensure correct template precedence.

### Update go.mod

```go
require (
    github.com/truenas/docs-shared v0.0.0-00000000000000-000000000000 // indirect
)

// For local development:
replace github.com/truenas/docs-shared => ../docs-shared
```

### Initialize Modules

```bash
hugo mod get github.com/truenas/docs-shared
hugo mod get -u  # Update all modules
hugo mod clean   # Clear module cache
```

## Site-Specific Customization

### Override Templates

To customize any template, create the same file path in your site's `/layouts/` directory:

```
your-site/
└── layouts/
    └── partials/
        └── navbar.html  ← Overrides docs-shared/layouts/partials/navbar.html
```

### Override Styles

Create site-specific SCSS with custom values:

```scss
// your-site/assets/scss/_variables_project.scss
$primary: #0099dd;  // Custom blue
@import "docs-shared/scss/variables_project.scss";
```

### Configure via hugo.toml

```toml
[params]
  # Site-specific settings
  title = "Your Site"
  logo = "/images/your-logo.svg"

  [params.search]
    siteName = "Your Site"
    siteKey = "yoursite"

  [params.ui]
    showLightDarkModeMenu = true
```

## Sites Using This Module

- **TrueNAS Docs Hub** (`/docs`) - Landing page with card grid
- **TrueNAS Connect** (`/connect-docs`) - Connect documentation

## Migration from Local Theme

If you have a site with local theme files, follow these steps:

1. **Backup**: Create a backup branch
2. **Update configs**: Add module imports to `hugo.toml` and `go.mod`
3. **Remove local files**: Delete layouts/partials/shortcodes now provided by module
4. **Test**: Build site and compare to baseline
5. **Deploy**: Merge when tests pass

See the implementation plan for detailed migration steps.

## Development Workflow

### Local Module Development

```bash
# Make changes in docs-shared
cd /path/to/docs-shared

# Test in consuming site
cd /path/to/your-site
# Ensure go.mod has: replace github.com/truenas/docs-shared => ../docs-shared
hugo serve

# Commit when ready
cd /path/to/docs-shared
git add .
git commit -m "Update navbar dropdown"
git push origin TrueShared2026
```

### Version Pinning

For production stability, pin to specific commit:

```bash
hugo mod get github.com/truenas/docs-shared@abc123def
```

Or in `go.mod`:

```go
require github.com/truenas/docs-shared v0.0.0-20260115123456-abcdef123456
```

## Theme Features

### Responsive Navigation
- Desktop: Full navbar with dropdown menus
- Mobile: Hamburger menu with slide-out drawer

### Light/Dark Mode
- Automatic theme toggle
- Preserves user preference
- Synced across pages

### Multi-Site Search
- Pagefind integration
- Cross-documentation search
- Filtered by site, section, tags

### Documentation Cards
- Hero sections with cover images
- Card grids for landing pages
- Doctype labels (Tutorial/How-to/Reference)

### Table of Contents
- Auto-generated from headings
- Scroll-based highlighting
- Sticky positioning

## Requirements

- **Hugo**: v0.146.0+ Extended
- **Docsy**: v0.13.0+
- **Bootstrap**: v5.3.8 (via Docsy)
- **Node.js**: v20.x (for PostCSS/Autoprefixer)

## Future Plans

When legacy GeekDoc sites are retired:
1. Merge `TrueShared2026` to `main`
2. Migrate remaining sites (api-docs, apps-web, security)
3. Archive old GeekDoc-based branches

## Support

For questions or issues:
- Check the implementation plan: `/home/dpizappi/.claude/plans/elegant-purring-cook.md`
- Review connect-docs source: `/mnt/c/Users/iXUser/Documents/GitHub/connect-docs`
- File issues in the truenas/docs-shared repository

---

**Version**: TrueShared2026 Branch
**Last Updated**: 2026-01-12
**Based On**: TrueNAS Connect Theme (Docsy v0.13.0)
