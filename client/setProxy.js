const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

const serverIp = process.env.SERVER_IP || 'localhost';
packageJson.proxy = `http://${serverIp}:8000`;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Proxy set to: ${packageJson.proxy}`);