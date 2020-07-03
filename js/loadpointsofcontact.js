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
        tabContent += buildContacts(agencyId, agencycontacts);
        tabContent += '</div>';

    }
    tabContent += '</div>';
    return tabContent;
}

//Start with level1 accordion and build one by one the levels going down.
//this is nestted accordion that can go upto 4 levels
let buildContacts = function(agencyId, agencycontacts){
    let counter = 1; 
    let contactElem = '';
    contactElem += '<div id = "' + agencyId + '">';
    let level1s = agencycontacts.filter(function(contact){
        return contact.level2 == '';
    });
    //if there is no level2 then it is a simple list
    if(level1s.length > 0)
    {
        contactElem += buildDivisionElement(level1s, 'level1');
    }
    //if there is level 2 then it is accordion
    let level1as = agencycontacts.filter(function(contact){
        return contact.level2 != '';
    });

    if(level1as.length > 0)
    {
        let distinctLevel1s = getDistinctAttributes(level1as, 'level1');
        distinctLevel1s.forEach(function(level) {
            let collapseId1 = "collapse" + counter;
            let headerId1 = "heading" + counter;
            let childId1 = "child" + counter;
            counter++;
            let level2Elem = '';
            //filter level2 without level3
            let level2s = level1as.filter(function(contact){
                return contact.level1 == level && contact.level3 == '';
            }); 
            //for level2s with out level3 build simple list
            if(level2s.length > 0)
            {
                level2Elem += buildDivisionElement(level2s, 'level2');
            }
            //filter level2s with level3 
            let level2as = level1as.filter(function(contact){
                return contact.level1 == level && contact.level3 != '';
            }); 
            //build accordion
            if(level2as.length > 0)
            {
                let distinctLevel2s = getDistinctAttributes(level2as, 'level2');
                distinctLevel2s.forEach(function(level){
                    let collapseId2 = "collapse" + counter;
                    let headerId2 = "heading" + counter;
                    let childId2 = "child" + counter;
                    counter++;
                    let level3Elem = '';
                    //filter level3 without level4
                    let level3s = level2as.filter(function(contact){
                        return contact.level2 == level && contact.level4 == '';
                    });
                    //for level3s with out level4 build simple list
                    if(level3s.length > 0)
                    {
                        level3Elem+= buildDivisionElement(level3s, 'level3');
                    }
                    //filter level3 with level4
                    let level3as = level2as.filter(function(contact){
                        return contact.level2 == level && contact.level4 != '';
                    });
                    //build accordion
                    if(level3as.length > 0)
                    {
                        let distinctLevel3s = getDistinctAttributes(level3as, 'level3');
                        distinctLevel3s.forEach(function(level){
                        let collapseId3 = "collapse" + counter;
                        let headerId3 = "heading" + counter;
                        let childId3 = "child" + counter;
                        counter++;
                        let level4s = level3as.filter(function(contact){
                                return contact.level3 == level;
                            });
                            let level4Elem = '';
                            level4Elem += buildDivisionElement(level4s, 'level4');
                            level3Elem+= generateAccordionSubElem(3, collapseId3, headerId3, childId2, childId3, level, level4Elem);
                        }); 
                        //end level3 accordion
                    }
                    level2Elem+= generateAccordionSubElem(2, collapseId2, headerId2, childId1, childId2, level, level3Elem);
                });
                //end level2 accordion
            }  
            contactElem+= generateAccordionSubElem(1, collapseId1, headerId1, agencyId, childId1, level, level2Elem);
        });
    }
    contactElem += '</div>';
    //end level1 accordion
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

let generateAccordionSubElem = function(level, collapseId, headerId, parentId, childId, header, accordionContent){
    var headerno = level + 2;
    let accordionElem =  '<div class = "card"><div class="card-header level'+ level +'" id="'+ headerId + '">' +
                          '<button class="btn btn-link" data-toggle="collapse" data-target="#'+ collapseId + '" aria-expanded="false" aria-controls="' + collapseId + '">'+
                            '<h'+ headerno +' class = "content-header-no-margin">' + header + '<i class="fas fa-chevron-down"></i></h'+ headerno +'></button></div>'
                        + '<div id="'+ collapseId + '" class = "collapse" aria-labelledby= "'+ headerId + '" data-parent="#'+ parentId +'"> <div class = "card-body" id="'+ childId +'">'
                        + accordionContent +'</div></div></div>';  
    return accordionElem;
}
