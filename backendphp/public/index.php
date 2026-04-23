<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/medicoController.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); 
    exit; 
}

$database = new Database();
$db = $database->getConnection();

$metodo = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($path, '/'));

$apiIndex = array_search('api', $uri);

if ($apiIndex !== false && isset($uri[$apiIndex+1]) && $uri[$apiIndex+1] == 'v1' && isset($uri[$apiIndex+2]) && $uri[$apiIndex+2] == 'medicos') {
    
    $controller = new MedicoController($db);
    $id = isset($uri[$apiIndex+3]) ? (int)$uri[$apiIndex+3] : null;

    // Roteamento para os métodos definidos no controller
    switch ($metodo) {
        case 'GET':
            $controller->index(); 
            break;

        case 'POST':
            $dados = json_decode(file_get_contents('php://input'), true);
            $controller->store($dados);
            break;

        case 'DELETE':
            if ($id) {
                $controller->delete($id); 
            } else {
                http_response_code(400);
                echo json_encode(["error" => "ID não fornecido para exclusão"]);
            }
            break;
        case 'PUT':
            if ($id) {
                $dados = json_decode(file_get_contents('php://input'), true);
                $controller->update($id, $dados);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "ID é necessário para atualizar"]);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(["error" => "Método não permitido"]);
            break;
    }

} else {
    http_response_code(404);
    echo json_encode([
        "error" => "Rota não encontrada",
        "debug_path" => $path
    ]);
}