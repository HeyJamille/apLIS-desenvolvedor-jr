import React, { useState } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';

const PacientesList = ({ pacientes, onEdit, refreshList }) => {
  const [busca, setBusca] = useState('');

  // Filtra a lista baseada na prop 'pacientes' que vem do App.jsx
  const pacientesFiltrados = pacientes.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase()) ||
    m.CRM.toLowerCase().includes(busca.toLowerCase())
  );

  const handleDeletar = async (id) => {
    if (window.confirm("Deseja excluir este paciente?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/pacientes/${id}`, {
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
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">Nome</th>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">Data de Nascimento</th>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">Carteirinha</th>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">CPF</th>
              <th className="p-3 uppercase text-[11px] font-bold tracking-widest text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.length > 0 ? (
              pacientesFiltrados.map((paciente) => (
                <tr key={paciente.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 pl-6 pr-2 text-gray-800 font-medium">{paciente.nome}</td>
                  <td className="py-4 px-2 text-gray-600">{paciente.dataNascimento}</td>
                  <td className="py-4 px-2 text-gray-600 text-center">{paciente.carteirinha}</td>
                  <td className="py-4 px-2 text-gray-600 text-center">{paciente.cpf}</td>
                  <td className="py-4 pl-2 pr-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => onEdit(paciente)} className="p-2 hover:bg-gray-200 rounded-lg">
                        <Pencil className="text-black" size={18} />
                      </button>
                      <button onClick={() => handleDeletar(paciente.id)} className="p-2 hover:bg-gray-200 rounded-lg">
                        <Trash2 className="text-black" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400">Nenhum resultado encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PacientesList;