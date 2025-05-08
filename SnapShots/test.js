const fs = require('fs');
const path = require('path');

fs.readdir('.', (err, files) => {
    if (err) {
      return console.error('Error reading folder:', err);
    }
  
    const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');
    console.log('PNG files:', pngFiles);
    console.log('Total PNG files:', pngFiles.length);
  });