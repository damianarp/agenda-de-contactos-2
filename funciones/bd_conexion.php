<?php 
    $conn = new mysqli('localhost', 'root','root','agenda');
    
    if($conn->connect_error) {
      echo $error = $conn->connect_error;
    }
    

?>