import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import Setup from '~/themes/default/pages/Setup'
import { Installer } from '~/models'

export const meta: MetaFunction = () => {
  return [{ title: 'Store setup' }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    const result = await Installer.create({
      name: String(body.get('store-name')),
      description: String(body.get('description')),
      createdBy: '123',
    })

    if (result) {
      return redirect('/admin')
    } else {
      return json({ data: false })
    }
  } catch (e) {
    return json({ data: false })
  }
}

export default function Index() {
  const result = useActionData<typeof action>()
  return <Setup isSubmitSuccessful={result ? result.data : false} />
}
