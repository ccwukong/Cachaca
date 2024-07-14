import { useTranslation } from 'react-i18next'
import Header from '~/themes/default/components/ui/account/Header'
import { Button } from '~/themes/default/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/themes/default/components/ui/card'
import { Input } from '~/themes/default/components/ui/input'

const Settings = ({
  storeLogo,
  storeName,
}: {
  storeLogo: string
  storeName: string
}) => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden">
      <Header storeLogo="" storeName="Cachaca" pageLinks={[]} />
      <div className="flex flex-col">
        <div className="max-w-screen-xl md:max-w-screen-md w-full flex-1 space-y-4 md:p-8 mx-auto h-auto mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Name</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex gap-8">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </form>
            </CardContent>
            <CardFooter className="px-6 py-4 flex justify-end">
              <Button>Save</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <Input placeholder="New password" type="password" />
              </form>
            </CardContent>
            <CardFooter className="px-6 py-4 flex justify-end">
              <Button>Save</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input placeholder="Email" />
              </form>
            </CardContent>
            <CardFooter className="px-6 py-4 flex justify-end">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
