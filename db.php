<?php
    $servername = "online-multi-clinic.ctpcl6jhrhcc.ap-southeast-1.rds.amazonaws.com:3306";
    $username = "oom";
    $password = "clinicmuiioom";
    $database = "clinic";

    $con = mysqli_connect("localhost", $username, $password, $db);

    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    }
    echo("Connected to " . $servername)
?>
