
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  d3.text(URL_FULL + BASE_URL + "/data/PI_digits.txt",
    function(d) {
      return d;
    }).then(function(data) {
      this.data = data.replace(".", "").replace("\n", "").split("").splice(0, 1000)

      this.transformedData = this.data.map(function(d, i){
        return {
          x: Math.sin(d * 0.2 * Math.PI),
          y: Math.cos(d * 0.2 * Math.PI),
					id: i,
					number: d
        };
      })


      /*var line = d3.line()
        .x(function(d){return 900+300*d["x"];})
        .y(function(d){return 400-300*d["y"];})
        .curve(d3.curveCatmullRom.alpha(0.5));

      //line.context(ctx)(this.transformedData.slice(0, 20))
      line.context(ctx)(this.transformedData)
      ctx.stroke()*/


      const duration = 15000;
      const ease = d3.easeLinear;
			const colorPalette = d3.scaleOrdinal(["#160b39","#420a68","#6a176e","#932667","#bc3754","#dd513a","#f37819","#fca50a","#f6d746","#fcffa4"]);

      timer = d3.timer((elapsed) => {
        // compute how far through the animation we are (0 to 1)
        const t = Math.min(1, ease(elapsed / duration));

        // update what is drawn on screen
        //ctx.save();

        // erase what is on the canvas currently
				ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height)
				ctx.fillStyle = 'white';

				const timeScale = 8//Math.pow(1.5, 200 * t);
				const idExponent = 0.95
				const circleRadius = 800;
				const tension = 1.0;
				const k = (1 - tension) / 6;

				ctx.lineWidth = 5;


				const linesToDraw = this.transformedData
					.filter(function(d, i){return timeScale * Math.pow(idExponent, d["id"]) * 50 < circleRadius  && timeScale * Math.pow(idExponent, d["id"]) * 50 > 20 })
					.map(function(d, i){
						return {
							number: d["number"],
							transformedX: 400 + Math.pow(idExponent, d["id"]) * timeScale * 50 * d["x"], //- 2*d["id"],
							transformedY: 400 - Math.pow(idExponent, d["id"]) * timeScale * 50 * d["y"] //+ 1*d["id"]
		        };
					});

				//for (var i = 0; i < linesToDraw.length - 3; ++i){
				for (var i = linesToDraw.length - 3; i >= 0 ; --i){
					const d1 = linesToDraw[i]
					const d2 = linesToDraw[i+1]
					const d3 = linesToDraw[i+2]
					const d4 = linesToDraw[i+3]

					ctx.beginPath();
					ctx.moveTo(d1["transformedX"], d1["transformedY"])

					const centerX = 0.5*(d1["transformedX"] + d2["transformedX"])
					const centerY = 0.5*(d1["transformedY"] + d2["transformedY"])
					const radius = Math.sqrt(Math.pow(d1["transformedX"] - d2["transformedX"], 2) + Math.pow(d1["transformedY"] - d2["transformedY"], 2)) / 2
					const angleFrom = Math.atan2((d1["transformedY"] - centerY), (d1["transformedX"] - centerX))


					/*ctx.bezierCurveTo(
				    d2["transformedX"] + k * (d1["transformedX"] - d3["transformedX"]),
						d2["transformedY"] + k * (d1["transformedY"] - d3["transformedY"]),
						d3["transformedX"] + k * (d2["transformedX"] - d4["transformedX"]),
						d3["transformedY"] + k * (d2["transformedY"] - d4["transformedY"]),
				    d3["transformedX"],
						d3["transformedY"]
				  );*/

					ctx.lineTo(d2["transformedX"], d2["transformedY"])

					//ctx.lineTo(d3["transformedX"], d3["transformedY"])
					//ctx.lineTo(d4["transformedX"], d4["transformedY"])
					//ctx.arc(centerX, centerY, radius, angleFrom, angleFrom + Math.PI);
					//ctx.arc(d1["transformedX"], d1["transformedY"], 10, 0, 2 * Math.PI);


					//alert(d1["number"] + " ; " + angleFrom)
					ctx.closePath();


					ctx.lineWidth = (10 - i*0.2);

					//const gradient = ctx.createLinearGradient(d1["transformedX"], d1["transformedY"], d2["transformedX"], d2["transformedY"]);
					const gradient = ctx.createLinearGradient(d1["transformedX"], d1["transformedY"], d2["transformedX"], d2["transformedY"]);
					gradient.addColorStop(0.0, colorPalette(0));
					gradient.addColorStop(0.1, colorPalette(1));
					gradient.addColorStop(0.2, colorPalette(2));
					gradient.addColorStop(0.3, colorPalette(3));
					gradient.addColorStop(0.4, colorPalette(4));
					gradient.addColorStop(0.5, colorPalette(5));
					gradient.addColorStop(0.6, colorPalette(6));
					gradient.addColorStop(0.7, colorPalette(7));
					gradient.addColorStop(0.8, colorPalette(8));
					gradient.addColorStop(0.9, colorPalette(9));

					ctx.strokeStyle = gradient;
					//ctx.stokeStyle = colorPalette(d3["number"]);
					ctx.stroke()

					ctx.fillStyle = gradient;
					//ctx.fillStyle = colorPalette(d3["number"]);
					ctx.fill()
				}

        ctx.restore();

        // if this animation is over
        if (t === 1) {
          // stop this timer since we are done animating.
          timer.stop();
        }
      });
    },);

});
