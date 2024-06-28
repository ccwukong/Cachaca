const Layout = ({
  header,
  content,
  footer,
}: {
  header?: JSX.Element
  content: JSX.Element
  footer?: JSX.Element
}) => {
  return (
    <div className="flex flex-col">
      {header}
      {content}
      {footer}
    </div>
  )
}

export default Layout
