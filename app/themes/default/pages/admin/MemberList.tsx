import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
import { Badge } from '~/themes/default/components/ui/badge'
import { Button } from '~/themes/default/components/ui/button'
import { Input } from '~/themes/default/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/themes/default/components/ui/table'
import { DatabaseRecordStatus, UserPublicInfo } from '~/types'

const MemberList = ({ users }: { users: UserPublicInfo[] }) => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden">
      <AdminHeader />

      <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('system.store_members')}
          </h2>
          <div className="flex items-center space-x-2">
            <Input placeholder="" />
            <Button>Search</Button>
          </div>
        </div>
        {users ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('system.name')}</TableHead>
                <TableHead>{t('system.email')}</TableHead>
                <TableHead>{t('system.role')}</TableHead>
                <TableHead>{t('system.status')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === DatabaseRecordStatus.Active
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {
                          Object.keys(DatabaseRecordStatus)[
                            Object.values(DatabaseRecordStatus).indexOf(
                              item.status as DatabaseRecordStatus,
                            )
                          ]
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            {t('system.actions')}
                          </DropdownMenuLabel>
                          <DropdownMenuItem>
                            {t('system.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {t('system.disable')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center">{t('system.no_records_found')}</div>
        )}
      </div>
    </div>
  )
}

export default MemberList
