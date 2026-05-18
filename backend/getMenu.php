<?php
require_once "db.php";

$restaurant_id = intval($_GET["restaurant_id"] ?? 0);

if (!$restaurant_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "restaurant_id is required."]);
    exit();
}

$stmt = $conn->prepare(
    "SELECT
        p.product_id,
        p.product_id AS id,
        p.product_name,
        p.product_name AS name,
        p.price,
        p.category,
        p.rating,
        p.description,
        p.picture,
        p.picture AS image_url,
        p.is_available,
        m.name AS menu_name
     FROM product_items p
     JOIN menus m ON p.menu_id = m.menu_id
     WHERE m.restaurant_id = ? AND p.is_available = 1
     ORDER BY m.name, p.product_name"
);
$stmt->bind_param("i", $restaurant_id);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) $items[] = $row;

echo json_encode($items);
$conn->close();
?>
