type BreadcrumbProps = {
    items?: Array<{
      label: string
      href?: string
    }>
  }
  
  export function Breadcrumb({ items = [] }: BreadcrumbProps) {
    return (
      <nav className="mb-6 text-sm text-slate-500">
        <span>SECP</span>
  
        {items.map((item) => (
          <span key={item.label}>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-700">{item.label}</span>
          </span>
        ))}
      </nav>
    )
  }