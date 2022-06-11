const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const util = require('util');
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } = require('../config');

const unLinkFile = util.promisify(fs.unlink);

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const imageId = () => Math.random().toString(36).substr(2, 4);

const uploadFile = async (path) => {
  const response = await cloudinary.uploader.upload(path, { resource_type: 'auto', public_id: `jemiEats/files${imageId()}` });
  await unLinkFile(path);
  return response.secure_url;
};

const upload = multer({ dest: 'uploads/' });

module.exports = {
  upload,
  uploadFile,
};
