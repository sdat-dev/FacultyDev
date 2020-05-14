let readMoreElem = document.getElementsByClassName('read-more')[0];
let readMoreFunction = function(){
    if(readMoreElem.innerText == "Read More")
    {
        let hiddenElems = readMoreElem.parentElement.getElementsByClassName('more-text');
        for(let i =0; i< hiddenElems.length; i++){
            hiddenElems[i].style.display = "block";
        }
        readMoreElem.innerText = "Read Less";
    }
    else
    {
        let visibleElems = readMoreElem.parentElement.getElementsByClassName('more-text');
        for(let i =0; i< visibleElems.length; i++){
            visibleElems[i].style.display = "none";
        }
        readMoreElem.innerText = "Read More";
    }
}
readMoreElem.addEventListener('click', readMoreFunction);
