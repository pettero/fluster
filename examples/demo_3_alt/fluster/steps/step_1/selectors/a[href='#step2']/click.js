function(event){
	window.first_name = $("#step1").val();
	$(event.currentTarget).trigger("step_2");
	event.preventDefault();
}