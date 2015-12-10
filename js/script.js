var offset_x = 512;
var offset_y = 384;

var gridSize_x = 32;
var gridSize_y = 32;

var zoom = 2;

var movingObject = null;
var selectOffsetX = 0;
var selectOffsetY = 0;

var altPressed = false;

$(document).bind("contextmenu", function (event) {event.preventDefault();});

$(document).ready(function() {

	// Fade in menu
	//$("#menu").css({left: "-192px"}).animate({left: "0px"}, 350);
	
	// Use arrow keys for navigating
	$(document).keydown(function (e) {
		switch(e.which) {
			case 37: offset_x += gridSize_x / 2; refreshView(); break; // Left
			case 38: offset_y += gridSize_y / 2; refreshView(); break; // Up
			case 39: offset_x -= gridSize_x / 2; refreshView(); break; // Right
			case 40: offset_y -= gridSize_y / 2; refreshView(); break; // Down
			default: return; // Exit this handler for other keys
	    }
    	e.preventDefault();
	});
	
	// Check for special keys
	$(document).keydown(function (e) {
		if(e.which == 18) altPressed = true;
	}).keyup(function (e) {
		if(e.which == 18) altPressed = false;
	});

	// Show coordinates
	$("#objects").mousemove(function (event) {
		x = Math.floor((event.clientX - offset_x) / gridSize_x);
		y = Math.floor((event.clientY - offset_y) / gridSize_y);
		
		$("#coordinates").html("(" + x + "," + (-y) + ")").css({left: "" + ((x - 0.75) * gridSize_x + offset_x) + "px", top: "" + (y * gridSize_y + offset_y - 40) + "px", opacity: 0.5}).clearQueue().animate({opacity: 0}, 1000);
	});
	
	// Use mouse for moving objects
	$("#objects").mousemove(function(event) {
		if(movingObject != null)
		{
			var jsObject = movingObject.data("jsObject");
			
			// Place object on grid
			jsObject.x = Math.floor((event.clientX - selectOffsetX - offset_x) / gridSize_x);
			jsObject.y = -Math.floor((event.clientY - selectOffsetY - offset_y) / gridSize_y);

			// Refresh everything, but set opacity of this object to 0.5
			refreshObject(movingObject);
			showProperties(movingObject)
			movingObject.css({opacity: 0.5});
		}
	}).mouseup(function() {movingObject = null; refreshView();});

	// Use save and load buttons
	$("#save").click(save);
	$("#loadInput").change(load);
	$("#resourceInput").change(addResourcesFromInput);
	
	// Search resources
	$("#resourceSearchInput").bind("propertychange change click keyup input paste", function () {
		if($(this).val() != $(this).data("oldVal"))
		{
			// Set new oldVal to val
			$(this).data("oldVal", $(this).val());
			
			// Filter resources
			$("#resources div").each(function () {
				search = $("#resourceSearchInput").val();
				if($(this).text().indexOf(search) > -1 || search == "")
					$(this).show();
				else 
					$(this).hide();
			});
		}
	});
	
	// Initialize and refresh everything
	document.title = currentFileName;
	refreshView();
	refreshResources();
	
	// Temporary shizzle
	
});

function refreshView()
{
	// Sort on depth
	var objects = $("#objects");
	objects.find("div").sort(function (a, b) {
    	return $(b).data("jsObject").depth - $(a).data("jsObject").depth;
	}).appendTo(objects);
	
	// Position the objects correctly
	$("#objects div").each(function() {
		refreshObject($(this));
	});
	
	// Adjust the grid
	$("#grid").css({left: "" + offset_x % gridSize_x + "px", top: "" + offset_y % gridSize_y + "px"})
}

// FOR DEBUGGING
function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    console.log(out);
}
