$(function() {

  /* -- Init floating button -- */
  $('.fixed-action-btn').openFAB();
  $('.fixed-action-btn').closeFAB();

  /* -- Print modal init -- */
  $('.modal-trigger').leanModal();

  /* -- All select init with materialize style -- */
  $('select').material_select();

  /* -- Tooltip init -- */
  $('.tooltipped').tooltip({delay: 5});

  /* -- Main action of editor-- */
  var imgWidth, imgHeight,
      wRatio, hRatio,
      photo = $('#photo'),
      originalCanvas = null,
      filters = $('#filters li a'),
      menu = $('#slide-out li a'),
      firstCanvas,
      clone,
      jcrop_api;

  // Left sidebar menu handler
  menu.click(function(){
    $(this).parent().siblings().removeClass('active');
    $(this).parent().addClass('active');

    menu.each(function(){
      $($(this).attr('href')).fadeOut();
    });

    var id = $(this).attr('href');
    $(id).fadeIn();

    if (id == "#cropContainer"){  
      $('canvas').Jcrop({
        onChange:   showCoords,
        onSelect:   showCoords,
        onRelease:  clearCoords
      },function(){
        jcrop_api = this;
      });

      makeCanvasCenter(true);
    }
    else{
      $('.jcrop-holder').remove();
      photo.find('canvas').remove().end().append(originalCanvas);
      makeCanvasCenter(false);
      showDownload(originalCanvas[0]);
    }
  });

  // Use the mousewheel plugin
  $('#filterContainer, #stickerContainer, #fContainer').find('ul').on('mousewheel',function(e, delta){
    this.scrollLeft -= (delta * 50);
    e.preventDefault();
  });

  // Save style action
  $('#addBtn').click(function(e){
    e.preventDefault();

    originalCanvas = cloneCanvas(clone);
    photo.find('canvas').remove().end().append(originalCanvas);
    makeCanvasCenter(false);
    showDownload(originalCanvas[0]);

    Materialize.toast('Your image is saved...', 2000);
  });

  // Reset style action
  $('#resetBtn').click(function(e){
    e.preventDefault();

    originalCanvas = cloneCanvas(firstCanvas);
    photo.find('canvas').remove().end().append(originalCanvas);
    makeCanvasCenter(false);
    showDownload(originalCanvas[0]);

    // Set all value for setting
    $('#filters li a').removeClass('active');
    $('#filters li a').first().addClass('active');

    $('#brightness').val(0);
    $('#hue').val(0);
    $('#contrast').val(0);
    $('#vibrance').val(0);
    $('#sepia').val(0);
    $('#sharpen').val(0);
    $('#saturation').val(0);
    $('#exposure').val(0);

    $('#blur').val(0);
    $('#blurLight').val(0);

    Materialize.toast('Your image is reseted...', 2000);
  });

  // Get image and create canvas element
  photo.fileReaderJS({
    on:{
      load: function(e, file){
        var img = $('<img>').appendTo(photo);

        // Remove previous canvas and active class
        photo.find('canvas').remove();
        filters.removeClass('active');

        // Make image fixed in div
        img.load(function() {

          imgWidth  = this.width;
          imgHeight = this.height;

          // Create the original canvas.
          originalCanvas = $('<canvas>');
          var originalContext = originalCanvas[0].getContext('2d');

          // Set image's width and height to canvas
          originalCanvas.attr({
            width: imgWidth,
            height: imgHeight,
            id: "canvasImage"
          });

          // Draw the dropped image to the canvas
          originalContext.drawImage(this, 0, 0, imgWidth, imgHeight);
          firstCanvas = cloneCanvas(originalCanvas);

          // Remove temp img
          img.remove();

          // Show filter container and active it in left menu
          filters.first().click();

          // Calculate rato of orginal img and showed img
          wRatio = imgWidth/$('canvas').width();
          hRatio = imgHeight/$('canvas').height();
        });

        // Set the src of the img, which will trigger the load event when done
        img.attr('src', e.target.result);
      },
      beforestart: function(file){
        return /^image/.test(file.type);
      }
    }
  });
  
  // Filter container click handle
  filters.click(function(e){
    e.preventDefault();

    var f = $(this);

    if(f.is('.active')){
      return false; // Apply filters only one time
    }

    filters.removeClass('active');
    f.addClass('active');

    clone = cloneCanvas(originalCanvas);
    photo.find('canvas').remove().end().append(clone);

    var effect = $.trim(f[0].id);
    Caman(clone[0], function () {

      // If such an effect exists, use it:
      if( effect in this){

        $('.preloader-wrapper ').addClass('active');

        this[effect]();
        this.render(function(){
          $('.preloader-wrapper ').removeClass('active');
        });
      }

      showDownload(clone[0]);

      $('#resetBtn').fadeIn();
      $('#addBtn').fadeIn();
    });

    makeCanvasCenter(false);
  });

  $('#stickers li a').click(function(){
    $('#stickers li a').removeClass('active');
    $(this).addClass('active');
  });

  $('#stickerBtn').click(function(e){
    e.preventDefault();
    
    var t = $('#stickerTop').val(),
        l = $('#stickerLeft').val();

    clone = cloneCanvas(originalCanvas);

    $('.jcrop-holder').remove();
    photo.find('canvas').remove().end().append(clone);

    clone[0].getContext('2d').drawImage(document.getElementById('img_' + $('#stickers li a.active').attr('id')), l, t);

    makeCanvasCenter(false);
    showDownload(clone[0]);
  });

  $('#addImageBtn').click(function(e){
    e.preventDefault();

    var t = $('#addedImageTop').val(),
        l = $('#addedImageLeft').val();

    clone = cloneCanvas(originalCanvas);

    $('.jcrop-holder').remove();
    photo.find('canvas').remove().end().append(clone);

    clone[0].getContext('2d').drawImage(document.getElementById('imgUpload'), l, t);

    makeCanvasCenter(false);
    showDownload(clone[0]);
  });

  $('#framers li a').click(function(e){
    e.preventDefault();

    clone = cloneCanvas(originalCanvas);

    var w = $('canvas').width,
        h = $('canvas').height,
        f = $(this);

    if(f.is('.active')){
      return false;
    }

    $('#framers li a').removeClass('active');
    f.addClass('active');

    var id = 'img_' + $('#framers li a.active').attr('id');
    var wFrame = $('#'+id).width();
    var hFrame = $('#'+id).height();

    clone[0].getContext('2d').drawImage(document.getElementById(id), 0, 0, wFrame, hFrame, 0, 0, imgWidth, imgHeight);

    $('.jcrop-holder').remove();
    photo.find('canvas').remove().end().append(clone);

    makeCanvasCenter(false);
    showDownload(clone[0]);
  });
  
  // Make canvas center in div
  function makeCanvasCenter(isJcrop){
    if(isJcrop){
      $('#photo .jcrop-holder').css({
        marginTop: -$('canvas').height()/2, 
        marginLeft: -$('canvas').width()/2
      });
    }
    else{
      $('#photo canvas').css({
        top: "50%",
        left: "50%",
        marginTop: -$('canvas').height()/2, 
        marginLeft: -$('canvas').width()/2
      });
    }
  }

  // Show download btn
  function showDownload(canvas){
    $('.imageAction').fadeIn();

    $('#downloadImage').click(function(){
      var url = canvas.toDataURL();
      $('#downloadImage').attr('href', url);
    });
  }

  // Advanced container handler
  $('#advancedContainer input[type=range]').change(function(){

    var brightness = parseInt($('#brightness').val());
    var hue = parseInt($('#hue').val());
    var contrast = parseInt($('#contrast').val());
    var vibrance = parseInt($('#vibrance').val());
    var sepia = parseInt($('#sepia').val());
    var sharpen = parseInt($('#sharpen').val());
    var saturation = parseInt($('#saturation').val());
    var exposure = parseInt($('#exposure').val());

    clone = cloneCanvas(originalCanvas);
    photo.find('canvas').remove().end().append(clone);

    Caman(clone[0], function () {
      $('.preloader-wrapper ').addClass('active');

      this.brightness(brightness).hue(hue).contrast(contrast).vibrance(vibrance).sepia(sepia).sharpen(sharpen).saturation(saturation).exposure(exposure);  
      this.render(function(){
        $('.preloader-wrapper ').removeClass('active');
      });
    });

    makeCanvasCenter(false);
    showDownload(clone[0]);
  });

  // Blur container handler
  $('#blurContainer input[type=range]').change(function(){

    var brightness = parseInt($('#blurLight').val());
    var blur = parseInt($('#blur').val());

    clone = cloneCanvas(originalCanvas);
    photo.find('canvas').remove().end().append(clone);

    Caman(clone[0], function () {
      $('.preloader-wrapper ').addClass('active');

      this.brightness(brightness).stackBlur(blur);
      this.render(function(){
        $('.preloader-wrapper ').removeClass('active');
      });
    });

    makeCanvasCenter(false);
    showDownload(clone[0]);
  });

  // Reset crop area when change value in crop container input
  $('#cropContainer input').change(function(){
    var x1 = $('#xCrop').val();
    var x2 = +$('#xCrop').val() + +$('#widthCrop').val();
    var y1 = $('#yCrop').val();
    var y2 = +$('#yCrop').val() + +$('#heightCrop').val();

    jcrop_api.setSelect([x1,y1,x2,y2]);
  });

  // Set value in crop container input
  function showCoords(c){
    $('#xCrop').val(c.x);
    $('#yCrop').val(c.y);
    $('#widthCrop').val(c.w);
    $('#heightCrop').val(c.h);
  };

  // Clear crop input container
  function clearCoords(){
    $('#cropContainer input').val('');
  };

  // Crop container handler
  $('#cropBtn').click(function(){
    var x = +$('#xCrop').val() * wRatio,
        y = +$('#yCrop').val() * hRatio,
        w = +$('#widthCrop').val() * wRatio,
        h = +$('#heightCrop').val() * hRatio;

    var newCanvas = cropImage(originalCanvas, x, y, w, h);

    imgWidth = w;
    imgHeight = h;

    $('.jcrop-holder').remove();
    photo.find('canvas').remove().end().append(newCanvas);

    $('canvas').Jcrop({
      onChange:   showCoords,
      onSelect:   showCoords,
      onRelease:  clearCoords
    },function(){
      jcrop_api = this;
    });

    makeCanvasCenter(true);
    showDownload(newCanvas[0]);
  });

  // Crop iamge
  function cropImage(srcCanvas, x, y, w, h){

    // Create a new canvas
    var newCanvas = $('<canvas>');
    var context = newCanvas[0].getContext('2d');

    // Generate img from old canvas src
    var sourceImage = new Image();
    sourceImage.src = srcCanvas[0].toDataURL();

    // Set dimensions to new canvas
    newCanvas.attr({
      width: w,
      height: h,
      id: "canvasImage"
    });

    // Draw image to canvas
    newCanvas[0].getContext('2d').drawImage(sourceImage, x, y, w, h, 0, 0, w, h);

    return newCanvas;
  }

  // Clone new canvas
  function cloneCanvas(oldCanvas) {

    // Create a new canvas
    var newCanvas = $('<canvas>');
    var context = newCanvas[0].getContext('2d');

    // Generate img from old canvas src
    var sourceImage = new Image();
    sourceImage.src = oldCanvas[0].toDataURL();

    // Set dimensions to new canvas
    newCanvas.attr({
      width: sourceImage.width,
      height: sourceImage.height,
      id: "canvasImage"
    });

    // Draw image to canvas
    newCanvas[0].getContext('2d').drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);

    return newCanvas;
  }

  // Text Draw
  $('#textBtn').click(function(){

    clone = cloneCanvas(originalCanvas);

    var color = $('#textColor').val(),
        size = +$('#textSize option:selected').val(),
        xStart = +$('#textLeft').val() * wRatio,
        yStart = +$('#textTop').val() + size,
        font = $('#textFont option:selected').val(),
        text = $('#textContent').val(),
        fString = '';

    photo.find('canvas').remove().end().append(clone);

    var ctx = clone[0].getContext('2d');    
    ctx.fillStyle = color;

    // Generate fString
    if($('#textBold').parent().hasClass('active')){
      fString += 'bold ';
    }

    if($('#textItalic').parent().hasClass('active')){
      fString += 'italic ';
    }

    fString += size + 'px ' + font

    ctx.font = fString;
    ctx.fillText(text, xStart, yStart);

    makeCanvasCenter(false);
    showDownload(clone[0]);
  });

  // bold - italic - underline options
  $('#textContainer .biu li a').click(function(e){
    e.preventDefault();
    
    $(this).parent().toggleClass('active');
  });

  // Generate print image windows
  $('#printImage').click(function(){
    var dataUrl = document.getElementById('canvasImage').toDataURL();
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Printing image</title></head>';
    windowContent += '<body style="margin: 0;">'
    windowContent += '<img src="' + dataUrl + '" style="max-width: 100%;">';
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open('','','width=1000, height=600');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  });

  // Calculate image print price
  function calPrice(){
    var area, quality, paperSize, price;

    if($('input[name=imageSize]:checked').val() == 'original'){
      area = imgWidth * imgHeight;
    } else{
      area = $('#printWidth').val() * $('#printHeight').val();
    }

    quality = $("#printQuality option:selected").val();

    paperSize = $("#paperSize option:selected").val();

    price = (area*quality*paperSize*(0.01/10000)).toFixed(1);

    return price;
  }

  $('#printNext').click(function(){
    var price = calPrice();

    $('#modal2 .modal-content .price').html('');
    $('#modal2 .modal-content .price').append('Your Payment: <span>'+ price +'$</span>');
  });

  $('#optional').click(function(){
    $('#printSizeInput').fadeIn();
  });

  $('#original').click(function(){
    $('#printSizeInput').fadeOut();
  });  
});

// Read url when upload image
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#imgUpload')
        .attr('src', e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}