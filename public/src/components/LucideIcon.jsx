const LucideIcon = ({ name, className = '' }) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (!ref.current || !window.lucide) return;
        ref.current.innerHTML = `<i data-lucide="${name}" class="${className}"></i>`;
        window.lucide.createIcons();
    }, [name, className]);

    return React.createElement('span', { ref });
};

window.LucideIcon = LucideIcon;
