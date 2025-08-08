# TrueNAS Hugo Module Implementation Guide

## Quick Reference

All TrueNAS documentation sites use the shared `docs-shared` Hugo module for common resources while maintaining site-specific functionality through local overrides.

## Docs-Shared Module Contents

This section details what shared resources are available in the `docs-shared` module. When you need to modify common styling, templates, or assets that should be used across multiple sites, these are the files you'll be working with.

### Core Files and Directories

#### `/docs-shared/static/`
- **`custom.css`** (3,319 lines) - Merged CSS from multiple sites
  - Contains styling from documentation, apps-web, and security sites
  - Excludes security site's dark mode override rules
  - Includes doctype label system, ribbons, grid layouts, and responsive design
- **`ixsystems_logo_130_30.svg`** - Shared company logo
- **`truenas_open_storage-logo-full-color-rgb-1.svg`** - Shared product logo

#### `/docs-shared/layouts/`
- **`partials/telemetry-awards.html`** - Hugo template for app popularity badges
  - Fetches telemetry data from API
  - Displays gold/silver/bronze medals based on deployment counts
  - Used by apps-web site for showing popular applications

#### `/docs-shared/scripts/`
- Shared build and cleanup scripts from apps-web
- Python scripts for app documentation generation

#### Other Directories
- `/docs-shared/assets/` - Empty (reserved for future shared assets)
- `/docs-shared/data/` - Empty (reserved for future shared data files)
- `/docs-shared/go.mod` - Hugo module configuration

## Site-Specific Local Overrides

Each site has its own override file that contains styling and functionality that should NOT be shared with other sites. When you need to modify something that's specific to one site's design or behavior, look for the appropriate override file below. These files load after the shared CSS, so they can override or extend the common styling.

### Apps-Web Overrides (`/apps-web/static/css/apps-web-overrides.css`)

**Purpose**: Maintains apps-web specific functionality that shouldn't be shared across all sites.

**Key Override Categories**:

1. **Section Box Styling**
   - Restores missing `position: relative` and `padding: 1rem` properties
   - Fixes external link and material icon styling

2. **Ribbon System** (Kind Labels)
   - Absolute positioning for ribbons (Official, Project, Community, etc.)
   - Color coding: Green default, Blue for Official
   - Proper z-index and border radius styling

3. **Image Sizing Fixes**
   - `.app-card-img`: 10em width, 10rem height for app catalog cards
   - `.prod-card-img`: 80px width, auto height for doc cards
   - Overrides shared CSS that forced 15em height

4. **Telemetry Awards Positioning**
   - Popular app badges positioned absolutely within cards
   - Specific dimensions and placement for gold/silver/bronze medals

5. **Grid Layout System**
   - 4-column responsive grid for docs-sections
   - Media queries for 3-col (99rem), 2-col (83rem), 1-col (50rem)
   - Proper gap and padding specifications

6. **Typography and Spacing**
   - Paragraph margins and line-height for section boxes
   - Prevents template dynamic padding from being overridden
   - Maintains proper spacing for doctype labels and ribbons

### API Docs Site Overrides (`/api-docs/static/css/api-docs-overrides.css`)

**Purpose**: Maintains API docs unique GeekDoc theme design and TrueNAS branding while using shared module.

**Key Override Categories**:

1. **TrueNAS Branding**
   - Inter font family consistency across all elements
   - Brand logo sizing (max-width: 8em)
   - Header icon dimensions (1.5rem x 1.5rem)

2. **API Version Buttons**
   - Grid layout for version selection (auto-fit, minmax 120px)
   - Color coding: Current (blue), Latest Maintenance (green), Previous (gray), Next (blue)
   - Hover effects and transitions
   - Responsive design for mobile devices

3. **Apps Banner Styling** 
   - Background image from `/images/Apps-Hero-Bg.png`
   - Proper typography (42px heading, 25px text, 19px button)
   - Flexbox layout with image positioning
   - Green download button (#71bf44) with hover states

4. **Responsive Adjustments**
   - Mobile breakpoints for version grid and banner layout
   - Font size scaling for smaller screens
   - Image positioning adjustments

**Additional API Docs Files**:
- `layouts/partials/site-header.html` - TrueNAS branded header
- `layouts/partials/head/custom.html` - CSS override link
- `layouts/shortcodes/api_versions.html` - Restored from GitHub

### Security Site Overrides (`/security/hugo-site/static/css/security-overrides.css`)

**Purpose**: Maintains security site's unique styling and functionality while using shared module resources.

**Key Override Categories**:

1. **TrueNAS Brand Font Import**
   - Imports "DIN 2014" font family from Google Fonts
   - Overrides shared CSS "Inter" font for headers and brand elements
   - Liberation Sans for body text with proper rendering optimizations

2. **Container Width and Navigation**
   - Sets `max-width: 90rem` instead of shared CSS 100rem
   - Hides navigation sidebar (`gdoc-nav`) for simplified layout

3. **Security Sections Grid**
   - 4-column responsive grid layout for security product boxes
   - Media queries: 2-col (50rem), 1-col (25rem)
   - Card styling with shadows, hover effects, and rounded corners
   - Instant color changes (no transitions) for consistent hover behavior

4. **Security-Specific Data Tables**
   - Table container with 40rem max-height and scroll
   - Full-width table elements to match container
   - Expandable row functionality for CVE details
   - Advisory details section styling
   - Response impact color coding (critical=red, medium=yellow, low=green)

5. **Custom Checkbox and Form Elements**
   - Blue-themed checkboxes matching TrueNAS branding (#0095D5)
   - CVE search input with light mode forced styling
   - Custom appearance with opacity transitions and focus states

6. **Sortable Table Elements**
   - Search box styling with full-width constraints
   - Sort indicator arrows (▲ for asc, ▼ for desc)
   - SBOM download button (hidden by default)

7. **Light Mode Forced Elements**
   - Forces light mode for all gdoc-expand elements (containers, heads, content)
   - CVE search input and button styling (white backgrounds, proper contrast)
   - Prevents automatic dark mode activation on security site
   - Comprehensive background overrides for all nested elements

8. **Layout and Width Overrides**
   - Footer spans full viewport width (removes margin constraints at large screens)
   - Table containers and all table elements span full width
   - Eliminates white margins that appear above 1450px viewport width

**Additional Security Site Files**:
- `hugo-site/layouts/partials/head/custom.html` - CSS override link

## Dynamic Template System

The shared module includes Hugo templates that provide dynamic functionality across sites. Understanding how these work is important when troubleshooting layout issues or adding new content types.

### Doc-Card Template Features

The shared `doc-card.html` shortcode provides the card layout system used across documentation sites. It includes:

1. **Dynamic Padding Calculation**
   ```hugo
   padding-top: 
   {{ if and $showLabel $showRibbon }}3rem
   {{ else if $showLabel }}2.8rem  
   {{ else if $showRibbon }}1.5rem
   {{ else }}0rem
   {{ end }};
   ```

2. **Ribbon Types** (Kind Labels)
   - `official` - Blue ribbon for TrueNAS team docs
   - `project` - Green ribbon for upstream project docs  
   - `community` - Green ribbon for community docs
   - `post` - Green ribbon for forum/community posts
   - `blog` - Green ribbon for blog posts

3. **Doctype Labels** (Diataxis System)
   - `tutorial` - Green border (#75bf44)
   - `how-to` - Blue border (#31BEEC)
   - `reference` - Purple border (#A593E0)
   - `foundations` - Orange border (#FF9800)

## Jenkins Pipeline Integration

The Hugo module system is integrated into Jenkins deployment pipelines to automatically pull the latest shared resources during builds. This means that when you update the `docs-shared` module, all sites will automatically get those changes on their next deployment - no manual intervention required.

All implementing sites include Hugo module updates in their Jenkins pipelines:

```bash
# Update Hugo modules before building
hugo mod clean
hugo mod get -u
```

**Updated Pipeline Files**:
- `/documentation/jenkins/update-master`
- `/documentation/jenkins/update-dev1` 
- `/documentation/jenkins/update-scale-next`
- `/apps-web/jenkins/update-main`
- `/api-docs/jenkins/update-main`
- `/security/jenkins/security-hugo.sh`

## Local Development Commands

While Jenkins automatically updates modules during deployment, when developing locally you need to manually update the modules to get the latest shared resources. This ensures your local testing environment matches what will be deployed.

```bash
# Update modules (run before local testing)
cd /path/to/your/site
hugo mod clean
hugo mod get -u

# Verify module loaded
hugo mod graph
```

**When to Run Manual Updates**:
- After changes are made to the docs-shared module (to pull in latest changes)
- When troubleshooting CSS or template issues that might be fixed in newer shared resources
- When you specifically need the very latest shared resources for your work

**Note**: Jenkins handles module updates automatically during deployment, so manual updates are only needed for local development testing.

## File Location Quick Reference

This section provides a quick lookup for finding specific files when you need to make updates. Check the shared resources first - if what you need isn't there, look in the appropriate site's local override files.

### Shared Resources (docs-shared)
- **Main CSS**: `/docs-shared/static/custom.css`
- **App Badges**: `/docs-shared/layouts/partials/telemetry-awards.html`
- **Logos**: `/docs-shared/static/ixsystems_logo_130_30.svg`

### Local Overrides
- **Apps-Web**: `/apps-web/static/css/apps-web-overrides.css`
- **API Docs**: `/api-docs/static/css/api-docs-overrides.css`
- **Security**: `/security/hugo-site/static/css/security-overrides.css`

### Pipeline Files
- **Documentation**: `/documentation/jenkins/update-*`
- **Apps-Web**: `/apps-web/jenkins/update-main`
- **API Docs**: `/api-docs/jenkins/update-main`
- **Security**: `/security/jenkins/security-hugo.sh`

---

*Updated: 2025-01-08 | Status: Project Complete*