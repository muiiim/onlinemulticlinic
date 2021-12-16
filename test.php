<?php
include "db.php";
    $sql = "SELECT * FROM doctor";
	$run_query = mysqli_query($conn, $sql);
	$count = mysqli_num_rows($run_query);
	$row = mysqli_fetch_array($run_query);
    echo $row["dfname"] . $row["dlname"]
?>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html"; charset="utf-8" />
        <title></title>
    </head>
    <body>

    </body>
</html>