// $(document).ready(function() {

	$(".slider").change(function(){

		if (savedData.length > 0) {
			console.log("///x:"+xCoor+"..y:"+yCoor+"..w:"+wSize+"..h:"+hSize);
			var imgData = savedData.pop();
			ctx.putImageData(imgData, xCoor, yCoor);
				// console.log("leng2:"+savedData.length);
		}

			map = ctx.getImageData(xCoor, yCoor, wSize, hSize);
			ctx.putImageData(map,xCoor,yCoor);
			savedData.push(map);

			red = document.getElementById('numberRedOff').value;

			green = document.getElementById('numberGreenOff').value;
			blue = document.getElementById('numberBlueOff').value;
		//console.log("r :"+red+"g :"+g+"b :"+b);

	   	// overlay filled rectangle using lighter composition
	   //	ctx.globalCompositeOperation = "lighter";
	   	ctx.globalAlpha = 0.5;
	   	ctx.fillStyle = "rgb("+red+","+green+","+blue+")"  ;
	   	ctx.fillRect(xCoor,yCoor,wSize,hSize);

   		});
$("#btnCancelDialogColor").click(function(){
	if(checkOk == 0) {

		ctx.putImageData(init,xCoor,yCoor);

	}
	else{
		if (editData.length > 0 && checkOk ==1) {
			console.log("cancell is running....");

			var imgData = editData.pop();
			ctx.putImageData(imgData, xCoor, yCoor);
		}
		console.log("leng can:"+editData.length);
		var fReader = new FileReader();
		fReader.readAsDataURL(input.files[0]);
		fReader.onloadend = function(event){

			img.src = event.target.result;
			ctx.drawImage(img,xCoor,yCoor,wSize,hSize);
			// imgWidth = img.width;
			// imgHeight = img.height;

		}
			// map = ctx.getImageData(0, 0, img.width, img.height);
			ctx.putImageData(init,xCoor,yCoor);
			if(checkOk == 1){
				console.log("r :"+r+"g :"+g+"b :"+b);
				ctx.fillStyle = "rgb("+r+","+g+","+b+")"  ;
			}
			ctx.fillRect(xCoor,yCoor,wSize,hSize);

		}
		$( "#colorForm" ).toggle( "blind", {}, 100 );
	});
$("#btnSaveColor").click(function(){

	$( "#colorForm" ).toggle( "blind", {}, 100 );

});

// });