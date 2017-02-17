<?php
require_once('../../private/getDbConnection.php');

$conn = getDbConnection();

$sql = 'SELECT COUNT(*) FROM posts';
$result = $conn->query($sql);

$rows = $result->fetch_row();
echo('{"numPosts": ' . $rows[0] . '}');
?>
