class CardRenderer {
    constructor(data, container, navigation) {
        this.data = data;
        this.containerElement = container;
        this.navigationElement = navigation;
        this.projects = {};
        this.currentProject = this.data[Object.keys(this.data)[0]].heading;
        this.currentProjectElement = null;

        this.render();
    }

    addProjectToNavigation(project) {
        const navElement = document.createElement('button');
        navElement.classList.add('flexbox-row', 'ajc', 'project-nav-link');
        navElement.dataset.projectHeading = project.heading;

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
        this.navigationElement.appendChild(navElement);
        navElement.addEventListener('click', (evt) => {
            this.showProject(navElement.dataset.projectHeading);
            document.querySelector('button.current-project').classList.remove('current-project');
            navElement.classList.add('current-project');
        })
    }

    renderProject(project) {
        let projectDescription = '';
        for (let desc of project.description) {
            if (desc instanceof Array) {
                projectDescription += `<span class="project-desc ${desc.slice(1).join(' ')}">${desc[0]}</span>`;
            }
            else {
                projectDescription += `<span class="project-desc">${desc}</span>`;
            }
        }

        let projectLinks = '';
        for (let link of project.links) {
            projectLinks += `
        <span class="flexbox-row ajc link ${link.className ? link.className : ''}" ${link.id ? `id=${link.id}` : ''}>
            ${link.svg}
            <span class="space-lr">${link.link}</span>
        </span>
        `;
        }

        let projectLogo = '';
        if (project.logo) {
            projectLogo += `<img src="${project.logo.path}" alt="${project.logo.alt}" width="${project.logo.width}" height="${project.logo.height}">`
        }

        const projectElement = document.createElement('div');
        projectElement.classList.add('flexbox-row', 'pad-50', 'mar-20', 'project');
        projectElement.id = `project-${project.heading}`;

        projectElement.innerHTML = `
        <div class="flexbox-column">
            ${projectLogo}
        </div>
        <div class="flexbox-column project-content">
            <h2 class="big mbt-10">${project.heading}</h2>
            ${projectDescription}
            <span class="flexbox-row pad-10 project-links">${projectLinks}</span>
            <span class="flexbox-row mt-10 flair">${project.flair}</span>
        </div>
        ${project.extraHTML ? project.extraHTML : ''}`;
        this.containerElement.appendChild(projectElement);
        this.projects[project.heading] = projectElement;
    }

    showProject(projectHeading) {
        this.currentProjectElement.classList.remove('active-project');
        for (let p in this.projects) {
            let project =  this.projects[p];
            if (p === projectHeading) {
                project.classList.add('active-project');
                this.currentProjectElement = project;
                break;
            }
        }
    }

    render() {
        for (let project in this.data) {
            this.addProjectToNavigation(this.data[project]);
            this.renderProject(this.data[project]);
        }
        console.log(this.projects);
        console.log(this.currentProject);
        this.navigationElement.firstElementChild.classList.add('current-project');
        this.projects[this.currentProject].classList.add('active-project');
        this.currentProjectElement = this.projects[this.currentProject];
    }
}

const projectContainer = document.querySelector('.project-container');
const projectListNavbar = document.querySelector('#project-navbar');

const projectJSON = document.querySelector('#project-data').src;
fetch(projectJSON)
    .then(response => response.json())
    .then(json => {
        const projects = new CardRenderer(json, projectContainer, projectListNavbar);
    })
    .then(() => {
        initMJXGUIDemo();
    });
