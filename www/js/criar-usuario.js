$(document).ready(function() {
	
	$(".cad-usu").click(function() {
		localStorage.usuarioSel = $(".usuario").val();
		localStorage.senhaSel = $(".senha").val();
		localStorage.perfilSel = $("select[name=perfil]").val();
        if($("select[name=perfil]").val() == 0){
            localStorage.perfilSel = 2;
        }
		
		location.href = "cat-usuario.html";
	});

});
