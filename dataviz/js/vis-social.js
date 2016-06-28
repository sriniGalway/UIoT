
        aa.visibleIsochroneLayer = null,
        aa.visibleIsochroneLegend = false,
        
        aa.tuamIsochroneLayer = null,
        aa.tuamIsochroneLegendLabels = [],
        aa.tuamIsochroneLegendColours = [],
        
        aa.galwayIsochroneLayer = null,
        aa.galwayIscochroneLegendLabels = [],
        aa.galwayIscochroneLegendColours = [],
        
        aa.commuteMap = null; 






// ---------------------------------
// Deprivation Index map
// ---------------------------------
        
    aa.deprivationIndexStyle = function(feature)
    {
        var dataPoint = _.first(feature.properties.deprivation);
        
        var colour;

        if(typeof dataPoint !== 'undefined'){
            colour = aa.deprivationIndexColour( parseFloat(dataPoint.HP2011rel));
        }else{
            colour = '#666';
        }
        
        return {
            fillColor: colour,
            weight: 1,
            opacity: 1,
            color: '#d35400',
            dashArray: '3',
            fillOpacity: 0.7
            // fillOpacity: 1
        };
    };

    aa.deprivationIndexColour = function(intervalVal)
    {
        if(intervalVal > 10){                
            return aa.depColours[0];
        }
        if(intervalVal > 5){                
            return aa.depColours[1];
        }
        if(intervalVal > 2.5){                
            return aa.depColours[2];
        }
        if(intervalVal > -2.5){                
            return aa.depColours[3];
        }
        if(intervalVal > -5){                
            return aa.depColours[4];
        }
        if(intervalVal > -10){                
            return aa.depColours[5];
        }
                    
        return aa.depColours[6];
        
    }  

    aa.deprivationIndexLabel = function(feature, layer)
    {
        
        var dataPoint = _.first(feature.properties.deprivation);
        var item = '<h4>' + feature.properties.EDNAME + '</h4>';
        
        if(typeof dataPoint !== 'undefined'){
            item += '<table class="table table-condensed">' +
                    '<tr><th scope="row">2006 Absolute HP Index Score</th><td>'+ dataPoint.HP2006abs + '</td></tr>'+
                    '<tr><th scope="row">Change in Absolute HP Index Score</th><td>'+ dataPoint.HP2011abs + '</td></tr>'+
                    '<tr><th scope="row">2011 Absolute HP Index Score</th><td>'+ dataPoint.HP0611abs + '</td></tr>'+
                    '<tr><th scope="row">2006 Relative HP Index Score</th><td>'+ dataPoint.HP2006rel + '</td></tr>'+
                    '<tr><th scope="row">2011 Relative HP Index Score</th><td><strong>'+ dataPoint.HP2011rel + '</strong></td></tr>'+
                    '<tr><th scope="row">Change in Relative HP Index Score</th><td>'+ dataPoint.HP0611rel + '</td></tr></table>';                        
        }else{
            item += '<p>Deprivation index data not found</p><p>' + feature.properties.CSOED + '</p>';
        }

        layer.bindPopup(item);  
    };

    aa.deprivationIndexLegend = function( intervals, colours)
    {
        

        var legend = L.control({position: 'bottomleft'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            div.innerHTML += '<h5>Deprivation Index<br/><small>Relative Measures, 2011</small></h5>';

            for (var i = 0; i < intervals.length; i++) {                
                div.innerHTML += '<i style="width: 18px; height: 18px; display: inline-block; background-color:' + colours[i] + '"></i> ' + intervals[i] + '<br/>';                  
                     // (intervals[i + 1] ? intervals[i] +'% &ndash; ' + (intervals[i - 1] - 1) + '% <br>' :  intervals[i] + '+%');
            }

            return div;
        };

        legend.addTo(aa.deprivationMap);
    }

    aa.deprivationMap = new L.Map('deprivation-index-map', {
        center: new L.LatLng(53.408, -9.128),
        zoom: 9,
        scrollWheelZoom: false
    });

    L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
        minZoom: 7,
        maxZoom: 15,
        noWrap: true,
        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(aa.deprivationMap);


    $.get('data/galway-deprivation-index-ed.json', function(data){

        aa.depColours = colorbrewer.RdBu[7];
        aa.depColours = aa.depColours.reverse();
        

        aa.deprivationLayer = L.geoJson(data, { 
            style: aa.deprivationIndexStyle,
            onEachFeature: aa.deprivationIndexLabel
        });

        aa.deprivationLayer.addTo(aa.deprivationMap);
        
        aa.depLabels = [ 'Over 10', '>5 &#8211; 10', '>2.5 &#8211; 5', '2.5 &#8211; -2.5', '>-2.5 &#8211; -5', ' >-5 &#8211; -10', 'Over -10'];
        aa.deprivationIndexLegend(aa.depLabels, aa.depColours);  
                    

    });







        aa.isoChroneStyleGalway = function(feature)
        {   
            var colour = aa.isochroneColourGalway(feature.properties.ObjectID - 1);
            aa.galwayIscochroneLegendColours.push(colour);

            return {
                fillColor: colour,
                weight: 1,
                opacity: 1,
                color: '#d35400',
                dashArray: '3',
                fillOpacity: 0.8
            };
        }

        aa.isoChroneStyleTuam = function(feature)
        {   
            var colour = aa.isochroneColourTuam(feature.properties.TOBREAK);
            aa.tuamIsochroneLegendColours.push(colour);

            return {
                fillColor: colour,
                weight: 1,
                opacity: 1,
                color: '#d35400',
                dashArray: '3',
                fillOpacity: 0.5
            };
        }

        aa.isochroneColourGalway = function(featureIndex)
        {
            // var colours = ['#ffffe0','#ffd59b','#ffa474','#f47461','#db4551','#b81b34','#8b0000'];
            var colours = ['#8b0000', '#b81b34', '#db4551', '#f47461', '#ffa474', '#ffd59b', '#ffffe0'];
            return colours[featureIndex];
        }

        aa.isochroneIntervalLabelGalway = function(feature)
        {
            aa.galwayIscochroneLegendLabels.push( feature.properties.FromBreak + '-' + feature.properties.ToBreak +' mins');
        }

        aa.isochroneColourTuam = function(intervalVal)
        {
            var colours = ['#8b0000', '#b81b34', '#db4551', '#f47461', '#ffa474', '#ffd59b', '#ffffe0'];
            colours = colours.reverse();
            var c;

            switch(intervalVal){
                case 15:
                    c = colours[0];
                    break;
                case 30:
                    c = colours[1];
                    break;
                case 60:
                    c = colours[2];
                    break;
                case 90:
                    c = colours[3];
                    break;
                default:
                    c = 'blue';
                    break;
            }

            return c;
        }        

        aa.isochroneIntervalLabelTuam = function(feature)
        {
            aa.tuamIsochroneLegendLabels.push( feature.properties.FROMBREAK + '-' + feature.properties.TOBREAK + ' mins');
        }

        aa.addIsochroneLegend = function(title, intervals, colours)
        {
            
            if(aa.visibleIsochroneLegend !== false){
                aa.visibleIsochroneLegend.removeFrom(aa.commuteMap);
            }

            aa.visibleIsochroneLegend = L.control({position: 'bottomleft'});

            aa.visibleIsochroneLegend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    labels = [];

                // loop through our density intervals and generate a label with a colored square for each interval
                div.innerHTML += '<h5>Travel times to '+ title + '<br/><small>(Approximate)</small></h5>';

                for (var i = 0; i < intervals.length; i++) {                
                    div.innerHTML += '<i style="width: 18px; height: 18px; display: inline-block; background-color:' + colours[i] + '"></i> ' + intervals[i] + '<br/>';                  
                         // (intervals[i + 1] ? intervals[i] +'% &ndash; ' + (intervals[i - 1] - 1) + '% <br>' :  intervals[i] + '+%');
                }

                return div;
            };

            aa.visibleIsochroneLegend.addTo(aa.commuteMap);
        }

    

        aa.commuteMap = new L.Map('commute-map', {
            center: new L.LatLng(53.408, -9.128),
            zoom: 8,
            scrollWheelZoom: false
        });

        L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
            minZoom: 7,
            maxZoom: 15,
            noWrap: true,
            attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(aa.commuteMap);

        $.get('data/GalwayIsochrones.json', function(data){

            aa.galwayIscochrone = data;

            aa.galwayIsochroneLayer = L.geoJson(data, { 
                style: aa.isoChroneStyleGalway,
                onEachFeature: aa.isochroneIntervalLabelGalway
            });

            aa.visibleIsochroneLayer = aa.galwayIsochroneLayer;
            aa.visibleIsochroneLayer.addTo(aa.commuteMap);

            var title = 'Galway City';
            aa.addIsochroneLegend(title, aa.galwayIscochroneLegendLabels, aa.galwayIscochroneLegendColours);



             $.get('data/TuamIsochrones.json', function(tuamData){

                aa.tuamIsochroneLayer = L.geoJson(tuamData, { 
                    style: aa.isoChroneStyleTuam,
                    onEachFeature: aa.isochroneIntervalLabelTuam
                });
            });

        });
        
        $.get('data/data-social.json', function(dataset){

            // console.log(dataset);


            $('#avg-monthly-rental-city-chart').highcharts({

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.galway_rental.city.periods
                },
                yAxis: {
                    title: {
                        text: 'Average Housing Prices'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valuePrefix: '€'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: dataset.galway_rental.city.series

            });

            $('#avg-monthly-rental-county-chart').highcharts(
            {

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.galway_rental.county.periods
                },
                yAxis: {
                    title: {
                        text: 'Average Housing Prices'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valuePrefix: '€'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: dataset.galway_rental.county.series

            });

            $('#house-price-chart').highcharts({

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.house_prices.periods
                },
                yAxis: {
                    title: {
                        text: 'Average House Prices (€)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valuePrefix: '€'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: dataset.house_prices.series

            });

        
            $('#disability-support-chart').highcharts(
            {
                chart: {
                    type: 'column'
                    // ,
                    // backgroundColor: 'transparent'
                },
                // credits: {
                //     enabled: false
                // },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: dataset.disability_support.category
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Recipients'
                    }                    
                },
                legend: {
                    enabled: false                  
                },               
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': <strong>' + this.y + '</strong> people<br/>' +
                            'Total: ' + this.point.stackTotal;
                    },
                    style: {
                        maxWidth: '200px'                        
                    },
                    backgroundColor: "rgba(255,255,255,1)",
                    
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'                       
                    }
                },
                series: dataset.disability_support.series
            });      



            // 3 x Poverty Tables
            $('#poverty-rates-at-risk-chart').highcharts({

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.poverty.at_risk.periods
                },
                yAxis: {
                    title: {
                        text: 'At Risk of Poverty Rate (%)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '%'
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0
                },
                series: dataset.poverty.at_risk.series

            });

            $('#poverty-rates-depriviation-chart').highcharts({

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.poverty.deprivation_rate.periods
                },
                yAxis: {
                    title: {
                        text: 'Deprivation Rate (%)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '%'
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0
                },
                series: dataset.poverty.deprivation_rate.series

            });

            $('#poverty-rates-consistent-chart').highcharts({

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.poverty.consistent_poverty.periods
                },
                yAxis: {
                    title: {
                        text: 'Consistent Poverty Rate (%)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '%'
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0
                },
                series: dataset.poverty.consistent_poverty.series

            }); 



        }); // dataset

    
  



        var shoppingMap = new L.Map('shopping-centre-map', {
            center: new L.LatLng(53.2877, -9.05004),
            zoom: 12,
            scrollWheelZoom: false
        });

        L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
            minZoom: 7,
            maxZoom: 15,
            noWrap: true,
            attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(shoppingMap);

        // baseLayer.addTo(shoppingMap);

        $.get('data/ShoppCentres.json', function(data){
            
             var shoppingCentreIcon = L.MakiMarkers.icon({
                    icon: "commercial",
                    color: "#48b",
                    size: "m"
                });

             var marketCentreIcon = L.MakiMarkers.icon({
                    icon: "shop",
                    color: "#b36",
                    size: "m"
                });


            L.geoJson(data, { 
                style: style,
                onEachFeature: markShoppingCentre
            }).addTo(shoppingMap);

            // 53.2728149,-9.0539604
            // 53.2746096,-9.0505285

            L.marker([53.2728149, -9.0539604], {icon: marketCentreIcon}).addTo(shoppingMap)
                    .bindPopup(
                        '<strong><small>Market</small></strong><h4>St Nicholas Market</h4><p>Operates on Saturdays & Sundays as well as during Arts Festival period and Christmas period</p><ul><li>82 licenced traders on Saturday.</li><li>59 licenced traders on Sunday.</li></ul>'
                    );                    

            L.marker([53.2746096, -9.0505285], {icon: marketCentreIcon}).addTo(shoppingMap)
                    .bindPopup(
                        '<strong><small>Market</small></strong><h4>Eyre Square market </h4><p>Operates Monday - Saturday inclusive</p><ul><li>12 licenced traders at Eyre Square Market.</li></ul>'
                    );


            function style(feature)
            {   
                return {
                    // fillColor: colour,
                    weight: 1,
                    opacity: 1,
                    color: '#d35400',
                    dashArray: '3',
                    fillOpacity: 0.8
                };
            }

           function markShoppingCentre(feature)
           {
                L.marker([feature.properties.LAT, feature.properties.LONG], {icon: shoppingCentreIcon}).addTo(shoppingMap)
                    .bindPopup('<strong><small>Shopping Centre</small></strong><h4>' + feature.properties.COMPANYNA + '</h4>');
           }

        });


    
        var heritageMap = new L.Map('heritage-map', {
                center: new L.LatLng(53.2877, -9.05004),
                zoom: 9,
                scrollWheelZoom: false,
            });

        L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
            minZoom: 7,
            maxZoom: 15,
            noWrap: true,
            attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(heritageMap);


        d3.csv('data/galway-heritage-sites.csv', function(d) {
          return {
            // Name,Type,Lat,Lon
            name: d.Name,
            type: d.Type,
            lat: +d.Lat,
            lon: +d.Lon,
            address: d.Address
          };
        }, function(err, rows) {

            var museumIcon = L.MakiMarkers.icon({
                icon: "museum",
                color: "#b36",
                size: "m"
            });

            var galleryIcon = L.MakiMarkers.icon({
                icon: "art-gallery",
                color: "#48b",
                size: "m"
            });

            var heritageIcon = L.MakiMarkers.icon({
                icon: "monument",
                color: "#1abc9c",
                size: "m"
            });

            var theatreIcon = L.MakiMarkers.icon({
                icon: "theatre",
                color: "#8e44ad",
                size: "m"
            });

            var cinemaIcon = L.MakiMarkers.icon({
                icon: "cinema",
                color: "#d35400",
                size: "m"
            });

            var defaultIcon = L.MakiMarkers.icon({
                icon: "circle",
                color: "#1abc9c",
                size: "m"
            });


            _.each(rows, function(site){
                var icon;

                switch(site.type){
                    case 'Heritage Site':
                        icon = heritageIcon;
                        break;

                    case 'Museum':
                        icon = museumIcon;
                        break;

                    case 'Art Gallery':
                        icon = galleryIcon;
                        break;

                    case 'Theatre':
                        icon = theatreIcon;
                        break;

                    case 'Theatre Company':
                        icon = theatreIcon;
                        break;

                    case 'Cinema':
                        icon = cinemaIcon;
                        break;

                    default: 
                        icon = defaultIcon;
                        break;
                }

                markHeritageSite(site, icon);

            });



            function markHeritageSite(site, icon)
            {
                var text = '<strong><small>' + site.type + '</small></strong><h4>' + site.name + '</h4>';
                if(site.address){
                    text += '<p>' + site.address + '</p>';
                }

                L.marker([site.lat, site.lon], {icon: icon}).addTo(heritageMap)
                    .bindPopup(text);
            }

            
        });
    

        $(document).ready(function(){
            $('a.commute-time-map-switch').on('click', function(e){
                e.preventDefault();

                if($(this).hasClass('active')){
                    return false;
                };

                var isochroneToView = $(this).data('commutelocation');

                aa.commuteMap.removeLayer(aa.visibleIsochroneLayer);
                
                if(isochroneToView === 'tuam'){

                    aa.visibleIsochroneLayer = aa.tuamIsochroneLayer;
                    var title = 'Tuam';
                    aa.addIsochroneLegend(title, aa.tuamIsochroneLegendLabels, aa.tuamIsochroneLegendColours);
                                    
                }else{
                    aa.visibleIsochroneLayer = aa.galwayIsochroneLayer;                    
                    var title = 'Galway City';
                    aa.addIsochroneLegend(title, aa.galwayIscochroneLegendLabels, aa.galwayIscochroneLegendColours);                    
                }

                aa.commuteMap.addLayer(aa.visibleIsochroneLayer);

                
                $('a.commute-time-map-switch').removeClass('active');
                $(this).addClass('active');


            });
        });
    