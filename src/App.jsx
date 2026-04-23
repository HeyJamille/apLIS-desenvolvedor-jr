import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MedicosList from './components/MedicosList';
import PacientesList from './components/PacientesList'; // Importe sua lista de pacientes
import Modal from './components/modal';
import FormMedico from './components/ui/forms/FormMedico';
import FormPaciente from './components/ui/forms/FormPaciente'; // Importe seu form de pacientes

export default function App() {
  const [activeTab, setActiveTab] = useState('medicos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados Médicos
  const [medicoParaEditar, setMedicoParaEditar] = useState(null);
  const [medicos, setMedicos] = useState([]);

  // Estados Pacientes
  const [pacienteParaEditar, setPacienteParaEditar] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  // --- FUNÇÕES DE CARREGAMENTO ---
  const carregarMedicos = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/medicos');
      const data = await response.json();
      setMedicos(Array.isArray(data) ? data : []);
    } catch (error) { console.error("Erro Médicos:", error); }
  }, []);

  const carregarPacientes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/pacientes');
      const data = await response.json();
      setPacientes(Array.isArray(data) ? data : []);
    } catch (error) { console.error("Erro Pacientes:", error); }
  }, []);

  // Efeito para carregar dados ao mudar de aba ou iniciar
  useEffect(() => {
    if (activeTab === 'medicos') carregarMedicos();
    if (activeTab === 'pacientes') carregarPacientes();
  }, [activeTab, carregarMedicos, carregarPacientes]);

  const fecharModalELimpar = () => {
    setIsModalOpen(false);
    setMedicoParaEditar(null);
    setPacienteParaEditar(null);
  };

  // Define o título do modal dinamicamente
  const getModalTitle = () => {
    if (activeTab === 'medicos') {
      return medicoParaEditar ? `Editando Médico: ${medicoParaEditar.nome}` : 'Novo Médico';
    }
    return pacienteParaEditar ? `Editando Paciente: ${pacienteParaEditar.nome}` : 'Novo Paciente';
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* MÓDULO MÉDICOS */}
          {activeTab === 'medicos' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Médicos</h2>
                <button 
                  onClick={() => { setMedicoParaEditar(null); setIsModalOpen(true); }}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                  + Novo Médico
                </button>
              </div>
              <MedicosList 
                medicos={medicos} 
                onEdit={(m) => { setMedicoParaEditar(m); setIsModalOpen(true); }}
                refreshList={carregarMedicos} 
              />
            </div>
          )}

          {/* MÓDULO PACIENTES */}
          {activeTab === 'pacientes' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Pacientes</h2>
                <button 
                  onClick={() => { setPacienteParaEditar(null); setIsModalOpen(true); }}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                  + Novo Paciente
                </button>
              </div>
              <PacientesList 
                pacientes={pacientes} 
                onEdit={(p) => { setPacienteParaEditar(p); setIsModalOpen(true); }}
                refreshList={carregarPacientes} 
              />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="text-center font-bold py-20 text-gray-400">
              Módulo Dashboard em desenvolvimento...
            </div>
          )}
        </div>
      </main>

      {/* MODAL ÚNICO COM CONTEÚDO DINÂMICO */}
      <Modal isOpen={isModalOpen} onClose={fecharModalELimpar} title={getModalTitle()}>
        {activeTab === 'medicos' ? (
          <FormMedico 
            medicoExistente={medicoParaEditar} 
            onSuccess={() => { carregarMedicos(); fecharModalELimpar(); }} 
          />
        ) : (
          <FormPaciente 
            pacienteExistente={pacienteParaEditar} 
            onSuccess={() => { carregarPacientes(); fecharModalELimpar(); }} 
          />
        )}
      </Modal>

    </div>
  );
}