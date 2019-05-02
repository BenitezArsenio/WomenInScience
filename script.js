var dataP = d3.csv("table3-2000both.csv");
dataP.then(function(data)
{
  console.log(data[0]);
})

var mapP = d3.json("us-states.json");
var abbrP = d3.csv("states.csv");

Promise.all([mapP,abbrP])
       .then(function(values)
{
  var geoData = values[0];
  var states = values[1];

  var statesDict = {};
  states.forEach(function(state){
    statesDict[state.NAME.trim()]=state;
  })

  geoData.features.forEach(function(feature)
{
  /*  console.log(feature.properties.name,
      statesDict[feature.properties.name]);
*/
  feature.properties.ABBR = statesDict[feature.properties.name].ABBR;

})

  console.log(geoData,states);

  drawMap(geoData,states);



});

var drawMap = function(geoData,stateArray)
{
  var screen = {width:1500,height:1000}
    //create Projection
    //var projection = d3.geoAlbersUsa()
    //                  .translate([screen.width/2,screen.height/2]);

    var geoGenerator = d3.geoPath()
//                         .projection(projection);
                        .projection(d3.geoAlbersUsa());
    var svg = d3.select("svg")
                .attr("width",screen.width)
                .attr("height",screen.height);
// split states by region
    var nE = ['MD','DE','NJ','PA','NY',"CT",'RI','MA','NH','VT','ME']
    var south = ['KY','WV','VA','TN','NC','SC','GA','FL','AL','MS','LA','TX','OK','AR']
    var mW = ['OH','IN','MI','IL','WI','MO','IA','MN','KS','NE','SD','ND']
    var west = ['OR','WA','CA','NV','ID','MT','WY','UT','CO','AZ','NM']


    var states = svg.append("g")
      .selectAll("g")
      .data(geoData.features)
      .enter()
      .append("g")

      states.append("path")
      .attr("d",geoGenerator)
      .attr("stroke","black")
      .attr("fill",function(d,i)
      {
        //console.log(s,d.properties.ABBR)
        if(nE.includes(d.properties.ABBR ))
        {
          return 'blue';
        }
        else if (south.includes(d.properties.ABBR ))
        {
          return 'yellow';
        }
        else if (mW.includes(d.properties.ABBR ))
        {
          return 'green';
        }
        else if (west.includes(d.properties.ABBR ))
        {
          return 'orange';
        }
      });

     // states.append("text")
     //  .attr("x",function(d) {return geoGenerator.centroid(d)[0]})
     //  .attr("y",function(d) {return geoGenerator.centroid(d)[1]})
     //  .text(function(d){return d.properties.ABBR});
      states.append('circle')

            .attr('cx',function(d)
            {
              if(d.properties.ABBR == 'MA'||d.properties.ABBR == 'CA'||d.properties.ABBR == 'WI'||d.properties.ABBR == 'NC'  )
              {
                return (geoGenerator.centroid(d)[0])
              }
              else
              {
                return (0)
              }
            })
            .attr('cy',function(d)
            {
              if(d.properties.ABBR == 'MA'||d.properties.ABBR == 'CA'||d.properties.ABBR == 'WI'||d.properties.ABBR == 'NC')
              {
                return (geoGenerator.centroid(d)[1])
              }
              else
              {
                return (0)
              }
            })
            .attr('r',7)
            .attr('fill',function(d)
            {
              if(d.properties.ABBR == 'MA'||d.properties.ABBR == 'CA'||d.properties.ABBR == 'WI'||d.properties.ABBR == 'NC' )
              {
                console.log(d.properties.ABBR)
                return 'black'
              }
              else
              {
                return 'none'
              }

            })
};
