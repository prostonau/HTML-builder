const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const testFolder = './04-copy-directory/files/';
const outFolder = './04-copy-directory/files-copy/';
//console.log("path.dirname(__filename)", path.dirname(__filename))
  
fsPromises.mkdir(`${path.dirname(__filename)}/files-copy`, {'recursive': true}).then(function() {
//console.log('Directory created successfully');
//})
//.catch(function() {
//console.log('failed to create directory');    
}).then( () => {    
  fs.readdir(testFolder, {withFileTypes: true}, (err, files) => {
    //console.log(files);
    files.forEach(file => {             
      console.log(`${file.name}`);
      fs.writeFile(
        path.join(__dirname, './files-copy/', `${file.name}`),
        '',
        (err) => {
          if (err) throw err;
          //console.log('The file has been created');
        }
      );
                  
      fs.copyFile(`${testFolder}/${file.name}`, `${outFolder}/${file.name}`, (err) => {
        if (err) throw err;
        //console.log('source.txt was copied to destination.txt');
      });
    }
    );
  });    
});






