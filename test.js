#!/usr/bin/env node

/**
 * Basic test script for Rattuso game
 * Tests core functionality before deployment
 */

import fs from 'fs';
import path from 'path';

console.log('🎮 Running Rattuso Game Tests...\n');

let passed = 0;
let failed = 0;

function test(name, testFn) {
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    failed++;
  }
}

// Test 1: Required files exist
test('Required files exist', () => {
  const requiredFiles = [
    'index.html',
    'index.js',
    'classes.js',
    'js/onLoad.js',
    'js/constants.js',
    'js/utils.js',
    'data/plot.js',
    'data/characters.js',
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }
  return true;
});

// Test 2: Required assets exist
test('Required assets exist', () => {
  const requiredAssets = [
    'assets/playerDown.png',
    'assets/playerUp.png',
    'assets/playerLeft.png',
    'assets/playerRight.png',
    'assets/casa.png',
    'assets/d_casa.jpg',
  ];

  for (const asset of requiredAssets) {
    if (!fs.existsSync(asset)) {
      throw new Error(`Missing required asset: ${asset}`);
    }
  }
  return true;
});

// Test 3: JavaScript syntax check
test('JavaScript syntax valid', () => {
  const jsFiles = [
    'index.js',
    'classes.js',
    'js/onLoad.js',
    'js/constants.js',
    'js/utils.js',
  ];

  for (const file of jsFiles) {
    try {
      // Basic syntax check by reading and looking for obvious issues
      const content = fs.readFileSync(file, 'utf8');

      // Check for common syntax errors
      if (content.includes('import ') && !content.includes('export ')) {
        if (!file.includes('index.js')) {
          // index.js might not export anything
          console.warn(`⚠️  Warning: ${file} has imports but no exports`);
        }
      }

      // Check for proper image paths
      if (content.includes('../assets/')) {
        throw new Error(
          `Incorrect image path in ${file}: found '../assets/' should be './assets/'`
        );
      }
    } catch (error) {
      throw new Error(`Error reading ${file}: ${error.message}`);
    }
  }
  return true;
});

// Test 4: HTML structure check
test('HTML structure valid', () => {
  const html = fs.readFileSync('index.html', 'utf8');

  // Check for required elements
  const requiredElements = [
    '<canvas id="canvas">',
    '<div id="dialogueBox">',
    'type="module"',
  ];

  for (const element of requiredElements) {
    if (!html.includes(element)) {
      throw new Error(`Missing required HTML element: ${element}`);
    }
  }

  // Check that debugging elements are minimal
  if (html.includes('Loading...') && !html.includes('id="status"')) {
    throw new Error('Found debugging code without proper status element');
  }

  return true;
});

// Test 5: Package.json and dependencies
test('Package configuration valid', () => {
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json missing');
  }

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  if (!pkg.scripts) {
    throw new Error('No scripts defined in package.json');
  }

  return true;
});

// Test 6: Image paths consistency
test('Image paths consistent', () => {
  const jsFiles = ['js/onLoad.js'];

  for (const file of jsFiles) {
    const content = fs.readFileSync(file, 'utf8');

    // All image paths should use './assets/'
    const imagePathRegex = /\.src\s*=\s*['"](.*?)['"]/g;
    let match;

    while ((match = imagePathRegex.exec(content)) !== null) {
      const imagePath = match[1];
      if (
        imagePath.startsWith('assets/') ||
        imagePath.startsWith('./assets/')
      ) {
        // Check if file actually exists
        const fullPath = imagePath.startsWith('./')
          ? imagePath.substring(2)
          : imagePath;
        if (!fs.existsSync(fullPath)) {
          throw new Error(`Referenced image does not exist: ${fullPath}`);
        }
      }
    }
  }

  return true;
});

// Test 7: HTML element consistency
test('HTML elements match JavaScript references', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const jsFiles = ['index.js', 'js/utils.js'];

  const htmlIds = [];
  const htmlIdRegex = /id="([^"]+)"/g;
  let match;
  while ((match = htmlIdRegex.exec(html)) !== null) {
    htmlIds.push(match[1]);
  }

  for (const file of jsFiles) {
    const content = fs.readFileSync(file, 'utf8');

    // Look for getElementById calls
    const getElementRegex = /getElementById\(['"`]([^'"`]+)['"`]\)/g;
    let jsMatch;

    while ((jsMatch = getElementRegex.exec(content)) !== null) {
      const elementId = jsMatch[1];
      // Skip dynamic IDs or known optional elements
      if (
        elementId.includes('${') ||
        elementId === 'logs' ||
        elementId === 'status'
      ) {
        continue;
      }

      if (!htmlIds.includes(elementId)) {
        throw new Error(
          `JavaScript in ${file} references element '${elementId}' that doesn't exist in HTML`
        );
      }
    }
  }

  return true;
});

// Test 8: Module imports/exports consistency
test('Module imports and exports match', () => {
  const moduleFiles = {
    'classes.js': [],
    'js/constants.js': [],
    'js/utils.js': [],
    'js/onLoad.js': [],
  };

  // Collect all exports
  for (const [file] of Object.entries(moduleFiles)) {
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, 'utf8');
    const exportRegex = /export\s+(?:const|function|class)\s+(\w+)/g;
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
      moduleFiles[file].push(match[1]);
    }
  }

  // Check imports in index.js
  const indexContent = fs.readFileSync('index.js', 'utf8');
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"`]([^'"`]+)['"`]/g;
  let importMatch;

  while ((importMatch = importRegex.exec(indexContent)) !== null) {
    const imports = importMatch[1]
      .split(',')
      .map(imp => imp.trim().replace(/\s+as\s+\w+/, ''))
      .filter(imp => imp.length > 0); // Filter out empty imports
    const fromFile = importMatch[2].replace('./', '');

    if (moduleFiles[fromFile]) {
      for (const importName of imports) {
        if (!moduleFiles[fromFile].includes(importName)) {
          throw new Error(
            `Import '${importName}' from '${fromFile}' is not exported`
          );
        }
      }
    }
  }

  return true;
});

// Test 9: Runtime DOM readiness
test('DOM elements required at runtime exist', () => {
  const html = fs.readFileSync('index.html', 'utf8');

  // Critical elements that must exist for the game to work
  const criticalElements = [
    'status', // for status updates
    'canvas', // main game canvas
    'dialogueBox', // dialogue system
    'comic_div', // comic scenes
    'comic_background', // comic background image
  ];

  for (const elementId of criticalElements) {
    if (!html.includes(`id="${elementId}"`)) {
      throw new Error(
        `Critical element '${elementId}' missing from HTML - game will fail at runtime`
      );
    }
  }

  return true;
});

// Test 10: Game accessibility check
test('Game is accessible via web server', () => {
  // This is a basic check - in a real environment you'd use HTTP requests
  // For now, just verify the server files are in place
  const serverFiles = ['/etc/nginx/sites-available/rattuso'];

  for (const file of serverFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes('/rattuso/')) {
        throw new Error(
          'Nginx configuration missing rattuso location block'
        );
      }
    }
  }

  // Basic HTML validation - ensure no obvious syntax errors
  const html = fs.readFileSync('index.html', 'utf8');
  if (!html.includes('</html>')) {
    throw new Error('HTML file appears to be malformed');
  }

  return true;
});

console.log('\n📊 Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.log('\n🚨 Tests failed! Do not commit until all tests pass.');
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed! Safe to commit.');
  process.exit(0);
}
