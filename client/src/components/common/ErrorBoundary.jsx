import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("UI ErrorBoundary caught", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-wrap">
          <div className="card-surface p-8 text-center">
            <h1 className="text-xl font-semibold text-primary">Unexpected UI error</h1>
            <p className="mt-2 text-sm text-textSecondary">Please refresh the page. If the issue persists, capture request-id from API logs.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
