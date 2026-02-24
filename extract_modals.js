const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

let insideModal = false;
let currentModalId = '';
let currentModalHtml = [];
let modalIds = [];
let newLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('<!-- Modal:')) {
        insideModal = true;
        currentModalHtml = [];
    }

    if (insideModal) {
        const idMatch = line.match(/<div class="modal-overlay" id="([^"]+)"/);
        if (idMatch) currentModalId = idMatch[1];

        currentModalHtml.push(line);

        const nextLine = lines[i + 1] || '';
        if (nextLine.includes('<!-- Modal:') || nextLine.includes('<!-- Toast notification -->') || nextLine.includes('<!-- ============ PAGE: SETTINGS')) {
            const modalContent = currentModalHtml.join('\n');
            console.log('Extracted modal:', currentModalId);
            modalIds.push(currentModalId);

            const safeId = currentModalId.replace(/-/g, '_');
            const escapedStr = modalContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');

            let jsContent = `const html_${safeId} = \`${escapedStr}\`;\n`;
            jsContent += `document.body.insertAdjacentHTML('beforeend', html_${safeId});\n`;

            fs.writeFileSync(`modules/${currentModalId}.js`, jsContent);

            insideModal = false;
            currentModalId = '';
        }
    } else {
        newLines.push(line);
    }
}

let finalHtml = newLines.join('\n');
const scriptTags = modalIds.map(id => `    <script src="modules/${id}.js"></script>`).join('\n');
finalHtml = finalHtml.replace('<!-- Modules -->', `<!-- Modules -->\n${scriptTags}`);

// Ensure Toast is still there
fs.writeFileSync('index.html', finalHtml);
console.log('Done! Extracted modals: ', modalIds.length);
