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

if (empty($data['name']) || empty($data['gender']) || empty($data['mobile_number']) || empty($data['district_id'])) {
    sendError('Required fields missing');
}

$name = $conn->real_escape_string($data['name']);
$gender = $conn->real_escape_string($data['gender']);
$mobile_number = $conn->real_escape_string($data['mobile_number']);
$email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
$address = isset($data['address']) ? $conn->real_escape_string($data['address']) : '';
$district_id = intval($data['district_id']);
$health_issue_id = isset($data['health_issue_id']) ? intval($data['health_issue_id']) : null;
$remarks = isset($data['remarks']) ? $conn->real_escape_string($data['remarks']) : '';
$family_members_count = isset($data['family_members_count']) ? intval($data['family_members_count']) : 0;
$survey_date = isset($data['survey_date']) ? $conn->real_escape_string($data['survey_date']) : date('Y-m-d');
$created_by = isset($data['created_by']) ? intval($data['created_by']) : 1;

if (!validatePhone($mobile_number)) {
    sendError('Invalid phone number (must be 10 digits)');
}

if (!empty($email) && !validateEmail($email)) {
    sendError('Invalid email format');
}

$query = "INSERT INTO surveys (survey_date, name, gender, mobile_number, email, address, district_id, health_issue_id, remarks, family_members_count, created_by) 
          VALUES ('$survey_date', '$name', '$gender', '$mobile_number', '$email', '$address', $district_id, " . ($health_issue_id ? $health_issue_id : 'NULL') . ", '$remarks', $family_members_count, $created_by)";

if ($conn->query($query) === TRUE) {
    $survey_id = $conn->insert_id;
    sendSuccess('Survey created successfully', [
        'survey_id' => $survey_id,
        'name' => $name,
        'survey_date' => $survey_date
    ]);
} else {
    sendError('Failed to create survey: ' . $conn->error, 500);
}
?>