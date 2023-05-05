const fs = require('fs');
const path = require('path');
const testFolder = './03-files-in-folder/secret-folder/';

const roundOff = (value) => Math.round(value*100)/100;

fs.readdir(testFolder, {withFileTypes: true}, (err, files) => {
  //console.log(files);
  files.forEach(file => {       
    if (file.isFile()) {
      fs.stat(`${testFolder}${file.name}`, (err, stats) => {
        if (err) {
          console.error(err);
        }
        console.log(`${file.name.substring(0,file.name.indexOf('.'))} - ${path.extname(file.name).slice(1, file.name.length)} - ${roundOff(stats.size*0.001)}kb`);
      });
    }
  });
});