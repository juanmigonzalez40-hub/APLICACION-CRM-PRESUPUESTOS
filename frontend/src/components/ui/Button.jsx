import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-accent text-black hover:brightness-110 active:scale-[0.98] shadow-[0_0_15px_rgba(217,255,0,0.1)]',
        secondary: 'bg-surface border border-white/10 text-white hover:bg-white/5 disabled:opacity-50',
        outline: 'bg-transparent border border-accent/20 text-accent hover:bg-accent/5',
        ghost: 'bg-transparent text-muted hover:text-white',
    };

    return (
        <button
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
