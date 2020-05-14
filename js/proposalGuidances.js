let requestURL = "data/proposalGuidance.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    let headers_sort = ['Find information: News, Funding Opportunities, and Past Awards',
                        'Plan Your Proposal: Guidance and Resources',
                    'Draft Your Proposal: Section Instructions and Templates'];
    let agencies_sort = ['National Science Foundation (NSF)​',
    'National Institutes of Health (NIH)',
    'U.S. Department of Defense (DoD)',
    'U.S. Department of Energy (DOE)',
    'U.S. Department of Education (ED)',
    'National Aeronautics and Space Administration (NASA)',
    'National Oceanic and Atmospheric Administration (NOAA)',
    'National Endowment for the Arts (NEA)',
    'National Endowment for the Humanities (NEH)',
    'National Institute of Justice (NIJ)',
    'Substance Abuse and Mental Health Services Administration (SAMHSA)',
    'U.S. Department of Agriculture (USDA)'
    ]
    let agencyAcronyms =    [{Name:'National Science Foundation (NSF)​', Acronym:'NSF'},
                            {Name:'National Institutes of Health (NIH)', Acronym:'NIH'},
                            {Name:'U.S. Department of Defense (DoD)', Acronym:'DOD'},
                            {Name:'U.S. Department of Energy (DOE)', Acronym:'DOE'},
                            {Name:'U.S. Department of Education (ED)', Acronym:'ED'},
                            {Name:'National Aeronautics and Space Administration (NASA)', Acronym:'NASA'},
                            {Name:'National Oceanic and Atmospheric Administration (NOAA)', Acronym:'NOAA'},
                            {Name:'National Endowment for the Arts (NEA)', Acronym:'NEA'},
                            {Name:'National Endowment for the Humanities (NEH)', Acronym:'NEH'},
                            {Name:'National Institute of Justice (NIJ)', Acronym:'NIJ'},
                            {Name:'Substance Abuse and Mental Health Services Administration (SAMHSA)', Acronym:'SAMHSA'},
                            {Name:'U.S. Department of Agriculture (USDA)', Acronym:'USDA'}];
    let content = '';
    const proposalGuidances = request.response;
    //condition for checking if browser is Internet Explorer
    let proposalGuidance =  ((false || !!document.documentMode))? JSON.parse(proposalGuidances): proposalGuidances;
    let distinctAgencies = getDistinctAttributes(proposalGuidance, 'agency');
    distinctAgencies = customSort(agencies_sort, distinctAgencies);

    let navContent = createAgencyNavigation(distinctAgencies, agencyAcronyms);
    let tabContent = buildTabContent(distinctAgencies, proposalGuidance, headers_sort);
    appendMainContent(maincontentContainer, navContent + tabContent); 
}

let createAgencyNavigation = function(distinctAgencies, agencyAcronyms)
{
    let navigationContent = '<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">';
    for(let i = 0; i< distinctAgencies.length; i++)
    {
        let buttonContent = '';
        let agencyId = "agency" + i.toString();
        let acronyms = agencyAcronyms.filter(function(agencyAcronym){
            return agencyAcronym.Name == distinctAgencies[i].trim();
        })
        let acronym = acronyms[0].Acronym;
        if(i == 0)
        {
            buttonContent = '<a class="nav-link active" id="pills-'+ agencyId +'-tab" data-toggle="pill" href="#pills-'+ agencyId +'" role="tab" aria-controls="pills-'+ agencyId +'" aria-selected="true">'+ acronym +'</a>';
        }
        else
        {
            buttonContent = '<a class="nav-link" id="pills-'+ agencyId +'-tab" data-toggle="pill" href="#pills-'+ agencyId +'" role="tab" aria-controls="pills-'+ agencyId +'" aria-selected="true">'+ acronym +'</a>';
        }
       
        let linkElement = '<li class="nav-item">' + buttonContent + '</li>';
        navigationContent = navigationContent + linkElement;
    }
    navigationContent += '</ul>';
    return navigationContent;
}

let buildTabContent = function(distinctAgencies, proposalGuidance, headers_sort){
    let tabContent = '<div class="tab-content" id="pills-tabContent">';
    
    for(let i = 0; i< distinctAgencies.length; i++)
    {
        let agencyId = "agency" + i.toString();
        let agencyGuidance = proposalGuidance.filter(function(guidance){
            return guidance.agency == distinctAgencies[i];
        });

        if(i == 0)
        {
            tabContent +='<div class="tab-pane fade show active" id="pills-'+ agencyId +'" role="tabpanel" aria-labelledby="pills-'+ agencyId +'-tab">';
        }
        else
        {
            tabContent +='<div class="tab-pane fade" id="pills-'+ agencyId +'" role="tabpanel" aria-labelledby="pills-'+ agencyId +'-tab">';
        }
        let accordionCounter = 1;
        let distinctHeaders = getDistinctAttributes(agencyGuidance, 'mainheader');
        let accordionElemContent = '';
        distinctHeaders = customSort(headers_sort, distinctHeaders);
        distinctHeaders.forEach(function(header) {
           
           let mainGuidances = agencyGuidance.filter(function(guidance){
               return guidance.mainheader == header;
           });
           let subHeaders = getDistinctAttributes(mainGuidances, 'subheader');
           let linkcontent = '';
           if(subHeaders.length == 1 && subHeaders[0] == '')
           {
                linkcontent = buildLinkContent(mainGuidances);
           }
           else
           {
            subHeaders.forEach(function(subheader) {
                let subGuidances = mainGuidances.filter(function(guidance){
                    return guidance.subheader == subheader;
                });
                linkcontent += '<h4 class = "content-header-no-margin">'+ subheader + '</h4>'+
                                buildLinkContent(subGuidances);
            });
           }
           let headerId = "collapse" + accordionCounter;
           let headingId = "heading" + accordionCounter;
           accordionElemContent+= generateAccordionElem(headerId, headingId, header, linkcontent);
           accordionCounter++;
        });
        tabContent = tabContent + wrapAccordionContent(accordionElemContent) + '</div>';
    }
    tabContent += '</div>';
    return tabContent;
}

let buildLinkContent = function(guidance){
    let content = '<ul class = "sub-list">';
    for(let i = 0; i< guidance.length; i++)
    {
        content = content + '<li><a href = "'+ guidance[i].link +'">'+ guidance[i].title+'</a>';
        let staticTextContent = (guidance[i].staticText == '')? '</li>': ' - ' + guidance[i].staticText + '</li>';
        content = content + staticTextContent;
    }
    content = content + '</ul>';
    return content;
}

let wrapAccordionContent = function(accordionElemContent)
{
    let content = '<div class = "accordion" id = "accordionExample">'+ accordionElemContent + '</div>';
    return content;
}