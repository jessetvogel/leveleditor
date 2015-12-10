// Thing
function Thing() {
	this.type = "";
	this.x = "0";
	this.y = "0";
	this.depth = "0";
}

function duplicateObject(oldObject)
{
	// Create a new object
	var newObject = createObject();
	var jsObjectNew = newObject.data("jsObject");
	var jsObjectOld = oldObject.data("jsObject");
	
	// Copy all properties
	for(var x in jsObjectOld) jsObjectNew[x] = jsObjectOld[x];
	
	// Return new object
	return newObject;
}

// Create and refresh functions
function createObject()
{
	// Create a new jsObject
	jsObject = new Thing();
	
	// Create a new HTML-object
	object = $("<div></div>");
	$("#objects").append(object);
	
	// Link the two objects
	object.data("jsObject", jsObject);
	
	// Make it movable (left button) & deletable (right button)
	object.mousedown(function(event) {
		if(event.which == 1)
		{
			if(altPressed)
			{
				// Duplicate object
				var newObject = duplicateObject($(this));
				
				// Move new object
				var jsObjectNew = newObject.data("jsObject");
				selectOffsetX = event.clientX - jsObjectNew.x * gridSize_x - offset_x - gridSize_x / 2;
				selectOffsetY = event.clientY - -jsObjectNew.y * gridSize_y - offset_y - gridSize_y / 2;
				movingObject = newObject;
				showProperties(newObject);
				
			}
			else
			{
				// Move object
				var jsObject = $(this).data("jsObject");
				selectOffsetX = event.clientX - jsObject.x * gridSize_x - offset_x - gridSize_x / 2;
				selectOffsetY = event.clientY - -jsObject.y * gridSize_y - offset_y - gridSize_y / 2;
				movingObject = $(this);
				showProperties($(this));
			}
			
		}
		if(event.which == 3) {showProperties(null); $(this).remove();}
	});
	
	// Return this object
	return object;
}

function refreshObject(object)
{
	jsObject = object.data("jsObject");
	
	// Default opacity
	object.css({opacity: 1});

	// Set position
	object.css({left: "" + (Number(jsObject.x) * gridSize_x + offset_x) + "px", top: "" + (-Number(jsObject.y) * gridSize_y + offset_y) + "px"});
	
	// Set size
	if(jsObject.res == null)
	{
		object.css({width: "" + (gridSize_x) + "px", height: "" + (gridSize_y) + "px"});
		object.css({backgroundImage: "url(\"img/question.png\")"});
	}
	else
	{
		object.css({width: "" + (Number(jsObject.width) * gridSize_x) + "px", height: "" + (Number(jsObject.height) * gridSize_y) + "px"});
		
		// Check if resource is already loaded, if not: use "null.png"
		src = resourceByName[jsObject.res] == null ? "img/question.png" : resourceByName[jsObject.res].src;
		object.css({backgroundImage: "url(\"" + src + "\")"});
	}
	
	// EXTRA STUFF
	if(jsObject.type == "solid") object.css({backgroundColor: "#AAAAFF", "background-blend-mode": "multiply"}); else object.css({backgroundColor: "transparent"});
	
	if(jsObject.type == "settings") object.css({backgroundImage: "url(\"img/settings.png\")"});
}
