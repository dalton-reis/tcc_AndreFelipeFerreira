$(document).ready(function mostrarConvites() {

	// Verifica conexão com o servidor
	localStorage.conectado = 0;
	var dados = {
		"dadoEnv" : 1
	};    
	$.ajax({
	    type     : "post",
	    url      : "http://intonses.com.br/tagarela/scripts/verifica-conexao.php",
	    data     : dados,
	    dataType : "json",
	    success  : function(ret) {
	    	if (ret.dadoRet == 1) {
		    	localStorage.conectado = 1;
		    	consistirDados();
		    }
	    },
		error    : function(ret) {
		   	$("body").removeClass("loading");
		},
		beforeSend: function() {
		   	$("body").addClass("loading");
		},
        complete: function() { 
        	$("body").removeClass("loading");
        }
	});
	
	/*var dados = {
		"idUsuario" : localStorage.idUser
	};    
	$.ajax({
	    type     : "post",
	    url      : "http://tagarela-afwippel.rhcloud.com/scripts/acc-convite.php",
	    data     : dados,
	    dataType : "json",
	    success  : function(ret) {
	    	$("body").removeClass("loading");
	   		if (ret.erro) {
		    	alert(ret.msg);
		    }
		    else {
		    	for	(var i = 0; i < ret.pacientesId.length; i++) {
					$(".pacientes").append("<a href='mostrar-convite.html'>"
										  +"<img src='../img/"+ret.pacientesImg[i]+"' title='"+ret.pacientesAudio[i]+"' alt='"+ret.pacientesId[i]+"' class='img-paciente' style='margin:25px'/>"
										  +"</a>");
				}
				if (ret.pacientesId.length == 0) {
					alert("Não há convites pendentes!");
					location.href = "../home.html";
				}
		    }
	    },
	    error    : function(ret) {
	    	$("body").removeClass("loading");
	   		alert("Erro no servidor (TIMEOUT)!");
	    },
	    beforeSend: function() {
	    	$("body").addClass("loading");
	    },
       	complete: function() { 
       		$("body").removeClass("loading");

			$(".img-paciente").click(function() {
		  		var alt = $(this).attr("alt");
		  		localStorage.idPaciente = Number(alt);
			});
       	}
	});*/
	db.transaction(transAccConv, nokQuery);
	function nokQuery(erro) {
		alert("Erro ao realizar operação no banco de dados! Erro: "+erro.code);
	}
	function transAccConv(tx) {
    	tx.executeSql("SELECT paciente FROM convites WHERE esp_tut = ?", [localStorage.idUser], okQueryAccConv, nokQuery);
    }
    var pacientesId = [];
	var pacientesIdAux = [];
    function okQueryAccConv(tx, results) {
    	var len = results.rows.length;
        if (len > 0) {	
        	for (var i=0; i<len; i++) {
	    		pacientesId[i] = results.rows.item(i).paciente;
	    		pacientesIdAux[i] = 0;
	    		db.transaction(transAccUsu, nokQuery);
	    	}
	    }
	    else {
	    	alert("Não há convites pendentes!");
			location.href = "../home.html";
	    }
    }
    function transAccUsu(tx) {
		for (var i=0; i<pacientesId.length; i++) {
    		if (pacientesIdAux[i] == 0) {
    			tx.executeSql("SELECT simbolo,id FROM usuarios WHERE id = ?", [pacientesId[i]], okQueryAccUsu, nokQuery);
				pacientesIdAux[i] = 1;
    			break;
    		}
    	}
    }
    var simbolo;
	var idPac;
    function okQueryAccUsu(tx, results) {
    	var len = results.rows.length;
        for (var i=0; i<len; i++) {
	    	simbolo = results.rows.item(i).simbolo;
			idPac = results.rows.item(i).id;
	    	db.transaction(transAccSimb, nokQuery);
	    }
    }
    function transAccSimb(tx) {
    	tx.executeSql("SELECT categoria,img,audio FROM simbolos WHERE id = ?", [simbolo], okQueryAccSimb, nokQuery);
    }
    function okQueryAccSimb(tx, results) {
    	var len = results.rows.length;
        var auxili = 0;
        for (var i=0; i<len; i++) {
	    	var corBorda;
	        switch (results.rows.item(i).categoria) {
				case 1:
					corBorda = "yellow";
					break;
				case 2:
					corBorda = "red";
					break;
				case 3:
					corBorda = "green";
					break;
				case 4:
					corBorda = "blue";
					break;
				default:
					corBorda = "black";
					break;
			}
            if(auxili == 0){
                $(".pacientes").append("<div class = 'row'>");
            }
	    	if (localStorage.dinamico == "iOS") {
                $(".pacientes").append("<div class = 'col col-50' simbs>"
                                    + "<a href='mostrar-convite.html'>"
                                    + "<img src='img/"+results.rows.item(i).img+"' title='"+results.rows.item(i).audio+"'"
                                    + " alt='"+idPac+"' class='img-paciente' style='margin:25px; border:10px solid "+corBorda+";"
                                    + "height='175' width='175'/></a></div>");
	    	}
	    	else {
	    		$(".pacientes").append("<div class = 'col col-50' simbs>"
                                    + "<a href='mostrar-convite.html'>"
                                    + "<img src='"+results.rows.item(i).img+"' title='"+results.rows.item(i).audio+"'"
                                    + " alt='"+idPac+"' class='img-paciente' style='margin:25px; border:10px solid "+corBorda+";"
                                    + "height='175' width='175'/></a></div>");
	    	}
            if(auxili == 1){
                $(".pacientes").append("</div>");
                auxili = 0;
            }else{
                auxili = 1;
            }
		}
        if(auxili == 1){
            $(".planos").append("</div>");
        }
		$(".img-paciente").click(function() {
			var alt = $(this).attr("alt");
			localStorage.idPaciente = Number(alt);
		});
    }    
		
});