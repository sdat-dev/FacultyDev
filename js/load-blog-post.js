let requestURL = "https://api.dropinblog.com/v1/json/post/?b=X3SHNNBHN8389GILXMXA&post=welcome-to-dropinblog";
let request = new XMLHttpRequest();
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    const blogpostjson = request.response; 
    maincontentContainer.innerHTML = blogpostjson.data.post.content;
}