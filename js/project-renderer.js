const projectContainer = document.querySelector('.project-container');
const projectListNavbar = document.querySelector('#project-navbar');

const projectJSON = document.querySelector('#project-data').src;
const fetchedJSON = fetch(projectJSON)
    .then(response => response.json())
    .then(json => {
        for (let project in json) {
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            addProjectToNavigation(json[project]);
            renderProject(json[project]);
        }
    });


function addProjectToNavigation(project) {
    const navElement = document.createElement('span');
    navElement.classList.add('flexbox-row', 'ajc', 'space-lr', 'project-nav-link');

    const projectLogo = document.createElement('img');
    projectLogo.classList.add('space-lr');
    projectLogo.src = project.logo.path;
    projectLogo.width = project.logo.width / 5;
    projectLogo.height = project.logo.height / 5;

    navElement.appendChild(projectLogo);

    const projectName = document.createElement('span');
    projectName.classList.add('space-lr');
    projectName.textContent = project.heading;

    navElement.appendChild(projectName);
    projectListNavbar.appendChild(navElement);
}

function renderProject(project) {
    console.log(project);
}
