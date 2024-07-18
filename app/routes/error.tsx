import type { MetaFunction } from '@remix-run/node'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.error') }]
}
export default function Index() {
  const { t } = useTranslation()
  return (
    <Suspense fallback={<Skeleton />}>
      <main>
        <div className="flex items-center justify-center text-center mt-32">
          <h3 className="text-2xl tracking-tight">
            {t('system.system_error_public_message')}
          </h3>
        </div>
      </main>
    </Suspense>
  )
}
