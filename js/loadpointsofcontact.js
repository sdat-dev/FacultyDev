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

//Start with level1 accordion and build one by one the levels going down.
//this is nestted accordion that can go upto 4 levels
let buildContacts = function(agencycontacts){
    let accordionCounter = 1; 
    let contactElem = '<div class = "accordion" id = "accordionLevel1">';
    let distinctLevel1s = getDistinctAttributes(agencycontacts, 'level1');
    distinctLevel1s.forEach(function(level) {
        let level2s = agencycontacts.filter(function(contact){
            return contact.level1 == level;
        }); 
        if(level2s.length == 1 && level2s[0].level2 == '')
        {
            contactElem += buildDivisionElement(level2s, 'level1');
        }
        else{
            let level2Elem = '<div class = "accordion" id = "accordionLevel2">';
            let distinctLevel2s = getDistinctAttributes(level2s, 'level2');
            distinctLevel2s.forEach(function(level){
                let level3s = level2s.filter(function(contact){
                    return contact.level2 == level;
                });
                if(level3s.length == 1 && level3s[0].level3 == '')
                {
                    level2Elem += buildDivisionElement(level3s, 'level2');
                }
                else
                {
                    let level3Elem = '<div class = "accordion" id = "accordionLevel3">';
                    let distinctLevel3s = getDistinctAttributes(level3s, 'level3');
                    distinctLevel3s.forEach(function(level){
                        let level4s = level3s.filter(function(contact){
                                return contact.level3 == level;
                            });
                            if(level4s.length == 1 && level4s[0].level4 == '')
                            {
                                level3Elem += buildDivisionElement(level3s, 'level3');
                            }
                            else
                            {
                                let level4Elem = '';
                                level4Elem += buildDivisionElement(level4s, 'level4');
                                let headerId3 = "collapse" + accordionCounter;
                                let headingId3 = "heading" + accordionCounter;
                                level3Elem+= generateAccordionElem(headerId3, headingId3, level4s[0].level3, level4Elem);
                                accordionCounter++;
                            }
                        }); 
                    level3Elem += '</div>';
                    let headerId2 = "collapse" + accordionCounter;
                    let headingId2 = "heading" + accordionCounter;
                    level2Elem+= generateAccordionElem(headerId2, headingId2, level3s[0].level2, level3Elem);
                    accordionCounter++;
                }
            });
            level2Elem += '</div>';
            let headerId1 = "collapse" + accordionCounter;
            let headingId1 = "heading" + accordionCounter;
            contactElem+= generateAccordionElem(headerId1, headingId1, level2s[0].level1, level2Elem);
            accordionCounter++;      
        }    
    });
    contactElem += '</div>';
    return contactElem;
}

let buildDivisionElement = function(divisions, level){
    let content = '';
    if(divisions.length === 1){
        if(divisions[0].staticText != '')
        {
            content = content + '<p>'+ divisions[0][level] +' <a target="_blank" href = "'+ divisions[0].link +'">('+ divisions[0].staticText +')</a></p>';
        }
        else
        {
            content = content + '<p><a target="_blank" href = "'+ divisions[0].link +'">'+ divisions[0][level] +'</a></p>';
        }
        return content;
    }
    else{
        content = '<ul class = "sub-list">';
        for(let i = 0; i< divisions.length; i++)
        {
            if(divisions[i].staticText != '')
            {
                content = content + '<li>'+ divisions[i][level] +'<a target="_blank" href = "'+ divisions[i].link +'">('+ divisions[i].staticText +')</a></li>';
            }
            else
            {
                content = content + '<li><a target="_blank" href = "'+ divisions[i].link +'">'+ divisions[i][level]+'</a></li>';
            }
        }
        content = content + '</ul>';
        return content;
    }
}