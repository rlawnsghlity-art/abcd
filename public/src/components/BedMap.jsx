const BedMap = ({ beds, setBeds, pending, onClearPending, now }) => {
    const { useState } = React;
    const [selectedId, setSelectedId] = useState(null);

    const selected = beds.find(b => b.id === selectedId) || null;

    const assign = async (bedId) => {
        if (!pending) return;
        try {
            await fetch(`/api/beds/${bedId}/assign`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId: pending.id })
            });
            setBeds(); // App.jsx의 fetchBeds 호출
            onClearPending();
        } catch (err) {
            alert('배정 실패: ' + err.message);
        }
    };

    const discharge = async (bedId) => {
        try {
            await fetch(`/api/beds/${bedId}/discharge`, { method: 'PUT' });
            setBeds(); // App.jsx의 fetchBeds 호출
            setSelectedId(null);
        } catch (err) {
            alert('퇴실 처리 실패: ' + err.message);
        }
    };

    const finishCleaning = async (bedId) => {
        try {
            // 청소 완료 API가 따로 없으므로 discharge에서 상태를 직접 조절하거나 
            // 여기서는 단순 상태 갱신만 처리하도록 설계 (현재 API상으로는 discharge가 cleaning으로 바꿈)
            await fetch(`/api/beds/${bedId}/discharge`, { method: 'PUT' }); // 임시로 다시 호출하여 빈 병상 상태 확인 유도
            setBeds();
            setSelectedId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const areas = ['중증처치구역', '응급처치구역', '관찰구역'];

    return (
        <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-9 bg-white p-12 rounded-[60px] shadow-sm border border-slate-100">
                {pending && (
                    <div className="mb-12 bg-blue-600 p-8 rounded-[40px] text-white flex justify-between items-center shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)]">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 rounded-[28px] flex items-center justify-center border border-white/30">
                                <LucideIcon name="user-plus" className="w-10 h-10" />
                            </div>
                            <div>
                                <div className="font-black text-3xl leading-none tracking-tighter">배정 대기: {pending.name}</div>
                                <div className="mt-2 text-blue-100 text-sm font-bold uppercase tracking-widest opacity-70">
                                    KTAS Level {pending.grade} | Select an available Bed
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClearPending}
                            className="px-10 py-3 bg-white/10 hover:bg-white/20 rounded-[20px] font-black text-sm transition-all border border-white/20"
                        >
                            CANCEL
                        </button>
                    </div>
                )}

                <div className="space-y-20">
                    {areas.map(area => (
                        <div key={area}>
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-[0.4em] mb-10 italic underline underline-offset-[12px] decoration-slate-100 decoration-4">
                                {area}
                            </h4>
                            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
                                {beds.filter(b => b.area === area).map(bed => (
                                    <button
                                        key={bed.id}
                                        onClick={() => {
                                            if (bed.status === 'empty' && pending) {
                                                assign(bed.id);
                                            } else {
                                                setSelectedId(bed.id);
                                            }
                                        }}
                                        className={`p-6 rounded-[30px] border-2 transition-all flex flex-col items-center gap-3 relative group ${
                                            selectedId === bed.id
                                                ? 'ring-8 ring-blue-50 border-blue-600 scale-110 z-10'
                                                : bed.status === 'occupied'
                                                ? 'bg-white border-slate-100 shadow-sm'
                                                : pending && bed.status === 'empty'
                                                ? 'assign-glow border-blue-400 bg-blue-50/40'
                                                : bed.status === 'cleaning'
                                                ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                                                : 'bg-slate-50/50 border-slate-100 text-slate-200'
                                        }`}
                                    >
                                        <div className="flex justify-between w-full">
                                            <span className="text-[10px] font-black opacity-40">{bed.id}</span>
                                            {bed.status === 'occupied' && bed.patient && (
                                                <div className={`w-2.5 h-2.5 rounded-full bg-ktas-${bed.patient.grade} animate-pulse-custom shadow-lg`}></div>
                                            )}
                                        </div>
                                        <div className="font-black text-sm text-slate-800 truncate w-full text-center leading-none">
                                            {bed.status === 'occupied' && bed.patient
                                                ? bed.patient.name
                                                : bed.status === 'cleaning'
                                                ? 'CLEAN'
                                                : ''}
                                        </div>
                                        {bed.status === 'occupied' && bed.patient && (
                                            <div className="text-[9px] font-black font-mono text-slate-400 opacity-60 tracking-tighter">
                                                {getElapsedTime(bed.patient.entryTime, now)}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
                {selected ? (
                    <div className="bg-[#0F172A] p-12 rounded-[60px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] text-white space-y-12 sticky top-10 border border-white/5">
                        <div className="flex justify-between items-center">
                            <span className="px-5 py-2 bg-blue-600 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase italic">Bed Detail</span>
                            <button onClick={() => setSelectedId(null)} className="text-white/10 hover:text-white transition-all hover:rotate-90">
                                <LucideIcon name="x" className="w-8 h-8" />
                            </button>
                        </div>

                        {selected.status === 'occupied' && selected.patient ? (
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-5xl font-black italic tracking-tighter leading-none">{selected.patient.name}</h3>
                                    <p className="text-white/20 font-black uppercase text-xs mt-4 tracking-[0.3em]">
                                        KTAS Level {selected.patient.grade}
                                    </p>
                                </div>

                                <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6 shadow-inner">
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">Admission</span>
                                        <span className="font-mono text-xl font-black text-slate-300">{formatTime(selected.patient.entryTime)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-blue-500/50 tracking-widest uppercase italic">Live Elapsed</span>
                                        <span className="font-mono text-4xl font-black text-blue-500 tracking-tighter">
                                            {getElapsedTime(selected.patient.entryTime, now)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <button 
                                        onClick={() => discharge(selected.id)}
                                        className="w-full py-8 bg-red-600/20 text-red-500 border border-red-500/20 rounded-[30px] font-black text-sm hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest italic"
                                    >
                                        Discharge & Cleaning
                                    </button>
                                </div>
                            </div>
                        ) : selected.status === 'cleaning' ? (
                            <div className="text-center py-20 space-y-8">
                                <LucideIcon name="refresh-cw" className="w-20 h-20 mx-auto text-yellow-500 animate-spin" />
                                <h4 className="text-3xl font-black italic text-white uppercase tracking-tighter">Cleaning In Progress</h4>
                                <button 
                                    onClick={() => finishCleaning(selected.id)}
                                    className="w-full py-6 bg-white text-slate-900 rounded-[30px] font-black text-sm uppercase tracking-widest italic"
                                >
                                    Mark as Ready
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-20 opacity-20">
                                <LucideIcon name="bed" className="w-20 h-20 mx-auto mb-6" />
                                <p className="font-black italic uppercase tracking-widest">Empty Bed</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full border-2 border-dashed border-slate-100 rounded-[60px] flex flex-col items-center justify-center p-12 text-slate-200">
                        <LucideIcon name="mouse-pointer-2" className="w-12 h-12 mb-6 opacity-20" />
                        <p className="font-black italic uppercase tracking-widest text-xs text-center leading-relaxed">
                            Select a bed to view<br />patient telemetry
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

window.BedMap = BedMap;
