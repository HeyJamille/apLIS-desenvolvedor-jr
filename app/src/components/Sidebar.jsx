import React from 'react';
import { Users, UserCircle, LayoutDashboard, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Configuração dos itens do menu para facilitar a manutenção
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'medicos', label: 'Médicos', icon: <Users size={20} /> },
    { id: 'pacientes', label: 'Pacientes', icon: <UserCircle size={20} /> },
  ];

  return (
    <aside className="w-[320px] bg-slate-900 text-white h-screen flex flex-col shadow-xl">
      {/* Header  */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400 tracking-tight">
          Hosp<span className="text-white">Admin</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Gestão Hospitalar v1.0</p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-40 hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;