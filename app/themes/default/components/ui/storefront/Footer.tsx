import { Link } from '@remix-run/react'
import { PublicPage } from '~/types'

const Footer = ({
  publicPages,
  copyright,
}: {
  publicPages: PublicPage[]
  copyright: string
}) => {
  return (
    publicPages && (
      <footer className="pt-8 pb-4 mt-10">
        <div className="max-w-screen-xl mx-auto grid grid-cols-4">
          <div>
            {publicPages
              .slice(0, Math.ceil(publicPages.length / 2))
              .map((item) => {
                return (
                  <div key={item.name} className="h-10">
                    <Link to={`/p/${item.slug}`}>{item.name}</Link>
                  </div>
                )
              })}
          </div>
          <div>
            {publicPages
              .slice(Math.ceil(publicPages.length / 2))
              .map((item) => {
                return (
                  <div key={item.name} className="h-10">
                    <Link to={`/p/${item.slug}`}>{item.name}</Link>
                  </div>
                )
              })}
          </div>
          <div className="col-span-2 flex justify-end">{copyright}</div>
        </div>
      </footer>
    )
  )
}

export default Footer
