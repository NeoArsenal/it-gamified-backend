const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walk(full));
    else if (entry.name.endsWith('.ts')) results.push(full);
  }
  return results;
}

const srcDir = path.join(__dirname, 'src');
let fixed = 0;

for (const file of walk(srcDir)) {
  let content = fs.readFileSync(file, 'utf8');
  // Add .js to relative imports that don't already have it
  const updated = content.replace(/from\s+'(\.\.?\/[^']+?)(?<!\.js)'/g, "from '$1.js'");
  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log('Fixed:', path.relative(srcDir, file));
    fixed++;
  }
}
console.log(`\nDone. Fixed ${fixed} files.`);
