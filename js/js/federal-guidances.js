let requestURL = "data/federal-guidances.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    const federalGuidances = request.response;  
    //condition for checking if browser is Internet Explorer
    let federalGuidance =  ((false || !!document.documentMode))? JSON.parse(federalGuidances): federalGuidances;
    let content = '';
    let sponsorCounter = 1;
    let distinctSponsors = [//'National Science Foundation (NSF) ',
    'National Science Foundation (NSF) ​',
    'National Institutes of Health (NIH)',
    'Department of Health and Human Services (HHS)',
    'Department of Defense (DOD)',
    'Department of Energy (DOE)​',
    'Department of Transportation (DOT)',
    'Department of Agriculture (USDA)',
    'National Aeronautics and Space Administration (NASA)​',
    'Department of Justice (DOJ)',
    'Environmental Protection Agency (EPA)',
    'Agency for International Development (USAID)',
    'National Security Agency',
    'National Endowment for the Humanities',
    'Office of Management and Budget (OMB)​',
    'Department of Labor (DOL)',
    'Department of State',
    'Chief Acquisition Officers Council (CAOC)'
    ];

    let HHS_sponsor_order = 
    [
    'Food and Drug Administration',
     'Health Resources and Services Administration (HRSA)',
     'Substance Abuse and Mental Health Services Administration (SAMHSA​)',
     'Centers for Disease Control​ (CDC)',
     'Department of Health and Human Services (HHS)'];

    let DOD_order = 
    [
        'Defense Advanced Research Projects Agency (DARPA​)',
        'Office of Naval Research (ONR)',
        'Department of the Air Force',
        'United States Army Medical Research Acquisition Activity​ (USAMRAA)',
        'Navy\'s Research, Development and Acquisition',
        'Department of Defense (DOD)',
    ];

    distinctSponsors.forEach(function(majorSponsor){
        let sponsorGuidance = federalGuidance.filter(function(guidance){ 	
            return guidance.majorSponsor == majorSponsor;
        });
        
        let majorSponsorlogos = getDistinctAttributes(sponsorGuidance, "majorlogo");
        majorSponsorlogos = majorSponsorlogos.filter(function(majorlogo){
            return (!majorlogo.includes('undefined'));
        });
        let sponsorLogo = majorSponsorlogos[0];
        let distinctsubSponsors = getDistinctAttributes(sponsorGuidance, "sponsor");
        if(majorSponsor == 'Department of Health and Human Services (HHS)')
        {
            customSort(HHS_sponsor_order,distinctsubSponsors);
        }
        else if(majorSponsor == 'Department of Defense (DOD)')
        {
            customSort(DOD_order,distinctsubSponsors);
        }

        let accordionContent = (sponsorGuidance[0].majorSponsor != sponsorGuidance[0].sponsor)?
        generateGuidanceSubAccordionContent(distinctsubSponsors, "sponsor", sponsorGuidance, generateGuidanceContent):
        generateGuidanceAccordionContent(sponsorGuidance);
        let sponsorId = "collapse" + sponsorCounter;
        let headingId = "heading" + sponsorCounter;
        sponsorLogo = (typeof(sponsorLogo) != 'undefined')? sponsorLogo: sponsorGuidance[0].logo;
        let accordionElem =  generateAccordionGuideanceElem(sponsorId, headingId, majorSponsor, accordionContent, sponsorLogo);
        content = content + accordionElem;
        sponsorCounter++;
    })
    appendMainContent(maincontentContainer, content);
    //Appending grants to main content Element 
    appendPostDate(federalGuidances[0].updateddate);
}

let generateGuidanceAccordionContent = function(guidances){
    let content = '<div><ul class = "sub-list">';
    for(let i = 0; i < guidances.length; i++)
    {
        content = content + '<li><a href = "'+ guidances[i].link.trim() +'">' + guidances[i].document + '</a></li>' ;
    }
    content = content + '</ul></div>';
    return content;
}

let generateGuidanceContent = function(guidance){
    let content = '<li><a href = "'+ guidance.link +'">' + guidance.document + '</a></li>' ;
    return content;
}