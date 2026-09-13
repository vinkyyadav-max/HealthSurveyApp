<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include('../config/database.php');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method !== 'POST') {
    sendError('Invalid request method', 405);
}

if (empty($data['email']) || empty($data['password'])) {
    sendError('Email and password are required');
}

$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

$query = "SELECT id, username, email, password, phone, full_name, role, is_active FROM users WHERE email = '$email'";
$result = $conn->query($query);

if ($result->num_rows === 0) {
    sendError('Invalid email or password', 401);
}

$user = $result->fetch_assoc();

if ($user['is_active'] == 0) {
    sendError('Your account is inactive', 403);
}

if (!verifyPassword($password, $user['password'])) {
    sendError('Invalid email or password', 401);
}

unset($user['password']);

sendSuccess('Login successful', $user);
?>