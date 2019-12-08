function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
  d3.text(URL_FULL + BASE_URL + "/data/PI_digits.txt",
    function(d) {
      return d;
    }).then(function(data) {
      const width = 1000;
      const height = 1000;
      const innerRadius = 400;
      const outerRadius = 450;

      const color = d3.scaleSequential(d3.interpolateSinebow)
				.domain([0, Math.PI * 2]);
      //const color = d3.scaleOrdinal(["#160b39","#420a68","#6a176e","#932667","#bc3754","#dd513a","#f37819","#fca50a","#f6d746","#fcffa4"]);


      this.data = data.replace(".", "").replace("\n", "").split("").splice(0, 3000)

      this.linksData = this.data.slice(0, -1).map(function(d, i){
        const randomNumber = i * Math.PI / 15000//(Math.random()) * Math.PI / 5;
        const startAngle = d * Math.PI / 5 + randomNumber;
        const endAngle = this.data[i+1] * Math.PI / 5 + randomNumber;
        const meanAngle = 0.5*(startAngle + endAngle);
        const intermadiateAngle = endAngle>= meanAngle >= startAngle ? meanAngle : meanAngle - Math.PI

        return {
            path: [
              {angle: startAngle, radius: innerRadius},
              {angle: intermadiateAngle, radius: 0},
              {angle: endAngle, radius: innerRadius}
            ],
            //color: color(d),
						color: color(startAngle - randomNumber),
						enabled: (d === this.data[i+1]) ? "" : ""
          }
      })

      /*const chord = d3.chord()
          .padAngle(.04)
          .sortSubgroups(d3.descending)
          .sortChords(d3.descending)

      const root = tree(d3.hierarchy(this.data)
          .sort((a, b) => d3.ascending(a.data.name, b.data.name)));*/



      const arc = function arc(d){
        return d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(d * Math.PI / 5)
          .endAngle((d+1) * Math.PI / 5)();
      };

      const line = function(data){
        return d3.lineRadial()
          .curve(d3.curveBundle.beta(0.85))
          .radius(d => d.radius)
          .angle(d => d.angle)(data)
      }

      const svg = d3.select("#svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .style("width", "100%")
        .style("height", "90vh");

      const group = svg.append("g")
        .selectAll("g")
        .data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        .enter("g")
        .append("path")
        .attr("fill", d => color(d * Math.PI / 5))
        .attr("stroke", d => color(d * Math.PI / 5))
        .attr("d", d => arc(d));

      const link = svg.append("g")
        .attr("id", "paths")
        //.attr("stroke", "black")
        //.attr("fill", "black")
        .selectAll("path")
        .data(this.linksData)
        .enter("#paths")
        .append("path")
        //.style("mix-blend-mode", "multiply")
        .attr("fill", d => "none")
        .attr("stroke", d => d.color)
        .attr("d", d => line(d.path))
        .attr("visibility", d => d.enabled);

  })
});
