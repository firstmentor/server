const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resumes',
          public_id: `resume-${Date.now()}.pdf`,  // 👈 FORCE .pdf here
          use_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };
  

module.exports = streamUpload;
