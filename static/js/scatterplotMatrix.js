function drawScatterplotMatrix(traits){

  title = document.getElementById("scatterplot-title");
  title.setAttribute('style','font-size: 30px; color: black; text-align:center; text-decoration: underline;font-family: Courier New;');
  title.innerHTML = "SCATTERPLOT MATRIX";
  document.getElementById("scatterplot-div").setAttribute('style','background-color:#cadfeb')

  scatterplotinfo = document.getElementById("scatterplot-info")
  scatterplotinfo.innerHTML="The matrix supports brushing to let us select and analyze a subportion of datapoints." ;
  scatterplotinfo.setAttribute('style','text-align:center');

  var labels = "";
  var kclusters = $.ajax({
           type: "GET",
           url: "/kmeans-labels",
           traditional: "true",
           dataType: "json",
           async : false,
           success: function (data) {
          labels = data.clusters;
      },error: function(error){
        console.log("scatterplot kclusters error ",error);
      }
           }) ;

   d3.select("#scatterplot_matrix").select("svg").remove();

  n = traits.length;

  // margin = {top: 30, right: 30, bottom: margin_bottom, left: 50},
  // width = 1500 - margin.left - margin.right,
  // height = 550 - margin.top - margin.bottom;

  var width = 1600,
      size = (width / n) - 12,
      padding = 24;

  var x = d3.scaleLinear()
      .range([padding / 2, size - padding / 2]);

  var y = d3.scaleLinear()
      .range([size - padding / 2, padding / 2]);

  var xAxis = d3.axisBottom()
      .scale(x)
      .ticks(5)
  		.tickFormat(d3.format("d"));

  var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(5)
  		.tickFormat(d3.format("d"));;


  d3.csv("https://raw.githubusercontent.com/rishitareddy/visualization/main/pokemon_filtered_data.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d,i) {
      traits.forEach(function(trait) {
        d[trait] = +d[trait];
      });

    });

    var domainByTrait = {};

    traits.forEach(function(trait) {
      domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
    });



    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);


    var brush = d3.brush()
    .on("start", brushstart)
    .on("brush", brushmove)
    .on("end", brushend)
    .extent([[0,0],[size,size]]);

    var svg = d3.select("body").select("#scatterplot_matrix").append("svg")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
      .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
        .data(traits)
      .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) {
          x.domain(domainByTrait[d]).nice();
          d3.select(this).call(xAxis);
        });

    svg.selectAll(".y.axis")
        .data(traits)
      .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
      .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", size/2)
        .attr("y", size/2)
        .attr("text-anchor", "middle")
        .text(function(d) { return d.x; });

   cell.call(brush);

    function plot(p) {
      var cell = d3.select(this);

      x.domain(domainByTrait[p.x]);
      y.domain(domainByTrait[p.y]);

      cell.append("rect")
          .attr("class", "frame")
          .classed("diagonal", function(d) {return d.i === d.j; })
          .style("fill", "none")
          .style("stroke", "#aaa")
          .attr("x", padding / 2)
          .attr("y", padding / 2)
          .attr("width", size - padding)
          .attr("height", size - padding);


      cell.filter(function(d) {return d.i !== d.j; })    // hide diagonal marks
        .selectAll("circle")
        .data(data)
        .enter().append("circle")
          .attr("cx", function(d) { return x(d[p.x]); })
          .attr("cy", function(d) { return y(d[p.y]); })
          .attr("r", 2.5)
          .style("fill", function(d,i) {
            var color = 'green';
            if(labels[i] == 1){
              color = 'blue';
            }
            else if (labels[i] == 2) {
              color = 'red';
            }
            return color; });

    }


    var brushCell;

 function brushstart(p) {
   document.getElementById("scree").setAttribute('style','background-color: #00008B;color: white;');
   if (brushCell !== this) {
     d3.select(brushCell).call(brush.move, null);
     brushCell = this;
   x.domain(domainByTrait[p.x]);
   y.domain(domainByTrait[p.y]);
   }
 }

 function brushmove(p) {
   var e = d3.brushSelection(this);
   document.getElementById("scree").setAttribute('style','background-color: #00008B;color: white;');

   svg.selectAll("circle").classed("hidden", function(d) {
     return !e
       ? false
       : (
         e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
         || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
       );
   });
 }

 function brushend() {
   var e = d3.brushSelection(this);
   document.getElementById("scree").setAttribute('style','background-color: #00008B;color: white;');

   if (e === null) svg.selectAll(".hidden").classed("hidden", false);
 }

  });

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }

}
