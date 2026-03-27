import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = 'taari',
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      )
      .end(fileBuffer);
  });
}

export async function uploadVideo(
  fileBuffer: Buffer,
  folder: string = 'taari/videos',
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'video',
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      )
      .end(fileBuffer);
  });
}

export async function deleteAsset(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return true;
  } catch {
    return false;
  }
}
