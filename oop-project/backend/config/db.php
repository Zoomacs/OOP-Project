<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "q-less_food_ordering_platform";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]));
}

$conn->set_charset("utf8");
?>