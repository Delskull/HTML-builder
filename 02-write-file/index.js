const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const { stdin, stdout } = process;

const fullPath = path.resolve(__dirname, 'user-text.txt');

const createTextFile = () => {
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile(fullPath, '', (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
};
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

const app = () => {
  rl.question('Введите текст или exit для завершения \n ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('До свидания!');
      rl.close();
      return;
    }
    writeText(input);
    app();
  });
};

const writeText = (input) => {
  fs.appendFile(fullPath, input + ' ', (err) => {
    if (err) {
      throw err.message;
    }
  });
};
rl.on('SIGINT', () => {
  console.log('До свидания!');
  rl.close();
  process.exit(0);
});
createTextFile();
app();

// раскомментируй для удаления файла с текстом

// fs.unlink(fullPath,(err) => {
//   if(err) {
//     throw err.message
//   }
// })
