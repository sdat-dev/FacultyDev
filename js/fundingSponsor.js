    let requestURL = "https://spin.infoedglobal.com/Service/ProgramSearch";
    var data = {
        PublicKey: "96183961-68B2-4B14-AEA3-376E734380CD",
        InstCode: "SUNYALB",
        signature: "97707afe4847b9862f27c9ce80a9cb6e",
        responseFormat: 'JSONP',
        pageSize: 3000,
        columns: ["synopsis", "id", "spon_name", "NextDeadlineDate", "total_funding_limit", "programurl", "sponsor_type", "prog_title", "revision_date"],
        isCrossDomain: true,
        callback: 'parseData',
        keywords: "all funding opportunities",
        uniqueId: '3AF9322F-EA4D-48DF-9'

        

    };


    let params = new URLSearchParams(data).toString();
    let final_url = requestURL + '?' + params;

    $.ajax({
        url: final_url,
        dataType: 'jsonp',
        success: function (dataWeGotViaJsonp) {
            console.log(dataWeGotViaJsonp);
        }
    });















function getAccordiationData(p) {
    let maincontentContainer = document.getElementsByClassName('main-content')[0];

    var covid_data = p;
    let distinctCategories = ['NSF', 'NIH', 'Federal - Others', 'Others'];
    let FederalsubCategories = ['Federal - All CDC', 'Federal - All HHS', 'Federal - All DoD', 'Federal - All DoE'];
    let content = '';
    let categoryCounter = 1;


  
    for (var k = 0; k < distinctCategories.length; k++) {
          var NSF_arr = [];
    var NIH_arr = [];
    var federal_arr = [];

    var others = [];
        var length = 0;
        var img_url = "";
        var arr = [];
        for (var j = 0; j < covid_data.Programs.length; j++) {
            var programs_value = covid_data.Programs[j];
          
            if (programs_value.spon_name.includes('NSF') ||
                programs_value.spon_name.includes('National Science Foundation') ||
                programs_value.spon_name === "Directorate for Engineering/NSF"
            ) {
                NSF_arr.push(programs_value);

            }

            else if (programs_value.spon_name.includes('NIH') ||
               programs_value.spon_name.includes('DHHS')    
                || programs_value.spon_name.includes('National Institute of Health')
                 && !NIH_arr.includes(programs_value) 

            ) {
                NIH_arr.push(programs_value);

            }



            else if (distinctCategories[k] == 'Federal - Others') {
                if (programs_value.sponsor_type == 'US Federal' && !programs_value.spon_name.includes('DHHS') &&
                    !programs_value.spon_name.includes('NIH') && !programs_value.spon_name.includes('NSF')     ) {
                    federal_arr.push(programs_value);
                }


            }

            else {
                if (distinctCategories[k] == 'Others') {
                    if (programs_value.sponsor_type != 'US Federal' &&

                        !federal_arr.includes(programs_value)  && !NIH_arr.includes(programs_value)
                    ) {

                        others.push(programs_value);
                    }
                }
            }






        }

        if (distinctCategories[k] == 'NSF') {
            length = NSF_arr.length;
            arr = NSF_arr;
            img_url = "assets/logos-funding-opportunities/nsf.png";
        }

        if (distinctCategories[k] == 'NIH') {
            length = NIH_arr.length;
            arr = NIH_arr;
            img_url = "assets/logos-funding-opportunities/NIH-logo.png";


        }
        if (distinctCategories[k] == 'Federal - Others') {
            length = federal_arr.length;
            arr = federal_arr;
            img_url = "assets/logos-funding-opportunities/SPIN_logo.png";

        }


        if (distinctCategories[k] == 'Others') {
            length = others.length;
            arr = others;
            img_url = "assets/logos-funding-opportunities/SPIN_logo.png"

        }


        let categoryHeader = distinctCategories[k] + ' (' + length + ' Solicitations)';
        let accordionContent = generateFederalAccordionContent(arr, img_url, distinctCategories[k]);
        let oppId = "collapse" + categoryCounter;
        let headingId = "heading" + categoryCounter;
        let accordionElem = generateAccordionElement(oppId, headingId, categoryHeader, accordionContent);
        content = content + accordionElem;
        categoryCounter++;



    }


    appendMainContent(maincontentContainer, content);



}



let generateFederalAccordionContent = function (arr, img_url, funding_name) {
    let content = '';
    var today = new Date();
    var flag = false;
    var flag_defunct = true;


    arr.sort(function(a, b) {
        var c = new Date(a.revision_date);
        var d = new Date(b.revision_date);
        return d-c;
    });
    


    for (let i = 0; i < arr.length; i++) {
        flag = false;
        var dueDate = "";
        var deadlineDate = "";
        var Estimated_Funding = "";
        if (arr[i].NextDeadlineDate != null) {

            if (arr[i].NextDeadlineDate.length <= 11) {
                dueDate = new Date(arr[i].NextDeadlineDate);
                deadlineDate = new Date(arr[i].NextDeadlineDate).toLocaleDateString();
            }
            else {
                var dateArr = arr[i].NextDeadlineDate.split(" ");
                dueDate = new Date(dateArr[0]);
                deadlineDate = new Date(dateArr[0]).toLocaleDateString();

            }
        } else {
            dueDate = "Continuous Submission/Contact the Program Officer"
            flag = true;
        }

        if (arr[i].total_funding_limit === 0) {
            Estimated_Funding = "N/A";
        } else {
            Estimated_Funding = '$' + arr[i].total_funding_limit;
        }







        /* if (funding_name === 'Federal - Others') {

            if (arr[i].spon_name.includes("Center for Global Health") ||
                arr[i].spon_name.includes("CDC")) {
                img_url = "assets/logos/cdc.png";

            }

            if (arr[i].spon_name === "Department of the Air Force" ||
                arr[i].spon_name === "Department of the Army" ||
                arr[i].spon_name === "Defense Logistics Agency" ||
                arr[i].spon_name === "Department of Veterans Affairs"
            ) {
                img_url = "assets/logos/dod.png";

            }
            if (arr[i].spon_name === "Department of Energy") {


                img_url = "assets/logos/doe.png";
            }


            if (arr[i].spon_name === "Department of Health & Human Services") {


                img_url = "assets/logos/hhs.png";
            }


            if (arr[i].spon_name === "Department of Health & Human Services") {


                img_url = "assets/logos/hhs.png";
            }

            if (arr[i].spon_name === "National Institute of Food and Agriculture/Department of Agriculture"
                || arr[i].spon_name === "Agricultural Research Service/Department of Agriculture"
            ) {


                img_url = "assets/logos/USDA+National+Institute+of+Food+and+Ag_thumb.png";
            }

           

        }



*/

        var image_name = getImageName(arr[i].spon_name).toLowerCase();


        if (funding_name === 'Federal - Others') {


            var url_image = "assets/logos-funding-opportunities/" + image_name + ".png";
            var image = new Image(url_image);

            if (image_name === "cfgh" ||
                image_name === "cdc") {
                img_url = "assets/logos-funding-opportunities/cdc.png";

            }

            else if (image_name === "dotaf" ||
                image_name === "dota" ||
                image_name === "dla" ||
                image_name === "dova" ||
                image_name === "dohs" ||
                image_name === "dod"
            ) {
                img_url = "assets/logos-funding-opportunities/dod.png";

            }



            else if (image_name === "niofaadoa"
                || image_name === "arsdoa"
            ) {


                img_url = "assets/logos-funding-opportunities/" + image_name + ".png";
            }
            else {


                if (checkFileExists(url_image)) {
                    img_url = url_image;

                }
                else {
                    img_url = "assets/logos-funding-opportunities/SPIN_logo.png";
                   // console.log("ddd");
                }

               
            }



        }





        if (funding_name === 'Others') {



            var url_image = "assets/logos-funding-opportunities/" + image_name + ".png";
            var image = new Image(url_image);



            if (checkFileExists(url_image)) {
                img_url = url_image;
            }
            else {
                img_url = "assets/logos-funding-opportunities/SPIN_logo.png";
               // console.log("ddd");
            }


            // }

        }


        var description = arr[i].synopsis.replace(/<[^>]*>/g, '');






        /* var dueDate = new Date(arr[i].NextDeadlineDate);
        if(Object.prototype.toString.call(dueDate) === "[object Date]" && !isNaN(dueDate.getTime()))
        {
            dueDate = new Date(arr[i].NextDeadlineDate);
        }
        else{
            dueDate = new Date();
        } */
        //Only add the oportunities which have due dates after today
        //if(dueDate == "Contact the Officier"  || dueDate >= today )
        //{

        if (dueDate != "Continuous Submission/Contact the Program Officer") {
           if (dueDate > today) {
              flag = true;
                dueDate = deadlineDate;
            }
        }




      //  if (flag) {
            let imageElement = (arr[i].logo == '') ? '' : '<div class = "col-xl-2 col-lg-3"><img class = "agency-logo" src = "' + img_url + '" /></div>';
            content = content + '<div class = "display-flex opportunity-container search-container">' + imageElement +
                '<div class = "col-xl-10 col-lg-9">' + '<h4 class = "opp-header black-content-header-no-margin">' + arr[i].prog_title + '</h4>' + '<div class = "opp-details display-flex">' +

                '<div class = "col-sm-12 col-md-12 col-lg-12 col-xl-6">' +
                '<i class="fas fa-flag"></i> <strong>Agency Name: </strong>' + arr[i].spon_name +
                '<br>' +
                '<i class="fas fa-dollar-sign"></i> <strong>Estimated Funding: </strong>' + Estimated_Funding +
                '<br>' +
                '</div><div class = "col-sm-12 col-md-12 col-lg-12 col-xl-6">' +
                '<i class="fas fa-calendar-day"></i> <strong>Due Date: </strong>' + dueDate + " -- " + arr[i].revision_date +
                '<br></div></div></div>' +
                '<p class = "opp-description">' + description + '</p>' +
                '<button type = "button" class = "details-button" onclick = "location.href = \'' + arr[i].programurl + '\'">View Details</button></div>';
            // }     
       // }
    }
    return content;
}


let generateAccordionElement = function (divId, bootlabelId, accordionHeader, accordionContent) {
    let accordionElem = '<div class = "card"><div class="card-header" id="' + bootlabelId + '">' +
        '<button class="btn btn-link" type="button" data-toggle="collapse"  data-target="#' + divId + '" aria-expanded="true" aria-controls="' + divId + '">' +
        '<h3 class = "content-header-no-margin">' + accordionHeader + '<i class="fas fa-chevron-down"></i></h3></button></div>'
        + '<div id="' + divId + '" class = "collapse" data-parent="#accordionExample" aria-labelledby= "' + bootlabelId + '"> <div class = "card-body">'
        + accordionContent + '</div></div></div>';
    return accordionElem;
}



let getImageName = function (sponser_name) {


    if (sponser_name.split(" ").length == 1) {
        return sponser_name;
    }
    var matches = sponser_name.match(/\b(\w)/g);
    return matches.join('');
}


let checkFileExists = function (url) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}


var parseData = function (p) {
    console.log(p);
    data = p;
    if (p.ErrorType != null) {
        if ($('#waiter').is(':visible')) $('#waiter').hide();
        alert(p.ErrorType + '\n' + p.ErrorMessage);
        return;
    }
    //$.Parse(p);


    getAccordiationData(p);


};



