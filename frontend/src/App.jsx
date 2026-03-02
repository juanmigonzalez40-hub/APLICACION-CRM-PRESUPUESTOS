import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BudgetWizard from './components/budget/Wizard/BudgetWizard';
import { supabase } from './lib/supabase';
import { Plus, Users, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
  <div className="glass p-6 flex flex-col gap-4 glass-hover">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-bold mt-1 tracking-tight">
        {loading ? <span className="inline-block w-8 h-8 bg-white/5 rounded animate-pulse" /> : value}
      </h3>
    </div>
  </div>
);

const Dashboard = ({ onNewBudget }) => {
  const [stats, setStats] = useState({ totalPresupuestos: 0, aceptados: 0, clientes: 0, pendientes: 0 });
  const [recentClients, setRecentClients] = useState([]);
  const [recentBudgets, setRecentBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch clients
        const { data: clientesData, count: clientesCount } = await supabase
          .from('clientes')
          .select('*', { count: 'exact' })
          .order('fecha_creacion', { ascending: false })
          .limit(5);

        // Fetch budgets (may not exist yet)
        let presupuestosData = [];
        let totalPresupuestos = 0;
        let aceptados = 0;
        let pendientes = 0;
        try {
          const { data: budgets, count } = await supabase
            .from('presupuestos')
            .select('*', { count: 'exact' })
            .order('fecha_creacion', { ascending: false })
            .limit(5);
          presupuestosData = budgets || [];
          totalPresupuestos = count || 0;
          aceptados = presupuestosData.filter(p => p.estado === 'aceptado').length;
          pendientes = presupuestosData.filter(p => p.estado === 'borrador' || p.estado === 'enviado').length;
        } catch (e) {
          // presupuestos table may not have data yet
        }

        setStats({
          totalPresupuestos,
          aceptados,
          clientes: clientesCount || 0,
          pendientes
        });
        setRecentClients(clientesData || []);
        setRecentBudgets(presupuestosData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-fade">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bienvenido, Juan Miguel</h2>
          <p className="text-slate-400 mt-1">Este es el resumen de actividad de DL Studio hoy.</p>
        </div>
        <button
          onClick={onNewBudget}
          className="btn-premium flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Presupuesto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FileText} label="Presupuestos" value={stats.totalPresupuestos} color="bg-blue-600 shadow-blue-500/30" loading={loading} />
        <StatCard icon={CheckCircle} label="Aceptados" value={stats.aceptados} color="bg-emerald-600 shadow-emerald-500/30" loading={loading} />
        <StatCard icon={Users} label="Clientes" value={stats.clientes} color="bg-purple-600 shadow-purple-500/30" loading={loading} />
        <StatCard icon={Clock} label="Pendientes" value={stats.pendientes} color="bg-amber-600 shadow-amber-500/30" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Presupuestos Recientes</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : recentBudgets.length > 0 ? (
            <div className="space-y-3">
              {recentBudgets.map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                  <div>
                    <p className="font-semibold group-hover:text-blue-400 transition-colors">{b.numero || 'Sin número'}</p>
                    <p className="text-sm text-slate-500">{new Date(b.fecha_creacion).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${b.estado === 'aceptado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        b.estado === 'enviado' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                      {b.estado?.toUpperCase() || 'BORRADOR'}
                    </span>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500 border-2 border-dashed border-white/5 rounded-2xl">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>No hay presupuestos aún</p>
                <button onClick={onNewBudget} className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  + Crear el primero
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="glass p-8 min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Últimos Clientes</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : recentClients.length > 0 ? (
            <div className="space-y-3">
              {recentClients.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {c.nombre?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-blue-400 transition-colors">{c.nombre}</p>
                      <p className="text-sm text-slate-500">{c.empresa || 'Particular'} • {c.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${c.tipo_cliente === 'agencia' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                    {c.tipo_cliente === 'agencia' ? 'AGENCIA' : 'FINAL'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500 border-2 border-dashed border-white/5 rounded-2xl">
              No hay clientes registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 ml-64 p-8">
          <div className="container-premium">
            {view === 'dashboard' ? (
              <Dashboard onNewBudget={() => setView('wizard')} />
            ) : (
              <div className="animate-fade">
                <button
                  onClick={() => setView('dashboard')}
                  className="text-slate-400 hover:text-white transition-colors mb-4 flex items-center gap-2"
                >
                  ← Volver al Dashboard
                </button>
                <BudgetWizard />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
