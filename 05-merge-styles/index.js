const fs = require('fs');
const path = require('path');
const { rejects } = require('node:assert');

const mergePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');

const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        return reject(err.message);
      }
      resolve();
    });
  });
};

const checkDirectoryAsync = async (path, data) => {
  return new Promise((resolve, reject) =>
    fs.readdir(path, (err, data) => {
      if (err) {
        return reject(err.message);
      }
      resolve(data);
    }),
  );
};

const readFileAsync = async (path) => {
  return new Promise((resolve, reject) =>
    fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        return reject(err.message);
      }
      resolve(data);
    }),
  );
};

writeFileAsync(mergePath, 'bundle.css')
  .then(() => {
    return checkDirectoryAsync(stylesPath);
  })
  .then((files) => {
    const cssFiles = files.filter((file) => {
      const extname = path.extname(file);
      return extname === '.css';
    });
    const readPromises = cssFiles.map((file) => {
      const filePath = path.join(stylesPath, file);
      return readFileAsync(filePath);
    });
    return Promise.all(readPromises);
  })
  .then((text) => {
    const mergeAllText = text.join('\n');
    return writeFileAsync(mergePath, mergeAllText);
  })

  .catch((err) => console.log(err));

module.exports = checkDirectoryAsync;