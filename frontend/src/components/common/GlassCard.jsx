import React from 'react';

const GlassCard = ({ children, className = "", title, subtitle }) => {
    return (
        <div className={`glass p-8 flex flex-col gap-6 animate-fade ${className}`}>
            {(title || subtitle) && (
                <div className="flex flex-col gap-1 border-b border-white/5 pb-6">
                    {title && <h3 className="text-xl font-bold tracking-tight">{title}</h3>}
                    {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
                </div>
            )}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
