import React from 'react';

const Select = ({ label, options = [], error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                    {label}
                </label>
            )}
            <select
                className={`bg-black border border-white/5 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none px-3 py-2 text-sm text-white transition-all rounded-sm appearance-none cursor-pointer ${error ? 'border-red-500/50' : ''}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-surface text-white">
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-[9px] text-red-500 font-bold uppercase ml-1 italic">{error}</span>}
        </div>
    );
};

export default Select;
