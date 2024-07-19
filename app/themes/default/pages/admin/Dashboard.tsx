import { addDays, format } from 'date-fns'
import { CalendarFold } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
import { Avatar, AvatarFallback } from '~/themes/default/components/ui/avatar'
import { Button } from '~/themes/default/components/ui/button'
import { Calendar } from '~/themes/default/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/themes/default/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/themes/default/components/ui/popover'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import { cn } from '~/themes/lib/utils'
import { PageLink, UserPublicInfo } from '~/types'

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Jul',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Aug',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Sep',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Oct',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Nov',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'Dec',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

const Dashboard = ({
  navLinks,
  account,
}: {
  navLinks: PageLink[]
  account: UserPublicInfo
}) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  })

  return (
    <div className="mx-6 overflow-hidden">
      <AdminHeader navItems={navLinks} account={account} />
      <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'w-[260px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarFold className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Bar
                        dataKey="total"
                        fill="currentColor"
                        radius={[4, 4, 0, 0]}
                        className="fill-primary"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Olivia Martin
                        </p>
                        <p className="text-sm text-muted-foreground">
                          olivia.martin@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$1,999.00</div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                        <AvatarFallback>JL</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Jackson Lee
                        </p>
                        <p className="text-sm text-muted-foreground">
                          jackson.lee@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$39.00</div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>IN</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Isabella Nguyen
                        </p>
                        <p className="text-sm text-muted-foreground">
                          isabella.nguyen@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$299.00</div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>WK</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          William Kim
                        </p>
                        <p className="text-sm text-muted-foreground">
                          will@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$99.00</div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>SD</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Sofia Davis
                        </p>
                        <p className="text-sm text-muted-foreground">
                          sofia.davis@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$39.00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard
