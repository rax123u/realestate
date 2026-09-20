export default function SectionHeader({ eyebrow, title, action, children }) {
  return (
    <header className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {children}
      </div>
      {action}
    </header>
  );
}
