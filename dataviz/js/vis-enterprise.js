aa.enterpriseMap = null;

$(document).ready(function(){
        
        aa.enterpriseMap = new L.Map('enterprise-map', {
            center: new L.LatLng(53.408, -9.128),
            zoom: 9,
            scrollWheelZoom: false,
        });

        L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
            minZoom: 8,
            maxZoom: 14,
            noWrap: true,
            attribution: '<a href="http://twitter.com/davkell">@davkell</a> | Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(aa.enterpriseMap);


        

        $.get('data/data-enterprise.json', function(dataset){

            // need max value so multiple charts have the same axis
            var maxEntrep = 0;
            _.each(dataset.entrepreneurship, function(el, ind, list){
                var m = _.max(el.data, function(d){ return d.total_count; });
                if(m.total_count > maxEntrep){
                    maxEntrep = m.total_count;
                }
            });

            // Draw set of entrepreneurship charts
            _.each(dataset.entrepreneurship, function(el, ind, list){
                var chartId = '#' + el.chart_id;
                aa.barchart(chartId, el.data, 
                    {
                        width: $(chartId).width(), 
                        height: $(chartId).height(),
                        margin: {
                            top: 12,
                            right: 20,
                            left: 60,
                            bottom: 10
                        },
                        bar_labels: true,
                        bar_label_suffix: '%',
                        maxValue: maxEntrep
                    }
                );
            });


            // ei-hpsu-chart
            // 
            aa.columnchart('#ei-hpsu-chart', dataset.hpsus, 
                {
                    width: $('#ei-hpsu-chart').width(), 
                    height: $('#ei-hpsu-chart').height(),
                    margin: {
                        top: 12,
                        right: 100,
                        left: 100,
                        bottom: 30
                    },
                    y_axis_label: 'Number of Companies'
                }
            );


            // BMW Research & Development Expenditure
            $('#bmw-rnd-expenditure-chart').highcharts(
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
                    categories: dataset.rnd_expenditure.bmw.years
                },
                yAxis: {
                    min: 0,
                    max: 1475244000,
                    title: {
                        text: 'Business Expenditure on Research and Development by Region'
                    }                    
                },
                legend: {
                    enabled: false                  
                },
                labels: {
                    format: '€{point.y:,.0f}'
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
                    column: {
                        stacking: 'normal'                       
                    }
                },
                series: dataset.rnd_expenditure.bmw.series
            });            

            // BMW Research & Development Expenditure
            $('#se-rnd-expenditure-chart').highcharts(
            {
                chart: {
                    type: 'column'                  
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: dataset.rnd_expenditure.se.years
                },
                yAxis: {
                    min: 0,
                    max: 1475244000,
                    title: {
                        text: 'Business Expenditure on Research and Development by Region'
                    }
                },
                legend: {
                    enabled: false                    
                },
                labels: {
                    format: '€{point.y:,.0f}'
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + ' ' + this.series.name + '</b><br/>' +
                           '<strong>' + this.y + '</strong><br/>' +
                            'Total: ' + this.point.stackTotal;
                    },
                    pointFormat: '€{point.y:,.0f}',
                    style: {
                        maxWidth: '200px'                        
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'                        
                    }
                },
                series: dataset.rnd_expenditure.se.series
            });


            // BMW Research & Development Staff
            var bmwRnd = _.where(dataset.bmw_rnd_personnel, { area: 'Border, Midland and Western' });
            var seRnd = _.where(dataset.bmw_rnd_personnel, { area: 'Southern and Eastern' });

            var rndMaxPersonnelValArr = [];

            _.each(dataset.bmw_rnd_personnel, function(region){                            
                var regionMax = _.max(region.data, function(value, key, list){                    
                    return +value;                
                });    
                rndMaxPersonnelValArr.push(+regionMax);
            });
            var rndMaxPersonnelValue = _.max(rndMaxPersonnelValArr, function(value){ return +value; });
            
            var bmwRnd2007 = _.map(bmwRnd, function(value){
                return {
                    variable_name: value.job,
                    total_count: value.data.year_2007
                }            
            });
            var bmwRnd2009 = _.map(bmwRnd, function(value){
                return {
                    variable_name: value.job,
                    total_count: value.data.year_2009
                }            
            });
            var bmwRnd2011 = _.map(bmwRnd, function(value){
                return {
                    variable_name: value.job,
                    total_count: value.data.year_2011
                }            
            });

            var seRnd2007 = _.map(seRnd, function(value){
                return {
                    variable_name: value.job,
                    total_count: value.data.year_2007
                }            
            });
            var seRnd2009 = _.map(seRnd, function(value){
                return {
                    variable_name: value.job,
                    total_count: value.data.year_2009
                }            
            });
            var seRnd2011 = _.map(seRnd, function(value){
                return {
                    variable_name: value.job,
                    total_count: value.data.year_2011
                }            
            });

    //         // BMW RnD Personnel (3 trellis-style charts)
                aa.barchart('#bmw-rnd-personnel-chart-2007', bmwRnd2007, 
                {
                    width: $('#bmw-rnd-personnel-chart-2007').width(), 
                    height: $('#bmw-rnd-personnel-chart-2007').height(),
                    margin: {
                        top: 12,
                        right: 20,
                        left: 140,
                        bottom: 20
                    },
                    hide_y_axis: false,
                    bar_labels: true,
                    maxValue: rndMaxPersonnelValue
                });

                aa.barchart('#bmw-rnd-personnel-chart-2009', bmwRnd2009, 
                {
                    width: $('#bmw-rnd-personnel-chart-2009').width(), 
                    height: $('#bmw-rnd-personnel-chart-2009').height(),
                    margin: {
                        top: 12,
                        right: 20,
                        left: 10,
                        bottom: 20
                    },
                    hide_y_axis: true,
                    bar_labels: true,
                    maxValue: rndMaxPersonnelValue
                });

                aa.barchart('#bmw-rnd-personnel-chart-2011', bmwRnd2011, 
                {
                    width: $('#bmw-rnd-personnel-chart-2011').width(), 
                    height: $('#bmw-rnd-personnel-chart-2011').height(),
                    margin: {
                        top: 12,
                        right: 20,
                        left: 10,
                        bottom: 20
                    },
                    hide_y_axis: true,
                    bar_labels: true,
                    maxValue: rndMaxPersonnelValue
                });

                aa.barchart('#se-rnd-personnel-chart-2007', seRnd2007, 
                {
                    width: $('#se-rnd-personnel-chart-2007').width(), 
                    height: $('#se-rnd-personnel-chart-2007').height(),
                    margin: {
                        top: 12,
                        right: 20,
                        left: 140,
                        bottom: 20
                    },
                    hide_y_axis: false,
                    bar_labels: true,
                    maxValue: rndMaxPersonnelValue
                });

                aa.barchart('#se-rnd-personnel-chart-2009', seRnd2009, 
                {
                    width: $('#se-rnd-personnel-chart-2009').width(), 
                    height: $('#se-rnd-personnel-chart-2009').height(),
                    margin: {
                        top: 12,
                        right: 20,
                        left: 10,
                        bottom: 20
                    },
                    hide_y_axis: true,
                    bar_labels: true,
                    maxValue: rndMaxPersonnelValue
                });

                aa.barchart('#se-rnd-personnel-chart-2011', seRnd2011, 
                {
                    width: $('#se-rnd-personnel-chart-2011').width(), 
                    height: $('#se-rnd-personnel-chart-2011').height(),
                    margin: {
                        top: 12,
                        right: 20,
                        left: 10,
                        bottom: 20
                    },
                    hide_y_axis: true,
                    bar_labels: true,
                    maxValue: rndMaxPersonnelValue
                });
                
            

            

            // Add enterprise centres to the map
            _.each(dataset.centres, function(el, index, list){

                var eiCentreIcon = L.MakiMarkers.icon({
                    icon: "building",
                    color: "#48b",
                    size: "m"
                });

                var marker = L.marker([el.lat, el.lon], {icon: eiCentreIcon})
                            .addTo(aa.enterpriseMap);                
                
                var popupContent = '<strong><smalL>Enterprise Support</small><h4>' + el.name + '</h4><div><small>'+ el.address_1 + ', '+ el.town + ' | Phone: ' + el.phone + '</small><p>Number of client companies: ' + 
                                        el.client_companies 
                                    + '</p>'; 
                marker.bindPopup(popupContent);
            });


            var max2004 = _.max(dataset.bmw_employment.year_2004, function(d){ return +d.total_count; });
            var max2007 = _.max(dataset.bmw_employment.year_2007, function(d){ return +d.total_count; });
            var max2010 = _.max(dataset.bmw_employment.year_2010, function(d){ return +d.total_count; });
            var maxTotalEmploymentFigure = _.max([max2004, max2007, max2010], function(d){ return +d.total_count; });
//             console.log(maxTotalEmploymentFigure);

            // BMW region employment (3 trellis-style charts)
            aa.barchart('#bmw-employment-chart-2004', dataset.bmw_employment.year_2004, 
            {
                width: $('#bmw-employment-chart-2004').width(), 
                height: $('#bmw-employment-chart-2004').height(),
                margin: {
                    top: 12,
                    right: 20,
                    left: 240,
                    bottom: 40
                },
                hide_y_axis: false,
                bar_labels: true,
                maxValue: maxTotalEmploymentFigure.total_count
            });

            aa.barchart('#bmw-employment-chart-2007', dataset.bmw_employment.year_2007, 
            {
                width: $('#bmw-employment-chart-2007').width(), 
                height: $('#bmw-employment-chart-2007').height(),
                margin: {
                    top: 12,
                    right: 20,
                    left: 10,
                    bottom: 40
                },
                hide_y_axis: true,
                bar_labels: true,
                maxValue: maxTotalEmploymentFigure.total_count
            });

            aa.barchart('#bmw-employment-chart-2010', dataset.bmw_employment.year_2010, 
            {
                width: $('#bmw-employment-chart-2010').width(), 
                height: $('#bmw-employment-chart-2010').height(),
                margin: {
                    top: 12,
                    right: 20,
                    left: 10,
                    bottom: 40
                },
                hide_y_axis: true,
                bar_labels: true,
                maxValue: maxTotalEmploymentFigure.total_count
            });
            
            // Get the max value for use on the ida / ei employment chart axis
            var maxIda = _.max(dataset.ida_employment, function(d){ return +d.total_count; });
            var maxEi = _.max(dataset.ei_employment, function(d){ return +d.total_count; });

            var maxEmploymentFigure = maxIda.total_count;
            if(maxEi.total_count > maxEi.total_count){
                var maxEmploymentFigure = maxEi.total_count;
            }

            // IDA employment chart
            aa.linechart('#ida-employment-chart', dataset.ida_employment, 
                {
                    width: $('#ida-employment-chart').width(), 
                    height: $('#ida-employment-chart').height(),
                    margin: {
                        top: 12,
                        right: 20,
                        left: 60,
                        bottom: 40
                    },
                    maxValue: maxEmploymentFigure,
                    bar_label_suffix: ' people'
                }
            );

            // EI employment chart
            aa.linechart('#ei-employment-chart', dataset.ei_employment, 
                {
                    width: $('#ei-employment-chart').width(), 
                    height: $('#ei-employment-chart').height(),
                    margin: {
                        top: 12,
                        right: 20,
                        left: 60,
                        bottom: 40
                    },
                    maxValue: maxEmploymentFigure,
                    bar_label_suffix: ' people'
                }
            );



            // UDRAS employment chart
            aa.linechart('#udras-employment-chart', dataset.udras_employment, 
                {
                    width: $('#udras-employment-chart').width(), 
                    height: $('#udras-employment-chart').height(),
                    margin: {
                        top: 22,
                        right: 20,
                        left: 40,
                        bottom: 40
                    },
                    bar_label_suffix: ' people',

                }
            );

            
            var udrasProjectData, 
                udrasGrantData; 

            udrasProjectData = _.map(dataset.udras_projects, function(value, key, list){
            
                return {
                    variable_name: value.area,
                    total_count:   +value.number_projects 
                }
            
            });             

            aa.columnchart('#udras-projects-chart', udrasProjectData, 
            {   
                width: $('#udras-projects-chart').width(), 
                height: $('#udras-projects-chart').height(),
                margin: {
                    top: 12,
                    right: 20,
                    left: 60,
                    bottom: 50
                },
                y_axis_label: 'Number of Projects'
            });

            udrasGrantData = _.map(dataset.udras_projects, function(value, key, list){            
                return {
                    variable_name: value.area,
                    total_count:   +value.total_grants 
                }
            
            }); 

            aa.columnchart('#udras-grants-chart', udrasGrantData, 
            {   
                width: $('#udras-grants-chart').width(), 
                height: $('#udras-grants-chart').height(),
                margin: {
                    top: 22,
                    right: 20,
                    left: 60,
                    bottom: 50
                },
                y_axis_label: 'Total Grants (€)'                
            });


            // 
            // Unemployment
            // 
             // West live register
            $('#live-register-west-chart').highcharts(
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
                    categories: dataset.employment.live_register.west.periods
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Persons on Live Register'
                    }                    
                },
                legend: {
                    enabled: false                  
                },
                labels: {
                    format: '€{point.y:,.0f}'
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': <strong>' + this.y + '</strong><br/>' +
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
                series: dataset.employment.live_register.west.series
            }); 

            $('#live-register-state-chart').highcharts(
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
                    categories: dataset.employment.live_register.state.periods
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Persons on Live Register'
                    }                    
                },
                legend: {
                    enabled: false                  
                },
                labels: {
                    format: '€{point.y:,.0f}'
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': <strong>' + this.y + '</strong><br/>' +
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
                series: dataset.employment.live_register.state.series
            });            

            
            $('#live-register-west-age-allowance-chart').highcharts(
            {

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.employment.live_register_age.periods
                },
                yAxis: {
                    min:0,
                    title: {
                        text: 'Number of People'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: ' people'
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0
                },
                series: dataset.employment.live_register_age.jobseekers_allowance.series

            });

            $('#live-register-west-age-benefit-chart').highcharts(
            {

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.employment.live_register_age.periods
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of People'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: ' people'
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom',
                    borderWidth: 0
                },
                series: dataset.employment.live_register_age.jobseekers_benefit.series

            });

            $('#live-register-office-chart').highcharts(
            {

                title: {
                    text: ''                    
                },               
                xAxis: {
                    categories: dataset.employment.live_register_office.periods,
                    tickInterval: 4
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of People'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: ' people'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'right',
                    borderWidth: 0
                },
                series: dataset.employment.live_register_office.series

            });        



        }, 'json');
        

        // map electoral division level commercial data
        $.get('data/galway-electoral-divisions-company.json', function(data){
            
            // add commercial layer to map
            L.geoJson(data, { 
                style: aa.populationUi.style                
            }).addTo(aa.enterpriseMap);      

            var intervals = [150, 125, 100, 75, 50, 25, 5];
            aa.populationUi.addNumericLegend(intervals, 'Number of Companies', aa.populationUi.getColour, aa.enterpriseMap);
            
        },'json');    


    });


        // var industrialEstateMap = new L.Map('industrial-estates-map', {
        //     center: new L.LatLng(53.2877, -9.05004),
        //     zoom: 12,
        //     scrollWheelZoom: false,
        // });

        // L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
        //     minZoom: 7,
        //     maxZoom: 15,
        //     noWrap: true,
        //     attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        // }).addTo(industrialEstateMap);

        $.get('data/GCityIndEstates.json', function(data){
        
            L.geoJson(data, { 
                pointToLayer: markIndustrialEstates
            }).addTo(aa.enterpriseMap);          

        });

         function markIndustrialEstates(feat, ll)
        {            
            var commercialIcon = L.MakiMarkers.icon({
                icon: "commercial",
                color: "#b36",
                size: "m"
            });

            return L.marker(ll, {
                    icon: commercialIcon
                }
            ).addTo(aa.enterpriseMap)
             .bindPopup(
                '<strong><smalL>Industrial Estate</small></strong><h4>' + feat.properties.COMPANYNAM + '</h4>');
        }         

