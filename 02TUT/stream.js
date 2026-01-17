const fs = require('fs');
//const path = require('path');
const rs = fs.createReadStream('./files/lorem.txt', { encoding: 'utf-8' });
const ws = fs.createWriteStream('./files/output2.txt', { encoding: 'utf-8' });

// rs.on('data', (chunk) => {
//     ws.write(chunk);
// });

rs.pipe(ws);