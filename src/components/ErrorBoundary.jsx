import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

// Catches render/runtime errors anywhere below it and shows a friendly
// fallback instead of an unmounted, blank white screen. Class component
// because error boundaries have no hooks equivalent.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // In a real deployment this is where we'd forward to an error tracker.
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info);
  }

  handleReload = () => {
    // Clearing potentially corrupt persisted state gives the app a clean
    // start; if storage is unavailable we still attempt a reload.
    try {
      localStorage.removeItem('performance-tracker.v1');
    } catch (e) {
      /* ignore */
    }
    window.location.assign('/');
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200/70 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-extrabold text-navy-800">Something went wrong</h1>
            <p className="text-sm text-slate-500 mt-2">
              The dashboard hit an unexpected error. Reloading with fresh demo
              data usually fixes it.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reload dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
