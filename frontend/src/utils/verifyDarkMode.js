/**
 * Dark Mode Verification Utility
 * Run this in console to verify dark mode is working correctly
 */

export const verifyDarkMode = () => {
  console.log('🌙 DARK MODE VERIFICATION STARTED');
  console.log('=====================================\n');

  // Check if dark mode is enabled
  const isDarkMode = document.documentElement.classList.contains('dark');
  console.log(`Current Mode: ${isDarkMode ? '🌙 Dark' : '☀️ Light'}`);

  // Check theme in localStorage
  const savedTheme = localStorage.getItem('theme');
  console.log(`Saved Theme: ${savedTheme || 'None'}`);

  // Verify Tailwind dark mode class strategy
  const htmlClasses = document.documentElement.className;
  console.log(`HTML Classes: ${htmlClasses}`);

  // Check for common visibility issues
  const elementsToCheck = [
    { selector: 'nav', name: 'Navbar' },
    { selector: 'aside', name: 'Sidebar' },
    { selector: 'main', name: 'Main Content' },
    { selector: '[class*="text-"]', name: 'Text Elements' },
    { selector: 'svg', name: 'Icons' },
  ];

  console.log('\n📊 COMPONENT VISIBILITY CHECK:\n');

  elementsToCheck.forEach(({ selector, name }) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const firstElement = elements[0];
      const styles = window.getComputedStyle(firstElement);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      console.log(`✅ ${name}:`);
      console.log(`   Count: ${elements.length}`);
      console.log(`   Text Color: ${color}`);
      console.log(`   Background: ${backgroundColor}\n`);
    } else {
      console.log(`❌ ${name}: Not found\n`);
    }
  });

  // Check for problematic color combinations
  console.log('🎨 CHECKING FOR VISIBILITY ISSUES:\n');

  const allElements = document.querySelectorAll('*');
  let invisibleCount = 0;
  const invisibleElements = [];

  allElements.forEach((el) => {
    const styles = window.getComputedStyle(el);
    const color = styles.color;
    const bg = styles.backgroundColor;

    // Check if text is too similar to background
    if (color && bg && color !== 'rgba(0, 0, 0, 0)' && bg !== 'rgba(0, 0, 0, 0)') {
      const textRGB = color.match(/\d+/g);
      const bgRGB = bg.match(/\d+/g);

      if (textRGB && bgRGB) {
        const diff = Math.abs(
          (parseInt(textRGB[0]) + parseInt(textRGB[1]) + parseInt(textRGB[2])) -
          (parseInt(bgRGB[0]) + parseInt(bgRGB[1]) + parseInt(bgRGB[2]))
        );

        if (diff < 100) { // Low contrast
          invisibleCount++;
          invisibleElements.push({
            element: el.tagName,
            class: el.className,
            text: el.textContent?.substring(0, 30),
          });
        }
      }
    }
  });

  if (invisibleCount > 0) {
    console.log(`⚠️  Found ${invisibleCount} elements with low contrast`);
    console.log('Sample problematic elements:', invisibleElements.slice(0, 5));
  } else {
    console.log('✅ No visibility issues detected!');
  }

  console.log('\n=====================================');
  console.log('🎉 VERIFICATION COMPLETE!');

  return {
    isDarkMode,
    savedTheme,
    invisibleCount,
    status: invisibleCount === 0 ? 'PASS' : 'NEEDS ATTENTION',
  };
};

// Make available globally
if (typeof window !== 'undefined') {
  window.verifyDarkMode = verifyDarkMode;
}

export default verifyDarkMode;
