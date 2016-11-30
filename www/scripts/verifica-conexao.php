<?php
	// IN
	$dadoEnv = $_POST["dadoEnv"];
	// OUT
    $dadoRet = 0;
    
	$con = mysqli_connect("localhost","inton634_tagarel","tagarela","inton634_tagarela","3306");
	if ($con) {
		$dadoRet = $dadoEnv;
	}
	
	$ret = array();
    $ret["dadoRet"] = $dadoRet;

    echo json_encode($ret);
?>