import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught render error:', error, info.componentStack);
    }
  }

  private reset = () => {
    this.setState({ error: null });
    if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
  };

  render() {
    if (this.state.error) {
      return (
        <div className="not-found" role="alert">
          <p className="eyebrow">Something went sideways</p>
          <h1>The gallery lights flickered.</h1>
          <p>An unexpected error interrupted this view. You can return to the museum entrance.</p>
          <button className="button button-dark" type="button" onClick={this.reset}>
            Return to the museum
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}