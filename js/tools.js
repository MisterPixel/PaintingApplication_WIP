(function() {



var canvas = document.querySelector('#Surface');
var ctx = canvas.getContext('2d');

var canvasHolder = document.querySelector('#canvasHolder');
var canvasHolder_style = getComputedStyle(canvasHolder);
canvas.width = parseInt(canvasHolder_style.getPropertyValue('width'));
canvas.height = parseInt(canvasHolder_style.getPropertyValue('height'));


//creating tmp canvas
var tmp_canvas = document.createElement('canvas');
var tmp_ctx = tmp_canvas.getContext('2d');
tmp_canvas.id = 'tmp_canvas';
tmp_canvas.width = canvas.width;
tmp_canvas.height = canvas.height;

canvasHolder.appendChild(tmp_canvas);

var mouse = {x: 0, y: 0};
var last_mouse = {x: 0, y: 0};

// pencil points
var ppts = [];



/* Mouse Capture Work */
tmp_canvas.addEventListener('mousemove', function(e) {
	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

}, false);

/* Drawing on Paint App */
tmp_ctx.lineWidth = 10;
tmp_ctx.lineJoin = 'round';
tmp_ctx.lineCap = 'round';
tmp_ctx.strokeStyle = 'blue';
tmp_ctx.fillStyle = 'blue';

tmp_canvas.addEventListener('mousedown', function(e) {
	tmp_canvas.addEventListener('mousemove', onPaint, false);
	
	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;


	ppts.push({x: mouse.x, y: mouse.y});

	onPaint();

}, false);

tmp_canvas.addEventListener('mouseup', function() {
	tmp_canvas.removeEventListener('mousemove', onPaint, false);

	// go to real canvas
	ctx.drawImage(tmp_canvas, 0, 0);
	// clear temporary canvas
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	// empty ppts
	ppts = [];
}, false);

/*canvas.addEventListener('mouseleave', function() {
	canvas.removeEventListener('mousemove', onPaint, false);
}, false);*/


var onPaint = function() {
	
	// Saving all points in an array
	ppts.push({x: mouse.x, y: mouse.y});

	if (ppts.length < 3) {
		var b = ppts[0];
		tmp_ctx.beginPath();
		tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
		tmp_ctx.fill();
		tmp_ctx.closePath();

		return;
}


// temporary canvas is always cleared up before drawing
tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

tmp_ctx.beginPath();
tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

for (var i = 1; i < ppts.length - 2; i++) {
	var c = (ppts[i].x + ppts[i + 1].x) / 2;
	var d = (ppts[i].y + ppts[i + 1].y) / 2;

	tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
}

// for the last 2 points
tmp_ctx.quadraticCurveTo(
	ppts[i].x,
	ppts[i].y,
	ppts[i + 1].x,
	ppts[i + 1].y
);

tmp_ctx.stroke();

};

// clear button functionality
      document.getElementById('clear').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, false);



}());