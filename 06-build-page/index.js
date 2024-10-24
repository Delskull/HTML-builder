const fs = require('fs');
const path = require('path');
const checkDirectoryAsync = require('../05-merge-styles/index');

const buildPath = path.join(__dirname, 'project-dist');
const htmlPath = path.join(__dirname, 'project-dist', 'index.html');
const headerPath = path.join(__dirname, 'components', 'header.html');
const footerPath = path.join(__dirname, 'components', 'footer.html');
const articlesPath = path.join(__dirname, 'components', 'articles.html');
const templatePath = path.join(__dirname, 'template.html');
const aboutPath = path.join(__dirname, 'components', 'about.html');
const mergePath = path.join(__dirname, 'project-dist', 'style.css');
const stylesPath = path.join(__dirname, 'styles');
const originalPath = path.join(__dirname, 'assets');
const copyPath = path.join(__dirname, 'project-dist', 'assets');

const createDir = async (path) =>
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
  });

const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, (err) => {
      if (err) {
        return reject(err.message);
      }
      resolve();
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

// экспиременты
const componentPaths = {
  header: path.join(__dirname, 'components', 'header.html'),
  footer: path.join(__dirname, 'components', 'footer.html'),
  articles: path.join(__dirname, 'components', 'articles.html'),
  about: path.join(__dirname, 'components', 'about.html'),
};

// компилируем html

const buildHTML = async () => {
  await createDir(buildPath);

  const template = await readFileAsync(templatePath);

  const tagRegex = /{{(.*?)}}/g;
  const tags = [
    ...new Set(
      template.match(tagRegex)?.map((tag) => tag.replace(/{{|}}/g, '').trim()),
    ),
  ];

  const components = await Promise.all(
    tags.map(async (tag) => {
      if (componentPaths[tag]) {
        return { tag, content: await readFileAsync(componentPaths[tag]) };
      }
      return { tag, content: '' };
    }),
  );

  let content = template;
  components.forEach(({ tag, content: componentContent }) => {
    content = content.replace(`{{${tag}}}`, componentContent);
  });

  await writeFileAsync(htmlPath, content);
};

// процесс сборки
buildHTML().catch((err) => console.error('Ошибка в процессе:', err));

// компилируем css

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

//компилируем ассеты
const removeDir = async () => {
  try {
    await fs.promises.rm(copyPath, { recursive: true, force: true });
  } catch (err) {
    console.error('Ошибка при удалении папки:', err);
  }
};

const createCopyFolder = async () => {
  return new Promise((resolve, reject) => {
    fs.mkdir(copyPath, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const copyDir = async (src, dest) => {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
};

const copyFile = async () => {
  try {
    await removeDir();
    await createCopyFolder();
    await copyDir(originalPath, copyPath);
    console.log('дело сделано');
  } catch (err) {
    console.log('Ошибка', err);
  }
};
copyFile();
