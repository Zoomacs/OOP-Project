<?php
require_once "db.php";

$sql = "SELECT
          restaurant_id AS id,
          name,
          description,
          rating,
          reviews,
          prep_time,
          is_open,
          staff_delivery,
          image_url
        FROM restaurants
        ORDER BY name ASC";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
    $conn->close();
    exit();
}

$restaurants = [];
while ($row = $result->fetch_assoc()) {
    $restaurants[] = [
        "id"            => intval($row["id"]),
        "name"          => $row["name"],
        "description"   => $row["description"] ?? "",
        "rating"        => floatval($row["rating"]),
        "reviews"       => intval($row["reviews"]),
        "time"          => $row["prep_time"] ?? "15-20 min",
        "isOpen"        => intval($row["is_open"]) === 1,
        "staffDelivery" => intval($row["staff_delivery"]) === 1,
        "imageUrl"      => $row["image_url"] ?? "",
    ];
}

echo json_encode($restaurants);
$conn->close();
?>
