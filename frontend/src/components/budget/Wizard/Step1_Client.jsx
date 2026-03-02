import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { UserPlus, Search } from 'lucide-react';

const Step1_Client = ({ onNext }) => {
    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('clientes')
                .select('*')
                .ilike('nombre', `%${search}%`)
                .limit(5);

            if (!error) setClientes(data || []);
            setLoading(false);
        };

        const timer = setTimeout(fetchClientes, 300);
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="flex flex-col gap-8 animate-fade">
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold tracking-tight">¿Para quién es el presupuesto?</h3>
                <p className="text-slate-400">Selecciona un cliente de la base de datos o crea uno nuevo.</p>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 focus-within:border-blue-500/50 transition-all">
                    <Search size={22} className="text-slate-500" />
                    <input
                        type="text"
                        placeholder="Escribe el nombre del cliente..."
                        className="bg-transparent border-none outline-none w-full text-lg placeholder:text-slate-600"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="glass px-6 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all text-slate-300">
                    <UserPlus size={20} />
                    Nuevo Cliente
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 italic">Buscando en la nube...</div>
                ) : clientes.length > 0 ? (
                    clientes.map(client => (
                        <div
                            key={client.id}
                            onClick={() => onNext(client)}
                            className="glass p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 border-white/5 hover:border-blue-500/30 transition-all group"
                        >
                            <div>
                                <p className="font-semibold text-lg group-hover:text-blue-400 transition-colors">{client.nombre}</p>
                                <p className="text-sm text-slate-500">{client.empresa || 'Cliente Particular'} • {client.email}</p>
                            </div>
                            <div className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {client.tipo_cliente === 'agencia' ? 'AGENCIA' : 'CLIENTE FINAL'}
                            </div>
                        </div>
                    ))
                ) : search.length > 2 ? (
                    <div className="p-12 text-center text-slate-500">No se encontraron clientes con "{search}"</div>
                ) : null}
            </div>
        </div>
    );
};

export default Step1_Client;
