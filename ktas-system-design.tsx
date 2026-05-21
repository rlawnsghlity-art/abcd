import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, Bed, AlertCircle, Settings, LogOut } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <nav className="w-64 bg-[#1A2B4C] text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-900">
          KTAS Smart ER
        </div>
        <div className="flex-1 py-4">
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<ClipboardList size={20}/>} 
            label="Triage" 
            active={activeTab === 'triage'} 
            onClick={() => setActiveTab('triage')} 
          />
          <NavItem 
            icon={<Bed size={20}/>} 
            label="Bed Visualizer" 
            active={activeTab === 'beds'} 
            onClick={() => setActiveTab('beds')} 
          />
        </div>
        <div className="p-4 border-t border-blue-900">
          <NavItem icon={<Settings size={20}/>} label="Settings" />
          <NavItem icon={<LogOut size={20}/>} label="Logout" />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
          <div className="flex gap-4">
            <StatusBadge grade="1" count={2} color="#E53E3E" />
            <StatusBadge grade="2" count={5} color="#ED8936" />
            <StatusBadge grade="3" count={12} color="#F6E05E" />
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'triage' && <TriageSection />}
          {activeTab === 'beds' && <BedVisualizer />}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-colors ${active ? 'bg-blue-800' : 'hover:bg-blue-900/50'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const StatusBadge = ({ grade, count, color }) => (
  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-sm font-bold">KTAS {grade}:</span>
    <span className="text-sm text-gray-600">{count}명</span>
  </div>
);

// --- Content Components Skeletons ---

const DashboardOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-xl shadow-sm border h-40">가동률 및 대기 현황</div>
    <div className="bg-white p-6 rounded-xl shadow-sm border h-40">구역별 환자 분포</div>
    <div className="bg-white p-6 rounded-xl shadow-sm border h-40">실시간 유입 환자 그래프</div>
  </div>
);

const TriageSection = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm border min-h-[500px]">
    <h3 className="text-lg font-bold mb-4">환자 분류 시스템 (Triage)</h3>
    <div className="text-gray-400 italic">여기에 트리아지 분류 로직이 들어갈 예정입니다.</div>
  </div>
);

const BedVisualizer = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm border min-h-[500px]">
    <h3 className="text-lg font-bold mb-4">응급실 병상 가동 현황 (2D Map)</h3>
    <div className="text-gray-400 italic">여기에 실시간 병상 현황 시각화가 들어갈 예정입니다.</div>
  </div>
);

export default App;
