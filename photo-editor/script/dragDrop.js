var idDrag;
var can = document.getElementById('canvas');
function drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
      idDrag = $(ev.target).attr("id");
      console.log("id of drag:"+$(ev.target).attr("id"));
  }
  function allowDrop(ev) {
      ev.preventDefault();
  }
  function drop(ev) {
  	console.log("drop...");
    ev.preventDefault();
    // console.log("id of drop:"+$(ev.target).attr("id"));
    var checkFrame;
    var subStrDrag = idDrag.substring(0,5);
    console.log("substring:"+subStrDrag);
    console.log(can.toDataURL());
    if(subStrDrag === "dragF"){
      console.log("drop frame");
      var data = ev.dataTransfer.getData("text");
      var oimg = document.getElementById("selectImg");
      var rect = can.getBoundingClientRect();

      var x = ev.clientX - rect.left - 50;
      var y = ev.clientY - rect.top - 50;
      oimg.src = document.getElementById(data).src;


      ctx.drawImage(oimg,xCoor,yCoor,wSize,hSize);
    }
    else{
      console.log("not drop frame");
      var data = ev.dataTransfer.getData("text");
      var oimg = document.getElementById("selectImg");
      var rect = can.getBoundingClientRect();

      var x = ev.clientX - rect.left - 50;
      var y = ev.clientY - rect.top - 50;
      oimg.src = document.getElementById(data).src;

      ctx.drawImage(oimg,x,y);
    }
    imgTemp.src = can.toDataURL();
  }