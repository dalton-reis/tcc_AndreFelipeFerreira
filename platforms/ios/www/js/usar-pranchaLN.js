var qtdPresas;

$(document).ready(function usarPrancha() {

	var audioElement = document.createElement("audio");
    var presasComidas = 0;
	$.get();
	
	// Verifica quem é o tutor e quem é o paciente
	var tutor = localStorage.idUser;
	var paciente = localStorage.idBuilder;
	if (localStorage.perfil == 3) {
		tutor = localStorage.idBuilder;
		paciente = localStorage.idUser;
	}
	// Data-hora atual e atividade
	var hoje = new Date();
	var dia = hoje.getDate();
	var mes = hoje.getMonth()+1;
	var ano = hoje.getFullYear();
	var hora = hoje.getHours();
	var min = hoje.getMinutes();
	var seg = hoje.getSeconds();
	var data = dia+'/'+mes+'/'+ano;
	var hora = hora+':'+min+':'+seg;
	var dataHora = data+" - "+hora;
	var atv = "Usou a prancha "+localStorage.idPrancha;

	// Busca simbolos da prancha
	var dados = {
		"idBuilder" : paciente,
		"espTut" : tutor,
		"dataHora" : dataHora,
		"atv" : atv,
		"idPrancha" : localStorage.idPrancha,
		"gravarLog" : localStorage.gravarLog
	};    
	$.ajax({
	    type     : "post",
	    url      : "http://tagarela.intonses.com.br/scripts/usar-pranchaLN.php",
	    data     : dados,
	    dataType : "json",
	    success  : function gravarLog(ret) {
	    	$("body").removeClass("loading");
	   		if (ret.erro) {
		    	alert(ret.msg);
		    }  else {
                var conteudo = "<img src='img/"+ret.simb_prancha+"' id='minhaImagem' style='width:500px;height:500px;'>";
                var conteudo2 = "<img hidden src='img/"+ret.simb_prancha+"' id='minhaImagemAux' style='width:1000px;height:1000px;'>";
                $("#imagemLN").append(conteudo);
                $("#divAuxiliar").append(conteudo2);
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
       		
       		$(".img-simbolo").click(function() {
		  		var src = "audio/"+$(this).attr("title");
  				audioElement.setAttribute("src",src);
    			audioElement.play();
			});        
	   	},
        timeout: 5000
	});
    
    var canvas = document.getElementById("canvas"),
                canvasDesenho = document.getElementById("canvasTeste"),
				ctx = canvasDesenho.getContext("2d"),
				painting = false,
				lastX = 0,
				lastY = 0,
				lineThickness = 1;
    
            canvasDesenho.width = canvasDesenho.height = 500;

			canvas.width = canvas.height = 500;

			canvas.onmousedown = function(e) {
				painting = true;
				ctx.fillStyle = "#000000";
				lastX = e.pageX - this.offsetLeft - 310;
				lastY = e.pageY - this.offsetTop - 200;
			};

			canvas.onmouseup = function(e){
				painting = false;
			}

			canvas.onmousemove = function(e) {
				if (painting) {
					var image = document.getElementById("minhaImagem");
					var cnv = document.getElementById("canvas2");
					cnv.width = 500;
					cnv.height = 500;
					var ctxt = cnv.getContext('2d');
					ctxt.drawImage(image, 0, 0, 500, 500);
					var pixelData = ctxt.getImageData(event.offsetX, event.offsetY, 1, 1).data;
					if(pixelData[3] > 100){
						mouseX = e.pageX - this.offsetLeft - 310;
						mouseY = e.pageY - this.offsetTop - 200;

						// find all points between        
						var x1 = mouseX,
							x2 = lastX,
							y1 = mouseY,
							y2 = lastY;


						var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
						if (steep){
							var x = x1;
							x1 = y1;
							y1 = x;

							var y = y2;
							y2 = x2;
							x2 = y;
						}
						if (x1 > x2) {
							var x = x1;
							x1 = x2;
							x2 = x;

							var y = y1;
							y1 = y2;
							y2 = y;
						}

						var dx = x2 - x1,
							dy = Math.abs(y2 - y1),
							error = 0,
							de = dy / dx,
							yStep = -1,
							y = y1;
						
						if (y1 < y2) {
							yStep = 1;
						}
					   
						lineThickness = 20 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
						if(lineThickness < 1){
							lineThickness = 1;   
						}

						for (var x = x1; x < x2; x++) {
							if (steep) {
								ctx.fillRect(y, x, lineThickness , lineThickness );
							} else {
								ctx.fillRect(x, y, lineThickness , lineThickness );
							}
							
							error += de;
							if (error >= 0.5) {
								y += yStep;
								error -= 1.0;
							}
						}
						lastX = mouseX;
						lastY = mouseY;

                        $("#predador").css({top: mouseY, left: mouseX, position:'absolute'});
                        if($('#presa1').is(':visible')){
                            var topo = ($("#presa1").offset().top - this.offsetTop - 200);
                            var esquerda = ($("#presa1").offset().left - this.offsetLeft - 310);
                            if(mouseY >= topo && mouseY <= (topo + 40)){
                                if(mouseX >= esquerda && mouseX <= (esquerda + 40)){
                                    $("#presa1").hide();
                                    presasComidas++;
                                }
                            }
                        }
                        if($('#presa2').is(':visible')){
                            topo = ($("#presa2").offset().top - this.offsetTop - 200);
                            esquerda = ($("#presa2").offset().left - this.offsetLeft - 310);
                            if(mouseY >= topo && mouseY <= (topo + 40)){
                                if(mouseX >= esquerda && mouseX <= (esquerda + 40)){
                                    $("#presa2").hide();
                                    presasComidas++;
                                }
                            }
                        }
                        if($('#presa3').is(':visible')){
                            topo = ($("#presa3").offset().top - this.offsetTop - 200);
                            esquerda = ($("#presa3").offset().left - this.offsetLeft - 310);
                            if(mouseY >= topo && mouseY <= (topo + 40)){
                                if(mouseX >= esquerda && mouseX <= (esquerda + 40)){
                                    $("#presa3").hide();
                                    presasComidas++;
                                }
                            }
                        }
                        if($('#presa4').is(':visible')){
                            topo = ($("#presa4").offset().top - this.offsetTop - 200);
                            esquerda = ($("#presa4").offset().left - this.offsetLeft - 310);
                            if(mouseY >= topo && mouseY <= (topo + 40)){
                                if(mouseX >= esquerda && mouseX <= (esquerda + 40)){
                                    $("#presa4").hide();
                                    presasComidas++;
                                }
                            }
                        }
                        if($('#presa5').is(':visible')){
                            topo = ($("#presa5").offset().top - this.offsetTop - 200);
                            esquerda = ($("#presa5").offset().left - this.offsetLeft - 310);
                            if(mouseY >= topo && mouseY <= (topo + 40)){
                                if(mouseX >= esquerda && mouseX <= (esquerda + 40)){
                                    $("#presa5").hide();
                                    presasComidas++;
                                }
                            }
                        }
                        if(presasComidas == qtdPresas){
                            //$("#imagemLN").css("background-color", "green")
                        }
					}else{
						painting = false;
					}
				}
			}


});

function preparaImagem(){
    var predador;
    var presa;
    var image2 = document.getElementById("minhaImagemAux");
    var cnv2 = document.getElementById("canvasAux");
    cnv2.width = 1000;
    cnv2.height = 1000;
    var ctxt2 = cnv2.getContext('2d');
    ctxt2.drawImage(image2, 0, 0, 1000, 1000);
    var pixelData2 = ctxt2.getImageData(0, 0, 1, 1).data;
    switch(pixelData2[3]){
        case 2:
            predador = 'coelho';
            break;
        case 4:
            break;
        case 6:
            break;
        case 8:
            break;
        case 10:
            break;
            
    }
    $("#predador").append("<img style='width:40px;height:40px;z-index:998' src='img/simbolos/" + predador + ".png'>");
    pixelData2 = ctxt2.getImageData(1, 0, 1, 1).data;
    switch(pixelData2[3]){
        case 2:
            presa = 'cenoura';
            break;
        case 4:
            break;
        case 6:
            break;
        case 8:
            break;
        case 10:
            break;
            
    }
    $("#presa1").append("<img src='img/simbolos/" + presa + ".png' style='width:40px;height:40px;z-index:997'>");
    $("#presa2").append("<img src='img/simbolos/" + presa + ".png' style='width:40px;height:40px;z-index:997'>");
    $("#presa3").append("<img src='img/simbolos/" + presa + ".png' style='width:40px;height:40px;z-index:997'>");
    $("#presa4").append("<img src='img/simbolos/" + presa + ".png' style='width:40px;height:40px;z-index:997'>");
    $("#presa5").append("<img src='img/simbolos/" + presa + ".png' style='width:40px;height:40px;z-index:997'>");
    pixelData2 = ctxt2.getImageData(2, 0, 1, 1).data;
    switch(pixelData2[3]){
        case 2:
            qtdPresas = 1;
            break;
        case 4:
            qtdPresas = 2;
            break;
        case 6:
            qtdPresas = 3;
            break;
        case 8:
            qtdPresas = 4;
            break;
        case 10:
            qtdPresas = 5;
            break;
    }
    var cont = 0;
    for(var i = 0; i< 1000; i++){
        for(var j = 0; j < 1000; j++){
            pixelData2 = ctxt2.getImageData(j, i, 1, 1).data;
            if(pixelData2[3] == 253){
                cont++;
                $("#presa" + cont).css({top: (i/2), left: (j/2), position:'absolute'})
            }
        }
    }

}