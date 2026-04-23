const express = require("express");
const cors = require("cors");
const pacienteRoutes = require("./routes/pacienteRoutes");

const app = express();

app.use(cors());

app.use(express.json());

// Prefixo das rotas
app.use("/api/v1", pacienteRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
