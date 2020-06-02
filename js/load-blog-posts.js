let requestURL = 'https://api.dropinblog.com/v1/json/?b=TJ1U42QNDUJDQ8LULSOQ&category=funding&limit=3';
let request = new XMLHttpRequest();
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    const postsjson = request.response;
    let blogposts =  (false || !!document.documentMode)? JSON.parse(postsjson): postsjson;
    let content = '';
    blogposts.data.posts.forEach(post => {
        content += '<div class="post"><h2 class="post-title"><a href="#">'+
                      post.title + '</a></h2>'+ 
                    '<p class="post-featured-image"><a href="#"><img src="'+ post.featuredImage +'"></a></p>'+
                    '<p class="meta-text"><span class="author meta-item">'+ post.author.name + '</span>'+
                    '<span class="date meta-item">'+ post.publishedAt + '</span>' +
                    '<span class="readtime meta-item">'+ post.readtime + '</span>' +
                    '<p class="post-content">'+ post.summary + '...<a href="#">more »</a></p></div>';
    });
    let mainContentElement = document.createElement('div');
    mainContentElement.innerHTML = content.trim();
    maincontentContainer.appendChild(mainContentElement);
}