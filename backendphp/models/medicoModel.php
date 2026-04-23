<?php
class Medico {
    private $conn;
    private $table = "medicos";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function listar() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function criar($dados) {
        $query = "INSERT INTO " . $this->table . " (nome, CRM, UFCRM) VALUES (:nome, :crm, :ufcrm)";
        $stmt = $this->conn->prepare($query);
        
        return $stmt->execute([
            ':nome'  => $dados['nome'] ?? null,
            ':crm'   => $dados['CRM'] ?? $dados['crm'] ?? null,
            ':ufcrm' => $dados['UFCRM'] ?? $dados['ufcrm'] ?? null
        ]);
    }

    public function deletar($id) {
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table . " WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount();
    }

    public function atualizar($id, $dados) {
        $query = "UPDATE " . $this->table . " 
                SET nome = :nome, CRM = :crm, UFCRM = :ufcrm 
                WHERE id = :id";
                
        $stmt = $this->conn->prepare($query);
        
        $stmt->execute([
            ':id'    => $id,
            ':nome'  => $dados['nome'] ?? null,
            ':crm'   => $dados['CRM'] ?? $dados['crm'] ?? null,
            ':ufcrm' => $dados['UFCRM'] ?? $dados['ufcrm'] ?? null
        ]);

        return $stmt->rowCount();
    }
}