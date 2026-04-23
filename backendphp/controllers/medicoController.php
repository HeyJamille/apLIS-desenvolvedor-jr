<?php
require_once __DIR__ . '/../models/medicoModel.php';

class MedicoController {
    private $medico;

    public function __construct($db) {
        $this->medico = new Medico($db);
    }

    // Lista médico
    public function index() {
        $lista = $this->medico->listar();

        // Verifica se a lista está vazia
        if (empty($lista)) {
            // Opção 1: Retornar 200 OK com mensagem (Mais amigável)
            echo json_encode([
                "status" => "sucesso",
                "message" => "Nenhum médico cadastrado no banco de dados.",
            ]);
        } else {
            // Se tiver dados, retorna a lista
            echo json_encode($lista);
        }
        exit;
    }

    // Cria médico
    public function store($dados) {
        // 1. Validação de campos vazios
        $erros = [];
        if (empty($dados['nome'])) $erros[] = "O campo 'nome' é obrigatório.";
        if (empty($dados['CRM']) && empty($dados['crm'])) $erros[] = "O campo 'CRM' é obrigatório.";
        if (empty($dados['UFCRM']) && empty($dados['ufcrm'])) $erros[] = "O campo 'UFCRM' é obrigatório.";

        if (!empty($erros)) {
            http_response_code(400);
            echo json_encode(["status" => "erro", "errors" => $erros]);
            exit;
        }

        // 2. Tenta criar o registro
        try {
            $foiCriado = $this->medico->criar($dados);

            if ($foiCriado) {
                http_response_code(201);
                echo json_encode([
                    "status" => "sucesso",
                    "message" => "Médico cadastrado com sucesso!"
                ]);
            }
        } catch (PDOException $e) {
            // 3. CAPTURA ERRO DE DUPLICIDADE (Código 23000)
            if ($e->getCode() == 23000) {
                http_response_code(409); // Conflito
                echo json_encode([
                    "status" => "erro",
                    "message" => "Este CRM já está cadastrado no sistema."
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "status" => "erro",
                    "message" => "Erro no banco de dados: " . $e->getMessage()
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "status" => "erro",
                "message" => "Erro inesperado: " . $e->getMessage()
            ]);
        }
        exit;
    }

    // Deleta médico
    public function delete($id) {
        // A variável $linhas tera o valor 1 (sucesso) ou 0 (não encontrado)
        $linhasAfetadas = $this->medico->deletar($id);

        if ($linhasAfetadas > 0) {
            echo json_encode([
                "status" => "sucesso",
                "message" => "Médico removido com sucesso!"
            ]);
        } else {
            // Se 0 linhas foram afetadas, o ID não existia
            http_response_code(404); // Not Found
            echo json_encode([
                "status" => "erro",
                "message" => "Médico não encontrado. O ID $id pode não existir ou já foi removido."
            ]);
        }
        exit;
    }

    // Atualiza médico
    public function update($id, $dados) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "erro", "message" => "ID não fornecido."]);
            exit;
        }

        // Validação básica
        if (empty($dados['nome']) || (empty($dados['CRM']) && empty($dados['crm']))) {
            http_response_code(400);
            echo json_encode(["status" => "erro", "message" => "Nome e CRM são obrigatórios para atualizar."]);
            exit;
        }

        try {
            $linhasAfetadas = $this->medico->atualizar($id, $dados);

            if ($linhasAfetadas > 0) {
                echo json_encode([
                    "status" => "sucesso",
                    "message" => "Médico atualizado com sucesso!"
                ]);
            } else {
                // Pode ser que o ID não exista ou os dados enviados são iguais aos que já estão no banco
                http_response_code(404);
                echo json_encode([
                    "status" => "aviso",
                    "message" => "Nenhuma alteração realizada. Verifique se o ID existe ou se os dados são novos."
                ]);
            }
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode(["status" => "erro", "message" => "Este CRM já pertence a outro médico."]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "erro", "message" => "Erro ao atualizar: " . $e->getMessage()]);
            }
        }
        exit;
    }
}

