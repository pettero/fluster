document.write("<div id='test'></div>");
if( typeof(jQuery) == "undefined" ){
	document.write('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>');
//	alert("loading");
}
document.write('<script type="text/javascript" src="http://fluster.se/js/jquery.fluster.js"></script>');
document.write('<script type="text/javascript" src="https://github.com/janl/mustache.js/raw/master/mustache.js"></script>');
document.write("<script type='text/javascript' src='js/fluster.js'></script>");
function loadFluster(){
	if( typeof(jQuery) != "undefined" ){
		$(function(){
			$("#test").fluster(fluster).trigger("injected");
		});
	}else{
		setTimeout("loadFluster();", 10);
	}
}
loadFluster();