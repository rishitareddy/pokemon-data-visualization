function drawMDSCorrelationPlot(){

  var xcoord="",ycoord="",attributes="";
  var mdsEuclidean = $.ajax({
           type: "GET",
           url: "/mds-correlation",
           traditional: "true",
           dataType: "json",
           async : false,
           success: function (data) {
          console.log("mdsCorrelation response ",data);
          xcoord = data.xcoord;
          ycoord = data.ycoord;
          attributes = data.attributes;
      },error: function(error){
        console.log("Yep, mdsCorrelation error ",error);
      }
           }) ;

           console.log("mdsCorrelation xcoord", xcoord);
           console.log("mdsCorrelation ycoord", ycoord);

title = document.getElementById("mds-correlation-title");
title.setAttribute('style','font-size: 30px; color: black; text-align:center; text-decoration: underline; font-family: Courier New;');
title.innerHTML = "MDS CORRELATION";
document.getElementById("mds-correlation-div").setAttribute('style','background-color:#cadfeb')



  d3.select("#mds_correlation_graph").select("svg").remove();
  var x = 0, y = 0;

  var margin = 0, x = 0, y = 0, xAxis = 0, yAxis = 0, svg = 0,values = 0;
  var margin_bottom = 100;
  var text_top = 40;
  margin = {top: 30, right: 50, bottom: 140, left: 70},
  width = 1500 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

   x = d3.scaleLinear().rangeRound([0, width]);
   y = d3.scaleLinear().range([height, 0]);


var xAxis = d3.axisBottom(x).scale(x).ticks(20);

var yAxis = d3.axisLeft(y).scale(y).ticks(40);

var svg = d3.select("body").select("#mds_correlation_graph").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define Extent for each Dataset
x.domain([d3.min(xcoord, function(d) { return d; }), d3.max(xcoord, function(d) { return d; })]);

y.domain([d3.min(ycoord, function(d) { return d; }), d3.max(ycoord, function(d) { return d; })]);


svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "middle");

svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                         (height + margin.top + text_top) + ")")
    .style("text-anchor", "middle")
    .text("First Dimension");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        console.log("After g y-axis");


        svg.append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 0 - margin.left + 10)
             .attr("x", 0 - (height/2))
             .attr("dy", ".71em")
             .style("text-anchor", "middle")
             .text("Second Dimension");

             console.log("After y variableName");


svg.selectAll(".dot")
    .data(xcoord)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 2.5)
    .attr("cx", function(d) { return x(d); })
    .attr("cy", function(d,i) { return y(ycoord[i]); })
    .style("fill", "red");

    svg.append("g")
    .selectAll("text")
    .data(attributes)
    .enter()
    .append("text")
    .style("fill","blue")
    .attr("x",(d,i)=>{
      return x(xcoord[i]) - 15;
    })
    .attr("y",(d,i) =>{
      return y(ycoord[i]) - 5;
    })
    .text((d, i) => attributes[i]);

    console.log("After scatterplot");

}
