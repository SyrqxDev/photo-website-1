const fs = require('fs');
const path = require('path');

const galleriesDir = path.join(__dirname, 'galleries');

fs.readdirSync(galleriesDir).forEach(folder => {
    const fullPath = path.join(galleriesDir, folder);
    if (!fs.statSync(fullPath).isDirectory()) return;

    const images = fs.readdirSync(fullPath)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && f !== 'manifest.json')
        .sort();

    fs.writeFileSync(
        path.join(fullPath, 'manifest.json'),
        JSON.stringify(images, null, 2)
    );

    console.log(`Generated manifest for ${folder}`);
});