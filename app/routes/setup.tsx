import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  writeAsyncIterableToWritable,
} from '@remix-run/node'
import Setup from '~/themes/default/pages/Setup'

export const meta: MetaFunction = () => {
  return [{ title: 'Store setup' }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData()
  console.log(body.get('store-name'))
  return json({ message: `Hello` })
}

export default function Index() {
  return <Setup />
}
