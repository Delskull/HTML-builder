const fs = require('fs')
const path = require('path')

const originalPath = path.join(__dirname, 'files')
const copyPath = path.join(__dirname, 'files-copy')

const removeDir = async () => {
  try {
    await fs.promises.rm(copyPath, { recursive: true, force: true });
  } catch (err) {
    console.error('Ошибка при удалении папки:', err);
  }
};

const createCopyFolder = async () => {
  return new Promise((resolve,reject) => {
    fs.mkdir(copyPath,{recursive:true},(err) => {
      if (err) {
        reject(err)
      }
      else {
        resolve()
      }
    })
  })
}
const copyFile = async () => {
  try {
   await removeDir()
   await createCopyFolder()
    const files = await fs.promises.readdir(originalPath)
    for (const file of files){
      const originPath = path.join(originalPath,file)
      const copyFolder = path.join(copyPath,file)
      await fs.promises.copyFile(originPath,copyFolder)

    }
    console.log('дело сделано')
  }
  catch (err) {
    console.log('ошибка',err)
  }
}
copyFile()

