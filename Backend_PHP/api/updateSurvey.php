<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include('../config/database.php');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method !== 'PUT') {
    sendError('Invalid request method', 405);
}

if (empty($data['survey_id']) || empty($data['name']) || empty($data['gender']) || empty($data['mobile_number'])) {
    sendError('Required fields missing');
}

$survey_id = intval($data['survey_id']);
$name = $conn->real_escape_string($data['name']);
$gender = $conn->real_escape_string($data['gender']);
$mobile_number = $conn->real_escape_string($data['mobile_number']);
$email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
$address = isset($data['address']) ? $conn->real_escape_string($data['address']) : '';
$district_id = intval($data['district_id']);
$health_issue_id = isset($data['health_issue_id']) ? intval($data['health_issue_id']) : null;
$remarks = isset($data['remarks']) ? $conn->real_escape_string($data['remarks']) : '';
$family_members_count = isset($data['family_members_count']) ? intval($data['family_members_count']) : 0;

if (!validatePhone($mobile_number)) {
    sendError('Invalid phone number');
}

$check_query = "SELECT * FROM surveys WHERE id = $survey_id";
$check_result = $conn->query($check_query);

if ($check_result->num_rows === 0) {
    sendError('Survey not found', 404);
}

$query = "UPDATE surveys SET name = '$name', gender = '$gender', mobile_number = '$mobile_number', 
          email = '$email', address = '$address', district_id = $district_id, 
          health_issue_id = " . ($health_issue_id ? $health_issue_id : 'NULL') . ", 
          remarks = '$remarks', family_members_count = $family_members_count WHERE id = $survey_id";

if ($conn->query($query) === TRUE) {
    sendSuccess('Survey updated successfully', ['survey_id' => $survey_id]);
} else {
    sendError('Failed to update survey', 500);
}
?>