

$(function () 
{


  // 
  // --------------------------------------
  // Event management
  // --------------------------------------

      // Show table click event set up differently
      // for the HBS template...
      $('section.row').on('click', '.show-data-table', function(e){
          e.preventDefault();
          var $this = $(this);
          var wrap = $(this).parents('section').find('.data-table-wrapper');
          
          if($(wrap).hasClass('sr-only')){
              $this.find('span').text('Hide data table');
              $(wrap).removeClass('sr-only').hide().slideDown('slow');
          }else{
              $this.find('span').text('Show data table');
              $(wrap).slideUp('slow').addClass('sr-only');
          }
          
      });
          

      // add a panel to mini-compare UI
      $('#map').on('click', '.quick-compare', function(e) {
          
          e.preventDefault();

          var areaId = $(this).data('areaid');
          var visType = $(this).data('vistype');

          var features = aa.geoJson.features;
          var district;

          $.each(features, function(i, o){
              switch(visType){
                case 'municipal-district': 
                  if(o.properties.ID == areaId){
                      district = o.properties;                      
                      return false;
                  }
                  break;
                case 'small-area': 
                  if(o.properties.SMALL_AREA == areaId){
                      district = o.properties;
                      return false;
                  }
                  break;
                default:
                  if(o.properties.CSOED == areaId){
                      district = o.properties;
                      return false;
                  }
                  break;
                
              }
              
          });
          
              
          if(visType !== 'municipal-district'){
            district.avgEdVacancyRate = aa.populationUi.getEdAvgVacancyRate();
          }

          district.areaId = areaId;
          district.visType = aa.visType;

          var html = hbsCompareTemplate(district);    
          aa.compareAreas.display(html, district, areaId);
      });

      // remove a panel from the mini-compare UI
      $('#compare-row').on('click', 'a.remove-compare', function(e){

         aa.compareAreas.removeFromDisplay(e, this);

      });

      
      $('#housing-stock').on('click', 'a#map-vacancy-rate-link', function(e){
          
          e.preventDefault();
          aa.populationUi.addVacancyRateMapLayer();
          aa.populationUi.afterMapUiUpdate();

      });

      // 
      // Industry map view controls
      // 
      $('#industry-map-refine-view-controls').hide();

      // toggle the refine map display controls
      $('a.toggle-industry-map-refine-view-controls').on('click', function(e){
          e.preventDefault();
          $('#industry-map-refine-view-controls').slideToggle('slow', function(){

            if($('#industry-map-refine-view-controls').is(":visible")){
              $('a.toggle-industry-map-refine-view-controls').find('span').text('Hide');
            }else{
              $('a.toggle-industry-map-refine-view-controls').find('span').text('Show');
            }  
          });
      });

      // 
      // Toggle between total & relative company map views
      // 
      $('input[name="companyMapViewType"]').on('change', function(){
        var selected = $(this).attr('value');
        if(selected == 'totalCompanies'){
          aa.populationUi.addCompanyCountLayer();
        }else if(selected == 'populationAdjustedCompanies'){
          aa.populationUi.addCompanyCountPopulationLayer();
        }
      });

      // 
      // Filter map view based on NACE checkbox
      //
      $('input.filterCompanies').on('change', function(){
        
        // update the map filter
        aa.populationUi.updateFilterCompanyCheckboxes();

      });

      $('a#resetFilterCompanies').on('click', function(e){
          e.preventDefault();
          
          var areChecked = $(this).hasClass('checked');

          $('input.filterCompanies').each(function(){
            $(this).prop('checked', !areChecked);
          });

          // update link text & status class
          if(!areChecked){
              $(this).find('span').text('Uncheck');
              $(this).removeClass('unchecked').addClass('checked');
          }else{
              $(this).find('span').text('Check');
              $(this).removeClass('checked').addClass('unchecked');
          }  

          // update the map filter
          aa.populationUi.updateFilterCompanyCheckboxes();

      });


      // Map industry data
      $('#industry').on('click', 'a.display-on-map', function(e){
          
          e.preventDefault();
          aa.populationUi.addCompanyCountLayer();
          aa.populationUi.afterMapUiUpdate();

          // re-show the controls for the industry 
          // map
          $('#industry-map-refine').show();

      });

      // Map population data
      $('#population').on('click', 'a.display-on-map', function(e){
          
          e.preventDefault();
          aa.populationUi.addPopulationLayer();
          aa.populationUi.afterMapUiUpdate();

          // re-show the controls for the industry 
          // map
          $('#industry-map-refine').hide();

      });

  //
  // ---------------------------------------------
  // Template Management (Handlebars related)
  // ---------------------------------------------
  //
    // HBS Mini-compare template setup
    if($('#compare-template').length > 0){
      var hbsCompareSource   = $("#compare-template").html();
      var hbsCompareTemplate = Handlebars.compile(hbsCompareSource);
    }

    
    /**
     * HBS helper to compare a value with an average
     * and output a green/red icon depending on which
     * is higher
     * 
     * @param  float value
     * @param  float avg   
     * @return string $html
     */
    Handlebars.registerHelper('rank_vacancy_rate', function(value, avg) {
        
        value = Handlebars.Utils.escapeExpression(value)
        avg = parseInt(Handlebars.Utils.escapeExpression(avg));
        var roundedValue = parseInt(value);


        if( roundedValue <= avg){
            return new Handlebars.SafeString( value + '% <span class="label label-success"><i class="glyphicon glyphicon-ok-sign"></i></span> (Avg.: ~'+ avg + '%)');      
        }else{
            return new Handlebars.SafeString( value + '% <span class="label label-danger"><i class="glyphicon glyphicon-warning-sign"></i></span> (Avg.: ~'+ avg + '%)' );
        }
      
    });


    /**
     * HBS helper to calculate and display the population
     * density for an area
     * 
     * @param  int population 
     * @param  float land_area  
     * @return string $html
     */
    Handlebars.registerHelper('population_density', function(population, land_area) {
        
        population = parseFloat(Handlebars.Utils.escapeExpression(population));
        land_area  = parseFloat(Handlebars.Utils.escapeExpression(land_area));

        pop_density = (population / land_area);

        // return new Handlebars.SafeString( pop_density.toFixed(2) + ' <br/>(population per <strong>unit</strong><sup>2</sup>)');            
        return new Handlebars.SafeString( 'XXX.XX <br/>(population per <strong>unit</strong><sup>2</sup>)');            
    });

    /**
     * HBS helper to total the number of companies held in the "analysis" 
     * geojson property. 
     * 
     * @uses underscore
     * 
     * @param  array items 
     * @return integer
     */
    Handlebars.registerHelper('get_total_companies', function(items){

      var sum = 0;

      var sum = _.reduce(items, function(c, items){         
          return +items.count + c; 
        }, 0);

       return new Handlebars.SafeString( sum + ' companies' );
    });

    /**
     * HBS helper to total the number of sectors with companies in the "analysis" 
     * geojson property. 
     * 
     * @uses underscore
     * 
     * @param  array items 
     * @return integer
     */
    Handlebars.registerHelper('get_total_sectors', function(items){

      var sum = 0;      
      var sum = _.reduce(items, function(c, items){        
          if( +items.count > 0){
            return ++c;
          }
          return c; 

        }, 0);

       return new Handlebars.SafeString( sum + ' sectors' );
    });

    /**
     * HBS helper to calculate and display total
     * housing stock
     * 
     * @param  array items
     * @return string $html
     */
    Handlebars.registerHelper('total_housing_stock', function(items) {
      var total = 0;

      for(var i=0, l=items.length; i<l; i++) {
        total += +items[i].properties.HS2011;
      }

      return total.toLocaleString();
    });

    /**
     * Create a data table showing housing stock related data
     * from the geojson file
     * 
     * @param  array items
     * @return string html
     */
    Handlebars.registerHelper('housing_stock_data_list', function(items) {
      var html = '';

      for(var i=0, l=items.length; i<l; i++) {
            
            html += '<tr><th scope="row">'+ items[i].properties.EDNAME + '</th>';
            html += '<td>'+ items[i].properties.HS2011 + '</td>';
            html += '<td>'+ items[i].properties.PPOCC2011 + '</td>';
            html += '<td>'+ items[i].properties.VACANT2011 + '</td>';
            html += '<td>'+ items[i].properties.UNOCC2011 + '</td>';
            html += '<td>'+ items[i].properties.PCVAC2011 + '%</td></tr>';
        }

      return new Handlebars.SafeString( html );
    });



    Handlebars.registerHelper('display_data_table', function(items) {
      var html = '';
      
      if(typeof items == 'undefined'){
        return html;
      }

      for(var i=0, l=items.length; i<l; i++) {
            
            html += '<tr><th scope="row" data-variable="{{ items[i].variable }}">'+ items[i].variable_name + '</th>';
            html += '<td>'+ items[i].total_count + '</td></tr>';
        }

      return new Handlebars.SafeString( html );
    });



});


//
// ---------------------------------------------
// Application related
// ---------------------------------------------
//
aa.populationUi = {

    // the geoJson layer attached to the map
    visGeoJson: false,

    visibleLegend: false,

    cleanMapUi: function()
    {
      if(this.visibleLegend !== false){
        map.removeControl(this.visibleLegend);
      }

      if(this.visGeoJson !== false){
        map.removeLayer(this.visGeoJson);
      }

      return;
    },

    /**
     * Handle any events needed once a map
     * update has occurred
     * 
     * @return void
     */
    afterMapUiUpdate: function()
    {
      $('#industry-map-refine').hide();

      $('html, body').animate({
        scrollTop: $("#map").offset().top
      }, 1000);

    },

    /**
     * Display the UI data panels 
     * 
     * @return {[type]} [description]
     */
    displayUiPanels: function()
    {
        // main panel UI template setup
        var hbsMainPanelUiSource = $('#main-panel-ui').html();
        var hbsMainPanelUiTemplate = Handlebars.compile(hbsMainPanelUiSource);

        
        $('#families-by-size').html( hbsMainPanelUiTemplate( aa.families_by_size) );
        $('#families-by-cycle').html( hbsMainPanelUiTemplate( aa.families_by_cycle) );
       
        $('#ethnicity').html( hbsMainPanelUiTemplate( aa.ethnicity) );
       
        $('#irish-language-ability').html( hbsMainPanelUiTemplate( aa.irish_language_ability) );
        $('#irish-language-location').html( hbsMainPanelUiTemplate( aa.irish_language_location) );
        $('#irish-language-frequency').html( hbsMainPanelUiTemplate( aa.irish_language_frequency) );
        
        $('#households-by-accom').html( hbsMainPanelUiTemplate( aa.accommodation_type) );
        $('#accommodation-year-built').html( hbsMainPanelUiTemplate( aa.accommodation_year_built) );
        $('#households-by-occupancy').html( hbsMainPanelUiTemplate( aa.households_by_occupancy) );
        
        $('#principal-status').html( hbsMainPanelUiTemplate( aa.principal_status) );
        $('#social-class').html( hbsMainPanelUiTemplate( aa.social_class) );
        
        $('#education-age-ceased').html( hbsMainPanelUiTemplate( aa.education_age_ceased) );
        $('#education-field-study').html(hbsMainPanelUiTemplate( aa.education_field_study));
        $('#education-highest-level').html(hbsMainPanelUiTemplate( aa.education_highest_level));
        
        $('#commuting-travel-type').html(hbsMainPanelUiTemplate( aa.commuting_travel_type));
        $('#commuting-time-leaving').html(hbsMainPanelUiTemplate( aa.commuting_time_leaving));
        $('#commuting-journey-time').html(hbsMainPanelUiTemplate( aa.commuting_journey_time));

        $('#disability-age').html(hbsMainPanelUiTemplate( aa.disability_age));
        $('#disability-carers-hours').html(hbsMainPanelUiTemplate( aa.disability_carers_hours));
        $('#population-health').html(hbsMainPanelUiTemplate( aa.population_health));

        $('#occupation').html(hbsMainPanelUiTemplate( aa.occupation));
        $('#cso-industry').html(hbsMainPanelUiTemplate( aa.cso_industry));
        
        $('#household-pc').html(hbsMainPanelUiTemplate( aa.household_pc));
        $('#household-internet').html(hbsMainPanelUiTemplate( aa.household_internet));


    },

    
    /**
     * Set a value for the CSOED with the largest
     * population size. Used to ensure comparable 
     * axes in the mini-compare UI
     * 
     * @return int
     */
    getEdMaxPopulation: function()
    {
        if( typeof aa.maxEdValue == 'undefined'){
            
            // need to determine which has the higher value across both
            // datasets => this is what the top range on the 
            // barchart needs to be:
            var maxMale     = d3.max(aa.geoJson.features, function(d){ return +d.properties.MALE2011; });
            var maxFemale   = d3.max(aa.geoJson.features, function(d){ return +d.properties.FEMALE2011; });
            
            if(maxMale >= maxFemale){
                aa.maxEdValue = maxMale;    
            }else{
                aa.maxEdValue = maxFemale;    
            }
        }

        return aa.maxEdValue;
    },

    /**
     * Calculate the average vacancy rate across
     * all ED's using PCVAC2011 (%)
     * 
     * @return float 
     */
    getEdAvgVacancyRate: function()
    {
        if(typeof aa.avgEdVacancyRate == 'undefined'){
            var avg = 0;
            var runningTotal = 0;

            $.each(aa.geoJson.features, function(i, o){
                runningTotal += +o.properties.PCVAC2011;
            });

            avg = (runningTotal / aa.geoJson.features.length);

            aa.avgEdVacancyRate = avg.toFixed(2);
        }

        return aa.avgEdVacancyRate;
    },

    /**
     * Calculate the total housing stock (PPOCC2011)
     * across all ED's
     * 
     * @return integer
     */
    getEdTotalHousingStock: function()
    {
        if( typeof aa.totalEdHousingStock == 'undefined'){
            
            var sum = _.reduce(aa.geoJson.features, function(memo, item){ return memo + (+item.properties.PPOCC2011)}, 0);
            aa.totalEdHousingStock = sum;
        }

        return aa.totalEdHousingStock;
    },

    /**
     * Create and display the Housing Stock 
     * template for ED's. Data is taken from the
     * GeoJson file, which is why it's dealt with
     * through JS
     * 
     * @return void
     */
    displayHousingStockTemplate: function()
    {
        if($('#housing-stock').length){
            var hbsHousingStockSource   = $("#housing-stock-template").html();
            var hbsHousingStockTemplate = Handlebars.compile(hbsHousingStockSource);
            var housingStockData = aa.geoJson.features;
            
            var hbsHousingStockHtml = hbsHousingStockTemplate({data: housingStockData, avg: aa.populationUi.getEdAvgVacancyRate() });

            $('#housing-stock').append(hbsHousingStockHtml);   
        }
    },

    displayHousingStockChart: function(data)
    {
        var options = {
            width: $('#housing-stock-chart').width() - 2,
            height: $('#housing-stock-chart').height()

        };
        
        // console.log(data);
        // data = _.sortBy(data, function(d){console.log(d.PCFULL2011); return +d.PCFULL2011; });

        aa.bar_stacked_normalised('#housing-stock-chart', data, options);
    },

    // Map vacancy rates
    addVacancyRateMapLayer: function()
    {
        this.cleanMapUi();

        this.visGeoJson = L.geoJson(aa.geoJson, { 
            style: aa.populationUi.vacancyStyle,
            onEachFeature: aa.populationUi.onEachVacancyFeature
        }).addTo(map);

        var intervals = [35, 30, 25, 20, 15, 10, 5];
        aa.populationUi.addPercentageLegend(intervals);

    },

    onEachVacancyFeature: function(feature, layer) 
    {

        var title = layer.feature.properties.EDNAME;        
        var countText = '<br/> Vacancy Rate: ' + layer.feature.properties.PCVAC2011 + ' %';          

        areaId = aa.populationUi.drawPopup(title, feature, layer, countText);

        // Pan to the selected area
        if(areaId == aa.areaId){
            var newCenter = _.first(_.flatten(layer.feature.geometry.coordinates), 2);
            map.panTo(new L.LatLng(newCenter[1], newCenter[0]));
        }
    }, 

    // update the colour of a region depending
    // on the number given (allows heatmap style
    // effect on regions)
    getVacancyChloroplethColour: function(d) 
    {
        
        d = parseInt(d);

        return  d >= 35 ? '#99000d' : 
                d >= 30 ? '#cb181d' : 
                d >= 25 ? '#ef3b2c' : 
                d >= 20 ? '#fb6a4a' : 
                d >= 15 ? '#fc9272' : 
                d >= 10 ? '#fcbba1' :
                d >= 5 ?  '#fee5d9' :
                         '#fff'; 

    },

    vacancyStyle: function(feature)
    {
        return {
            fillColor: aa.populationUi.getVacancyChloroplethColour( feature.properties.PCVAC2011 ),
            weight: 1,
            opacity: 1,
            color: '#d35400',
            dashArray: '3',
            fillOpacity: 0.8
        };
    },

    addPercentageLegend: function(intervals)
    {
        this.visibleLegend = L.control({position: 'bottomleft'});

        this.visibleLegend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            div.innerHTML += '<h5>Vacancy Rates</h5><i style="width: 18px; height: 18px; display: inline-block; background-color:' + aa.populationUi.getVacancyChloroplethColour( _.first(intervals) ) + '"></i> >' + _.first(intervals) + '% <br/>';

            for (var i = 1; i < intervals.length; i++) {                
                div.innerHTML += '<i style="width: 18px; height: 18px; display: inline-block; background-color:' + aa.populationUi.getVacancyChloroplethColour(intervals[i]) + '"></i> ' +                  
                     (intervals[i + 1] ? intervals[i] +'% &ndash; ' + (intervals[i - 1] - 1) + '% <br>' :  intervals[i] + '+%');
            }

            div.innerHTML += '<p class="help-block"><small><strong>Note</strong>: Click areas on the map to view more detail</small></p>';
            
            return div;
        };

        this.visibleLegend.addTo(map);
    },


    updateFilterCompanyCheckboxes: function()
    {
        $('input:radio[name=companyMapViewType]:nth(0)').attr('checked','checked');

        var x = $('.filterCompanies:checked');
        var values = [];
        $.each(x, function(id, obj){
          values.push($(obj).attr('value'));
        });
        
        var filteredData = aa.populationUi.filterCompanies(values);
        aa.populationUi.addCompanyCountLayer(filteredData); 
    },


    /**
     * Handle checkbox filters 
     * @param  {[type]} visibleNaceCodes [description]
     * @return {[type]}                  [description]
     */
    filterCompanies: function(visibleNaceCodes)
    {
      $.each(aa.geoJson.features, function(id, value){

        if( typeof value.properties.analysis !== 'undefined'){
          $.each(value.properties.analysis, function(id, v){
                            
              v.is_visible = false;            

              // if it's a match, change visibility
              if( _.indexOf(visibleNaceCodes, v.type) !== -1 ){                
                v.is_visible = true;
              }
          });
        }
      });

      return aa.geoJson;
    },


    addPopulationLayer: function(data)
    {

      if(typeof data == 'undefined' || data === false){
        data = aa.geoJson;
      }

      this.cleanMapUi();
      
      this.visGeoJson = L.geoJson(data, { 
            style: this.stylePopulationCount,
            onEachFeature: this.onEachPopulationFeature
      }).addTo(map);
      
      var intervals = this.getPopulationIntervals();
      
      aa.populationUi.addNumericLegend(intervals, 'Population of the Area', aa.populationUi.getPopulationColour);

    },

    /**
     * Add Chloropleth layer showing number of companies
     * 
     * @param data
     */
    addCompanyCountLayer: function(data)
    {

      if(typeof data == 'undefined' || data === false){
        data = aa.geoJson;
      }

      this.cleanMapUi();
      
      this.visGeoJson = L.geoJson(data, { 
            style: this.style,
            onEachFeature: this.onEachCompanyFeature
      }).addTo(map);
      
      var intervals = this.getCompanyCountIntervals();
      
      aa.populationUi.addNumericLegend(intervals, 'Number of Companies', aa.populationUi.getColour);

    },

    addCompanyCountPopulationLayer: function(data)
    {
      if(typeof data == 'undefined' || data === false){
        data = aa.geoJson;
      }

      this.cleanMapUi();
      
      this.visGeoJson = L.geoJson(data, { 
            style: this.styleRelativeCompanyCount,
            onEachFeature: this.onEachCompanyPopulationFeature
      }).addTo(map);      

      var intervals = this.getCompanyCountIntervals();
      aa.populationUi.addNumericLegend(intervals, 'Companies relative to population <br/><small>(Per 1000 people)</small>', aa.populationUi.getColour);

    },

    getCompanyCountIntervals: function()
    {
      if(aa.visType == 'municipal-district'){
        intervals = [1400, 1300, 1200, 1100, 1000, 900];
      }else{
        intervals = [150, 125, 100, 75, 50, 25, 5];
      }
      return intervals;
    },

    getPopulationIntervals: function()
    {
    
      if(aa.visType == 'municipal-district'){
        intervals = [70000, 60000, 50000, 40000, 30000, 20000, 10000];
      }else{
        intervals = [7500, 5000, 2500, 1000, 500, 250, 100];
      }

      return intervals;
    },

    onEachCompanyFeature: function(feature, layer) 
    {

        var title = layer.feature.properties.EDNAME;
        var countText = ': ' + aa.populationUi.countVisibleCompanies(layer.feature.properties.analysis) + ' companies';
        
        areaId = aa.populationUi.drawPopup(title, feature, layer, countText);

        // Pan to the selected area
        if(areaId == aa.areaId){
            var newCenter = _.first(_.flatten(layer.feature.geometry.coordinates), 2);
            map.panTo(new L.LatLng(newCenter[1], newCenter[0]));
        }
    }, 

    onEachPopulationFeature: function(feature, layer) 
    {

        var title = layer.feature.properties.EDNAME;
        var countText = ': ' + layer.feature.properties.TOTAL2011 + ' people';
        
        areaId = aa.populationUi.drawPopup(title, feature, layer, countText);

        // Pan to the selected area
        if(areaId == aa.areaId){
            var newCenter = _.first(_.flatten(layer.feature.geometry.coordinates), 2);
            map.panTo(new L.LatLng(newCenter[1], newCenter[0]));
        }
    },    


    drawPopup: function(title, feature, layer, countText)
    {
        var popupContent = '<strong>' + title + '</strong>';

        var re = /\//g,
            areaId,
            urlIdSegment;

        // Small Areae
        if(typeof layer.feature.properties.SMALL_AREA !== 'undefined'){
          areaId = layer.feature.properties.SMALL_AREA;
          urlIdSegment = '/' + aa.visType + '/' + layer.feature.properties.SMALL_AREA.replace(re, '-');  
        }
        // Electoral Division
        else if(typeof layer.feature.properties.CSOED !== 'undefined'){
          areaId = layer.feature.properties.CSOED;
          urlIdSegment = '/' + aa.visType + '/' + layer.feature.properties.CSOED.replace(re, '-');  
        // Municpal District
        }else if(typeof layer.feature.properties.ID !== 'undefined'){
          areaId = layer.feature.properties.ID;
          urlIdSegment = '/' + aa.visType + '/' + layer.feature.properties.ID;  
        }
        
        popupContent += countText;            
        
        popupContent += '<ul style="text-align: left; padding-left: 1em; margin-top: .5em;">'+ 
          '<li><a href="#" class="quick-compare" id="compare-' + areaId +'" data-vistype="'+ aa.visType +'" data-areaid="'+ areaId +'">Add to Quick Compare</a></li>'+
          '<li><a href="' + urlIdSegment +'">Detailed Data View</a></li></ul>';
      

        layer.bindPopup(popupContent);
        
        return areaId;

    },

    onEachCompanyPopulationFeature: function(feature, layer) 
    {
        

        var totalPopulation = layer.feature.properties.TOTAL2011;
        var normalisedCompanyCount = aa.populationUi.countVisibleCompaniesPopulation(layer.feature.properties.analysis, totalPopulation)
        
        var popupContent = '<strong>' + layer.feature.properties.EDNAME + '</strong>:';
        popupContent += '<br/>Companies relative to population ' +  normalisedCompanyCount;            
        

        var re = /\//g;
        var urlIdSegment = layer.feature.properties.CSOED.replace(re, '-');
        popupContent += '<ul style="text-align: left; padding-left: 1em; margin-top: .5em;"><li><a href="#" class="quick-compare" id="compare-' + layer.feature.properties.CSOED +'" data-csoed="'+ layer.feature.properties.CSOED +'">Add to Quick Compare</a></li><li><a href="/electoral-division/' + urlIdSegment +'">Detailed Data View</a></li></ul>';

        layer.bindPopup(popupContent);            

    },

    addNumericLegend: function(intervals, title, colour, theMap)
    {
        var mapToUse = theMap || map;
        
        this.visibleLegend = L.control({position: 'bottomleft'});

        this.visibleLegend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            div.innerHTML += '<h5>' + title + 
                    '</h5><i style="width: 18px; height: 18px; display: inline-block; background-color:' 
                    + colour( _.first(intervals) ) + '"></i> >' 
                    + _.first(intervals) + ' <br/>';

            for (var i = 1; i < intervals.length; i++) {                
                div.innerHTML += '<i style="width: 18px; height: 18px; display: inline-block; background-color:' + colour(intervals[i]) + '"></i> ' +                  
                     (intervals[i + 1] ? intervals[i] +' &ndash; ' + (intervals[i - 1] - 1) + ' <br>' :  intervals[i] + '+');
            }

            div.innerHTML += '<p class="help-block"><small><strong>Note</strong>: Click areas on the map to view more detail</small></p>';
            return div;
        };

        this.visibleLegend.addTo(mapToUse);
    },

    // update the colour of a region depending
    // on the number given (allows heatmap style
    // effect on regions)
    getColour: function(d) 
    {

      if(aa.visType == 'municipal-district')
      { 
        // 1400, 1300, 1200, 1100, 1000, 900
          return d >= 1400 ? '#99000d' : 
                d >= 1300 ? '#cb181d' : 
                d >= 1200 ? '#ef3b2c' : 
                d >= 1100 ? '#fb6a4a' : 
                d >= 900 ? '#fc9272' :
                d >= 700 ? '#fcbba1' : 
                d >= 500 ?  '#fee5d9' :
                         '#fff'; 
      }else{      

        return  d >= 150 ? '#99000d' : 
                d >= 125 ? '#cb181d' : 
                d >= 100 ? '#ef3b2c' : 
                d >= 75 ? '#fb6a4a' : 
                d >= 50 ? '#fc9272' :
                d >= 25 ? '#fcbba1' : 
                d >= 5 ?  '#fee5d9' :
                         '#fff'; 
      }

    },

    getPopulationColour: function(d) 
    {

      if(aa.visType == 'municipal-district')
      { 
          return d >= 70000 ? '#99000d' : 
                d >=  60000? '#cb181d' : 
                d >=  50000? '#ef3b2c' : 
                d >=  40000? '#fb6a4a' : 
                d >=  30000 ? '#fc9272' :
                d >=  20000 ? '#fcbba1' : 
                d >=  10000 ?  '#fee5d9' :
                         '#fff'; 
      }else{      


        return  d >= 7500 ? '#99000d' : 
                d >= 5000 ? '#cb181d' : 
                d >= 2500 ? '#ef3b2c' : 
                d >= 1000 ? '#fb6a4a' : 
                d >= 500 ? '#fc9272' :
                d >= 250 ? '#fcbba1' : 
                d >= 100 ?  '#fee5d9' :
                         '#fff'; 
      }

    },


    // update the colour of a region depending
    // on the number given (allows heatmap style
    // effect on regions)
    getRelativeColour: function(d) 
    {
        d = parseInt(d);

        return  d >= 150 ? '#99000d' : 
                d >= 125 ? '#cb181d' : 
                d >= 100 ? '#ef3b2c' : 
                d >= 75 ? '#fb6a4a' : 
                d >= 50 ? '#fc9272' :
                d >= 25 ? '#fcbba1' : 
                d >= 5 ?  '#fee5d9' :
                         '#fff'; 

    },

    countVisibleCompanies: function( sector_breakdown )
    {
        if(typeof sector_breakdown === 'undefined'){
             return 0;
        }

        var total = 0;
        $.each(sector_breakdown, function(id, value){
          if(value.is_visible !== false){
            total += parseInt(value.count);
          }
        });

        return total;
    },

    countVisibleCompaniesPopulation: function(sector_breakdown, totalPopulation)
    { 
      if(typeof sector_breakdown === 'undefined'){
             return 0;
        }

        var total = 0;
        $.each(sector_breakdown, function(id, value){
            total += parseInt(value.count);
        });

        var num = (total / totalPopulation) * 1000;
        num = Math.floor(num);
        return num;
    },

    style: function(feature){
        return {
            fillColor: aa.populationUi.getColour(aa.populationUi.countVisibleCompanies(feature.properties.analysis)),
            weight: 1,
            opacity: 1,
            color: '#d35400',
            dashArray: '3',
            fillOpacity: 0.8
        };
    },

    styleRelativeCompanyCount: function(feature){
        return {
            fillColor: aa.populationUi.getRelativeColour(
              aa.populationUi.countVisibleCompaniesPopulation(feature.properties.analysis, feature.properties.TOTAL2011)),
            weight: 1,
            opacity: 1,
            color: '#d35400',
            dashArray: '3',
            fillOpacity: 0.8
        };
    },

    stylePopulationCount: function(feature){
        return {
            fillColor: aa.populationUi.getPopulationColour(feature.properties.TOTAL2011),
            weight: 1,
            opacity: 1,
            // color: '#d35400',
            color: '#fff',
            dashArray: '3',
            fillOpacity: 0.8
        };
    }
}

// functions to handle the mini-compare UI
aa.compareAreas = {

    /**
     * Create and add a mini-compare panel to the UI for the 
     * selected Electoral District
     * 
     * @param  string html - compiled Handlebars template
     * @param  object data - the geojson properties for the selected ED
     * @return void
     */
    display: function( html, data, areaId)
    {

        // does it already have a panel for this area?
        if( $('#compare-row').has('#compare-' + areaId).length > 0){
            return false;
        }

        $('#compare-row').append(html);   

        var columnChartData;

        if(!data.MALE2011){
          columnChartData = 
            [{
                'variable_name': 'Population',
                'total_count': data.TOTAL2011
            }];
        }else{
          columnChartData = 
            [{
                'variable_name': 'Male',
                'total_count': data.MALE2011
            },
            {   
                'variable_name': 'Female',
                'total_count': data.FEMALE2011
            }];
        }

        var elPopulationGender = '#compare-' + areaId + '-population-gender';

        aa.columnchart( elPopulationGender, columnChartData, 
            {
                width: $(elPopulationGender).width(), 
                height: $(elPopulationGender).height(),
                margin: {
                    top: 12,
                    right: 20,
                    left: 45,
                    bottom: 50
                },
                maxValue: aa.populationUi.getEdMaxPopulation()
            }
        );

    },

    /**
     * Remove a mini-compare panel from the UI
     * 
     * @param  event event - a click event
     * @param  element element - the "remove" link clicked
     * @return void
     */
    removeFromDisplay: function(event, element)
    {
        event.preventDefault();
        $(element).parents('.compare-block').fadeOut(750, function(){
            setTimeout($(this).empty().remove(), 750);
        });
    }
}