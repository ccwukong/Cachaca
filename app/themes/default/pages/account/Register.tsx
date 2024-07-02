import { Link } from '@remix-run/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/themes/default/components/ui/card'
import { Label } from '~/themes/default/components/ui/label'
import { Input } from '~/themes/default/components/ui/input'
import { Button } from '~/themes/default/components/ui/button'
import Header from '~/themes/default/components/ui/Header'

const Register = () => {
  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Header storeLogo="" storeName="Cachaca" logoOnly={true} />
      <div className="max-w-screen-xl mx-auto h-full pt-24 flex justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Create a new account
            </CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to="/login">Already have an account?</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Register
