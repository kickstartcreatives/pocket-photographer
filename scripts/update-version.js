const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../public/version.json');
const version = {
  version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || Date.now().toString(),
  timestamp: Date.now()
};

fs.writeFileSync(versionFile, JSON.stringify(version));
console.log('Version updated:', version);
