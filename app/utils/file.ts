import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuidv4 } from 'uuid'
import { FileHostingProvider } from '~/types'

export default async function fileUpload(
  provider: FileHostingProvider,
  file: File,
  configs: { [key: string]: string },
) {
  if (provider === FileHostingProvider.Cloudinary) {
    cloudinary.config({
      cloud_name: configs.cloudName,
      api_key: configs.apiKey,
      api_secret: configs.apiSecret,
    })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const id = uuidv4()
  await cloudinary.uploader
    .upload_stream({
      public_id: id,
    })
    .end(buffer)

  const optimizeUrl = cloudinary.url(id, {
    fetch_format: 'auto',
    quality: 'auto',
  })

  return optimizeUrl
}
