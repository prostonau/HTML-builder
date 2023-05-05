// const fs = require('fs');
// const path = require('path');

// fs.readFile(
//     path.join(__dirname, '01-read-file', '../text.txt'),
//     'utf-8',
//     (err, data) => {
//         if (err) throw err;
//         console.log(data);
//     }
// );

const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.join(__dirname, '01-read-file', '../text.txt'),'utf-8');
readableStream.on('data', chunk => console.log(chunk));
