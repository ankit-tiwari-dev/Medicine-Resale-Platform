import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="page-wrap">
      <div className="card-surface p-8 text-center">
        <p className="text-xs font-semibold uppercase text-textSecondary">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-primary">Page not found</h1>
        <p className="mt-2 text-sm text-textSecondary">The requested route does not exist in this environment.</p>
        <Link to="/" className="mt-4 inline-flex rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white">Back to Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
