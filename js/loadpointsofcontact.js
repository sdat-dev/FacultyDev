let requestURL = "data/pointsofcontact.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    let agencies_sort = ['NSF​','NIH','DoD','DOE','ED','NASA','NOAA','NEA','NEH','NIJ','SAMHSA','USDA']
    let content = '';
    const pointsofcontactjson = request.response;
    //condition for checking if browser is Internet Explorer
    let pointsofcontact =  ((false || !!document.documentMode))? JSON.parse(pointsofcontactjson): pointsofcontactjson;
    let distinctAgencies = getDistinctAttributes(pointsofcontact, 'acronym');
    distinctAgencies = customSort(agencies_sort, distinctAgencies);

    let navContent = createAgencyNavigation(distinctAgencies);
    let tabContent = buildTabContent(distinctAgencies, pointsofcontact);
    appendMainContent(maincontentContainer, navContent + tabContent); 
    appendPostDate(pointsofcontact[0].updateddate) 
}

let createAgencyNavigation = function(distinctAgencies)
{
    let navigationContent = '<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">';
    for(let i = 0; i< distinctAgencies.length; i++)
    {
        let buttonContent = '';
        let agencyId = "agency" + i.toString();
        if(i == 0)
        {
            buttonContent = '<a class="nav-link active" id="pills-'+ agencyId +'-tab" data-toggle="pill" href="#pills-'+ agencyId +'" role="tab" aria-controls="pills-'+ agencyId +'" aria-selected="true">'+ distinctAgencies[i] +'</a>';
        }
        else
        {
            buttonContent = '<a class="nav-link" id="pills-'+ agencyId +'-tab" data-toggle="pill" href="#pills-'+ agencyId +'" role="tab" aria-controls="pills-'+ agencyId +'" aria-selected="true">'+ distinctAgencies[i] +'</a>';
        }
       
        let linkElement = '<li class="nav-item">' + buttonContent + '</li>';
        navigationContent = navigationContent + linkElement;
    }
    navigationContent += '</ul>';
    return navigationContent;
}

let buildTabContent = function(distinctAgencies, pointsofcontact){
    let tabContent = '<div class="tab-content" id="pills-tabContent">';
    
    for(let i = 0; i< distinctAgencies.length; i++)
    {
        let agencyId = "agency" + i.toString();
        let agencycontacts = pointsofcontact.filter(function(pointofcontact){
            return pointofcontact.acronym == distinctAgencies[i];
        });

        if(i == 0)
        {
            tabContent +='<div class="tab-pane fade show active" id="pills-'+ agencyId +'" role="tabpanel" aria-labelledby="pills-'+ agencyId +'-tab">';
        }
        else
        {
            tabContent +='<div class="tab-pane fade" id="pills-'+ agencyId +'" role="tabpanel" aria-labelledby="pills-'+ agencyId +'-tab">';
        }
        tabContent += '<div class="sponsor-title-container"><h3 class="sponsor-title"><img class="logo" src="assets/logos/sponsor_logos/'+ agencycontacts[0].acronym.toLowerCase() +'.png">'+ agencycontacts[0].agency.toString() +'</h3></div>';
        tabContent += buildContacts(agencycontacts);
        tabContent += '</div>';

    }
    tabContent += '</div>';
    return tabContent;
}

let buildContacts = function(agencycontacts){
    let accordionCounter = 1; 
    let contactElem = '<div class = "accordion" id = "accordionExample">';
    let distinctDirectorates = getDistinctAttributes(agencycontacts, 'directorate');
    distinctDirectorates.forEach(function(directorate) {
        let divisions = agencycontacts.filter(function(contact){
            return contact.directorate == directorate;
        }); 
        let divisionElement = buildDivisionElement(divisions);
        let headerId = "collapse" + accordionCounter;
        let headingId = "heading" + accordionCounter;
        if(directorate == '')
        {
            contactElem+= divisionElement;
        }
        else
        {
            contactElem+= generateAccordionElem(headerId, headingId, divisions[0].directorate, divisionElement);
            accordionCounter++;  
        }     
    });
    contactElem += '</div>';
    return contactElem;
}

let buildDivisionElement = function(divisions){
    let content = '';
    if(divisions.length === 1){
        if(divisions[0].staticText != '')
        {
            content = content + '<p>'+ divisions[0].title +' <a target="_blank" href = "'+ divisions[0].link +'">('+ divisions[0].staticText +')</a></p>';
        }
        else
        {
            content = content + '<p><a target="_blank" href = "'+ divisions[0].link +'">'+ divisions[0].title +'</a></p>';
        }
        return content;
    }
    else{
        content = '<ul class = "sub-list">';
        for(let i = 0; i< divisions.length; i++)
        {
            if(divisions[i].staticText != '')
            {
                content = content + '<li>'+ divisions[i].title +'<a target="_blank" href = "'+ divisions[i].link +'">('+ divisions[i].staticText +')</a></li>';
            }
            else
            {
                content = content + '<li><a target="_blank" href = "'+ divisions[i].link +'">'+ divisions[i].title +'</a></li>';
            }
        }
        content = content + '</ul>';
        return content;
    }
}