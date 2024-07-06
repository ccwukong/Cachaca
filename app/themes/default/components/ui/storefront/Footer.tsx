import { Link } from '@remix-run/react'
import { PageLink } from '~/models'

const Footer = ({
  pageLinks,
  copyright,
}: {
  pageLinks: PageLink[]
  copyright: string
}) => {
  return (
    <footer className="pt-8 pb-4 mt-10">
      <div className="max-w-screen-xl mx-auto grid grid-cols-4">
        <div>
          {pageLinks
            .sort((a, b) => a.order - b.order)
            .slice(0, 3)
            .map((item) => {
              return (
                <div key={item.title} className="h-10">
                  <Link to={item.url}>{item.title}</Link>
                </div>
              )
            })}
        </div>
        <div>
          {pageLinks
            .sort((a, b) => a.order - b.order)
            .slice(3)
            .map((item) => {
              return (
                <div key={item.title} className="h-10">
                  <Link to={item.url}>{item.title}</Link>
                </div>
              )
            })}
        </div>
        <div className="col-span-2 flex justify-end">{copyright}</div>
      </div>
    </footer>
  )
}

export default Footer
