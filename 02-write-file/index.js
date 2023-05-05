const fs = require('fs');
const path = require('path');

fs.writeFile(
  path.join(__dirname, '02-write-file', '../notes.txt'),
  '',
  (err) => {
    if (err) throw err;
    // console.log('The file has been created');
  }
);

const { stdin, stdout, stderr } = process;

console.log('Input text and we add it to the file notes.txt:');
stdin.on('data', data => {    
  const dataFromUser = data.toString();
  //console.log('dataFromUser: ',dataFromUser)

  fs.appendFile(
    path.join(__dirname, '02-write-file', '../notes.txt'),
    dataFromUser,
    err => {
      if (err) throw err;
      console.log('The file has been modified.\nEnter something else or use Ctrl+C or node -v"exit" to finish the process');
    }
  );

  if (dataFromUser.trim() === 'exit')  {
    stdout.write('Starting logging out from process...');
    process.exit();
  }
  // stdout.write(dataFromUser);
});

process.on('exit', code => {
  if (code === 0) {
    stdout.write('It is all right. Filling of the file is completed.');
  } else {
    stderr.write(`Something went wrong. The program ended with the code ${code}`);
  }
});

process.on('SIGINT', () => {
  console.log('Caught interrupt signal');
  process.exit();
});