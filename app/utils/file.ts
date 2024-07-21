import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuidv4 } from 'uuid'
import { FileHostingProvider } from '~/types'

export default async function fileUpload(
  provider: FileHostingProvider,
  configs: { [key: string]: string },
) {
  if (provider === FileHostingProvider.Cloudinary) {
    cloudinary.config({
      cloud_name: configs.cloudName,
      api_key: configs.apiKey,
      api_secret: configs.apiSecret,
    })
  }
  const id = uuidv4()
  await cloudinary.uploader.upload(configs.filename, {
    public_id: id,
  })

  const optimizeUrl = cloudinary.url(id, {
    fetch_format: 'auto',
    quality: 'auto',
  })

  return optimizeUrl
}
