import React, { useEffect } from 'react';
import useStore from './store';
import Sidebar from './components/layout/Sidebar';
import GlobalHeader from './components/layout/GlobalHeader';
import RightPanel from './components/layout/RightPanel';
import QuickConsult from './components/QuickConsult';
import BudgetEditor from './components/BudgetEditor';
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-20 bg-black text-red-500 font-mono">
          <h1 className="text-4xl font-black mb-4 uppercase">Critical Render Error</h1>
          <p className="text-lg border-b border-red-500/20 pb-4 mb-4">{this.state.error?.message}</p>
          <pre className="text-[10px] opacity-50 whitespace-pre-wrap">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { mode, fetchCatalogs, fetchClients } = useStore();

  useEffect(() => {
    // PROTECCIÓN: Cargamos datos una sola vez para evitar bloqueos
    fetchCatalogs();
    fetchClients();
  }, []); // Array vacío para detener el bucle infinito

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-primary text-white font-sans industrial-grid overflow-hidden">
        {/* 1. Side Navigation (LEFT) */}
        <Sidebar />

        {/* 2. Main Workspace Area (CENTER) */}
        <div className="flex-1 flex flex-col min-w-0 bg-primary/40 relative">
          {/* Abstract Background Element */}
          <div className="absolute top-0 right-0 p-40 opacity-5 pointer-events-none z-0">
            <div className="w-[800px] h-[800px] border border-accent/20 rounded-full blur-[100px] animate-pulse"></div>
          </div>

          <GlobalHeader />

          <main className="flex-1 overflow-y-auto p-10 relative z-10 custom-scroll">
            <div className="max-w-[1600px] mx-auto">
              {mode === 'quick' ? (
                <QuickConsult />
              ) : (
                <BudgetEditor />
              )}
            </div>
          </main>
        </div>

        {/* 3. Real-time Summary & Basket (RIGHT) */}
        {mode === 'formal' && <RightPanel />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
