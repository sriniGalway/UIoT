$(document).ready(function(){


    $.get('data/data-environmental.json', function(dataset){


        $('#ortho-phosphate-eqs-chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: '',
            },
            tooltip: {
                enabled: false
                // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        // style: {
                        //     fontWeight: 'bold',
                        //     color: 'white',
                        //     textShadow: '0px 1px 2px black'
                        // },
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    },
                    showInLegend: false,
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: dataset.ortho_phosphate.name,
                innerSize: '50%',
                data: dataset.ortho_phosphate.data
            }]
        });

        $('#ammonia-eqs-chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: '',
            },
            tooltip: {
                enabled: false
                // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        // style: {
                        //     fontWeight: 'bold',
                        //     color: 'white',
                        //     textShadow: '0px 1px 2px black'
                        // },
                        format: '<b>{point.name}</b>: {point.y} %',
                    },
                    showInLegend: false,
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: dataset.ammonia.name,
                innerSize: '50%',
                data: dataset.ammonia.data
            }]
        });
        

        $('#ton-eqs-chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: '',
            },
            tooltip: {
                enabled: false                
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        format: '<b>{point.name}</b>: {point.y} %',
                    },
                    showInLegend: false,
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: dataset.ton.name,
                innerSize: '50%',
                data: dataset.ton.data
            }]
        });

        $('#bod-eqs-chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: '',
            },
            tooltip: {
                enabled: false                
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        format: '<b>{point.name}</b>: {point.y} %',
                    },
                    showInLegend: false,
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: dataset.bod.name,
                innerSize: '50%',
                data: dataset.bod.data
            }]
        });

    },'json');

    // aa.heatmapColours = colorbrewer.RdBu[3];
    // aa.heatmapColours[1] = '#dbdbdb';
    aa.heatmapColours = [ '#FF7373' , '#ccc', '#00B200' ]

    // 
    // EPA River / Lake water quality heatmap
    d3.csv('data/epa-water-quality.csv', function(d) {
      return {
        // Type,Name,Identifiers,Remarks,Condition
        type: d.Type,
        name: d.Name,
        codes: d.Identifiers.replace(/(\r\n|\n|\r)/gm, ", "),   // replace linebreaks with commas
        remarks: d.Remarks,
        condition: d.Condition
      };
    }, function(err, rows) {
        
        var vis = d3.select('#water-quality-chart');

        var div = d3.select("body").append("div")   
                    .attr("class", "tooltip heatmap-tooltip")               
                    .style("opacity", 0);
        

        vis.selectAll('.heatmap-item')            
            .data(rows)
            .enter()
                .append('div')
                .attr('class', function(d){
                    return 'heatmap-item ' + d.condition;
                })
                .attr('style', function(d){
                    var bg = '';

                    switch(d.condition){
                        case 'happy':
                            bg = aa.heatmapColours[2];
                            break;
                        case 'meh':
                            bg = aa.heatmapColours[1];
                            break;
                        case 'sad':
                            bg = aa.heatmapColours[0];
                            break;                        
                    }
                    return 'background-color: ' + bg;
                })
                .on("mouseover", function(d) {      
                    div.transition()        
                        .duration(200)      
                        .style("opacity", .95);      
                    div .html(function(){
                        return '<h5><small>' +d.type + '</small> ' + d.name +'</h5><p><small>' + d.codes +'</small></p><p><strong>Remarks</strong>: ' + d.remarks + '</p>' ;
                        
                    })  
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px");    
                    })                  
                .on("mouseout", function(d) {       
                    div.transition()        
                        .duration(500)      
                        .style("opacity", 0);   
                });

    });    

    // 
    // Bathing water quality heatmap
    d3.csv('data/bathing-water-quality.csv', function(d) {
      return {
        // Location, Status
       name: d.location,
       status: d.status
      };
    }, function(err, rows) {
        
        var vis = d3.select('#bathing-water-quality-chart');

        var div = d3.select("body").append("div")   
                    .attr("class", "tooltip heatmap-tooltip")               
                    .style("opacity", 0);



        vis.selectAll('.heatmap-item')            
            .data(rows)
            .enter()
                .append('div')
                .attr('class', function(d){
                    return 'heatmap-item ' + d.status.toLowerCase();
                })
                .attr('style', function(d){
                    var bg = '';

                    switch(d.status){
                        case 'Good':
                            bg = aa.heatmapColours[2];
                            break;
                        case 'Sufficient':
                            bg = aa.heatmapColours[1];
                            break;
                        case 'Poor':
                            bg = aa.heatmapColours[0];
                            break;                        
                    }
                    return 'background-color: ' + bg;
                })
                .on("mouseover", function(d) {      
                    div.transition()        
                        .duration(200)      
                        .style("opacity", .95);      
                    div .html(function(){
                        return '<h5>' + d.name +'</h5><p><strong>Water Quality</strong>: ' + d.status + '</p>' ;
                        
                    })  
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px");    
                    })                  
                .on("mouseout", function(d) {       
                    div.transition()        
                        .duration(500)      
                        .style("opacity", 0);   
                });

    });


    aa.beachMap = new L.Map('beach-map', {
        center: new L.LatLng(53.308, -9.128),
        zoom: 10,
        scrollWheelZoom: false,
    });

    L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
        minZoom: 7,
        maxZoom: 15,
        noWrap: true,
        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(aa.beachMap);

    $.get('data/BlueflagBeaches.json', function(data){
        aa.galwayIsochroneLayer = L.geoJson(data, { 
            pointToLayer: aa.labelBeaches
        });
    }, 'json');



    d3.csv('data/waste-management.csv', function(d) {
      // LocalAuthority,Variable,y2010,y2011,y2012
      return {
        local_authority: d.LocalAuthority,
        variable: d.Variable,
        year: {
            2010: +d.y2010,
            2011: +d.y2011,
            2012: +d.y2012
        }
      };
    }, function(err, rows) {

        var categories = _.keys( _.first(rows).year );
      
        var cityWaste = _.where(rows, {  local_authority: 'Galway City' });
        var countyWaste = _.where(rows, {  local_authority: 'Galway' });

        // Managed
        var cityManaged = [];
        cityManaged.push( _.first( _.where(cityWaste, { variable: "HWM ‐Destination recycling/recovery"  })) );
        cityManaged.push( _.first( _.where(cityWaste, { variable: "HWM disposed"  })) );
          
        var countyManaged = [];
        countyManaged.push( _.first( _.where(countyWaste, { variable: "HWM ‐Destination recycling/recovery"  })) );
        countyManaged.push( _.first( _.where(countyWaste, { variable: "HWM disposed"  })) );

        // should be setting axis to same maxValue here for easier comparison...      
        aa.drawWasteManagementChart(categories, cityManaged, null, '#city-waste-management-chart', 'Household Waste Managed (tonnes)');
        aa.drawWasteManagementChart(categories, countyManaged, null, '#county-waste-management-chart', 'Household Waste Managed (tonnes)');

        // Kerbside
        var theData = [];
        theData.push( _.first( _.where(cityWaste, { variable: "Residual kerbside household waste disposed"  })) );
        theData.push( _.first( _.where(cityWaste, { variable: "Residual kerbside household waste destined for recycling / energy recovery"  })) );
        theData.push( _.first( _.where(cityWaste, { variable: "MRD household waste collected at kerbside"  })) );
        theData.push( _.first( _.where(cityWaste, { variable: "Organic kerbside household waste collected (tonnes)"  })) );
        
        aa.drawWasteManagementChart(categories, theData, null, '#city-kerbside-waste-management-chart', 'Kerbside Household Waste Managed (tonnes)');

        var theData = [];
        theData.push( _.first( _.where(countyWaste, { variable: "Residual kerbside household waste disposed"  })) );
        theData.push( _.first( _.where(countyWaste, { variable: "Residual kerbside household waste destined for recycling / energy recovery"  })) );
        theData.push( _.first( _.where(countyWaste, { variable: "MRD household waste collected at kerbside"  })) );
        theData.push( _.first( _.where(countyWaste, { variable: "Organic kerbside household waste collected (tonnes)"  })) );
        
        aa.drawWasteManagementChart(categories, theData,null, '#county-kerbside-waste-management-chart', 'Kerbside Household Waste Managed (tonnes)');

        // Non-Kerbside
        var theData = [];
        theData.push( _.first( _.where(cityWaste, { variable: "Non-kerbside Household Waste Managed (HWM)"  })) );                
        aa.drawWasteManagementChart(categories, theData, null, '#city-non-kerbside-waste-management-chart', 'Non ‐Kerbside Household Waste Managed');

        var theData = [];
        theData.push( _.first( _.where(countyWaste, { variable: "Non-kerbside Household Waste Managed (HWM)"  })) );               
        aa.drawWasteManagementChart(categories, theData,  null,'#county-non-kerbside-waste-management-chart', 'Non ‐Kerbside Household Waste Managed');

    });
    
});

aa.drawWasteManagementChart = function( categories, data, maxValue, element, title)
{
    
    var theChartData = {};
      
    theChartData.categories = categories;
    theChartData.series = [];

      _.each(data, function(value, key, list){

            var series = {
                name: value.variable,
                data: _.values(value.year)
            };

            theChartData.series.push(series);
      });


        $(element).highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: theChartData.categories
            },
            yAxis: {
                min: 0,
                max: maxValue,
                title: {
                    text: title
                }
            },
            legend: {
                reversed: true
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': <strong>' + this.y + '</strong><br/>' +
                        'Total: ' + this.point.stackTotal;
                },
                style: {
                    maxWidth: '200px'                        
                }                    
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: theChartData.series
        });
}

aa.labelBeaches = function(feature, ll)
{
     var starIcon = L.MakiMarkers.icon({
        icon: "star",
        color: "#b36",
        size: "m"
    });

    return L.marker(ll, {
        icon: starIcon
        }
    ).addTo(aa.beachMap)
     .bindPopup(
        '<strong><smalL>Blue Flag Beach</small></strong><h4>' + feature.properties.NAME + '</h4>');

}