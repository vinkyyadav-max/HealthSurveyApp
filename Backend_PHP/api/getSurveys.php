<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include('../config/database.php');

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    sendError('Invalid request method', 405);
}

$district_id = isset($_GET['district_id']) ? intval($_GET['district_id']) : '';
$health_issue_id = isset($_GET['health_issue_id']) ? intval($_GET['health_issue_id']) : '';
$from_date = isset($_GET['from_date']) ? $conn->real_escape_string($_GET['from_date']) : '';
$to_date = isset($_GET['to_date']) ? $conn->real_escape_string($_GET['to_date']) : '';
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = 20;
$offset = ($page - 1) * $limit;

$query = "SELECT s.*, d.district_name, h.issue_name FROM surveys s 
          LEFT JOIN districts d ON s.district_id = d.id 
          LEFT JOIN health_issues h ON s.health_issue_id = h.id 
          WHERE s.is_deleted = 0";

if (!empty($district_id)) {
    $query .= " AND s.district_id = $district_id";
}

if (!empty($health_issue_id)) {
    $query .= " AND s.health_issue_id = $health_issue_id";
}

if (!empty($from_date)) {
    $query .= " AND s.survey_date >= '$from_date'";
}

if (!empty($to_date)) {
    $query .= " AND s.survey_date <= '$to_date'";
}

$count_query = str_replace("SELECT s.*, d.district_name, h.issue_name", "SELECT COUNT(*) as total", $query);
$count_result = $conn->query($count_query);
$total = $count_result->fetch_assoc()['total'];

$query .= " ORDER BY s.survey_date DESC LIMIT $limit OFFSET $offset";

$result = $conn->query($query);
$surveys = [];

while ($row = $result->fetch_assoc()) {
    $surveys[] = $row;
}

sendSuccess('Surveys retrieved successfully', [
    'surveys' => $surveys,
    'total' => $total,
    'page' => $page,
    'limit' => $limit,
    'total_pages' => ceil($total / $limit)
]);
?>