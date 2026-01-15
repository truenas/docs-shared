# Pagefind Search Setup Guide

## Overview

The `docs-shared` module provides common Pagefind search configuration for TrueNAS documentation sites. This guide explains how to enable search indexing for your Hugo site.

## What's Included in the Module

The `docs-shared` module automatically provides:

1. **Template Modifications** (`layouts/_default/single.html`)
   - Adds `data-pagefind-body` attribute to mark content for indexing
   - Adds `data-pagefind-meta` attributes for site identification
   - No manual template changes needed in your site!

2. **Configuration Template** (`pagefind.template.yml`)
   - Ready-to-use Pagefind configuration
   - Pre-configured with common exclusions

## Setup Steps

### 1. Add Search Configuration to Your Site

Add the following to your site's `config.toml`:

```toml
[params.search]
  siteName = "Your Site Name"      # Display name in search results
  siteKey = "your-site-key"        # Unique identifier (lowercase, no spaces)
  siteIcon = "/path/to/icon.png"   # Icon for search results
  sitePriority = 1                 # Lower = higher priority in results
```

**Example for Apps Site:**
```toml
[params.search]
  siteName = "TrueNAS Apps"
  siteKey = "apps"
  siteIcon = "/images/TN_Open_Enterprise_Storage_White_Version.png"
  sitePriority = 2
```

### 2. Copy Pagefind Configuration

Copy the template configuration to your site root:

```bash
# From your site directory
cp path/to/docs-shared/pagefind.template.yml pagefind.yml
```

Or create `pagefind.yml` in your site root with these contents:

```yaml
site: public
output_path: public/pagefind

exclude_selectors:
  - 'nav'
  - 'footer'
  - '.gdoc-nav'
  - '.gdoc-footer'
  - '.gdoc-nav--main'
  - '.gdoc-nav--more'
  - '.gdoc-page__header'
  - '.gdoc-page__footer'
  - '.gdoc-search'
  - '#search-modal'
  - '[data-pagefind-ignore]'

keep_index_url: true
verbose: true
```

**Site-Specific Adjustments:**
- **GeekDoc theme sites** (documentation, apps-web, api-docs, security): Use the template as-is
- **Docsy theme sites** (connect-docs): Add these additional exclusions:
  ```yaml
  - '.td-navbar'
  - '.td-sidebar'
  - '.td-toc'
  - '.td-page-meta'
  ```

### 3. Build Your Site with Search Index

```bash
# Build Hugo site
hugo

# Generate search index
npx pagefind --site public
```

This creates a `public/pagefind/` directory with:
- `pagefind.js` - Search engine
- Index files - Searchable content
- Fragment files - Search results

### 4. Verify Index Generation

Check that the index was created:

```bash
ls -la public/pagefind/
# Should show: pagefind.js, pagefind.en_*.pf_meta, wasm files, etc.
```

## Integration with Multi-Site Search

If your site participates in the TrueNAS multi-site search (hosted on the Documentation Hub):

1. **Your site provides**: The Pagefind index at `https://yoursite.com/pagefind/`
2. **Documentation Hub consumes**: Loads and searches your index remotely
3. **Users search from**: Documentation Hub only (your site doesn't need search UI)

### Requirements for Multi-Site Search

1. ✅ Search configuration in `config.toml` (as shown above)
2. ✅ Pagefind index generated (`npx pagefind`)
3. ✅ Index deployed to production at `/pagefind/` path
4. ✅ CORS enabled (allow Documentation Hub to load your index)

## Build Automation

### Add to Your Build Script

```bash
#!/bin/bash
# build.sh

echo "Building Hugo site..."
hugo

echo "Generating search index..."
npx pagefind --site public

echo "Build complete!"
```

### Add to CI/CD Pipeline

**GitHub Actions Example:**
```yaml
- name: Build Hugo site
  run: hugo

- name: Generate search index
  run: npx pagefind --site public
```

**Jenkins Example:**
```groovy
stage('Build') {
  steps {
    sh 'hugo'
    sh 'npx pagefind --site public'
  }
}
```

## Excluding Content from Search

### Method 1: Page-Level Exclusion

Add to page frontmatter:
```yaml
---
title: "My Page"
pagefind: false
---
```

### Method 2: Element-Level Exclusion

Add `data-pagefind-ignore` attribute:
```html
<div data-pagefind-ignore>
  This content won't be indexed
</div>
```

### Method 3: CSS Class

Use the `.no-search` class (defined in pagefind.yml):
```html
<div class="no-search">
  This content won't be indexed
</div>
```

## Troubleshooting

### Index Not Generated

**Problem**: `public/pagefind/` directory doesn't exist

**Solutions:**
1. Check that `hugo` built successfully
2. Verify `public/` directory exists
3. Run `npx pagefind --site public --verbose` for detailed output
4. Check `pagefind.yml` path is correct

### Empty Search Results

**Problem**: Index generated but no results found

**Solutions:**
1. Verify templates include `data-pagefind-body` (provided by module)
2. Check that content isn't excluded by `exclude_selectors`
3. Inspect HTML: `grep "data-pagefind-body" public/**/*.html`
4. Run with `--verbose` flag to see what's indexed

### Site Metadata Missing

**Problem**: Search results show "Unknown Site"

**Solutions:**
1. Verify `[params.search]` section in `config.toml`
2. Check `siteName` and `siteKey` are defined
3. Rebuild site after config changes

### Cross-Origin Errors (Multi-Site Search)

**Problem**: Documentation Hub can't load your index

**Solutions:**
1. Ensure index is deployed at `/pagefind/` path
2. Configure CORS headers to allow Documentation Hub domain
3. Check browser console for specific CORS errors

## Testing Locally

### Test Single-Site Index

```bash
# Build and index
hugo && npx pagefind --site public

# Serve locally
hugo serve

# Test by searching (if your site has search UI)
# Or verify files exist: ls public/pagefind/
```

### Test Multi-Site Integration

See Documentation Hub's `LOCAL_SEARCH_TESTING.md` for instructions on testing multi-site search locally.

## File Size Considerations

Pagefind indexes are typically small:
- **Small site** (50 pages): ~100-200 KB
- **Medium site** (500 pages): ~500 KB - 1 MB
- **Large site** (5000 pages): ~3-5 MB

The index is lazy-loaded, so it doesn't impact initial page load.

## Module Updates

When `docs-shared` module is updated:

```bash
# Update module
hugo mod get -u

# Rebuild site
hugo && npx pagefind --site public
```

Template changes automatically apply since `single.html` comes from the module.

## Support

- **Pagefind Documentation**: https://pagefind.app/
- **Module Issues**: https://github.com/truenas/docs-shared/issues
- **TrueNAS Docs**: Contact documentation team

## Site-Specific Examples

### Documentation Site (GeekDoc)
```toml
[params.search]
  siteName = "TrueNAS Documentation"
  siteKey = "docs"
  siteIcon = "/favicon/TN-favicon-32x32.png"
  sitePriority = 1
```

### Apps Site (GeekDoc)
```toml
[params.search]
  siteName = "TrueNAS Apps"
  siteKey = "apps"
  siteIcon = "/images/TN_Open_Enterprise_Storage_White_Version.png"
  sitePriority = 2
```

### Connect Site (Docsy)
```toml
[params.search]
  siteName = "TrueNAS Connect"
  siteKey = "connect"
  siteIcon = "/images/tn-openstorage-logo.png"
  sitePriority = 5
```

Remember: Each site needs its **own unique `siteKey`**!

---

*Part of the TrueNAS docs-shared Hugo module*
*Last updated: October 2025*
