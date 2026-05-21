const NavItem = ({ iconName, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-8 py-6 transition-all duration-300 ${
                active
                    ? 'bg-white/10 text-white border-l-4 border-blue-500 font-bold'
                    : 'hover:bg-white/5 text-slate-400'
            }`}
        >
            <LucideIcon name={iconName} className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest leading-none">{label}</span>
        </button>
    );
};

window.NavItem = NavItem;
