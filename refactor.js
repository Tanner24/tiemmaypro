const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

if (!fs.existsSync('modules')) {
    fs.mkdirSync('modules');
}

let newHtml = html;
const pagesRegex = /<section class="page([^"]*)" id="page-([^"]+)">(.*?)<\/section>/gs;
const pageIds = [];

newHtml = newHtml.replace(pagesRegex, (match, classes, pageId, innerHtml) => {
    pageIds.push(pageId);

    // Escape backticks and dollar signs for template literals
    const escapedInnerHtml = innerHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$');

    const safeId = pageId.replace(/-/g, '_');
    const jsContent = `// Module: ${pageId}\n` +
        `const html_${safeId} = \`${escapedInnerHtml}\`;\n` +
        `document.getElementById('page-${pageId}').innerHTML = html_${safeId};\n`;

    fs.writeFileSync(`modules/${pageId}.js`, jsContent);
    console.log(`Extracted modules/${pageId}.js`);

    return `<section class="page${classes}" id="page-${pageId}"></section>`;
});

// Insert script tags into index.html just before app.js
const scriptTags = pageIds.map(id => `    <script src="modules/${id}.js"></script>`).join('\n');
newHtml = newHtml.replace('<script src="app.js"></script>', `<!-- Modules -->\n${scriptTags}\n\n    <script src="app.js"></script>`);

fs.writeFileSync('index.html', newHtml);
console.log('Refactoring complete. Total modules extracted:', pageIds.length);
