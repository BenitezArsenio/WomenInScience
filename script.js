
var dataP = d3.csv("table3-2000both.csv");
dataP.then(function(data)
{
  console.log(data[0]);
})

var mapP = d3.json("us-states.json");
var abbrP = d3.csv("states.csv");
var regionData = d3.json("schoolDATA.json");
Promise.all([mapP,abbrP,regionData])
       .then(function(values)
{
  var geoData = values[0];
  var states = values[1];
  var data = values[2];

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

  console.log(geoData,states,data);

  drawMap(geoData,states,data);



});

var drawMap = function(geoData,stateArray,data)
{
  var screen = {width:1000,height:500}
    //create Projection
    //var projection = d3.geoAlbersUsa()
    //                  .translate([screen.width/2,screen.height/2]);

    var geoGenerator = d3.geoPath()
//                         .projection(projection);
                        .projection(d3.geoAlbersUsa());
    var svg = d3.select("#map")
                .attr("width",screen.width)
                .attr("height",screen.height);
// split states by region
    var nE = ['MD','DE','NJ','PA','NY',"CT",'RI','MA','NH','VT','ME']
    var south = ['KY','WV','VA','TN','NC','SC','GA','FL','AL','MS','LA','TX','OK','AR']
    var mW = ['OH','IN','MI','IL','WI','MO','IA','MN','KS','NE','SD','ND']
    var west = ['OR','WA','CA','NV','ID','MT','WY','UT','CO','AZ','NM']
// get data for each regionData
    var menCS = 0;
    var womenCS = 0;
    var menEn = 0;
    var womenEn = 0;
    var menM = 0;
    var womenM = 0;
    var menPh = 0;
    var womenPh= 0;
    var totalMen = 0;
    var totalWomen = 0;
    var year = 2005;
    var getYear = function()
    {
    year = this.id;
  }
  document.getElementById('2005').onclick = getYear;
  document.getElementById('2010').onclick = getYear;
  document.getElementById('2015').onclick = getYear;
    var mWMen = function(year,region)
    {
    data.forEach(function(d)//for each school
    {

if(region.includes(d.ABBR))
{console.log(region,d.ABBR)
      d.data.forEach(function(y,i)//for each year
      {
        console.log(y.year)
        if(y.year==year)
        {
            y.completions_BY_field.forEach(function(j)//for each major
            {
              if(j.field=='CS')
              {
                menCS += j.male;
                womenCS += j.female;
              }
              else if(j.field=='Engineering')
              {
                menEn += j.male;
                womenEn += j.female;
              }
              else if(j.field=='Mathematics')
              {
                menM += j.male;
                womenM += j.female;
              }
              else if(j.field=='Physics')
              {
                menPh += j.male;
                womenPh += j.female;
              }

            })
        }

      })}
    })}

    ///initialize other chart
    var screen2 = {width:800,height:800};
    var margins =
    {
      top:10,
      bottom:50,
      left:50,
      right:200
    }
    var width = 600-margins.left-margins.right;
    var height = 600-margins.top-margins.bottom;
    var barWidth = width/4;
    var xscale = d3.scaleLinear()
      .domain([0,4])
      .range([0,width]);
    var yscale = d3.scaleLinear()
      .domain([0,100])
      .range([height,0]);

    var barChart = d3.select('#barChart')
                      .attr("width",600)
                      .attr('height',600)
                      .classed('hidden',true);
    var plotLand = barChart.append('g')
                      .classed("hidden",false)
                      .attr('width',width)
                      .attr('height',height)
                      .attr("transform","translate("+margins.left+","+(0)+")");
    //draw states
    var accent = d3.scaleOrdinal(d3.schemeAccent);
    var states = svg.append("g")
      .selectAll("g")
      .data(geoData.features)
      .enter()
      .append("g")
      .classed('hidden',false)

      states.append("path")
      .attr("d",geoGenerator)
      .attr("stroke","black")
      .attr("fill",function(d,i)
      {
        //console.log(s,d.properties.ABBR)
        if(nE.includes(d.properties.ABBR ))
        {
          return '#ffa97e';
        }
        else if (south.includes(d.properties.ABBR ))
        {
          return '#ffa97e';
        }
        else if (mW.includes(d.properties.ABBR ))
        {
          return '#ffa97e';
        }
        else if (west.includes(d.properties.ABBR ))
        {
          return '#ffa97e';
        }
      })
      .on('mouseenter',function(d)
          {
            if(mW.includes(d.properties.ABBR))
            {
              console.log(d.properties.ABBR)
              mWMen(2015,mW)
              drawBarChart(plotLand,menCS,womenCS,menEn,womenEn,menM,womenM,menPh,womenPh,xscale,yscale,margins,barChart,'r');
              plotLand.classed('hidden',false);

              states.classed('hidden',function(d)
                {
                  if(mW.includes(d.properties.ABBR)==false)
                  {
                    return true
                  }
                })


            }

            else if(nE.includes(d.properties.ABBR))
            {
              console.log(d.properties.ABBR)
              mWMen(2015,nE)
              drawBarChart(plotLand,menCS,womenCS,menEn,womenEn,menM,womenM,menPh,womenPh,xscale,yscale,margins,barChart,'r');
              plotLand.classed('hidden',false);

              states.classed('hidden',function(d)
                {
                  if(nE.includes(d.properties.ABBR)==false)
                  {
                    return true
                  }
                })

            }
            else if(west.includes(d.properties.ABBR))
            {
              console.log(d.properties.ABBR)
              mWMen(2015,west)
              drawBarChart(plotLand,menCS,womenCS,menEn,womenEn,menM,womenM,menPh,womenPh,xscale,yscale,margins,barChart,'r');
              plotLand.classed('hidden',false);

              states.classed('hidden',function(d)
                {
                  if(west.includes(d.properties.ABBR)==false)
                  {
                    return true
                  }
                })

            }
            else if(south.includes(d.properties.ABBR))
            {
              console.log(d.properties.ABBR)
              mWMen(2015,south)
              drawBarChart(plotLand,menCS,womenCS,menEn,womenEn,menM,womenM,menPh,womenPh,xscale,yscale,margins,barChart,'r');
              plotLand.classed('hidden',false);

              states.classed('hidden',function(d)
                {
                  if(south.includes(d.properties.ABBR)==false)
                  {
                    return true
                  }
                })

            }
          })
        .on('mouseleave',function(d)
        {
          plotLand.selectAll('rect').remove();
          plotLand.selectAll('text').remove();
          barChart.classed('hidden',true);
          states.classed('hidden',false);
          menCS = 0;
          womenCS = 0;
          menEn = 0;
          womenEn = 0;
          menM = 0;
          womenM = 0;
          menPh = 0;
          womenPh= 0;
          totalMen = 0;
          totalWomen = 0;

        })

     states.append("text")
      .attr("x",function(d) {return geoGenerator.centroid(d)[0]})
      .attr("y",function(d) {return geoGenerator.centroid(d)[1]})
      .text(function(d){
        if (d.properties.ABBR=='TX')
        {
          return 'South'
        }
        else if (d.properties.ABBR=='UT')
        {
          return 'West'
        }
        else if (d.properties.ABBR=='IA')
        {
          return 'Midwest'
        }
        else if (d.properties.ABBR=='PA')
        {
          return 'NorthEast'
        }
      })
      .attr('fill', 'purple')
      .attr('font-size','25px');


      states.append('circle')

            .attr('cx',function(d)
            {
              if(d.properties.ABBR == 'MA'||d.properties.ABBR == 'CA'||d.properties.ABBR == 'GA'||d.properties.ABBR == 'CT' ||d.properties.ABBR == 'MD'||d.properties.ABBR == 'KY' ||d.properties.ABBR == 'VA'||d.properties.ABBR == 'KS'||d.properties.ABBR == 'NE'||d.properties.ABBR == 'IN' ||d.properties.ABBR == 'WA'||d.properties.ABBR == 'AZ'  )
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
              if(d.properties.ABBR == 'MA'||d.properties.ABBR == 'CA'||d.properties.ABBR == 'GA'||d.properties.ABBR == 'CT' ||d.properties.ABBR == 'MD'||d.properties.ABBR == 'KY' ||d.properties.ABBR == 'VA'||d.properties.ABBR == 'KS'||d.properties.ABBR == 'NE'||d.properties.ABBR == 'IN' ||d.properties.ABBR == 'WA'||d.properties.ABBR == 'AZ')
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
              if(d.properties.ABBR == 'MA'||d.properties.ABBR == 'CA'||d.properties.ABBR == 'GA'||d.properties.ABBR == 'CT' ||d.properties.ABBR == 'MD'||d.properties.ABBR == 'KY' ||d.properties.ABBR == 'VA'||d.properties.ABBR == 'KS'||d.properties.ABBR == 'NE'||d.properties.ABBR == 'IN' ||d.properties.ABBR == 'WA'||d.properties.ABBR == 'AZ'        )
              {

                return 'red'
              }
              else
              {
                return 'none'
              }

            })

          //  .on("mouseover", function(d, i){

  //      states.append("text")
  //      .attr("class", "tooltip")
  //      .attr("x", 215)
  //      .attr("y", 600)
  //      .attr("tet-anchor", "middle")
  //      .attr("fill", "black")
  //      .text("Year: "+(year)+", % women CS: "+(((womenCS/(menCS+womenCS))*100)))
  //    })
  //     .on("mouseout", function()
  //   {states.select(".tooltip").remove();
  //
  // })


}
var drawBarChart = function(plotLand,menCS,womenCS,menEn,womenEn,menM,womenM,menPh,womenPh,xscale,yscale,margins,barChart,type)
{
console.log('here',)
document.getElementById('totalM').innerHTML = menCS+menEn+menM+menPh;
document.getElementById('totalF').innerHTML = womenCS+womenEn+womenM+womenPh;
document.getElementById('perW').innerHTML = parseInt(((womenCS+womenEn+womenM+womenPh)/(womenCS+womenEn+womenM+womenPh+(menCS+menEn+menM+menPh)))*100);
  barChart.classed('hidden',false)
  var width = 600-margins.left-margins.right;
  var height = 600-margins.top-margins.bottom;
  var barWidth = width/4;

console.log('here',menCS,womenCS)

  var array = [((womenCS/(menCS+womenCS))*100),((womenEn/(menEn+womenEn))*100 ),((womenM/(menM+womenM))*100),((womenPh/(menPh+womenPh))*100)]
  var barWidth = width/4;
console.log(array)
  plotLand.selectAll('rect')
          .data(array)
          .enter()
          .append('rect')
          .attr('x',function(d,i)
          {
            return xscale(i);
          })
          .attr('y',function(d)
          {
            console.log(yscale(d))
            return yscale(d);
          })
          .attr('width',barWidth)
          .attr('height', function(d)
          {
            return height-yscale(d);
          })
          .attr('fill',function(d,i){
            if(i==0)
            {
              return '#ffdd48'
            }
            else if(i==1)
            {
              return '#ffbcb2'
            }
            else if (i==2){
              return '#cbff7d'
            }
            else if (i==3){
              return '#b5fff6'
            }
          });
          plotLand.selectAll("text")
          .data(array)
          .enter()
          .append('text')
          .attr("class","label")
          .attr("x", (function(d,i) { return xscale(i)  ; }  ))
          .attr("y", function(d) { return yscale(d) + 1; })
          .attr("dy", ".6em")
          .text(function(d)
          { console.log(d);
              return parseInt(d);
          });

  ////make axis
  yAxis = d3.axisLeft(yscale);
//xAxis = d3.axisBottom(xscale);

   var xA = margins.top;
  // barChart.append('g').classed('xAxis',true)
  //    .call(xAxis)
  //    .attr('transform','translate('+ margins.left + ','+550+')' );
 var yA = margins.left-10;
 barChart.append('g').classed('yAxis',true)
     .call(yAxis)
     .attr('transform','translate('+yA+ ','+5+')' );
     var legend = barChart.append('g')
                       .classed('legend',true)
                       .attr('transform','translate('+(width+margins.left)+','+margins.top+')');
     var legendLines = legend.selectAll('g')
                             .data([0,1,2,3])
                             .enter()
                             .append('g')
                             .classed('legendLines',true)
                             .attr('transform', function(d,i)
                             {
                               return "translate(0,"+(i*12)+")";
                             })
     legendLines.append('rect')
                .attr('x',0)
                .attr('y',function(d,i){return 10*i})
                .attr('width',12)
                .attr('height',12)
                .attr('fill',function(d,i)
                {
                 if(i==0)
                 {
                   return "#ffdd48";
                 }
                 else if(i==1)
                 {
                   return "#ffbcb2";
                 }
                 else if(i==2)
                 {
                   return "#cbff7d";
                 }
                 else if(i==3)
                 {
                   return "#b5fff6";
                 }

               })
     legendLines.append('text')
               .attr("id", "legendText")
                .attr('x',15)
                .attr('y',function(d,i){return (10*i)+12})
                .text(function(d,i)
                {
                 if(i==0)
                 {
                   return "Computer Science";
                 }
                 else if(i==1)
                 {
                   return "Engineering";
                 }
                 else if(i==2)
                 {
                   return "Mathematics";
                 }
                 else if(i==3)
                 {
                   return "Physics";
                 }

               })
                 .attr('id',function(d,i)
               {

                  if(i==0)
                  {
                    return "line1";
                  }
                  else if (i==1)
                  {
                    return "line2";
                  }
                  else if(i==2)
                {
                  return "line3"}
               })


}
