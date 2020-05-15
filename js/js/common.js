let getDistinctAttributes = function(objects, attribute){
    let mappedAttributes = objects.map(function(object){
        return object[attribute];
    });
    let distinctAttributes = mappedAttributes.filter(function(v, i, a){
        return a.indexOf(v) === i;
     });

    distinctAttributes.sort();
    return distinctAttributes;
}

let customSort = function(sortOrder, objects){
        let i,j = 0;
        for(i = 0; i< objects.length; i++)
        {
            for(j = 0; j < objects.length - (i+1); j++)
            {
                if(sortOrder.indexOf(objects[j]) > sortOrder.indexOf(objects[j+1]))
                {
                    let swap = objects[j];
                    objects[j] = objects[j+1];
                    objects[j+1] = swap;
                }
            }
        }
        return objects;
}

let generateSubAccordionContent = function(attributes, filterAttribute, objects, generateObjectContent){
    let accordionContent = '';

    attributes.forEach(function(attribute){
        //filtering objects based on each subaccordion grouping
        sub_objects = objects.filter(function(object){ 	
            return object[filterAttribute] == attribute;
        });

        let objectContent = '';
        sub_objects.forEach(function(object){
            objectContent = objectContent + generateObjectContent(object);
        });

        accordionContent += '<div class = "accordion-container"><div class = "accordion-header"><p class = "paragraph-question">'+ attribute + '</p></div><div class = "accordion-content"><ul class = "sub-list">'+ objectContent +'</ul></div></div>';
    });
    return accordionContent;
}

let generateAccordionElem = function(divId, bootlabelId, accordionHeader, accordionContent){
    let accordionElem =  '<div class = "card"><div class="card-header" id="'+ bootlabelId + '">' +
                          '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#'+ divId + '" aria-expanded="true" aria-controls="' + divId + '">'+
                            '<h3 class = "content-header-no-margin">' + accordionHeader + '<i class="fas fa-chevron-down"></i></h3></button></div>'
                        + '<div id="'+ divId + '" class = "collapse" aria-labelledby= "'+ bootlabelId + '"> <div class = "card-body">'
                        + accordionContent +'</div></div></div>';  
    return accordionElem;
}

let generateAccordionGuideanceElem =  function(divId, bootlabelId, accordionHeader, accordionContent, imageSrc){
    let accordionElem =  '<div class = "card"><div class="card-header" id="'+ bootlabelId + '">' +
                          '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#'+ divId + '" aria-expanded="true" aria-controls="' + divId + '">'+
                            '<div class = "display-flex"><div><img class = "accordion-logo" src = "'+ imageSrc +'"></div><div><h3 class = "content-header-no-margin">' + accordionHeader + '</h3></div></div></button></div>'
                        + '<div id="'+ divId + '" class = "collapse" aria-labelledby= "'+ bootlabelId + '"> <div class = "card-body">'
                        + accordionContent +'</div></div></div>';  
    return accordionElem;
}

let generateGuidanceSubAccordionContent = function(attributes, filterAttribute, objects, generateObjectContent){
    let accordionContent = '';

    attributes.forEach(function(attribute){
        //filtering objects based on each subaccordion grouping
        sub_objects = objects.filter(function(object){ 	
            return object[filterAttribute] == attribute;
        });

        let objectContent = '';
        sub_objects.forEach(function(object){
            objectContent = objectContent + generateObjectContent(object);
        });

        accordionContent += '<div class = "accordion-container"><div class = "accordion-header"><div class = "sub-accordion-logo-container"><img class = "sub-accordion-logo" src = "'+ sub_objects[0].logo +'"></div><p class = "paragraph-question">'+ attribute + '</p></div><div class = "accordion-content"><ul class = "sub-list">'+ objectContent +'</ul></div></div>';
    });
    return accordionContent;
}


let appendMainContent = function(maincontentContainer, content){
    let mainContentElement = document.createElement('div');
    mainContentElement.classList.add('accordion');
    mainContentElement.id = 'accordionExample';
    mainContentElement.innerHTML = content.trim();
    maincontentContainer.appendChild(mainContentElement);
}

let appendPostDate  = function(date){
    let lastupdatedContent = document.getElementById('last-updated');
    lastupdatedContent.innerHTML = "Last updated: " + date;
}