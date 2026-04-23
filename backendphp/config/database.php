<?php

class Database {
    private $host = "localhost";
    private $db_name = "hospital_db"; 
    private $username = "root";       
    private $password = "";           
    public $conn;

    public function getConnection() {
    $this->conn = null;

    try {
        $this->conn = new PDO(
            "mysql:host=" . $this->host . ";charset=utf8mb4", 
            $this->username, 
            $this->password
        );
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // 1. Verifica se o banco já existe no servidor
        $query = $this->conn->query("SELECT COUNT(*) FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$this->db_name'");
        $bancoExiste = $query->fetchColumn();

        // 2. Só entra aqui e manda log se o banco NÃO existir
        if (!$bancoExiste) {
            $this->conn->exec("CREATE DATABASE `$this->db_name` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            
            // Esse log agora só aparece na primeira vez!
            error_log("--- [LOG DO BD] Banco de dados '$this->db_name' criado com sucesso ---");
        }

        // 3. Segue o fluxo normal
        $this->conn->exec("USE `$this->db_name`;");
        $this->conn->exec("set names utf8");

        $this->createTables();

    } catch(PDOException $exception) {
        error_log("--- DATABASE ERROR: " . $exception->getMessage() . " ---");
        header('Content-Type: application/json');
        echo json_encode(["error" => "Falha Crítica: " . $exception->getMessage()]);
        exit;
    }

    return $this->conn;
}

    private function createTables() {
        $sql = "CREATE TABLE IF NOT EXISTS medicos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            CRM VARCHAR(50) NOT NULL UNIQUE,
            UFCRM VARCHAR(2) NOT NULL
        ) ENGINE=InnoDB;";

        try {
            $this->conn->exec($sql);
        } catch(PDOException $e) {
            die("Erro ao criar tabela: " . $e->getMessage());
        }
    }
}