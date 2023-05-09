const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

// https://stackoverflow.com/questions/55212864/error-ebusy-resource-busy-or-locked-rmdir

const assetSubFolderPath = './06-build-page/assets';
const outAssetSubFolderPath = './06-build-page/project-dist/assets/';

fsPromises.mkdir(`${path.dirname(__filename)}/project-dist`, {'recursive': true}).then(function() {
  //console.log('Folder project-dist created'); 

  fsPromises.mkdir(`${path.dirname(__filename)}/project-dist/assets`, {'recursive': true}).then(function() {
    //console.log('Directory created successfully');
    //})
    //.catch(function() {
    //console.log('failed to create directory');    
  }).then( () => {  
    copyFolder ('/fonts/');
    copyFolder ('/img/');
    copyFolder ('/svg/');


    fs.writeFile(
      path.join(__dirname, 'project-dist', '/style.css'),
      '',
      (err) => {
        if (err) throw err;
        //console.log('style.css has been created');
        createCss();
      }
    );  

    fs.writeFile(
      path.join(__dirname, 'project-dist', '/index.html'),
      '',
      (err) => {
        if (err) throw err;
        //console.log('index.html has been created');
        fs.copyFile('./06-build-page/template.html', './06-build-page/project-dist/index.html', (err) => {
          if (err) throw err;
          //console.log('template.html was copied to index.html');
          editIndexBasedOnTemplate ();          
        });
      }
    );
  });
});

async function copyFolder (subFolderName) {
  await fsPromises.mkdir(`${path.dirname(__filename)}/project-dist/assets${subFolderName}`, {'recursive': true}).then(async function() {  
     //clearFolder(`${outAssetSubFolderPath}${subFolderName}`);
  }).then( async () => {  

    fs.readdir(`${assetSubFolderPath}${subFolderName}`, {withFileTypes: true}, (err, files) => {
      //console.log(`${assetSubFolderPath}${subFolderName}`);
      //console.log(files);
      files.forEach(file => { 
        if (file.isFile()) {             
          //console.log(`${file.name}`);
          
          fs.access(`${outAssetSubFolderPath}${subFolderName}${file.name}`, fs.F_OK, (err) => {
            if (err) {
              //console.error(err);              
            }          
            //file exists
            // console.log (`${file.name} exist!`);
          });


          fs.writeFile(
            path.join(__dirname, `./project-dist/assets/${subFolderName}/`, `${file.name}`),
            '',
            (err) => {
              if (err) throw err;
              //console.log('The file has been created');
              fs.copyFile(`${assetSubFolderPath}/${subFolderName}/${file.name}`, `${outAssetSubFolderPath}/${subFolderName}/${file.name}`, (err) => {
                if (err) throw err;
                // console.log('source.txt was copied to destination.txt');
              });

            }
          );
        }
      }
      );
    });
  });
}

function createCss () {
  const testFolder = './06-build-page/styles/'; 
    
  fs.readdir(testFolder, {withFileTypes: true}, (err, files) => {
    //console.log(files);
    files.forEach(file => {       
      if (file.isFile() && path.extname(file.name).slice(1, file.name.length) === 'css') {     
        //console.log(`${file.name.substring(0,file.name.indexOf('.'))} - ${path.extname(file.name).slice(1, file.name.length)}`);
        const readableStream = fs.createReadStream(path.join(__dirname, './styles/', file.name),'utf-8');
        readableStream.on('data', (data) => {
          //console.log(chunk);
          fs.appendFile(
            path.join(__dirname, './project-dist/', 'style.css'),
            data,
            err => {
              if (err) {               
                throw err;
              }
              //console.log(`The file style.css has been updeted with data from ${file.name}.`);
            }
          );
        });      
      }
    });
  });
}

function editIndexBasedOnTemplate () {
  const readableStream = fs.createReadStream(path.join(__dirname, 'project-dist', 'index.html'),'utf-8');
  readableStream.on('data', content => {
    // console.log('start');
    // console.log('content', content);
    // console.log('========================================');
    const components = path.join(__dirname,'components');
    fs.readdir(components, {withFileTypes: true}, (err, files) => {
    //console.log(files);

      files.forEach((file) => {             
        // console.log(`${file.name}`);
        const readableStream = fs.createReadStream(path.join(__dirname, 'components', `/${file.name}`),'utf-8');
        readableStream.on('data', data => {
          //console.log(file.name,'data', typeof data);
          //componentsData.push([file.name, data]);
          //console.log("content ", typeof content);          
          //console.log('tut + '+ file.name);
          if (file.name === 'articles.html') content = content.replace('{{articles}}',data);
          else if (file.name === 'about.html') content = content.replace('{{about}}',data);
          else if (file.name === 'footer.html') content = content.replace('{{footer}}',data);
          else if (file.name === 'header.html') {
            // console.log('TRY TO REPLACE header');
            // console.log("content before", content)
            content = content.split('{{header}}').join(data);
            //console.log("content AFTER", content)
            //console.log("content_AFTER", content)
          }
          
          //console.log('-----------------------');                

          //if (file.name === 'header.html') {
          if (content.split('{{').length === 1) {              
            //console.log('We are ready to rewrite content = ', content);
            fs.writeFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              content,
              err => {
                if (err) throw err;
                //console.log('The file has been modified.\nEnter something else or use Ctrl+C or node -v"exit" to finish the process');
              }
            );

          }

        });//console.log('componentsData', componentsData);

      }
      );
    });
    
  });
}

const clearFolder = (folderPath) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) throw err
    
    files.forEach(file => {
      const filePath = `${folderPath}/${file}`
      fs.unlink(filePath, (err) => {
        if (err) throw err
        //console.log(`Deleted ${filePath}`)
      })
    })
  })
}
