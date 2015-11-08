function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
function insertText(){
    if ($('#imgFile').prop('files')[0] == null){
			console.log('NULL')
			return
		}
    var maxWidth = 400;
    var lineHeight = 40;
    var fontsize = lineHeight.toString();
    var x = document.getElementsByName('text_positon_x')[0].value;
    var y = document.getElementsByName('text_positon_y')[0].value;
    var colort = document.getElementById('colortext').value;
    textt = document.getElementById('inserttext').value;

    ctx.clearRect(0, 0, can.width, can.height);
    ctx.drawImage(imgTemp,0,0);
    ctx.font = ''+fontsize +'px Calibri';
    ctx.textAlign = 'center';
    ctx.fillStyle = colort ;
    ctx.textBaseline = 'alphabetic';
    wrapText(ctx, textt, x, y, maxWidth, lineHeight);
  }
  function summit() {
    var can = document.getElementById('canvas');
    imgTemp.src = can.toDataURL();
    sizetemp.src = null;
  }