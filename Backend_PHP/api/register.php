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

if (empty($data['username']) || empty($data['email']) || empty($data['password']) || empty($data['phone']) || empty($data['full_name'])) {
    sendError('All fields are required');
}

$username = $conn->real_escape_string($data['username']);
$email = $conn->real_escape_string($data['email']);
$password = $data['password'];
$phone = $conn->real_escape_string($data['phone']);
$full_name = $conn->real_escape_string($data['full_name']);
$role = isset($data['role']) ? $conn->real_escape_string($data['role']) : 'Staff';

if (!validateEmail($email)) {
    sendError('Invalid email format');
}

if (!validatePhone($phone)) {
    sendError('Invalid phone number (must be 10 digits)');
}

if (!validatePassword($password)) {
    sendError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
}

$query = "SELECT id FROM users WHERE email = '$email' OR username = '$username'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    sendError('Email or Username already exists', 409);
}

$hashed_password = hashPassword($password);

$query = "INSERT INTO users (username, email, password, phone, full_name, role, is_active) 
          VALUES ('$username', '$email', '$hashed_password', '$phone', '$full_name', '$role', 1)";

if ($conn->query($query) === TRUE) {
    $user_id = $conn->insert_id;
    sendSuccess('User registered successfully', [
        'user_id' => $user_id,
        'username' => $username,
        'email' => $email,
        'role' => $role
    ]);
} else {
    sendError('Registration failed: ' . $conn->error, 500);
}
?>