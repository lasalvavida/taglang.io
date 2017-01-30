<?php
function getDbConnection() {
    $servername = "localhost:3306";
    $username = "api_access";
    $password = "12345";
    $dbname = "blog";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}
?>
