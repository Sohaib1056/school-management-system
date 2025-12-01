import { v2 as cloudinary } from 'cloudinary';

const {
  CLOUDINARY_API_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_API_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary environment variables are not fully configured. Image uploads will fail.');
}

cloudinary.config({
  cloud_name: CLOUDINARY_API_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
