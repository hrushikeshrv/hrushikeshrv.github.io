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
    })
    .then(() => {
        const outputContainer = document.querySelector('#mjxgui-output-container');
        const outputTable = document.querySelector('#mjxgui-output');
        const gui = new MJXGUI('.mjxgui-demo-button', '$$', function() {
            outputContainer.classList.remove('hidden');
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>$$ ${gui.getLatex()} $$</td><td>${gui.getLatex()}</td>`;
            outputTable.appendChild(tr);
            MathJax.typesetPromise([tr]).then(() => {})
        });
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

    let projectHTML = `
    <div class="flexbox-row pad-50 mar-20 project">
        <div class="flexbox-column">
            ${projectLogo}
        </div>
        <div class="flexbox-column project-content">
            <h2 class="big mbt-10">${project.heading}</h2>
            ${projectDescription}
            <span class="flexbox-row pad-10 project-links">${projectLinks}</span>
            <span class="flexbox-row mt-10 flair">${project.flair}</span>
        </div>
        ${project.extraHTML ? project.extraHTML : ''}
    </div>
    `;
    projectContainer.innerHTML += projectHTML;
}
