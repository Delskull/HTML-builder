const fs = require('fs');
const path = require('path');

const fullPath = path.resolve(__dirname, 'text.txt');
const readFileAsync = async (path) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path, { encoding: 'utf-8' });
    let data = '';
    readStream.on('data', (chunk) => {
      data += chunk;
    });
    readStream.on('end', () => {
      resolve(data);
    });
    readStream.on('error', (error) => {
      reject(error.message);
    });
  });
};
readFileAsync(fullPath)
  .then((data) => console.log(data))
  .catch((error) => console.log('ошибка', error));
