function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function linearFunc(a, b, c){
	return (x, y) => a * x + b * y + c;
}

function circleFunc(a, b, r, sx, sy){
	return (x, y) => sx * Math.pow(x - a, 2) + sy * Math.pow(y - b, 2) + sx*x + sy*y + r;
}

function drawFunction(funcX, funcY, ctx, canvasWidth, canvasHeight){
	const canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

	for(var i = 0; i < canvasWidth; ++i){
		for(var j = 0; j < canvasHeight; ++j){
			const x = (2*i / canvasWidth) - 1.0;
			const y = (2*j / canvasHeight) - 1.0;

			const colorX = (funcX(x, y) + 1.0) * 127;
			const colorY = (funcY(x, y) + 1.0) * 127;

			var index = (i + j * canvasWidth) * 4;

			canvasData.data[index + 0] = colorX;
	    canvasData.data[index + 1] = colorY;
	    canvasData.data[index + 2] = 0;
	    canvasData.data[index + 3] = 255;
		}
	}

	ctx.putImageData(canvasData, 0, 0);
}

function drawFunctionProjection(funcX, funcY, ctx, canvasWidth, canvasHeight){
	const canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

	for(var i = 0; i < canvasWidth; ++i){
		for(var j = 0; j < canvasHeight; j += parseInt(canvasHeight/10.0)){
			const x = (2*i / canvasWidth) - 1.0;
			const y = (2*j / canvasHeight) - 1.0;

			const nextX = funcX(x, y);
			const nextY = funcY(x, y);

			const xDraw = parseInt(nextX*(canvasWidth/2) + canvasWidth/2)
			const yDraw = parseInt(nextY*(canvasHeight/2) + canvasHeight/2)

			var index = (xDraw + yDraw * canvasWidth) * 4;

			canvasData.data[index + 0] = 255;
	    canvasData.data[index + 1] = 0;
	    canvasData.data[index + 2] = 0;
	    canvasData.data[index + 3] = 255;
		}
	}

	ctx.putImageData(canvasData, 0, 0);
}

class FractalFunction{

	constructor(funcX, funcY, colorFunction){
		this.funcX = funcX;
		this.funcY = funcY;
		this.colorFunction = colorFunction;
	}

	nextX(x, y){
		return this.funcX(x, y)
	}

	nextY(x, y){
		return this.funcY(x, y)
	}

}

class Fractal{
	constructor(fractalFunctions){
		this.fractalFunctions = fractalFunctions;
	}

	drawNPoints(ctx, canvasWidth, canvasHeight, N, colorFunction){
		this.canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
		this.canvasWidth = canvasWidth

		var x = 0;
	  var y = 0;
	  var xNext = 0;
	  var yNext = 0;
	  for(var i = 0; i < N; ++i){
	    const r = randomInt(0, this.fractalFunctions.length - 1);
			const fractalFunction = this.fractalFunctions[r];
			xNext = fractalFunction.funcX(x, y)
			yNext = fractalFunction.funcY(x, y)

			if(i % 10000){
				console.log(xNext, " : ", yNext)
			}

	    const xDraw = parseInt(xNext*(canvasWidth/2) + canvasWidth/2)
	    const yDraw = parseInt(yNext*(canvasHeight/2) + canvasHeight/2)
			const rgb = fractalFunction.colorFunction(i/N)
	    this.drawPixel(xDraw, yDraw, rgb[0], rgb[1], rgb[2], 255);
	    x = xNext;
	    y = yNext;
	  }

		// Update canvas
		ctx.putImageData(this.canvasData, 0, 0);
	}

	drawPixel (x, y, r, g, b, a) {
      var index = (x + y * this.canvasWidth) * 4;

			this.canvasData.data[index + 0] = r;
      this.canvasData.data[index + 1] = g;
      this.canvasData.data[index + 2] = b;
      this.canvasData.data[index + 3] = a;
  }

}

whenDocumentLoaded(() => {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var canvasWidth = canvas.scrollWidth;
  var canvasHeight = canvas.scrollHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	var canvas_tmp = document.getElementById('canvas-tmp');
  var ctx_tmp = canvas_tmp.getContext('2d');
  var canvasWidth_tmp = canvas_tmp.scrollWidth;
  var canvasHeight_tmp = canvas_tmp.scrollHeight;
  canvas_tmp.width = canvasWidth_tmp;
  canvas_tmp.height = canvasHeight_tmp;
	ctx_tmp.fillStyle = 'white';
	ctx_tmp.fillRect(0, 0, canvas_tmp.width, canvas_tmp.height)



	const colorFunction1 = function(r){return [parseInt(30+200.0*r), parseInt(10.0*r), parseInt(110-100.0*r)]}
	const colorFunction2 = function(r){return [parseInt(40+200.0*r), parseInt(10.0*r), parseInt(90-80.0*r)]}
	const colorFunction3 = function(r){return [parseInt(50+200.0*r), parseInt(10.0*r), parseInt(70-60.0*r)]}

	const colorFunction4 = function(r){return [parseInt(40.0+180*r), parseInt(100.0*r), parseInt(140-120.0*r)]}
	const colorFunction5 = function(r){return [parseInt(50+180.0*r), parseInt(100.0*r), parseInt(120-100.0*r)]}
	const colorFunction6 = function(r){return [parseInt(60+180.0*r), parseInt(100.0*r), parseInt(100-80.0*r)]}

	/* first art */
	/*var fractalFunctions1 = [
		new FractalFunction(linearFunc(0.7, -0.7, 0.2), linearFunc(0.2, 0.7, 0.2), colorFunction1),
		new FractalFunction(linearFunc(-0.7, 0.2, -0.2), linearFunc(0.2, -0.7, 0.2), colorFunction2),
		new FractalFunction(linearFunc(-0.2, 0.5, 0.2), linearFunc(-0.5, 0.2, 0.2), colorFunction3)
	]
	var fractal1 = new Fractal(fractalFunctions1);

	var fractalFunctions2 = [
		new FractalFunction(linearFunc(0.2, -0.5, -0.2), linearFunc(0.9, 0.5, 0.2), colorFunction4),
		new FractalFunction(linearFunc(-0.2, 0.1, 0.1), linearFunc(0.2, -0.2, 0.3), colorFunction5),
		new FractalFunction(linearFunc(-0.1, 0.9, 0.2), linearFunc(-0.5, 0.2, 0.1), colorFunction6)
	]
	var fractal2 = new Fractal(fractalFunctions2);

	fractal1.drawNPoints(ctx, canvasWidth, canvasHeight, 4000000)
	fractal2.drawNPoints(ctx, canvasWidth, canvasHeight, 8000000)*/


	/*var fractalFunctions1 = [
		new FractalFunction(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, 0.5*Math.random()-0.25, colorFunction1),
		new FractalFunction(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, 0.5*Math.random()-0.25, colorFunction2),
		new FractalFunction(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, 0.5*Math.random()-0.25, colorFunction3),
		new FractalFunction(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, 0.5*Math.random()-0.25, colorFunction3),
		new FractalFunction(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, Math.random()*2-1, 0.5*Math.random()-0.25, colorFunction3)
	]
	var fractal1 = new Fractal(fractalFunctions1);*/

	// I fractal
	/*const scaleX = 0.2
	const scaleY = 0.2
	var fractalFunctions1 = [
		new FractalFunction(linearFunc(0.0, 0.2, -0.2), linearFunc(0.2, 0.0, -0.4), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, 0.0), linearFunc(0.0, scaleY, -0.4), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, 0.2), linearFunc(0.0, scaleY, -0.4), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, 0.0), linearFunc(0.0, scaleY, -0.2), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, 0.0), linearFunc(0.0, scaleY, -0.0), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, 0.0), linearFunc(0.0, scaleY, 0.2), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, -0.2), linearFunc(0.0, scaleY, 0.4), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, 0.0), linearFunc(0.0, scaleY, 0.4), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, 0.2), linearFunc(0.0, scaleY, 0.4), colorFunction1)
	]
	var fractal1 = new Fractal(fractalFunctions1);
	fractal1.drawNPoints(ctx, canvasWidth, canvasHeight, 4000000)*/

	// more fractal
	const scaleX = 0.3;
	const scaleY = 0.3;
	const tX = 2;
	const tY = 0.5;
	var fractalFunctions1 = [
		//new FractalFunction(circleFunc(cX, 0, 0.0, scaleX, scaleY, tX, 0.0), circleFunc(0.0, cY, 0.0, scaleX, scaleY, 0.0, tY), colorFunction1),
		//new FractalFunction(circleFunc(cX, 0, 0.0, scaleX, scaleY, -tX, 0.0), circleFunc(0.0, cY, 0.0, scaleX, scaleY, 0.0, tY), colorFunction1),
		//new FractalFunction(circleFunc(cX, 0, 0.0, scaleX, scaleY, tX, 0.0), circleFunc(0.0, cY, 0.0, scaleX, scaleY, 0.0, -tY), colorFunction1),
		//new FractalFunction(circleFunc(cX, 0, 0.0, scaleX, scaleY, -tX, 0.0), circleFunc(0.0, cY, 0.0, scaleX, scaleY, 0.0, -tY), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, -0.2), linearFunc(0.0, scaleY, 0.4), colorFunction1),
	  new FractalFunction(linearFunc(scaleX, 0.0, 0.0), linearFunc(0.0, scaleY, 0.4), colorFunction1),
		new FractalFunction(linearFunc(scaleX, 0.0, 0.2), linearFunc(0.0, scaleY, 0.4), colorFunction1),
		//new FractalFunction(circleFunc(0.5, 0.5, -0.2, scaleX, scaleY, 0.5, 0.5), linearFunc(0.0, scaleY, 0.4), colorFunction1),
		new FractalFunction(circleFunc(0.5, 0.5, 1.5, 2*scaleX, scaleY), linearFunc(0.0, 0.2*scaleY, -0.3), colorFunction1)
	]
	var fractal1 = new Fractal(fractalFunctions1);
	fractal1.drawNPoints(ctx, canvasWidth, canvasHeight, 40000)

	drawFunctionProjection(linearFunc(scaleX, 0.0, -0.2), linearFunc(0.0, scaleY, 0.4), ctx_tmp, canvasWidth_tmp, canvasHeight_tmp);
	drawFunctionProjection(linearFunc(scaleX, 0.0, 0.0), linearFunc(0.0, scaleY, 0.4), ctx_tmp, canvasWidth_tmp, canvasHeight_tmp);
	drawFunctionProjection(linearFunc(scaleX, 0.0, 0.2), linearFunc(0.0, scaleY, 0.4), ctx_tmp, canvasWidth_tmp, canvasHeight_tmp);
	drawFunctionProjection(circleFunc(0.5, 0.5, 1.5, 2*scaleX, scaleY), linearFunc(0.0, 0.2*scaleY, -0.3), ctx_tmp, canvasWidth_tmp, canvasHeight_tmp);

});
