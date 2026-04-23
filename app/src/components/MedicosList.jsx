import React, { useState } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';

const MedicosList = ({ medicos, onEdit, refreshList }) => {
  const [busca, setBusca] = useState('');

  // Filtra a lista baseada na prop 'medicos' que vem do App.jsx
  const medicosFiltrados = medicos.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase()) ||
    m.CRM.toLowerCase().includes(busca.toLowerCase())
  );

  const handleDeletar = async (id) => {
    if (window.confirm("Deseja excluir este médico?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/medicos/${id}`, {
          method: 'DELETE',
        });

        const resultado = await response.json();

        if (!resultado.status === 'sucesso') {
          throw new Error(resultado.message || 'Erro desconhecido na API');
        }

        alert(resultado.message);

        refreshList(); 
      } catch (err) {
        alert("Erro: " + err.message);
      }
    }
  };

  return (  
    <div className="space-y-4">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">Nome</th>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">CRM</th>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">UF</th>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicosFiltrados.length > 0 ? (
              medicosFiltrados.map((medico) => (
                <tr key={medico.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  {/* Usando p-3 para igualar ao cabeçalho. text-center se o cabeçalho for center */}
                  <td className="p-3 text-gray-800 font-medium text-center">{medico.nome}</td>
                  <td className="p-3 text-gray-600 text-center">{medico.CRM}</td>
                  <td className="p-3 text-gray-600 text-center">{medico.UFCRM}</td>
                  <td className="p-3">
                    {/* Centralizado para bater com o 'Ações' do thead que tem text-center */}
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => onEdit(medico)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Pencil className="text-black" size={18} />
                      </button>
                      <button onClick={() => handleDeletar(medico.id)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Trash2 className="text-black" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-400">
                  Nenhum resultado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicosList;