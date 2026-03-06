import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                    {label}
                </label>
            )}
            <input
                className={`bg-black border border-white/5 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none px-3 py-2 text-sm text-white placeholder:text-white/10 transition-all rounded-sm tabular-nums ${error ? 'border-red-500/50' : ''}`}
                {...props}
            />
            {error && <span className="text-[9px] text-red-500 font-bold uppercase ml-1 italic">{error}</span>}
        </div>
    );
};

export default Input;
