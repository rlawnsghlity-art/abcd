const Triage = ({ onFinish }) => {
    const { useState } = React;
    const [step, setStep] = useState(1);
    const [info, setInfo] = useState({ name: '', dob: '', gender: '남성' });
    const [result, setResult] = useState({ category: '', symptom: '', grade: 0, desc: '', entryTime: null });

    const startTriage = () => {
        if (!info.name || !info.dob) return alert('모든 정보를 입력해 주십시오.');
        setResult(prev => ({ ...prev, entryTime: new Date() }));
        setStep(2);
    };

    const group = calculateAge(info.dob) >= 15 ? '성인' : '소아';

    return (
        <div className="max-w-5xl mx-auto bg-white p-20 rounded-[60px] shadow-2xl border border-slate-100 min-h-[750px] flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
                <div
                    className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>

            {step === 1 && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 max-w-2xl mx-auto">
                    <div className="text-center space-y-6">
                        <h3 className="text-5xl font-black text-slate-800 tracking-tighter uppercase italic leading-none underline decoration-blue-600 decoration-[16px] underline-offset-8">
                            Patient Admission
                        </h3>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-lg opacity-60">
                            기초 정보 및 환자 네임스트립 발행
                        </p>
                    </div>
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Full Name</label>
                            <input
                                type="text"
                                value={info.name}
                                onChange={e => setInfo({ ...info, name: e.target.value })}
                                className="w-full bg-[#F1F5F9] px-10 py-8 rounded-[40px] border-none outline-none font-black text-4xl shadow-inner placeholder:italic placeholder:opacity-20"
                                placeholder="이름 입력"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Date of Birth</label>
                                <input
                                    type="date"
                                    value={info.dob}
                                    onChange={e => setInfo({ ...info, dob: e.target.value })}
                                    className="w-full bg-[#F1F5F9] px-10 py-8 rounded-[40px] border-none outline-none font-black text-xl shadow-inner"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Gender</label>
                                <div className="flex bg-[#F1F5F9] p-2 rounded-[40px] shadow-inner h-full items-center">
                                    {['남성', '여성'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setInfo({ ...info, gender: g })}
                                            className={`flex-1 py-6 rounded-[32px] font-black transition-all duration-500 ${
                                                info.gender === g ? 'bg-white text-slate-900 shadow-2xl scale-[1.02]' : 'text-slate-400'
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={startTriage}
                            className="w-full py-10 bg-slate-900 text-white rounded-[45px] font-black text-2xl hover:bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-4 group"
                        >
                            초기 분류 단계 진입
                            <LucideIcon name="chevron-right" className="group-hover:translate-x-3 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-12 animate-in slide-in-from-right-10">
                    <div className="space-y-3">
                        <h3 className="text-5xl font-black text-slate-800 tracking-tighter italic uppercase leading-none">
                            Diagnostic Category
                        </h3>
                        <p className="text-slate-400 text-2xl font-bold italic tracking-tight">
                            주요 증상 분류 선택{' '}
                            <span className="text-blue-600 opacity-40">[{group}]</span>
                        </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.keys(triageOptions[group]).map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setResult({ ...result, category: cat }); setStep(3); }}
                                className="p-12 text-left bg-[#F1F5F9] rounded-[50px] font-black text-3xl italic hover:bg-white hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] transition-all group flex justify-between items-center"
                            >
                                {cat}
                                <LucideIcon name="chevron-right" className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setStep(1)} className="text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-slate-600">
                        Back to Identity
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-12 animate-in slide-in-from-right-10">
                    <div className="space-y-3">
                        <h3 className="text-5xl font-black text-slate-800 tracking-tighter italic uppercase leading-none">
                            Acuity Evaluation
                        </h3>
                        <p className="text-slate-400 text-2xl font-bold italic tracking-tight">
                            세부 증상 및 중증도 평가{' '}
                            <span className="text-blue-600 opacity-40">[{result.category}]</span>
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 max-h-[450px] overflow-y-auto pr-6">
                        {triageOptions[group][result.category].map(s => (
                            <button
                                key={s.name}
                                onClick={() => { setResult({ ...result, symptom: s.name, grade: s.grade, desc: s.desc }); setStep(4); }}
                                className="w-full p-10 text-left bg-[#F1F5F9] rounded-[40px] hover:bg-white hover:shadow-2xl transition-all group flex justify-between items-center border-2 border-transparent hover:border-blue-100"
                            >
                                <div className="space-y-2">
                                    <div className="font-black text-4xl text-slate-800 tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors">
                                        {s.name}
                                    </div>
                                    <p className="text-slate-400 mt-2 font-bold text-lg italic leading-relaxed">"{s.desc}"</p>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-200 group-hover:text-blue-600 transition-all duration-500">
                                    <LucideIcon name="chevron-right" className="w-8 h-8" />
                                </div>
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setStep(2)} className="text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-slate-600">
                        Change Category
                    </button>
                </div>
            )}

            {step === 4 && (
                <div className="text-center space-y-16 animate-in zoom-in-95">
                    <div className="inline-block relative">
                        <div className="p-28 rounded-[110px] border-[32px] border-[#F1F5F9] bg-white shadow-inner">
                            <div className={`text-[280px] leading-none font-black italic ktas-${result.grade} tracking-tighter`}>
                                {result.grade}
                            </div>
                        </div>
                        <div className={`absolute -top-6 -right-10 px-12 py-6 rounded-[35px] bg-ktas-${result.grade} text-white font-black text-4xl shadow-2xl tracking-[0.2em] uppercase italic`}>
                            Level
                        </div>
                    </div>
                    <div className="space-y-8">
                        <h4 className="text-7xl font-black text-slate-800 tracking-tighter italic leading-none underline decoration-slate-100 underline-offset-[16px]">
                            KTAS Level {result.grade}
                        </h4>
                        <p className="text-slate-400 font-black text-5xl italic tracking-tighter">"{result.symptom}"</p>
                        <div className="text-slate-300 font-bold text-2xl uppercase tracking-[0.2em] pt-10">
                            {info.name} / {info.gender} / Age {calculateAge(info.dob)} /{' '}
                            <span className="text-slate-500">{formatTime(result.entryTime)} Registration</span>
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('/api/patients', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        name: info.name,
                                        dob: info.dob,
                                        gender: info.gender,
                                        grade: result.grade,
                                        symptom: result.symptom,
                                        description: result.desc
                                    })
                                });
                                const savedPatient = await res.json();
                                onFinish({
                                    id: savedPatient.id,
                                    name: savedPatient.name,
                                    grade: savedPatient.grade,
                                    entryTime: savedPatient.entry_time
                                });
                            } catch (err) {
                                alert('환자 등록 실패: ' + err.message);
                            }
                        }}
                        className="px-24 py-10 bg-blue-600 text-white rounded-[45px] font-black text-3xl hover:scale-105 shadow-[0_30px_70px_-15px_rgba(37,99,235,0.6)] transition-all italic"
                    >
                        배정 및 모니터링 완성
                    </button>
                </div>
            )}
        </div>
    );
};

window.Triage = Triage;
