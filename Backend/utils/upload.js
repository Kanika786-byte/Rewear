
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload files to Cloudinary
exports.uploadFiles = async files => {
  const uploadPromises = files.map(file => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        {
          folder: 'rewear',
          use_filename: true,
          unique_filename: false,
          resource_type: 'auto'
        },
        (error, result) => {
          fs.unlinkSync(file.path); // Remove file from server
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
    });
  });

  return Promise.all(uploadPromises);
};

// Delete files from Cloudinary
exports.deleteFiles = async urls => {
  const deletePromises = urls.map(url => {
    const publicId = url.split('/').pop().split('.')[0];
    return cloudinary.uploader.destroy(`rewear/${publicId}`);
  });

  return Promise.all(deletePromises);
};