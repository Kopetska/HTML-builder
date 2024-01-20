const path = require('path');
const fs = require('fs');
const stream = fs.createReadStream(
  path.join('01-read-file', 'text.txt'),
  'utf-8',
);

stream.on('data', (chunk) => console.log(chunk));
