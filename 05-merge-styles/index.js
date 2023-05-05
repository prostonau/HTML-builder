const fs = require('fs');
const path = require('path');
const testFolder = './05-merge-styles/styles/';

fs.writeFile(
  path.join(__dirname, './project-dist/', 'bundle.css'),
  '',
  (err) => {
    if (err) throw err;
    // console.log('The file has been created');
  }
);

fs.readdir(testFolder, {withFileTypes: true}, (err, files) => {
  //console.log(files);
  files.forEach(file => {       
    if (file.isFile() && path.extname(file.name).slice(1, file.name.length) === 'css') {     
      //console.log(`${file.name.substring(0,file.name.indexOf('.'))} - ${path.extname(file.name).slice(1, file.name.length)}`);
      const readableStream = fs.createReadStream(path.join(__dirname, './styles/', file.name),'utf-8');
      readableStream.on('data', (data) => {
        //console.log(chunk);
        fs.appendFile(
          path.join(__dirname, './project-dist/', 'bundle.css'),
          data,
          err => {
            if (err) throw err;
            console.log(`The file bundle.css has been updeted with data from ${file.name}.`);
          }
        );
      });      
    }
  });
});