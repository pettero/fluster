function(event){
	window.last_name = $("#step2").val();
	$(event.currentTarget).trigger("step_3");
	event.preventDefault();
}