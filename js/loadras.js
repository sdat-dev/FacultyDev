let requestURL = "data/ralist.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    let content = '';
    const raslistjson = request.response;
    //condition for checking if browser is Internet Explorer
    let ralist =  ((false || !!document.documentMode))? JSON.parse(raslistjson): raslistjson; 
    let distinctadmins = getDistinctAdmins(ralist);
    content += '<div class="display-flex">';
    distinctadmins.forEach(function(admin){
        let departments = ralist.filter(function(rarecord){ 	
            return rarecord.ra.name == admin;
        });
        content += createadminelement(departments);
    });
    content += '</div>';
    appendMainContent(maincontentContainer, content);
}

let getDistinctAdmins = function(ralist){
    let raadminlist = ralist.map(function(rarecord){
        return rarecord.ra['name'];
    });
    let distinctAdmins = raadminlist.filter(function(v, i, a){
        return a.indexOf(v) === i;
     });

     distinctAdmins.sort();
    return distinctAdmins;
}

let createadminelement = function(departments){
    let content = '';
    let adminrecord = departments[0];
    content +=  '<div class= "col-lg-4 col-md-4 col-sm-6 search-container">' +
                '   <p class="admin-info"><img class="admin-img" src="assets/images/ras/' + adminrecord.ra.photo + '" alt="">' +       
                '   <br><span class="title"><strong>' + adminrecord.ra.name + '</strong>' +
                '   <br><span class="email"><a href="mailto:'+ adminrecord.ra.email + '">'+ adminrecord.ra.email+ '</a></span></span>' +
                '   <br><span class="departments"><strong>Departments:</strong><br>';
    departments.forEach(function(department){
        content += department.name + '<br>'
    });
    content +=  '       </span>'+ 
                '   </p>' +
                '</div>';
    return content;
} 