/**
 * This is an ajax update pattern inspired by Evently.js which is a plug-in created for working with couchDb
 * @author petter
 *
 *
 * The plug-in has handles these files:
 * before.js - function that is called before the ajaxCall is executed
 * function(element, event){ alert("before"); }
 * 
 * after.js - function that is called after the ajax call or after the before script
 * function(element, resp, dom){ alert("after"); }
 *
 *
**/
(function($){
	/**
	 * Converts a string to a function
	 */
	function funFromStr(str){
		try{
			eval("var f = " + str);
			return f;
		}catch(err){
			$.log("error", err);
			$.log(str + " did not valuate to a function");
		}
	}
	function handle_response(element, resp, pattern, ev){
		// Log the response
		var data;
		if( pattern.data ){
			try{
				data = funFromStr(pattern.data)(resp, element);}
			catch(err2){
				$.log(err2, element, resp, pattern, ev);
			}
		}else{
			data = resp;
		}
		// $.log(pattern.mustache, data);
		// Merge the response with the templates
		if( typeof(pattern.mustache) != "undefined" ){
			var dom = $( Mustache.to_html( pattern.mustache, data, pattern.partials ) );
			// Replace the context element with the new dom
			$(element).html( dom );
			// Apply the selectors on the result
			for( var sel in pattern.selectors ){
				// $.log("Selector", sel);
				// Bind the event to the element with the funtion
				for( var evnt in pattern.selectors[sel] ){
					 // $.log("Binding to ", evnt, "on", $(dom).find(sel));
					var $target = $(element).find(sel);
					if( evnt.substr(0, 6) == "_delay" ){
						// $.log(evnt.substr(7, evnt.length));
						var delay = evnt.substr(7, evnt.length);
						// Automaticly trigger the timeout after delay seconds 
						setTimeout("$(\"" + $target.selector + "\").trigger(\"" + evnt + "\");" , delay);
						$target.data("e_" + evnt, pattern.selectors[sel][evnt]);
						$target.bind(evnt, fluster_update);
					}else if(evnt.substr(0, 10) == "_intervall"){
						var delay = evnt.substr(11, evnt.length);
						// Automaticly trigger the timeout after delay seconds 
						setTimeout("$(\"" + $target.selector + "\").trigger(\"" + evnt + "\");" , delay);
						$target.data("e_" + evnt, pattern.selectors[sel][evnt]);
						$target.bind(evnt, fluster_update);
					}else{
						// $.log("registering " + evnt + " on ", $target);
						$target.data("e_" + evnt, pattern.selectors[sel][evnt]);
						$target.bind(evnt, { parent : element }, function(event){
							// $.log("Executing event", event, "on", event.currentTarget);
							funFromStr($(event.currentTarget).data("e_"+event.type))(event);
						});
					}
					// $.log("registering " + evnt + "on " + sel);
				} // For every event
			} // For every child selector
		}
		// If the event was an interval, we need to reregister the event so that it can be triggered again
		if( ev.type.substring(0,10) == "_intervall" ){
			// $.log("Re-registering intervall event");
			$(dom).data("e_" + ev.type, pattern);
			$(dom).bind(ev.type, fluster_update);
		}
		// Call the after method if it exists
		if( pattern.after ){
			funFromStr(pattern.after)(element, resp, $(dom) );
		}
	}
	
	function fluster_update(e){
		var pattern = e.data.fun;

		// Call the before method if it exists
		if( pattern.before ){
			try{
				funFromStr(pattern.before)($(this), e);
			}catch(err){
				$.log("Error in before", err);				
			}
		}
		// If the query parameter is a function evaluate it, otherwise take the string
		var query = null;
		var func = funFromStr(pattern.query);
		if( typeof(func) === 'function')
			query = func($(this));
		else
			query = func;
		// $.log("query", query);
		// Set the context of the response to the element that was triggered
		// pattern.ajax.context = element;
		// $.log("this inside");
		// $.log("jqfluster", this);
		if( typeof (query) != 'undefined'){
			// Do an ajax call
			var request = {};
			var defaults = {
				dataType : "json",
				success : function( resp ){
					handle_response($(this), resp, pattern, e);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					// Log errors
					$.log(XMLHttpRequest, textStatus, errorThrown);
				},
				context : this
			};
			
			$.extend(request, defaults, query);
			$.ajax(request);
		}else{
			handle_response($(this), undefined, pattern, e);
		}
	}
	
	$.fn.fluster = function(node, doc){
		// Saves a reference to the selected element
		for(var i = 0; i <  $(this).length; i = i + 1 ){
			var element = $(this)[i];
			// Register the event handlers
			for(var fun in node ){
				var pattern = node[fun];
				// Bind the query pattern
				$(element).bind(fun, {fun : pattern}, fluster_update);
				$.log("bound", fun, "on", $(element));
			} // For event handler
		} // For every element
		// Return this element in order to allow chaining of methods
		if( typeof( node["_init"] ) != "undefined" ){
			// Trigger _init right away
			$(element).triggerHandler("_init");
		}
		return $(this);
	}
	
	//
	// Adds a logging function that writes to the console if none is defined else where
	//
	if($.log == undefined){
		$.log = function(){
			if( window.console ){
				try{
					console.log(arguments);
				}catch(error){
					alert(args);
				}
			}
		}
	}
})(jQuery);