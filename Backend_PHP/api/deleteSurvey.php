<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include('../config/database.php');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if ($method !== 'DELETE') {
    sendError('Invalid request method', 405);
}

if (empty($data['survey_id'])) {
    sendError('Survey ID is required');
}

$survey_id = intval($data['survey_id']);

$check_query = "SELECT * FROM surveys WHERE id = $survey_id";
$check_result = $conn->query($check_query);

if ($check_result->num_rows === 0) {
    sendError('Survey not found', 404);
}

$query = "UPDATE surveys SET is_deleted = 1 WHERE id = $survey_id";

if ($conn->query($query) === TRUE) {
    sendSuccess('Survey deleted successfully', ['survey_id' => $survey_id]);
} else {
    sendError('Failed to delete survey', 500);
}
?>