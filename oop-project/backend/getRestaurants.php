<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "db.php";

$sql = "SELECT 
          id,
          name,
          description,
          rating,
          reviews,
          prep_time,
          is_open,
          staff_delivery,
          image_url
        FROM restaurants";

$result = $conn->query($sql);

$restaurants = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $restaurants[] = [
            "id" => $row["id"],
            "name" => $row["name"],
            "description" => $row["description"],
            "rating" => floatval($row["rating"]),
            "reviews" => intval($row["reviews"]),
            "time" => $row["prep_time"],
            "isOpen" => $row["is_open"] == 1,
            "staffDelivery" => $row["staff_delivery"] == 1,
            "imageUrl" => $row["image_url"]
        ];
    }

    echo json_encode($restaurants);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error loading restaurants"
    ]);
}

$conn->close();
?>