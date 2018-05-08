window.addEventListener("DOMContentLoaded", function(event) {
	var bar=document.getElementById("sample-buttons");
	var btnCode= document.createElement('div');
	btnCode.id = 'sample-view-code';
	btnCode.innerHTML="Ver c&oacute;digo fuente";
	bar.appendChild( btnCode )
	btnCode.onclick = function() {
		var url=location.href;
		location.href=url.substr(0,url.length-5)+".code.html";
	}
});