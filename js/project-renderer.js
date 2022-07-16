const projectContainer = document.querySelector('.project-container');
const projectListNavbar = document.querySelector('#project-navbar');

const projectJSON = document.querySelector('#project-data').src;
const fetchedJSON = fetch(projectJSON)
    .then(response => response.json())
    .then(json => {
        for (let project in json) {
            addProjectToNavigation(json[project]);
            renderProject(json[project]);
        }
    });


function addProjectToNavigation(project) {

}

function renderProject(project) {
    console.log(project);
}
