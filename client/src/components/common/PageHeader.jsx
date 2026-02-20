export const PageHeader = ({ title, subtitle }) => (
  <header className="mb-6">
    <h1 className="text-2xl font-semibold text-primary">{title}</h1>
    {subtitle ? <p className="mt-1 text-sm text-textSecondary">{subtitle}</p> : null}
  </header>
);
