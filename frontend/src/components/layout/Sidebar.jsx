import React from 'react';
import { Home, FileText, PlusCircle, Users, Settings, LogOut } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}>
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </div>
);

const Sidebar = () => {
    return (
        <div className="w-64 h-screen glass border-r border-white/5 p-6 flex flex-col gap-8 fixed left-0 top-0">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/40">
                    DL
                </div>
                <h1 className="text-xl font-bold tracking-tight">Studio Budget</h1>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                <SidebarItem icon={Home} label="Dashboard" active />
                <SidebarItem icon={PlusCircle} label="Nuevo Presupuesto" />
                <SidebarItem icon={FileText} label="Presupuestos" />
                <SidebarItem icon={Users} label="Clientes" />
            </nav>

            <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
                <SidebarItem icon={Settings} label="Configuración" />
                <SidebarItem icon={LogOut} label="Cerrar Sesión" />
            </div>
        </div>
    );
};

export default Sidebar;
