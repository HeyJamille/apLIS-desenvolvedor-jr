const Paciente = require("../models/pacienteModel");

const pacienteController = {
  // Lista
  listar: async (req, res) => {
    try {
      const pacientes = await Paciente.findAll();
      console.log("pacientes", pacientes);
      return res.status(200).json(pacientes);
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ message: "Erro ao buscar pacientes." });
    }
  },

  // Lista por ID
  buscarPorId: (req, res) => {
    try {
      const { id } = req.params;
      const paciente = Paciente.findById(id);

      if (!paciente) {
        return res.status(404).json({ message: "Paciente não encontrado." });
      }

      return res.status(200).json(paciente);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar o paciente." });
    }
  },

  // Cria
  criar: async (req, res) => {
    try {
      const { nome, dataNascimento, carteirinha, cpf } = req.body;

      if (!nome || !dataNascimento || !carteirinha || !cpf) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      const novoPaciente = await Paciente.create({
        nome,
        dataNascimento,
        carteirinha,
        cpf,
      });

      return res.status(201).json({
        message: "Paciente criado com sucesso",
        data: novoPaciente,
      });
    } catch (error) {
      console.error("Erro no Controller ao criar:", error);

      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ message: "Este CPF já está cadastrado." });
      }

      return res.status(500).json({
        message: "Erro interno ao criar paciente: " + error.message,
      });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, dataNascimento, carteirinha, cpf } = req.body;

      if (!nome || !dataNascimento || !carteirinha || !cpf) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      const pacienteAtualizado = await Paciente.update(id, {
        nome,
        dataNascimento,
        carteirinha,
        cpf,
      });

      if (!pacienteAtualizado) {
        return res.status(404).json({
          message: "Paciente não encontrado ou nenhum dado alterado.",
        });
      }

      return res.status(200).json({
        message: "Paciente atualizado com sucesso!",
        data: pacienteAtualizado,
      });
    } catch (error) {
      console.error("Erro ao atualizar no MySQL:", error);

      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ message: "Este CPF já pertence a outro paciente." });
      }

      return res.status(500).json({
        message: "Erro interno: " + error.message,
      });
    }
  },

  // Deleta
  remover: (req, res) => {
    try {
      const { id } = req.params;
      const deletado = Paciente.delete(id);

      if (!deletado) {
        return res
          .status(404)
          .json({ message: "Paciente não encontrado para exclusão." });
      }

      return res
        .status(200)
        .json({ message: "Paciente removido com sucesso." });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao remover paciente." });
    }
  },
};

module.exports = pacienteController;
