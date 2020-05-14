dropdown.onchange = function()
{
    //selecting dropdown element
    let dropdown = document.getElementById('dropdown');
    //Getting selected option attribute to render selected container
    let selectedOption = dropdown.selectedOptions[0].getAttribute('data-selected');
    //Getting underlying containers
    let linkContainers = document.getElementsByClassName('link-container');
    for(let i = 0; i< linkContainers.length; i++)
    {
        linkContainers[i].style.display = 'none';
    }
    //Setting selected container's display property to block
    document.getElementById(selectedOption).style.display = 'block';
}