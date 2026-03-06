import React from 'react';

const Toggle = ({ label, checked, onChange, className = '' }) => {
    return (
        <div className={`flex items-center justify-between gap-4 p-3 bg-white/5 rounded-sm border border-transparent hover:border-white/5 transition-all cursor-pointer group ${className}`} onClick={() => onChange(!checked)}>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-white transition-colors">
                {label}
            </span>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${checked ? 'bg-accent' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full bg-black transition-all transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </div>
    );
};

export default Toggle;
