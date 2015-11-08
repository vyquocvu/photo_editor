	console.log("frame......");
	function drawFrame(id){
		var f = document.getElementById(id);
		
		console.log("w:"+f.clientWidth);
		// var frame = new Image();

		console.log("database64:"+getBase64Image(f));
		// frame.src = $("#"+id).src;
		// ctx.drawImage(frame,xCoor,yCoor,wSize,hSize);

	}
	function getBase64Image(frame) {
    // Create an empty canvas element
    var canvasFrame = document.createElement("canvas");
    canvasFrame.width = frame.width;
    canvasFrame.height = frame.height;

    // Copy the image contents to the canvas
    var ctxFrame = canvasFrame.getContext("2d");
    ctxFrame.drawImage(frame, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvasFrame.toDataURL();

    return dataURL;
}

