# Claude Development Rules for Rattuso Game

## CRITICAL RULES - NEVER SKIP THESE

### 1. ALWAYS TEST BEFORE COMMITTING
- **NEVER commit without running tests first**
- **NEVER remove debugging code without verifying the game still works**
- Always run `npm test` (if available) before any commit
- Always manually test the deployed URL after changes
- Keep a minimal status indicator when making changes to verify functionality

### 2. IMAGE LOADING VERIFICATION
- Always verify image paths are correct (`./assets/` not `../assets/`)
- Check that all required images exist in the assets folder
- Test image loading on both desktop and mobile
- Ensure proper error handling for broken images

### 3. MOBILE COMPATIBILITY CHECKS
- Test on Chrome mobile after any significant changes
- Verify touch controls work properly
- Check canvas sizing on different screen sizes
- Ensure ES modules load correctly on mobile browsers

### 4. DEBUGGING PROTOCOL
- When adding debugging code, use a consistent pattern:
  ```html
  <div id="status" style="position: fixed; top: 0; left: 0; background: rgba(0,0,0,0.7); color: white; z-index: 9999; padding: 5px; font-size: 11px;">Status</div>
  ```
- Always create a minimal status updater function
- Remove debugging code only AFTER verifying functionality
- Keep debugging commits separate from feature commits

### 5. TESTING REQUIREMENTS
- Create automated tests for core game functionality
- Test image loading, module imports, and game loop startup
- Verify mobile controls work correctly
- Test both HTTP and HTTPS deployment

## DEVELOPMENT WORKFLOW

### Before Making Changes
1. Read this file
2. Understand what you're changing
3. Plan how to test the changes

### While Making Changes
1. Add minimal debugging/status indicators
2. Test frequently during development
3. Verify changes work on mobile

### Before Committing
1. Run all tests (automated + manual)
2. Test the deployed URL manually
3. Verify mobile compatibility
4. Only remove debugging code if tests pass
5. Create meaningful commit messages

### After Committing
1. Verify the deployed version works
2. Test on multiple devices if possible
3. Monitor for any runtime errors

## COMMON ISSUES TO AVOID

### Image Loading Problems
- Incorrect paths (`../assets/` vs `./assets/`)
- Missing error handling in Sprite class
- Trying to draw broken images (InvalidStateError)

### Mobile Issues
- Canvas sizing problems
- Touch event handling
- ES module compatibility
- Viewport configuration

### Module Loading
- Import/export syntax errors
- Missing dependencies
- Path resolution issues

## TESTING CHECKLIST

### Manual Tests (Required Before Each Commit)
- [ ] Game loads on desktop Chrome
- [ ] Game loads on mobile Chrome
- [ ] Images display correctly
- [ ] Touch controls work (mobile)
- [ ] Keyboard controls work (desktop)
- [ ] No console errors
- [ ] Game reaches playable state

### Automated Tests (To Be Implemented)
- [ ] Image loading tests
- [ ] Module import tests
- [ ] Canvas initialization tests
- [ ] Game loop startup tests

## FILE STRUCTURE AWARENESS
```
/var/www/html/rattuso/
├── index.html          # Main game page
├── index.js           # Main game logic (ES module)
├── classes.js         # Sprite classes
├── js/
│   ├── onLoad.js      # Asset loading
│   ├── constants.js   # Game constants
│   └── utils.js       # Utility functions
├── assets/            # Game images (use ./assets/ paths)
├── styles/            # CSS files
└── data/              # Game data files
```

## NGINX CONFIGURATION
- Game served from `/var/www/html/rattuso/`
- Accessible at `https://65.21.146.140/rattuso/`
- Proper MIME types configured for JS modules
- SSL with self-signed certificates

## ERROR PATTERNS TO WATCH FOR
1. `InvalidStateError: Failed to execute 'drawImage'` → Image loading issue
2. Module import errors → Path or syntax problems
3. Canvas sizing issues → Mobile viewport problems
4. Touch event failures → Mobile control problems

## REMEMBER
- **The game has been working before - if it breaks, something specific changed**
- **Always test the obvious things first (loading, images, modules)**
- **Mobile Chrome is often the most problematic - test it specifically**
- **When in doubt, add debugging and investigate step by step**

---

*This file should be read before making any changes to the Rattuso game codebase.*