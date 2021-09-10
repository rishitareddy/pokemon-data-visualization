function drawParallelCoordinates(){

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
        console.log("parallel coordinates kclusters error ",error);
      }
           }) ;


  title = document.getElementById("graph-title");
  title.setAttribute('style','font-size: 30px; color: black; text-align:center; text-decoration: underline; font-family: Courier New;');
  title.innerHTML = "PARALLEL COORDINATES";
  document.getElementById("graph-div").setAttribute('style','background-color:#cadfeb')

  graphinfo = document.getElementById("graph-info")
  graphinfo.setAttribute('style','text-align:center');
  graphinfo.innerHTML="Please drag on the axes to reorder them. <br/> Brushing is enabled to select a subportion of datapoints.";

  document.getElementById("table-title").innerHTML="";
  document.getElementById("scatterplot-title").innerHTML="";
  document.getElementById("mds-correlation-title").innerHTML="";
  document.getElementById("table-info").innerHTML="";
  document.getElementById("scatterplot-info").innerHTML="";
  document.getElementById("bi").setAttribute('style','background-color: #cfebca;color: black;');
  document.getElementById("scree").setAttribute('style','background-color: #cfebca;color: black;');
  document.getElementById("mds").setAttribute('style','background-color: #cfebca;color: black;');
  document.getElementById("pcp").setAttribute('style','background-color: #00008B;color: white;');


  var t = document.getElementById("pcaLoad");
  if (t != null){t.style.display = "none";}

    d3.selectAll("svg").remove();

    var margin = 0;
    var margin_bottom = 100;
    margin = {top: 30, right: 30, bottom: margin_bottom, left: 50},
    width = 1500 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  var svg = d3.select("body").select("#graph-plot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var x = d3.scalePoint().range([0, width]).padding(1),
    y = {},
    dragging = {};

var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

  //  var Categorical = ['Type_1','Type_2','Color','Egg_Group_1','Body_Style'];


d3.csv("https://raw.githubusercontent.com/rishitareddy/visualization/main/pokemon_filtered_data.csv", function(data) {

  x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    // if(Categorical.includes(d)){
    //   y[d] = d3.scalePoint()
    //   .domain(data.map(function(p) { return p[d]; }).keys())
    //   .rangeRound([height, 0]).padding(0.1);
      //
      // y[d] = d3.scaleOrdinal()
      // .domain(data.map(function(p) { return p[d]; }).keys())
      // .range([height,0]);
    // }else{
      y[d] = d3.scaleLinear()
          .domain(d3.extent(data, function(p) { return +p[d]; }))
          .range([height, 0]);
    // }
    return d != "Name" && d != "Number" && y[d];
  }));

  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path)
    .style("stroke", function(d,i) {
    var color = 'green';
    if(labels[i] == 1){
      color = 'blue';
    }
    else if (labels[i] == 2) {
      color = 'red';
    }
    return color; })
    .style("opacity", 0.2);

  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.drag()
        .on("start", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
          document.getElementById("pcp").setAttribute('style','background-color: #00008B;color: white;');
        })
        .on("drag", function(d) {
          document.getElementById("pcp").setAttribute('style','background-color: #00008B;color: white;');
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("end", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);

        }));

  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill","black");


      g.append('g')
        .attr('class', 'brush')
        .each(function(d) {
          d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, y[d].range()[1]], [8, y[d].range()[0]]]).on("start", brushstart).on("brush", brush));
        })
        .selectAll('rect')
        .attr('x', -8)
        .attr('width', 16);
});

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  document.getElementById("pcp").setAttribute('style','background-color: #00008B;color: white;');

  d3.event.sourceEvent.stopPropagation();
}

function brush() {

  document.getElementById("pcp").setAttribute('style','background-color: #00008B;color: white;');

  const actives = [];
  svg.selectAll('.brush')
    .filter(function(d) {
      return d3.brushSelection(this);
    })
    .each(function(d) {
      actives.push({
        dimension: d,
        extent: d3.brushSelection(this)
      });
    });
  foreground.style('display', function(d) {
    return actives.every(function(active) {
      const dim = active.dimension;
      return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
    }) ? null : 'none';
  });
}

}
