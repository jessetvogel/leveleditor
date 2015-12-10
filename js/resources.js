var resourceList = [];
var resourceByName = [];

function addResource(resourceName, resourceSrc)
{	
	// Only add if it is not yet added!
	if(resourceByName[resourceName] != null) return;

	// Create a resource object
	var resource = {name: resourceName, src: resourceSrc};
	
	// Load image
	var image = new Image();
	image.src = resource.src;
	image.resource = resource;
	image.onload = function() {
		resource.width = this.width;
		resource.height = this.height;
	};
	
	// Add to lists
	resourceList.push(resource);
	resourceByName[resourceName] = resource;
}

function addResourcesFromInput(event)
{
	// Add each resource induvidually
	var files = event.target.files;
	
	function ___(index)
	{
		var reader = new FileReader();
		reader.fileName = files[index].name;
		reader.onload = function (readerEvent) {
			// Add resource
			addResource(readerEvent.target.fileName.replace("\.png", ""), reader.result);	

			// Check if this was the last one
			if(index + 1 >= files.length)
			{
				// Refresh resource menu
				refreshResources();
	
				// Refresh objects (in case some resource wasn't loaded yet)
				refreshView();
			}
			else
			{
				// Read next file
				___(index + 1);
			}
		};
		
		reader.readAsDataURL(files[index]);
	}
	
	// Start with first file
	___(0);
}

function refreshResources()
{
	resourceList.sort(function(a, b) {return a.name.localeCompare(b.name);});
	$("#resources").empty();
	
	length = resourceList.length;
	for(var i = 0;i < length;i ++)
	{	
		// Create and append a new resource
		var resource = $("<div class=\"resource\"></div>");
		$("#resources").append(resource);
		
		// Add a thumbnail, and the name of the resource
		resource.html("<img class=\"thumbnail\" src=\"" + resourceList[i].src + "\" alt />" + resourceList[i].name);
		
		// When clicked on, create a new object
		resource.on("mousedown", {index: i},function(e) {
			object = createObject();
			var jsObject = object.data("jsObject");
			jsObject.type = $("#typeInput").val();
			jsObject.res = resourceList[e.data.index].name;
			jsObject.width = resourceList[e.data.index].width / (gridSize_x / zoom);
			jsObject.height = resourceList[e.data.index].height / (gridSize_y / zoom);
			movingObject = object;
			selectOffsetX = 0;
			selectOffsetY = 0;
		});
	}
}