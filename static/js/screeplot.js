function drawScreeplot(data){

title = document.getElementById("graph-title");
title.setAttribute('style','font-size: 30px; color: black; text-align:center; text-decoration: underline; font-family: Courier New;');
title.innerHTML = "SCREEPLOT";
document.getElementById("graph-div").setAttribute('style','background-color:#cadfeb')


graphinfo = document.getElementById("graph-info")
graphinfo.innerHTML="Click on the bars or the dots to select the intrinsic dimensionality index <br/> Hover over the dot to see the cumulative variance %";
graphinfo.setAttribute('style','text-align:center');

document.getElementById("table-title").innerHTML="";
document.getElementById("scatterplot-title").innerHTML="";
document.getElementById("mds-correlation-title").innerHTML="";
document.getElementById("table-info").innerHTML="";
document.getElementById("scatterplot-info").innerHTML="";

document.getElementById("pcp").setAttribute('style','background-color: #cfebca;color: black;');
document.getElementById("bi").setAttribute('style','background-color: #cfebca;color: black;');
document.getElementById("mds").setAttribute('style','background-color: #cfebca;color: black;');
document.getElementById("scree").setAttribute('style','background-color: #00008B;color: white;');



d3.selectAll("svg").remove();

var margin = 0, svg = 0;
var margin_bottom = 100;
var text_top = 40,     barWidth = 40,   barOffset = 20;
margin = {top: 30, right: 30, bottom: margin_bottom, left: 70},
width = 1500 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(.05);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom()
  .scale(x);

    x.domain(data.map(function(d) { return d[1];}));
    y.domain([0, 100]);


var yAxis = d3.axisLeft()
  .scale(y)
  .ticks(10);

  svg = d3.select("body").select("#graph-plot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  svg.selectAll("bar")
  .data(data)
  .enter().append("rect")
    .style("fill", "#69b3a2")
    .attr("width", barWidth)
    .on("click",function(d, i) {


    document.getElementById("scree").setAttribute('style','background-color: #00008B;color: white;');

    var jqxhr = $.ajax({
             type: "POST",
             contentType: "text/html;charset=utf-8",
             url: "/di",
             traditional: "true",
             data: (i+1).toString(),
             dataType: "string",
             async : false
             }) ;

            var response = {valid: jqxhr.statusText,  data: jqxhr.responseText};

            drawPcaTable(response.data);

            })
    .attr("x", function(d) { return x(d[1])+ x.bandwidth()/4 + 15;})
    .attr("height", function(d) { return height - y(d[0]); })
    .attr("y", function(d) { return y(d[0]); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height) + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "middle");

  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + text_top ) + ")")
      .style("text-anchor", "middle")
      .text("Components");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

      svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 0 - margin.left + 10)
           .attr("x",0 - (height / 2))
           .attr("dy", ".71em")
           .style("text-anchor", "middle")
           .text("Explained Variance %");


       // line chart
     var line = d3.line()
         .x(function(d, i) { return x(d[1]) + x.bandwidth()/2; })
         .y(function(d) { return y(d[2]); })
         .curve(d3.curveMonotoneX);

     svg.append("path")
       .attr("class", "line")
       .style("fill", "none")
       .style("stroke", "black")
       .attr("d", line(data));

      //points
     svg.selectAll("myCircles")
           .data(data)
           .enter()
           .append("circle")
             .attr("fill", "blue")
             .attr("stroke", "none")
             .on("click",function(d, i) {

             var jqxhr = $.ajax({
                      type: "POST",
                      contentType: "text/html;charset=utf-8",
                      url: "/di",
                      traditional: "true",
                      data: (i+1).toString(),
                      dataType: "string",
                      async : false
                      }) ;
                     var response = {valid: jqxhr.statusText,  data: jqxhr.responseText};

                     drawPcaTable(response.data);
                })
             .attr("cx", function(d, i) { return x(d[1]) + x.bandwidth()/2; })
             .attr("cy", function(d) { return y(d[2]); })
             .attr("r", 4)
             .on("mouseover",function(d){

               d3.select(this)
              .transition()
              .duration(400)
              .attr("cx", function(d, i) { return x(d[1]) + x.bandwidth()/2; })
              .attr("cy", function(d) { return y(d[2]); })
              .attr("r", 7)
              .attr("fill","red");

              svg.append("text")
               .attr('class', 'val')
               .attr('x', (x(d[1]) + x.bandwidth()/2 - 10))
                .attr('y', function() {
                   return y(d[2]) - 15;
               })
               .text(function() {
                return +(Math.round(d[2] + "e+2")  + "e-2") +"%";
               });
             })
             .on("mouseout",function(d){

               d3.select(this)
              .transition()
              .duration(400)
              .attr("cx", function(d, i) { return x(d[1]) + x.bandwidth()/2; })
              .attr("cy", function(d) { return y(d[2]); })
              .attr("r", 4)
              .attr("fill","blue");
                  d3.selectAll('.val')
                    .remove();
             });



}
