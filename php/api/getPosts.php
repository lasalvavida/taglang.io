<?php
require_once('../../private/getDbConnection.php');

if (!isset($_GET['numPosts'])) {
  $numPosts = 3;
} else {
  $numPosts = $_GET['numPosts'];
}

if (!isset($_GET['page'])) {
  $page = 0;
} else {
  $page = $_GET['page'];
}

$conn = getDbConnection();

settype($numPosts, 'integer');
settype($page, 'integer');
$sql = 'SELECT id, title, author, date, tags FROM posts ORDER BY date DESC LIMIT ' . $numPosts . ' OFFSET '  . ($page * $numPosts);
$result = $conn->query($sql);

$jsonString = '[';

if ($result->num_rows > 0) {
    $rowNum = 0;
    while ($row = $result->fetch_object()) {
        if ($rowNum > 0) {
            $jsonString .= ",";
        }
        $row->tags = explode(',', $row->tags);
        $jsonString .= json_encode($row);
        $rowNum++;
    }
}

$jsonString .= "]";
echo $jsonString;

$conn->close();
?>
