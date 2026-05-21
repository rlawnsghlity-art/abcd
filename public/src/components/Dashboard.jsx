const Dashboard = ({ beds }) => {
    const occupied = beds.filter(b => b.status === 'occupied').length;
    const critical = beds.filter(b => b.status === 'occupied' && b.patient?.grade <= 2).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in duration-700">
            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100">
                <div className="p-4 bg-blue-50 w-fit rounded-2xl text-blue-600 mb-8">
                    <LucideIcon name="activity" />
                </div>
                <h4 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">ER Occupancy</h4>
                <div className="text-6xl font-black text-slate-800 italic underline decoration-blue-500 decoration-8 underline-offset-8">
                    {((occupied / 20) * 100).toFixed(1)}
                    <span className="text-2xl not-italic ml-1 opacity-20">%</span>
                </div>
            </div>

            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100">
                <div className="p-4 bg-orange-50 w-fit rounded-2xl text-orange-500 mb-8">
                    <LucideIcon name="zap" />
                </div>
                <h4 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Urgent Pts</h4>
                <div className="text-6xl font-black text-slate-800 italic underline decoration-orange-400 decoration-8 underline-offset-8">
                    {critical}
                    <span className="text-2xl not-italic ml-1 opacity-20">Pts</span>
                </div>
            </div>

            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100">
                <div className="p-4 bg-red-50 w-fit rounded-2xl text-red-600 mb-8">
                    <LucideIcon name="shield-alert" />
                </div>
                <h4 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Severity Rate</h4>
                <div className="text-6xl font-black text-red-600 italic underline decoration-red-100 decoration-8 underline-offset-8">
                    {occupied ? ((critical / occupied) * 100).toFixed(1) : 0}
                    <span className="text-2xl not-italic ml-1 opacity-20">%</span>
                </div>
            </div>
        </div>
    );
};

window.Dashboard = Dashboard;
