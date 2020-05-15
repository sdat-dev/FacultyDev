let requestURL = "data/funding-opps.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    const opportunities = request.response;  
    //condition for checking if browser is Internet Explorer
    let opportunity =  ((false || !!document.documentMode))? JSON.parse(opportunities): opportunities;
    let distinctCategories = ['NSF', 'NIH', 'Federal - Others', 'International', 'Others'];
    let FederalsubCategories = ['Federal - All CDC','Federal - All HHS', 'Federal - All DoD', 'Federal - All DoE'];
    let content = '';
    let categoryCounter = 1;

    distinctCategories.forEach(function(category){
        let categoryOpportunities = opportunity.filter(function(opp){ 	
            return opp.category == category;
        });
        let categoryHeader = category + ' (' + categoryOpportunities.length + ' Solicitations)';
        let accordionContent = generateOpportunityAccordionContent(categoryOpportunities);
        let oppId = "collapse" + categoryCounter;
        let headingId = "heading" + categoryCounter;
        let accordionElem =  generateAccordionElem(oppId, headingId, categoryHeader, accordionContent);
        content = content + accordionElem;
        categoryCounter++;
    })
    appendMainContent(maincontentContainer, content);
    //Appending grants to main content Element  
    appendPostDate(opportunities[0].updateddate);
}

let generateOpportunityAccordionContent = function(opportunities){
    let content = '';
    for(let i = 0; i < opportunities.length; i++)
    {
        let imageElement = (opportunities[i].logo == '')? '' : '<div class = "col-xl-2 col-lg-3"><img class = "agency-logo" src = "'+ opportunities[i].logo +'" /></div>';
        content = content + '<div class = "display-flex opportunity-container search-container">'+ imageElement + 
               '<div class = "col-xl-10 col-lg-9">'+ '<h4 class = "opp-header black-content-header-no-margin">'+ opportunities[i].title +'</h4>'+'<div class = "opp-details display-flex">'+
               
                    '<div class = "col-sm-12 col-md-12 col-lg-12 col-xl-6">'+
                        '<i class="fas fa-flag"></i> <strong>Agency Name: </strong>' + opportunities[i].agency +
                        '<br>' +
                        '<i class="fas fa-dollar-sign"></i> <strong>Estimated Funding: </strong>' + opportunities[i].fundingLevel +
                        '<br>' +
                    '</div><div class = "col-sm-12 col-md-12 col-lg-12 col-xl-6">' +
                        '<i class="fas fa-calendar-day"></i> <strong>Due Date: </strong>' + opportunities[i].dueDate +
                        '<br></div></div></div>' +
               '<p class = "opp-description">' + opportunities[i].description + '</p>' +
               '<button type = "button" class = "details-button" onclick = "location.href = \'' + opportunities[i].website + '\'">View Details</button></div>';
    }
    return content;
}