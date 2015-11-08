var savedData = [];
var editData = [];
var namFile = "";
var HAFTW_CAN, HAFTH_CAN;
var xCoor = 1;
var yCoor = 1;
var wSize = 1;
var hSize = 1;
var can,ctx,img,input,map;
var red,green,blue,r,g,b;
var checkOk = 0;
var init;
var colorStep = 0;
var cropStep = 0;
var frameStep = 0;
var imgTemp = new Image();
document.getElementsByName('text_positon_x')[0].addEventListener("mousemove",insertText);
document.getElementsByName('text_positon_y')[0].addEventListener("mousemove",insertText);
document.getElementById('inserttext').addEventListener("keydown",insertText);
	$("#overlay").click(function(){
		$("#overlay_file").click();
	});
	$("#open").click(function(){
		$("#imgFile").click();
	});
	$("#over_x").mousemove(function(){insertImg()});
	$("#sizeImg").mousemove(function(){insertImg()});
	$("#over_y").mousemove(function(){insertImg()});
  $("#overlay_file").change(function(){insertImg()});

	function insertImg() {
   	var sizeImg = $('#sizeImg').val()/100;
   	var over_x = $('#over_x').val();
   	var over_y = $('#over_y').val();
		var overImg =  document.getElementById('selectImg');
		var overinput = document.getElementById("overlay_file");
		if ($('#overlay_file').prop('files')[0] == null){
			console.log('NULL')
			return
		}

		namFile =   $('#overlay_file').prop('files')[0].name;
		var canvas = document.getElementById('canvas');
		HAFTW_CAN = canvas.width/2;
		HAFTH_CAN = canvas.height/2;
		ctx = canvas.getContext('2d');

		var fReader = new FileReader();
		fReader.readAsDataURL(overinput.files[0]);
		fReader.onloadend = function(event){
			overImg.src = event.target.result;
			var rect = overImg.getBoundingClientRect();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(imgTemp,0,0);
			if(overImg.height > canvas.height || overImg.width > canvas.width){
				ctx.drawImage(overImg,rect.left + parseInt(over_x) ,rect.top + parseInt(over_y),overImg.width*sizeImg,overImg.height*sizeImg);
				xCoor = rect.left;
				yCoor = rect.top;
				wSize = canvas.width;
				hSize = canvas.height;
			}
			else{
				console.log("smaller.....");
					ctx.drawImage(overImg,rect.left + parseInt(over_x) ,rect.top + parseInt(over_y),overImg.width*sizeImg,overImg.height*sizeImg);
				xCoor = HAFTW_CAN - overImg.width/2;
				yCoor = HAFTH_CAN - overImg.height/2;
				wSize = overImg.width;
				hSize = overImg.height;
			}
		}
		console.log("x:"+xCoor+"..y:"+yCoor+"..w:"+wSize+"..h:"+hSize);
		map = ctx.getImageData(xCoor, yCoor,wSize,hSize);
		init = map;
		savedData.push(map);
		editData.push(map);
	}


	$("#imgFile").change(function(){
		img =  document.getElementById('selectImg');
		input = document.getElementById("imgFile");
		namFile =   $('#imgFile').prop('files')[0].name;
		console.log("namFile:"+namFile);
		can = document.getElementById('canvas');
		HAFTW_CAN = can.width/2;
		HAFTH_CAN = can.height/2;
		ctx = can.getContext('2d');
		var fReader = new FileReader();
		fReader.readAsDataURL(input.files[0]);
		fReader.onloadend = function(event){
			img.src = event.target.result;
			var rect = img.getBoundingClientRect();

			console.log("size:"+HAFTW_CAN+"..."+HAFTH_CAN);
			console.log(rect.top, rect.right, rect.bottom, rect.left);
			if(img.height > canvas.height || img.width > canvas.width){
				console.log("larger....");
				ctx.drawImage(img,rect.left,rect.top,img.width,img.height,rect.left,rect.top,canvas.width,canvas.height);
				xCoor = rect.left;
				yCoor = rect.top;
				wSize = canvas.width;
				hSize = canvas.height;
			}
			else{
				console.log("smaller.....");
				ctx.drawImage(img,rect.left,rect.top,img.width,img.height,HAFTW_CAN - img.width/2,HAFTH_CAN - img.height/2,img.width,img.height);
				xCoor = HAFTW_CAN - img.width/2;
				yCoor = HAFTH_CAN - img.height/2;
				wSize = img.width;
				hSize = img.height;
			}
			imgTemp.src = can.toDataURL();
		}
		console.log("x:"+xCoor+"..y:"+yCoor+"..w:"+wSize+"..h:"+hSize);
		map = ctx.getImageData(xCoor, yCoor,wSize,hSize);
		init = map;
		savedData.push(map);
		editData.push(map);
		console.log('data'+can.toDataURL());
	});

	 $("#save").click(function(){

		console.log("....x:"+xCoor+"..y:"+yCoor+"..w:"+wSize+"..h:"+hSize);
		a = $('a#save');
		a.attr('href', can.toDataURL());
			a.attr('download', namFile);

	});
	$('span.button-icon').bind('click', function (){
		console.log("button click");
		var toolId = this.id;
		openSubMenu(toolId);
	});

	$('div#aside-extend ul li i').bind('click', function(){
		expandSubMenu(this);
	})
	function openSubMenu(toolname) {
		$('div#aside-extend ul').css('visibility', 'hidden');
		$('div#colorForm').css('visibility', 'hidden');
		$('div#cropForm').css('visibility', 'hidden');
		$('div#frameForm').css('visibility', 'hidden');
		//.... others different div tags will be hidden

		switch(toolname){
			case 'effects':
				console.log('effects');
				$('#ul-effects').css('visibility', 'visible');
				break;
			case 'stickers':console.log('stickers');
				$('#ul-tickers').css('visibility', 'visible');
				break;
			case 'text':console.log('text');
				$('#ul-text').css('visibility', 'visible');
				break;
			case 'frames':console.log('frames');
				$('#ul-frames').css('visibility', 'visible');
				break;
			default:
				console.log('edit');
				$('#colorForm').css({ height: '0px'});
				$('#cropForm').css({ height: '0px'});
				 $('#frameForm').css({ height: '0px'});
				$('#ul-edit').css('visibility', 'visible');
				break;

		}
	};

	function expandSubMenu(object){


		console.log(object.parentNode);
		var parent = object.parentNode;
		console.log("child:"+object.id);
		switch(object.id){
			case 'color':

				console.log('color');
				if(colorStep == 0){

					$('#colorForm').css({ height: '260px'});
					$('#colorForm').css('visibility', 'visible');
					colorStep = 1;
					console.log("height:"+$('#colorForm').css('height'));
				}
				else
					$( "#colorForm" ).toggle( "blind", {}, 100 );
				break;
			case 'crop':
				console.log("crop");
				if (cropStep == 0){
					// $('#cropForm').css({ height: '60px'});
					$('#cropForm').css('visibility', 'visible');
					cropStep = 1;
				}
				else
					$('#cropForm').toggle( "blind", {}, 100 );
				break;
			case 'frame':
				console.log("frame");
				if(frameStep == 0){
					$('div#frameForm li').css('visibility', 'visible');
					$('div#frameForm ul').css('visibility', 'visible');
					$('div#frameForm').css('visibility', 'visible');
					frameStep = 1;
				}
				else
					$('#frameForm').toggle( "blind", {}, 100 );
			default:
				break;
		}
	}
	function openSuperSubMenu(toolname) {

		switch(toolname){
			case 'effects':
				console.log('effects');
				$('#ul-effects').css('visibility', 'visible');
				break;

			default:console.log('edit');
				$('#ul-edit').css('visibility', 'visible');
				break;
		}
	};
