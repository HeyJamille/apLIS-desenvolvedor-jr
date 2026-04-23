const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");

router.get("/pacientes", pacienteController.listar);
router.get("/pacientes/:id", pacienteController.buscarPorId);
router.put("/pacientes/:id", pacienteController.atualizar);
router.post("/pacientes", pacienteController.criar);
router.delete("/pacientes/:id", pacienteController.remover);

module.exports = router;
