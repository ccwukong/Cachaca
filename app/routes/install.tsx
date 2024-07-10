import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import Install from '~/themes/default/pages/Install'
import { Installer } from '~/models'

export const meta: MetaFunction = () => {
  return [{ title: 'Store setup' }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()

    const result = await Installer.create({
      adminUser: {
        firstName: String(body.get('first-name')),
        lastName: String(body.get('last-name')),
        email: String(body.get('email')),
        password: String(body.get('password')),
      },
      store: {
        name: String(body.get('store-name')),
        description: String(body.get('description')),
      },
    })

    if (result) {
      return redirect('/admin?installed=true')
    } else {
      return json({ data: false })
    }
  } catch (e) {
    console.log(e)
    return json({ data: false })
  }
}

export default function Index() {
  const result = useActionData<typeof action>()
  return <Install isSubmitSuccessful={result ? result.data : false} />
}
