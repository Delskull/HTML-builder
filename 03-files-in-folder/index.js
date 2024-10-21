const fs = require('fs/promises');
const path = require('path');

const fullPath = path.resolve(__dirname, 'secret-folder');

const infoFiles = async () => {
  try {
    const files = await fs.readdir(fullPath);
    return files;
  } catch (err) {
    throw err;
  }
};

infoFiles()
  .then((files) => {
    const filePromises = files.map((file) => {
      const filePath = path.join(fullPath, file);
      return fs.stat(filePath).then((data) => {
        if (data.isFile()) {
          const { name } = path.parse(file);
          const ext = path.extname(file).slice(1);
          const size = (data.size / 1024).toFixed(3);
          console.log(`${name} - ${ext} - ${size}kb`);
        }
      });
    });
    return Promise.all(filePromises);
  })
  .catch((err) => {
    console.error('Error reading directory:', err);
  });
