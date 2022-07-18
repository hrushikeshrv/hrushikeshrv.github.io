const projectContainer = document.querySelector('.project-container');
const projectListNavbar = document.querySelector('#project-navbar');

const projectJSON = document.querySelector('#project-data').src;
fetch(projectJSON)
    .then(response => response.json())
    .then(json => {
        for (let project in json) {
            addProjectToNavigation(json[project]);
            renderProject(json[project]);
        }

        projectListNavbar.firstElementChild.classList.add('current-project');
    });


function addProjectToNavigation(project) {
    const navElement = document.createElement('button');
    navElement.classList.add('flexbox-row', 'ajc', 'project-nav-link');

    if (project.logo) {
        const projectLogo = document.createElement('img');
        projectLogo.classList.add('space-lr');
        projectLogo.src = project.logo.path;
        projectLogo.width = project.logo.width / 5;
        projectLogo.height = project.logo.height / 5;

        navElement.appendChild(projectLogo);
    }

    const projectName = document.createElement('span');
    projectName.classList.add('space-lr');
    projectName.textContent = project.heading;

    navElement.appendChild(projectName);
    projectListNavbar.appendChild(navElement);
}

function renderProject(project) {
    console.log(project);
    // TODO - ! Make sure you add support for props like id, classname, and extraHTML
}
