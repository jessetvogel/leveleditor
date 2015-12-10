function showProperties(object)
{
	// First clear table
	var propertiesTable = $("#properties table");
	propertiesTable.empty();

	if(object == null) return;
	
	// Focus this object
	$("#objects div").css({outline: "0px"});
	object.css({outline: "red solid 2px"});
	
	// Put all properties in table
	var jsObject = object.data("jsObject");
	for(var x in jsObject)
	{
		// For number and string properties
		if(typeof(jsObject[x]) == "number" || typeof(jsObject[x]) == "string")
		{
			var input = $("<input />");
			input.on("change", {object: object, jsObject: jsObject, field: x}, function (e) {
				e.data.jsObject[e.data.field] = $(this).val();
				//jsObject.refresh(e.data.object);
				refreshView();
			});
			
			input.val(jsObject[x]);
			propertiesTable.append("<tr><td>" + x + "</td><td></td></tr>");
			propertiesTable.find("td").last().append(input);
			continue;
		}
		
		// Exceptions are: functions
		if(typeof(jsObject[x]) == "function") continue;
		if(x == "res") continue;
		
		// TODO: remove, only for debugging
		console.log("UNKNOWN PROPERTY: " + x);	
	}
	
	propertiesTable.append("<tr><td class=\"buttons\"></td><td></td></tr>");
	
	var addProperty = $("<div></div>");
	addProperty.html("+").css({"float": "left"});
	addProperty.addClass("button");
	addProperty.on("click", {object: object, jsObject: jsObject}, function (e) {
		// TODO: better fix?
		var property = window.prompt("New property name:", "");
		if(property != null && property != "")
		{
			// Set new property (default empty string)
			e.data.jsObject[property] = "";
			
			// Refresh properties menu
			showProperties(e.data.object);
						
			// Refresh object
			refreshObject(e.data.object);
		}
	});
	propertiesTable.find(".buttons").css({margin: "0px", padding: "0px"}).append(addProperty);
	
	var removeProperty = $("<div></div>");
	removeProperty.html("-").css({"float": "left"});
	removeProperty.addClass("button");
	removeProperty.on("click", {object: object, jsObject: jsObject}, function (e) {
		// TODO: better fix?
		var property = window.prompt("Property name to delete:", "");
		if(property != null && property != "")
		{
			// Remove property
			e.data.jsObject[property] = "";
			delete e.data.jsObject[property];
			
			// Refresh properties menu
			showProperties(e.data.object);
			
			// Refresh object
			refreshObject(e.data.object);
		}
	});
	propertiesTable.find(".buttons").append(removeProperty);
}