var zoom = 2;
var pxzoom = zoom * 8;
var drawType = true;
var cookie1 = 0;
var cookie2 = 0;
var cookie3 = 0;
var bytes;
var flairname = "Untitled Flair";
var flairtag = "No Tagline";
var canvaselem;

function makeGrid(rows, cols, size) {
	var column = "<td class='sqrgrid'></td>";
	var columnrepeat = column.repeat(cols);
  var tablelem = "";
	for (var i = 0; i < rows; i++) {
		tablelem = tablelem + "<tr>" + columnrepeat + "</tr>";
	}
  tablelem = "<table id='paintgrid'>" + tablelem + "</table>";
	pxzoom = zoom * 8;
	return tablelem;
}

$("#paintarea").append(makeGrid(16,16,8));
$(".sqrgrid").css("width", pxzoom + "px").css("height", pxzoom + "px");

var mouseDownState = false;

$("#clearbutton").on("click", function(){
	$("#paintgrid").remove();
	$("#paintarea").append(makeGrid(16,16,8));
	$(".sqrgrid").css("width", pxzoom + "px").css("height", pxzoom + "px");
	resetDrawEvents();
});

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

$("#loadsave").on("click", function(){
	if(Cookies.get("slot1") !== undefined){cookie1 = Cookies.get("slot1").length;}
	if(Cookies.get("slot2") !== undefined){cookie2 = Cookies.get("slot2").length;}
	if(Cookies.get("slot3") !== undefined){cookie3 = Cookies.get("slot3").length;}
	var bytes = cookie1 + cookie2 + cookie3;
	bytes = bytes + 100;
	console.log(bytes);
	var result = (bytes * 100) / 3500;
	$("#bytelevels").width( result.toString() + '%');
});

$(".saveslotbutton").on("click", function(){
	var id = $(this).closest("div").prop("id");
	var html = $("#paintarea").html();
	var clrtr = new RegExp('</tr><tr>', "g");
	var clrtd = new RegExp(';"></td>', "g");
	var clrspace = new RegExp('<td class="sqrgrid" style="width: '+pxzoom+'px; height: '+ pxzoom +'px;"></td>', "g");
	var clearshiz = new RegExp('<td class="sqrgrid" style="width: 16px; height: 16px; background-color: rgb', "g");
	var code = html.replace(clrspace, "!").replace(clearshiz, "@").replace(clrtr, "#").replace(clrtd, "z").replace('<table id="paintgrid"><tbody><tr>', "").replace(/\s/g, "").replace('</tr></tbody></table>', "");
	Cookies.set(id, code, {expires: 365});
	console.log(code);
	if(Cookies.get("slot1") !== undefined){cookie1 = Cookies.get("slot1").length;}
	if(Cookies.get("slot2") !== undefined){cookie2 = Cookies.get("slot2").length;}
	if(Cookies.get("slot3") !== undefined){cookie3 = Cookies.get("slot3").length;}
	var bytes = cookie1 + cookie2 + cookie3;
	bytes = bytes + 100;
	console.log(bytes);
	var result = (bytes * 100) / 3500;
	$("#bytelevels").width( result.toString() + '%');
});



$(".loadflairbutton").on("click", function(){
	var code = Cookies.get($(this).closest("div").prop("id"));
	var html = code.replace(/!/g, '<td class="sqrgrid" style="width: '+pxzoom+'px; height: '+ pxzoom +'px;"></td>').replace(/@/g, '<td class="sqrgrid" style="width: 16px; height: 16px; background-color: rgb').replace(/#/g, '</tr><tr>').replace(/z/g, ';"></td>');
	html = '<table id="paintgrid"><tbody><tr>' + html + '</tr></tbody></table>';
	console.log(html);
	$("#paintgrid").remove();
	$("#paintarea").append(html);
});

$(".clearslotbutton").on("click", function(){
	var id = $(this).closest("div").prop("id");
	Cookies.set(id, "");
	if(Cookies.get("slot1") !== undefined){cookie1 = Cookies.get("slot1").length;}
	if(Cookies.get("slot2") !== undefined){cookie2 = Cookies.get("slot2").length;}
	if(Cookies.get("slot3") !== undefined){cookie3 = Cookies.get("slot3").length;}
	var bytes = cookie1 + cookie2 + cookie3;
	bytes = bytes + 100;
	console.log(bytes);
	var result = (bytes * 100) / 3500;
	$("#bytelevels").width( result.toString() + '%');
})

function saveFlairText() {
	flairname = $("#flairtitle").val();
	flairtag = $("#flairtagline").val();
}

function shareFlair() {
	var dataURL = document.getElementById("previewcanvas").toDataURL();
	console.log(dataURL);
	if(flairname === "Untitled Flair" || flairtag === "No Tagline"){
		var con = confirm("Are you sure you want to share?(You have not set a Title or Tagline.)");
		if(con){
			$.ajax({
				type: "POST",
				url: "share.php",
				data: { 
					imgBase64: dataURL,
					flname: $("#flairtitle").val(),
					fltag: $("#flairtagline").val()
				}
			}).done(function(o) {
				location.href = "http://korbinskode.com/flairmaker/show/" + o + ".html";
			});
		}
	} else {
		$.ajax({
				type: "POST",
				url: "share.php",
				data: { 
					imgBase64: dataURL,
					flname: flairname,
					fltag: flairtag
				}
			}).done(function(o) {
				location.href = "http://korbinskode.com/flairmaker/show/" + o + ".html";
			});
	}
}

function shareFlairCall() {
	showPreview(true);
}

resetDrawEvents();

function resetDrawEvents(){
	$("#paintgrid tr td").on("mousedown", function() {
		mouseDownState = true;
		$el = $(this);
		if(drawType){
			$el.css("background-color", $("#colorpicker").val());
		} else {
			$el.css("background-color", "");
		}
	}).on("mouseenter", function() {
		if (mouseDownState) {
			$el = $(this);
			if(drawType){
				$el.css("background-color", $("#colorpicker").val());
			} else {
				$el.css("background-color", "");
			}
		}
	});
	$("html").bind("mouseup", function() {
		mouseDownState = false;
	});
}

function showPreview(callback) {
	$(".sqrgrid").css("width", "1px").css("height", "1px");
	$("#paintgrid").css("border-width", "0px").css("background-image", "none");
	html2canvas($("#paintgrid"), {
		onrendered: function(canvas) {
			$("#previewcanvas").remove();
			$("#previewdiv").append(canvas);
			$("#previewdiv canvas").prop("id", "previewcanvas");
			$("#paintgrid").css("background-image", "url(http://i.cubeupload.com/Yh9D6G.png)");
			$("#paintgrid").css("border-width", "1px");
			$(".sqrgrid").css("width", zoom * 8 + "px").css("height", zoom * 8 + "px");
			if(callback != undefined){
				shareFlair();
				console.log(callback);
			}
		}
	});
}

function zoomIn() {
	if(zoom === 4){
		$(this).disabled = true;
	} else {
		$(this).disabled = false;
		zoom = zoom + 1;
		$(".sqrgrid").css("width", zoom * 8 + "px").css("height", zoom * 8 + "px");
	}
}

function zoomOut() {
	if(zoom === 1){
		$(this).disabled = true;
	} else {
		$(this).disabled = false;
		zoom = zoom - 1;
		$(".sqrgrid").css("width", zoom * 8 + "px").css("height", zoom * 8 + "px");
	}
}

Cookies.set("here4flairs", "true");