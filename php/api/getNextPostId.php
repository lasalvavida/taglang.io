<?php
require_once('../../private/getDbConnection.php');

if (isset($_GET['id'])) {
  $id = $_GET['id'];
  // Matches uuid
  if (preg_match('/^[a-zA-Z0-9]{8}-([a-zA-Z0-9]{4}-){3}[a-zA-Z0-9]{12}$/', $id)) {
    $conn = getDbConnection();

    $sql = 'SELECT id FROM posts WHERE date > (SELECT date from posts WHERE id = "' . $id . '") ORDER BY date ASC LIMIT 1';
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
      while ($row = $result->fetch_object()) {
        echo(json_encode($row));
        return;
      }
    }
  }
}
echo('{}');
return;

$conn->close();
?>
