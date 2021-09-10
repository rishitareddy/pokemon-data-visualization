function drawMDSEuclideanPlot(){

  d3.selectAll("svg").remove();

  // document.getElementById("")

  title = document.getElementById("graph-title");
  title.setAttribute('style','font-size: 20px; color: black; text-align:center;');
  title.innerHTML = "Loading.. Please wait";
  document.getElementById("graph-div").setAttribute('style','background-color:white')


  document.getElementById("graph-info").innerHTML="";
  document.getElementById("table-title").innerHTML="";
  document.getElementById("scatterplot-title").innerHTML="";
  document.getElementById("mds-correlation-title").innerHTML="";
  document.getElementById("table-info").innerHTML="";
  document.getElementById("scatterplot-info").innerHTML="";

  document.getElementById("pcp").setAttribute('style','background-color: #cfebca;color: black;');
  document.getElementById("bi").setAttribute('style','background-color: #cfebca;color: black;');
  document.getElementById("scree").setAttribute('style','background-color: #cfebca;color: black;');
  document.getElementById("mds").setAttribute('style','background-color: #00008B;color: white;');

  var t = document.getElementById("pcaLoad");
  if (t != null){t.style.display = "none";}

  var xcoord="",ycoord="";
  var mdsEuclidean = $.ajax({
           type: "GET",
           url: "/mds-euclidean",
           traditional: "true",
           dataType: "json",
           async : false,
           success: function (data) {
          xcoord = data.xcoord;
          ycoord = data.ycoord;
          title.setAttribute('style','font-size: 30px; color: black; text-align:center; text-decoration: underline; font-family: Courier New;');
          title.innerHTML = "MDS EUCLIDEAN";
          document.getElementById("graph-div").setAttribute('style','background-color:#cadfeb')


      },error: function(error){
        console.log("Yep, mdsEuclidean error ",error);
      }
           }) ;

   var labels = "";
   var kclusters = $.ajax({
            type: "GET",
            url: "/kmeans-labels",
            traditional: "true",
            dataType: "json",
            async : false,
            success: function (data) {
           console.log("mdsEuclidean kclusters response ",data);
           labels = data.clusters;
       },error: function(error){
         console.log("mdsEuclidean kclusters error ",error);
       }
            }) ;




  var x = 0, y = 0;

  var margin = 0, x = 0, y = 0, xAxis = 0, yAxis = 0, svg = 0,values = 0;
  var margin_bottom = 100;
  var text_top = 40;
  margin = {top: 30, right: 30, bottom: 140, left: 80},
  width = 1500 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

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

        svg.append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 0 - margin.left + 10)
             .attr("x", 0 - (height/2))
             .attr("dy", ".71em")
             .style("text-anchor", "middle")
             .text("Second Dimension");

svg.selectAll(".dot")
    .data(xcoord)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 2.5)
    .attr("cx", function(d) { return x(d); })
    .attr("cy", function(d,i) { return y(ycoord[i]); })
    .style("fill", function(d,i) {
      var color = 'green';
      if(labels[i] == 1){
        color = 'blue';
      }
      else if (labels[i] == 2) {
        color = 'red';
      }
      return color; });

drawMDSCorrelationPlot();

}
