import React, { useState, useEffect } from 'react';

const FormPaciente = ({ onSuccess, pacienteExistente }) => {
  // 1. Estados inicializados com dados do médico (se for edição) ou vazio (se for novo)
  const [nome, setNome] = useState(pacienteExistente ? pacienteExistente.nome : '');
  const [dataNascimento, setDataNascimento] = useState(pacienteExistente ? pacienteExistente.dataNascimento : '');
  const [carteirinha, setCarteirinha] = useState(pacienteExistente ? pacienteExistente.carteirinha : '');
  const [cpf, setCpf] = useState(pacienteExistente ? pacienteExistente.cpf : '');
  const [loading, setLoading] = useState(false);

  // Sincroniza os estados se o pacienteExistente mudar enquanto o modal está aberto
  useEffect(() => {
    if (pacienteExistente) {
      setNome(pacienteExistente.nome);
      setDataNascimento(pacienteExistente.dataNascimento);
      setCarteirinha(pacienteExistente.carteirinha);
      setCpf(pacienteExistente.cpf);
    }
  }, [pacienteExistente]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dadosPaciente = {
      nome: nome,
      dataNascimento: dataNascimento,
      carteirinha: carteirinha,
      cpf: cpf
    };

    const isEditing = !!pacienteExistente;

    const url = isEditing 
      ? `http://localhost:3000/api/v1/pacientes/${pacienteExistente.id}` 
      : 'http://localhost:3000/api/v1/pacientes';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosPaciente),
      });

      const resultado = await response.json();
      if (!resultado.status === 'sucesso') {
        throw new Error(resultado.message || 'Erro desconhecido na API');
      }

      alert(resultado.message || (isEditing ? 'Atualizado!' : 'Cadastrado!'));
      
      if (!isEditing) {
        setNome('');
        setDataNascimento('');
        setCarteirinha('');
        setCpf('');
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
          placeholder="Ana Carolina da Silva" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
          <input 
            type="date" 
            required
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-800" 
            placeholder="00000" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Carteirinha</label>
          <input 
            type="text" 
            required
            maxLength={15}
            value={carteirinha}
            onChange={(e) => setCarteirinha(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-800" 
            placeholder="987654321ABCDEF" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
          <input 
            type="number" 
            required
            maxLength={11}
            value={cpf}
            onChange={(e) => setCpf(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-800" 
            placeholder="000.000.000-00" 
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
        {loading ? 'Processando...' : pacienteExistente ? 'Salvar Alterações' : 'Cadastrar Paciente'}
      </button>
    </form>
  );
};

export default FormPaciente;