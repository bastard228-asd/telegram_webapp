<?php
// fetch_products.php

// Подключение к базе данных
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Phones";

$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL-запрос для получения данных о товарах
$sql = "SELECT id, name, price, image1, image2, image3, description FROM products";
$result = $conn->query($sql);

$products = array();

if ($result->num_rows > 0) {
    // Вывод данных о каждом товаре
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
} else {
    echo "0 results";
}

$conn->close();

// Возвращаем данные в формате JSON
header('Content-Type: application/json');
echo json_encode($products);
?>
