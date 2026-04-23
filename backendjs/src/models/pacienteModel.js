const db = require("../config/database");

const Paciente = {
  // Lista todos
  findAll: async () => {
    const [rows] = await db.query("SELECT * FROM pacientes");
    return rows;
  },

  // Busca por ID
  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM pacientes WHERE id = ?", [id]);
    return rows[0];
  },

  // Cria
  create: async (dados) => {
    const { nome, dataNascimento, carteirinha, cpf } = dados;
    const [result] = await db.query(
      "INSERT INTO pacientes (nome, dataNascimento, carteirinha, cpf) VALUES (?, ?, ?, ?)",
      [nome, dataNascimento, carteirinha, cpf],
    );
    return { id: result.insertId, ...dados };
  },

  // Atualiza
  update: async (id, dados) => {
    const { nome, dataNascimento, carteirinha, cpf } = dados;

    const [result] = await db.query(
      "UPDATE pacientes SET nome = ?, dataNascimento = ?, carteirinha = ?, cpf = ? WHERE id = ?",
      [nome, dataNascimento, carteirinha, cpf, id],
    );

    if (result.affectedRows === 0) return null;

    return { id: parseInt(id), ...dados };
  },

  // Deleta
  delete: async (id) => {
    const [result] = await db.query("DELETE FROM pacientes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Paciente;
