# jquery.fluster.js

Fluster is a way to organize and structure your code. By letting you place the code in folders the JavaScript files become 
smaller and is easier to oversee. 

It is suitable in projects when the BackEnd provides JSON and a lot of processing is done in the client.

The pattern is highly influenced by [Evently][] and the way it is used in CouchApps.

What I liked working with [CouchApp][] and [Evently][] was that it made it easy to structure code making it easier to structure 
the code into different folders and then merge it together. It provided a structure for how to organize the code and how to 
manage ajax calls.

## What it does

Fluster organizes your code by letting you place the code in folder. A flustered folder could look like this:

	my_event
		- query.js
		- data.js
		- mustache.html

Running the script `jqfluster.py` on the folder creates the following JSON document.

	var fluster = {
		"my_event" : {
			"query" : contents of query.js..,
			"data" : contents of data.js...,
			"mustache" : contents of mustache.html...
		}
	}

This means that from having a bunch of files we now have a nice document that we can traverse to 
find the function. Please notice that the functions gets a name spaced from the folder 

### Mustache
Mustache is a template language with implementations for many languages. Documentation for the the template can be found
[here][mustache]. The sample we will go through here is not trivial, and it might help looking up mustache first.

A sample file can look like this:

	<ul>
		{{#items}}
			<li {{#selected}}class="seletcted"{{/selected}}>{{value}}</li>
		{{/items}}
	</ul>

### Query
The query file should return a JSON document populating the url property.

	function(element){
		return {
			"url" : "/my_items.json"
		};
	}

The response from `my_items.json` might look like this.

	{
		"items" : [
			"item1",
			"item2",
			"item3"
		]
	}

### Data
The data file should process the result and generate an object suitable for merging with the mustache.

The `HTML` that we want to generate should highlight the current selected item. The data function might look like this:

	function(data){
		var resp = {};
		resp.items = $.each(data.items, function(item){
			return {
				"selected" : window.selected_item == item,
				"value" : item
			};
		});
		return resp;
	}

### How to compile the file
The data,query and mustache file are compile together with by running the `jqfluster.py` command in the prompt

	$ jqfluster.py

## Using the generated file
The generated is used in html like this

	<html>
		<head>
			<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
			<script type="text/javascript" src="https://github.com/janl/mustache.js/raw/master/mustache.js"></script>
			<script type="text/javascript" src="fluster.js"></script>
			<script type="text/javascript">
				selected_item = "item2";
				$(function(){
					$(.container).fluster(fluster).trigger("my_event");
				});
			</script>
		</head>
		<body>
			<div class="container"></div>
		</body>
	</head>

* See a demo [Here!][demo_1]
* See a demo with click listeners registered afterwards [here][demo_2]
* See a 3 step wizard that uses the global scope [here][demo_3_alt]
* See a 3 step wizard [here][demo_3]
* See a demo with JavaScript injections [here][demo_4]
* See a demo with 


## Where to use it
When you want a page to update several parts regardless of each other. 

When the response you get back from the server is in JSON and you start concatenate strings in order to 
merge the result with the JSON.

[couchapp]: http://couchapp.org/page/index "CouchApp" 
[evently]: https://github.com/jchris/evently "Evently"
[mustache]: https://github.com/janl/mustache.js/ "Mustache JS"
[jquery-ajax]: http://api.jquery.com/jQuery.ajax/ "jQuery Ajax"
[demo_1]: http://fluster.se/demo_1/index.html "Demo 1"
[demo_2]: http://fluster.se/demo_2/index.html "Demo 2"
[demo_3_alt]: http://fluster.se/demo_3/index.html "Demo 3 - The wizard using the global scope"
[demo_3]: http://fluster.se/demo_3/index.html "Demo 3 - The wizard"
[demo_4]: http://fluster.se/demo_4/index.html "Demo 4 - Injections"