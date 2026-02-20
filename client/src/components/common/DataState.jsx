export const DataState = ({ loading, error }) => {
  if (loading) return <div className="card-surface p-4 text-sm text-textSecondary">Loading...</div>;
  if (error) return <div className="card-surface p-4 text-sm text-danger">{error}</div>;
  return null;
};
