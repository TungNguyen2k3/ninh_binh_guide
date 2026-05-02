import { v2 as cloudinary } from 'cloudinary'
import { env } from './env.js'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export async function uploadAudio(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // Cloudinary uses 'video' for audio files
        folder: 'ninh-binh-guide/audio',
        public_id: filename.replace(/\.[^.]+$/, ''), // strip extension
        format: 'mp3',
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

export async function uploadImage(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'ninh-binh-guide/images',
        public_id: filename.replace(/\.[^.]+$/, ''),
        overwrite: true,
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

export async function deleteFile(
  publicId: string,
  resourceType: 'video' | 'image' = 'image'
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
