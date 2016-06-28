'use strict';

//
// -----------------------------------------------
//  Handles drawing the various D3 charts needed
//  for the CSO datasets
//   
//------------------------------------------------

$(document).ready(function(){


    // remap the company type object keys to work
    // with D3 charting
    var companyTypesRemapped = [];

    // sort the companies by count first, then reverse (highest first for charting)
    var companyTypesSorted = _.sortBy(companyTypes, function(d){return d.count; });
    companyTypesSorted.reverse();

    _.each(companyTypesSorted, function(el, index){
        companyTypesRemapped.push({
            variable_name: el.label,
            total_count: el.count
        });
    });
    aa.industry_type = {
        data: companyTypesRemapped
    }; 
    
    aa.barchart('#industry-type-chart', aa.industry_type.data, 
    {
        width: $('#industry-type-chart').width(), 
        height: $('#industry-type-chart').height(),
        margin: {
            top: 12,
            right: 20,
            left: 320,
            bottom: 0
        }
    });



    aa.columnchart('#families-by-size-chart', aa.families_by_size.data, 
        {
            width: $('#families-by-size-chart').width(), 
            height: $('#families-by-size-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 160
            }
        }
    );


    aa.columnchart('#ethnicity-chart', aa.ethnicity.data, 
        {
            width: $('#ethnicity-chart').width(), 
            height: $('#ethnicity-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 80
            }
        }
    );

    aa.columnchart('#irish-language-ability-chart', aa.irish_language_ability.data, 
        {
            width: $('#irish-language-ability-chart').width(), 
            height: $('#irish-language-ability-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 60
            }
        }
    );

    aa.columnchart('#irish-language-location-chart', aa.irish_language_location.data, 
        {
            width: $('#irish-language-location-chart').width(), 
            height: $('#irish-language-location-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 160
            }
        }
    );

    aa.columnchart('#irish-language-frequency-chart', aa.irish_language_frequency.data, 
        {
            width: $('#irish-language-frequency-chart').width(), 
            height: $('#irish-language-frequency-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 60
            }
        }
    );

    aa.columnchart('#families-by-cycle-chart', aa.families_by_cycle.data, 
        {
            width: $('#families-by-cycle-chart').width(), 
            height: $('#families-by-cycle-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 160
            }
        }
    );

    aa.columnchart('#households-by-accom-chart', aa.accommodation_type.data, 
        {
            width: $('#households-by-accom-chart').width(), 
            height: $('#households-by-accom-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 80
            }
        }
    );

    aa.columnchart('#accommodation-year-built-chart', aa.accommodation_year_built.data, 
        {
            width: $('#accommodation-year-built-chart').width(), 
            height: $('#accommodation-year-built-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 60
            }
        }
    );

    aa.columnchart('#households-by-occupancy-chart', aa.households_by_occupancy.data, 
        {
            width: $('#households-by-occupancy-chart').width(), 
            height: $('#households-by-occupancy-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 160
            }
        }
    );

    aa.columnchart('#principal-status-chart', aa.principal_status.data, 
        {
            width: $('#principal-status-chart').width(), 
            height: $('#principal-status-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 160
            }
        }
    );

    aa.columnchart('#social-class-chart', aa.social_class.data, 
        {
            width: $('#social-class-chart').width(), 
            height: $('#social-class-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 160
            }
        }
    );

    aa.columnchart('#education-age-ceased-chart', aa.education_age_ceased.data, 
        {
            width: $('#education-age-ceased-chart').width(), 
            height: $('#education-age-ceased-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 60
            }
        }
    );

    aa.columnchart('#education-field-study-chart', aa.education_field_study.data, 
        {
            width: $('#education-field-study-chart').width(), 
            height: $('#education-field-study-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 160
            }
        }
    );

    aa.columnchart('#education-highest-level-chart', aa.education_highest_level.data, 
        {
            width: $('#education-highest-level-chart').width(), 
            height: $('#education-highest-level-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 180
            }
        }
    );

    aa.columnchart('#disability-age-chart', aa.disability_age.data, 
        {
            width: $('#disability-age-chart').width(), 
            height: $('#disability-age-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 100
            }
        }
    );

    aa.columnchart('#commuting-travel-type-chart', aa.commuting_travel_type.data, 
        {
            width: $('#commuting-travel-type-chart').width(), 
            height: $('#commuting-travel-type-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 100
            }
        }
    );

    aa.columnchart('#commuting-time-leaving-chart', aa.commuting_time_leaving.data, 
        {
            width: $('#commuting-time-leaving-chart').width(), 
            height: $('#commuting-time-leaving-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 60
            }
        }
    );
    
    aa.columnchart('#commuting-journey-time-chart', aa.commuting_journey_time.data, 
        {
            width: $('#commuting-journey-time-chart').width(), 
            height: $('#commuting-journey-time-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 100
            }
        }
    );

    aa.columnchart('#disability-carers-hours-chart', aa.disability_carers_hours.data, 
        {
            width: $('#disability-carers-hours-chart').width(), 
            height: $('#disability-carers-hours-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 100
            }
        }
    );

    aa.columnchart('#population-health-chart', aa.population_health.data, 
        {
            width: $('#population-health-chart').width(), 
            height: $('#population-health-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 60
            }
        }
    );

    aa.columnchart('#occupation-chart', aa.occupation.data, 
        {
            width: $('#occupation-chart').width(), 
            height: $('#occupation-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 160
            }
        }
    );

    aa.columnchart('#cso-industry-chart', aa.cso_industry.data, 
        {
            width: $('#cso-industry-chart').width(), 
            height: $('#cso-industry-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 110,
                bottom: 160
            }
        }
    );

    aa.columnchart('#household-pc-chart', aa.household_pc.data, 
        {
            width: $('#household-pc-chart').width(), 
            height: $('#household-pc-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 50
            }
        }
    );

    aa.columnchart('#household-internet-chart', aa.household_internet.data, 
        {
            width: $('#household-internet-chart').width(), 
            height: $('#household-internet-chart').height(),
            margin: {
                top: 12,
                right: 20,
                left: 60,
                bottom: 50
            }
        }
    );

});