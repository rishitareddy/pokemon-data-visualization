function drawBiplot(data){

console.log("Testing");

title = document.getElementById("graph-title");
title.setAttribute('style','font-size: 30px; color: black; text-align:center; text-decoration: underline; font-family: Courier New;');
title.innerHTML = "BIPLOT";
document.getElementById("graph-div").setAttribute('style','background-color:#cadfeb')

document.getElementById("graph-info").innerHTML="";
document.getElementById("table-title").innerHTML="";
document.getElementById("scatterplot-title").innerHTML="";
document.getElementById("mds-correlation-title").innerHTML="";
document.getElementById("table-info").innerHTML="";
document.getElementById("scatterplot-info").innerHTML="";

document.getElementById("pcp").setAttribute('style','background-color: #cfebca;color: black;');
document.getElementById("scree").setAttribute('style','background-color: #cfebca;color: black;');
document.getElementById("mds").setAttribute('style','background-color: #cfebca;color: black;');
document.getElementById("bi").setAttribute('style','background-color: #00008B;color: white;');


var t = document.getElementById("pcaLoad");
if (t != null){t.style.display = "none";}

var pca1 = data.pca1;
var pca2 = data.pca2;
var xcoord = data.xcoord;
var ycoord = data.ycoord;
var attributes = data.attributes;

    d3.selectAll("svg").remove();

    var margin = 0, x = 0, y = 0, xAxis = 0, yAxis = 0, svg = 0, values = 0;
    var margin_bottom = 100;
    var text_top = 40;
    margin = {top: 30, right: 30, bottom: 140, left: 70},
    width = 1500 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;


    var xmax = d3.max(xcoord, function(d) { return d; });
    var xmin = d3.min(xcoord, function(d) { return d; });
    var xdiff = xmax - xmin;

    var i;
    for (i = 0; i < xcoord.length; i++) {
      xcoord[i] = xcoord[i]/xdiff;
    }

    var ymax = d3.max(ycoord, function(d) { return d; });
    var ymin = d3.min(ycoord, function(d) { return d; });
    var ydiff = ymax - ymin;

    var j;
    for (j = 0; j < ycoord.length; j++) {
      ycoord[j] = ycoord[j]/ydiff;
    }


  x = d3.scaleLinear().rangeRound([0, width]);
  y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(x).scale(x).ticks(20);

  var yAxis = d3.axisLeft(y).scale(y).ticks(40);

  var svg = d3.select("body").select("#graph-plot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain([d3.min(xcoord, function(d) { return d; }), d3.max(xcoord, function(d) { return d; })]);
    y.domain([d3.min(xcoord, function(d) { return d; }), d3.max(ycoord, function(d) { return d; })]);



  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle");


      console.log("After g x-axis");


  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + text_top) + ")")
      .style("text-anchor", "middle")
      .text("PCA1");

      console.log("After x variableName");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

          svg.append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 0 - margin.left + 10)
               .attr("x", 0 - (height/2))
               .attr("dy", ".71em")
               .style("text-anchor", "middle")
               .text("PCA2");

  svg.selectAll(".circle")
      .data(xcoord)
    .enter()
    .append("circle")
    .attr("r", 2.5)
      .attr("cx", function(d) { return x(d); })
      .attr("cy", function(d,i) { return y(ycoord[i]); })
      .style("fill", "#69b3a2");

      svg.append("defs").append("marker")
          .attr("id", "marker")
          .attr("viewBox", "0 0 12 12")
          .attr("refX", 0)
          .attr("refY", 1.5)
          .attr("markerWidth", 12)
          .attr("markerHeight", 12)
          .attr("orient", "auto")
        .append("path")
          .attr("d", "M0,-5L10,0L0,5");

        svg.selectAll(".path")
        .data(attributes)
        .enter()
        .append("path")
        .attr("fill","none")
        .attr("stroke","black")
       .attr("marker-end","url(#marker)")
        .attr("stroke-width",1.5)
        .attr("d",(d,i) =>{
          return d3.line()([
            [x(0),y(0)],
            [x(pca1[i]),y(pca2[i])]
          ]);
        });

        svg.append("g")
        .selectAll("text")
        .data(attributes)
        .enter()
        .append("text")
        .style("fill","blue")
        .attr("x",(d,i)=>{
          return x(pca1[i]);
        })
        .attr("y",(d,i) =>{
          return y(pca2[i])-10;
        })
        .text((d, i) => attributes[i]);

        console.log("Biplot Atrributes ", attributes[0]);


}
