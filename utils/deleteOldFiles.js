const fs = require('fs');
const path = require('path');

const deleteOldFiles = () => {
  const uploadsPath = path.join(__dirname, '../uploads');

  fs.readdir(uploadsPath, (err, files) => {
    if (err) return console.error('❌ Error reading uploads folder:', err);

    // console.log('📁 Files found:', files);

    files.forEach(file => {
      const filePath = path.join(uploadsPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error(`❌ Error checking file: ${file}`, err);

        const now = Date.now();
        const fileCreated = new Date(stats.ctime).getTime(); // created time
        const diffInDays = (now - fileCreated) / (1000 * 60 * 60 * 24);

        // console.log(`${file} - Age in days: ${diffInDays.toFixed(2)}`);

        // ✅ Yahan likhna hai — this is the correct place
        if (diffInDays > 30) {
          fs.unlink(filePath, err => {
            if (err) console.error(`❌ Error deleting ${file}`, err);
            else console.log(`🧹 Deleted old resume: ${file}`);
          });
        }
      });
    });
  });
};

// 👇 Call function when file run directly
deleteOldFiles();
