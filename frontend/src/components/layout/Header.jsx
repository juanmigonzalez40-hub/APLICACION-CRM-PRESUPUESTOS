import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-dark/80 backdrop-blur-md z-10 w-full ml-64">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96 glass-hover transition-all">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar presupuestos, clientes..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500"
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="p-2 rounded-full hover:bg-white/5 cursor-pointer relative">
                    <Bell size={20} className="text-slate-400" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-dark"></span>
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="text-right">
                        <p className="text-sm font-medium">Juan Miguel</p>
                        <p className="text-xs text-slate-500">Administrador</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User size={20} className="text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
