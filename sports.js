//This is the javascript file that accompanies the 'DataVizProject1.html' file

(function(){

//dimensions of the chart
  var width = 500;
  var height = 500;
  //var radius = 5;

  var svg = d3.select("#circle_chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    //.attr("radius", radius)
    .append("g")
    .attr("transform", "translate(0,0)")

//add .jpg image to circle as background
  //defs are definitions of graphic objects that will be reused
  var defs = svg.append("defs")
  defs.append("pattern") //pattern component fills in circle
    .attr("id", "LeBron")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    .attr("xlink:href", "LeBron.jpg")


  var radiusScale = d3.scaleSqrt().domain([31, 1035]).range([50, 100])

//force simulation gets circles to go to a certain place (the center)
  var simulation = d3.forceSimulation()
    .force("xAxis", d3.forceX(width / 2).strength(0.05)) //...strength/quickness of force
    .force("yAxis", d3.forceY(height / 2).strength(0.05))
    //prevent colliding of circles
    .force("collide", d3.forceCollide (function(d)
    {
      return radiusScale (d.term1_count) +10; //spacing between bubbles
    }))


  d3.queue()
    .defer(d3.csv, "guardian_data.csv")
    .await(ready)


  function ready (error, datapoints) {

    defs.selectAll(".athlete-pattern")
      .data(datapoints)
      .enter().append("pattern")
      .attr("class", "athlete-pattern")
      .attr("id", function (d){
        return d.term1.replace(/ /g,"_") //gets rid of spaces in names
      })
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("height", 1)
      .attr("width", 1)
      .attr("preserveAspectRatio", "none")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .attr("xlink:href", function(d){
        return d.image
      })


    //draw circles
    var circles = svg.selectAll(".athletes")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "athletes")
      .attr("r", function(d){
        return radiusScale(d.term1_count)
      })
      .attr("fill",function(d){
        return "url(#" + d.term1.replace(/ /g,"_") + ")"
      })
      .on('click', function(d)
      {
        console.log(d)
      })


    simulation.nodes(datapoints)
      .on('tick', ticked)

    //  //position the circle to not be in the corner
    //   .attr("cx",100)
    //   .attr("cy",300)

//function grabs circles and places them in the center; updates x and y points
//positions the circle to not be in the corner
  function ticked()
  {
    circles
      .attr("cx", function(d)
      {
        return d.x
      })
      .attr("cy", function(d)
      {
        return d.y
      })

  }
 }

})();
