import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, Building, Mail, Phone, MapPin, Check, ChevronRight, Loader2 } from 'lucide-react';
import useStore from '../store';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

const ClientStepper = ({ onComplete }) => {
    const { setClient, clients: dbClients, isLoading } = useStore();
    const [view, setView] = useState('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);

    const [newClient, setNewClient] = useState({
        nombre: '',
        empresa: '',
        tipo: 'FINAL', // FINAL / AGENCIA
        email: '',
        telefono: '',
        direccion: '',
        cif_nif: ''
    });

    // Filter logic
    useEffect(() => {
        if (searchQuery.length > 2) {
            const query = searchQuery.toLowerCase();
            const filtered = (dbClients || []).filter(c =>
                c.nombre.toLowerCase().includes(query) ||
                (c.empresa && c.empresa.toLowerCase().includes(query)) ||
                (c.email && c.email.toLowerCase().includes(query))
            );
            setFilteredClients(filtered);
        } else {
            setFilteredClients([]);
        }
    }, [searchQuery, dbClients]);

    const handleSelect = (client) => {
        setClient(client);
        onComplete();
    };

    const handleCreate = (e) => {
        e.preventDefault();
        // Simulate creation
        const createdClient = { ...newClient, id: Date.now() };
        setClient(createdClient);
        onComplete();
    };

    return (
        <div className="max-w-2xl mx-auto py-10 animate-fade-in">
            <div className="flex gap-4 mb-10">
                <button
                    onClick={() => setView('search')}
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${view === 'search' ? 'bg-accent text-black border-accent' : 'bg-white/5 border-white/5 text-muted hover:border-white/10'
                        }`}
                >
                    <Search size={16} />
                    Buscar Existente
                </button>
                <button
                    onClick={() => setView('create')}
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${view === 'create' ? 'bg-accent text-black border-accent' : 'bg-white/5 border-white/5 text-muted hover:border-white/10'
                        }`}
                >
                    <UserPlus size={16} />
                    Nuevo Cliente
                </button>
            </div>

            {view === 'search' ? (
                <div className="space-y-6 animate-slide-up">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Nombre, Empresa o Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface/50 border border-white/5 p-6 pl-14 text-white focus:border-accent outline-none transition-all font-bold placeholder:text-muted/50 text-lg"
                        />
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scroll pr-2">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-10 text-muted gap-3">
                                <Loader2 size={24} className="animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Buscando en base de datos...</span>
                            </div>
                        ) : filteredClients.length > 0 ? (
                            filteredClients.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => handleSelect(c)}
                                    className="w-full bg-white/5 border border-white/5 p-6 flex items-center justify-between group hover:border-accent/30 hover:bg-accent/5 transition-all text-left rounded-sm"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-sm text-muted group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                            {c.empresa ? <Building size={20} /> : <Users size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white uppercase tracking-tight">{c.nombre}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{c.empresa || 'Particular'}</span>
                                                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm ${c.tipo_cliente?.toLowerCase() === 'agencia' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                                    {c.tipo_cliente?.toUpperCase() || 'FINAL'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                </button>
                            ))
                        ) : searchQuery.length > 2 ? (
                            <div className="text-center py-10 border border-dashed border-white/10 rounded-sm">
                                <p className="text-muted text-[10px] font-black uppercase tracking-widest">No se encontraron clientes</p>
                                <button onClick={() => setView('create')} className="text-accent text-[9px] font-black uppercase tracking-[0.2em] mt-4 hover:underline">
                                    Crear como nuevo cliente
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-10 opacity-30">
                                <Users size={40} className="mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Escriba para buscar</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleCreate} className="space-y-8 animate-slide-up bg-surface/50 border border-white/5 p-8 rounded-sm glass">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nombre Completo"
                            required
                            value={newClient.nombre}
                            onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
                        />
                        <Input
                            label="Empresa (Opcional)"
                            value={newClient.empresa}
                            onChange={(e) => setNewClient({ ...newClient, empresa: e.target.value })}
                        />
                        <Select
                            label="Tarifa Cliente"
                            options={[
                                { value: 'FINAL', label: 'CLIENTE FINAL' },
                                { value: 'AGENCIA', label: 'AGENCIA / DISTRIBUIDOR' },
                            ]}
                            value={newClient.tipo}
                            onChange={(e) => setNewClient({ ...newClient, tipo: e.target.value })}
                        />
                        <Input
                            label="CIF / NIF"
                            value={newClient.cif_nif}
                            onChange={(e) => setNewClient({ ...newClient, cif_nif: e.target.value })}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={newClient.email}
                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        />
                        <Input
                            label="Teléfono"
                            value={newClient.telefono}
                            onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Dirección Fiscal"
                        value={newClient.direccion}
                        onChange={(e) => setNewClient({ ...newClient, direccion: e.target.value })}
                    />

                    <div className="pt-6 border-t border-white/5">
                        <Button type="submit" className="w-full py-5 text-xs font-black tracking-[0.2em]">
                            Crear y Continuar
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ClientStepper;
