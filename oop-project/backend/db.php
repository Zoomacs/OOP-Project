<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "university_food_ordering";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]));
}

$conn->set_charset("utf8");
?>