import { useTranslation } from 'react-i18next'
import { Link } from '@remix-run/react'
import {
  Card,
  CardContent,
  CardFooter,
} from '~/themes/default/components/ui/card'
import { Button } from '~/themes/default/components/ui/button'

const ProductCard = ({
  coverImage,
  title,
  price,
}: {
  coverImage: string
  title: string
  price: string
}) => {
  const { t } = useTranslation()
  return (
    <Card className="py-10 md:pt-0 rounded-none border-none shadow-none">
      <Link to="/products/slug">
        <CardContent className="h-72 p-0">
          <img
            src={coverImage}
            alt={title}
            className="object-cover w-full h-full rounded-sm"
          />
        </CardContent>
        <CardFooter className="py-3 flex flex-col items-start">
          <p className="font-weight-300">{title}</p>
          <p className="mt-3 text-lg">{price}</p>
        </CardFooter>
      </Link>
      <Button variant="secondary" className="w-full">
        {t('add_cart')}
      </Button>
    </Card>
  )
}

export default ProductCard
