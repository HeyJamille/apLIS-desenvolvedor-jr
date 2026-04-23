import React, { useState, useEffect } from 'react';

const FormMedico = ({ onSuccess, medicoExistente }) => {
  // 1. Estados inicializados com dados do médico (se for edição) ou vazio (se for novo)
  const [nome, setNome] = useState(medicoExistente ? medicoExistente.nome : '');
  const [crm, setCrm] = useState(medicoExistente ? medicoExistente.CRM : '');
  const [uf, setUf] = useState(medicoExistente ? medicoExistente.UFCRM : '');
  const [loading, setLoading] = useState(false);

  // Sincroniza os estados se o medicoExistente mudar enquanto o modal está aberto
  useEffect(() => {
    if (medicoExistente) {
      setNome(medicoExistente.nome);
      setCrm(medicoExistente.CRM);
      setUf(medicoExistente.UFCRM);
    }
  }, [medicoExistente]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dadosMedico = {
      nome: nome,
      CRM: crm,
      UFCRM: uf
    };

    const isEditing = !!medicoExistente;

    const url = isEditing 
      ? `http://localhost:8000/api/v1/medicos/${medicoExistente.id}` 
      : 'http://localhost:8000/api/v1/medicos';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosMedico),
      });

      const resultado = await response.json();
      if (!resultado.status === 'sucesso') {
        throw new Error(resultado.message || 'Erro desconhecido na API');
      }

      alert(resultado.message || (isEditing ? 'Atualizado!' : 'Cadastrado!'));
      
      if (!isEditing) {
        setNome('');
        setCrm('');
        setUf('');
      }

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
    
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
        <input 
          type="text" 
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-800" 
          placeholder="Ex: Dr. João Silva" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CRM</label>
          <input 
            type="text" 
            required
            value={crm}
            onChange={(e) => setCrm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-800" 
            placeholder="00000" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
          <input 
            type="text" 
            required
            maxLength={2}
            value={uf}
            onChange={(e) => setUf(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-800" 
            placeholder="CE" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={`w-full text-white font-semibold py-2 rounded-lg transition-colors mt-4 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'
        }`}
      >
        {loading ? 'Processando...' : medicoExistente ? 'Salvar Alterações' : 'Cadastrar Médico'}
      </button>
    </form>
  );
};

export default FormMedico;