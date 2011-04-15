function(data){
	var resp = {
		items : []
	};
	$.each(data.items, function(i,item){
		resp.items[i] = {
			"selected" : window.selected_item == item,
			"value" : item
		};; 
	});
	return resp;
}