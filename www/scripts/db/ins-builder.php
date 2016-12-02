<?php
	$id = $_POST["id"];
	$paciente = $_POST["paciente"];
	$esptut = $_POST["esptut"];
    $erro = false;
    $msg = "";
    	
	$con = mysqli_connect("localhost","inton634_tagarel","tagarela","inton634_tagarela","3306");
	if (!$con) {
		$erro = true;
		$msg = "Erro ao consistir a tabela de builders!";
	}
	else {
		$query1 = "INSERT INTO builder (paciente, esp_tut) "
				."VALUES ('$paciente', '$esptut') ";
		mysqli_query($con,$query1);	
	}
	mysqli_close($con);

    $ret = array();
    $ret["erro"] = $erro;
    $ret["msg"] = $msg;
    $ret["id"] = $id;
        
    echo json_encode($ret);
?>
