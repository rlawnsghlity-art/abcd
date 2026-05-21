const { useState, useEffect } = React;

const App = () => {
    const [tab, setTab] = useState('triage');
    const [pending, setPending] = useState(null);
    const [now, setNow] = useState(new Date());
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(true);

    // 데이터 불러오기
    const fetchBeds = async () => {
        try {
            const res = await fetch('/api/beds');
            const data = await res.json();
            // 서버 데이터 형식을 프론트엔드 형식에 맞게 변환
            const formattedBeds = data.map(b => ({
                id: b.id,
                area: b.area,
                status: b.status,
                patient: b.patient_id ? {
                    id: b.patient_id,
                    name: b.patient_name,
                    grade: b.patient_grade,
                    entryTime: b.patient_entry_time
                } : null
            }));
            setBeds(formattedBeds);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch beds:', err);
        }
    };

    useEffect(() => {
        fetchBeds();
        const timer = setInterval(() => setNow(new Date()), 1000);
        const poll = setInterval(fetchBeds, 5000); // 5초마다 자동 갱신
        return () => {
            clearInterval(timer);
            clearInterval(poll);
        };
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center font-black text-4xl italic text-slate-200 uppercase tracking-tighter animate-pulse">Initializing Matrix...</div>;

    return (
        <div className="flex h-screen overflow-hidden text-slate-900 bg-[#F8FAFC]">
            <aside className="w-96 bg-[#0F172A] text-white flex flex-col shrink-0 shadow-2xl z-20">
                <div className="p-14 pb-24">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
                        <span className="text-[10px] font-black tracking-[0.5em] text-blue-500 uppercase">System Live</span>
                    </div>
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                        KTAS<br />
                        <span className="text-white/20 text-2xl font-bold not-italic tracking-normal">Matrix v1.0</span>
                    </h1>
                </div>
                <nav className="flex-1 space-y-2">
                    <NavItem iconName="grid" label="Overview" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
                    <NavItem iconName="shield-check" label="Screening" active={tab === 'triage'} onClick={() => setTab('triage')} />
                    <NavItem iconName="map" label="Bed Matrix" active={tab === 'beds'} onClick={() => setTab('beds')} />
                </nav>
                <div className="p-14 text-[10px] text-white/10 font-black tracking-[0.4em] uppercase border-t border-white/5 text-center leading-relaxed">
                    Medical Command Unit<br />
                    <span className="italic opacity-50 font-medium">Standard of Excellence</span>
                </div>
            </aside>

            <div className="flex-1 flex flex-col relative overflow-hidden">
                <header className="h-40 bg-white/80 backdrop-blur-3xl border-b border-slate-100 flex items-center justify-between px-20 shrink-0 z-10 shadow-sm">
                    <div>
                        <h2 className="text-5xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">{tab}</h2>
                        <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-[0.4em] opacity-60">
                            Hospital Live Feed · {new Date().toLocaleDateString('ko-KR')}
                        </p>
                    </div>
                    <div className="flex gap-6 p-6 bg-slate-50/50 rounded-[40px] border border-slate-100/50">
                        {[1, 2, 3].map(g => (
                            <div key={g} className="px-8 py-3 bg-white rounded-[22px] shadow-sm border border-slate-100 flex items-center gap-4 group hover:scale-105 transition-all">
                                <div className={`w-3 h-3 rounded-full bg-ktas-${g} shadow-lg shadow-black/10`}></div>
                                <span className="text-lg font-black text-slate-800 leading-none">
                                    {beds.filter(b => b.status === 'occupied' && b.patient?.grade === g).length}
                                </span>
                            </div>
                        ))}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-20">
                    {tab === 'dashboard' && <Dashboard beds={beds} />}
                    {tab === 'triage' && <Triage onFinish={(p) => { setPending(p); setTab('beds'); }} />}
                    {tab === 'beds' && (
                        <BedMap
                            beds={beds}
                            setBeds={fetchBeds} // setBeds 대신 fetchBeds를 전달하여 상태 갱신
                            pending={pending}
                            onClearPending={() => setPending(null)}
                            now={now}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
