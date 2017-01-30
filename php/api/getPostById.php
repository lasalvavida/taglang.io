<?php
require_once('../getDbConnection.php');

if (isset($_GET['id'])) {
  $id = $_GET['id'];
  // Matches uuid
  if (preg_match('/^[a-zA-Z0-9]{8}-([a-zA-Z0-9]{4}-){3}[a-zA-Z0-9]{12}$/', $id)) {
    $conn = getDbConnection('');

    $sql = 'SELECT id, title, author, date, tags FROM posts WHERE id = "' . $id . '"';
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
      while ($row = $result->fetch_object()) {
        $row->tags = explode(',', $row->tags);
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
