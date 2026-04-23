const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hospital_db",
});

const initDb = async () => {
  const db = connection.promise();

  const tableQuery = `
    CREATE TABLE IF NOT EXISTS pacientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      dataNascimento DATE NOT NULL,
      carteirinha VARCHAR(50) NOT NULL,
      cpf VARCHAR(14) NOT NULL UNIQUE
    );
  `;

  try {
    await db.query(tableQuery);
    console.log(
      '--- [DATABASE LOG]: Tabela "pacientes" verificada/criada com sucesso!',
    );
  } catch (err) {
    console.error("--- [DATABASE LOG]: Erro ao criar tabela:", err);
  }
};

connection.connect((err) => {
  if (err) {
    console.error("--- [DATABASE LOG]: Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("--- [DATABASE LOG]: Conectado ao banco MySQL!");
  initDb();
});

module.exports = connection.promise();
