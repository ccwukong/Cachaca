const ShopLayout = ({
  header,
  content,
  footer,
}: {
  header?: JSX.Element
  content: JSX.Element
  footer?: JSX.Element
}) => {
  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      {header}
      {content}
      {footer}
    </div>
  )
}

export default ShopLayout
