import React from 'react'
import './PageHeader.css'

const PageHeader = ({ breadcrumbs, title, description, actionButton }) => {
  const items = breadcrumbs || []

  return (
    <header className="page-header-wrapper">
      <div className="ph-left">
        <nav className="ph-breadcrumbs">
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg className="ph-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
              <span className={item.active ? 'ph-active' : 'ph-inactive'}>
                {item.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
        <h1 className="ph-title">{title}</h1>
        {description && <p className="ph-description">{description}</p>}
        <div className="ph-accent" />
      </div>
      {actionButton && <div className="ph-right">{actionButton}</div>}
    </header>
  )
}

export default PageHeader
