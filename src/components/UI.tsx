export function SectionHeading({ eyebrow, title, description, align = 'left' }: { eyebrow?: string; title: string; description?: string; align?: 'left' | 'center' }) {
  return (
    <header className={`section-header section-header-${align}`} data-reveal>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-intro">{description}</p>}
    </header>
  );
}

export function PageHero({ eyebrow, title, description, image, imageAlt = '', children }: { eyebrow: string; title: string; description?: string; image?: string; imageAlt?: string; children?: React.ReactNode }) {
  return (
    <section className={`page-hero${image ? ' page-hero-image' : ''}`}>
      {image && <img src={image} alt={imageAlt} />}
      <div className="page-hero-overlay" />
      <div className="page-hero-content">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </div>
    </section>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="empty-state">
      <span className="empty-state-mark" aria-hidden="true">M</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
