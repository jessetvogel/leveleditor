var currentFileName = "untitled";

function save()
{
	var lines = [];
	
	$("#objects div").each(function() {
		// Make an array of all the properties (non functions)
		var properties = [];
		var jsObject = $(this).data("jsObject");
		for(var x in jsObject) if(x != "type") properties.push(x + "=\"" + jsObject[x] + "\"");
		
		// Push new line to array
		lines.push("<" + jsObject.type + " " + properties.join(" ") + "/>");
	});
	
	download(currentFileName + "-" + getTimeDate() + ".txt", lines.join("\n"));
}

function getTimeDate()
{
	var date = new Date();
	return "" + date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear() + "-" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
}

// Objects are of the type: <thing x="3" y="4" />
var regexFindObject = /\<(\w+)\s(.*)\s?\/\>/g; 
var regexFindProperty = /(\w+)\s?=\s?"([\w.-]+)"/g;

function load(event)
{
	// First clear all current objects
	$("#objects").empty();
	
	// Get filename and set title
	var file = event.target.files[0];
	currentFileName = file.name;
	document.title = currentFileName;
	
	var reader = new FileReader();
	reader.onload = function(e) {
		// Find all objects
		var matchObjects = regexFindObject.exec(reader.result);
		while(matchObjects != null)
		{
			// Find all values
			var properties = [];
			properties["type"] = matchObjects[1];
			
			var matchProperty = regexFindProperty.exec(matchObjects[2]);
			while(matchProperty != null)
			{
				// Store value
				properties[matchProperty[1]] = matchProperty[2];
				
				// Find new value
				matchProperty = regexFindProperty.exec(matchObjects[2]);		
			}
			
			// Create a new object, and give it the correct values
			var jsObject = createObject().data("jsObject");
			
			// Delete all existing properties
			for(var x in jsObject) {jsObject[x] = null; delete jsObject[x];}
	
			// Copy all properties
			for(var x in properties) jsObject[x] = properties[x];
						
			// Find new object
			matchObjects = regexFindObject.exec(reader.result);
		}
		
		// Finally, refresh everything
		refreshView();
	}
	reader.readAsText(file);
}

// Thank you internet!
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}