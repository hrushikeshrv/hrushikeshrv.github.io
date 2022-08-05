class CardRenderer {
    constructor(data, container, navigation) {
        this.data = data;
        this.containerElement = container;
        this.navigationElement = navigation;
        this.cards = {};
        this.currentCard = this.data[Object.keys(this.data)[0]].heading;
        this.currentCardElement = null;
        this.currentNavElement = null;

        this.render();
    }

    addCardToNavigation(card) {
        const navElement = document.createElement('button');
        navElement.classList.add('flexbox-row', 'ajc', 'project-nav-link');
        navElement.dataset.projectHeading = card.heading;

        if (card.logo) {
            const projectLogo = document.createElement('img');
            projectLogo.classList.add('space-lr');
            projectLogo.src = card.logo.path;
            projectLogo.width = card.logo.width / 5;
            projectLogo.height = card.logo.height / 5;

            navElement.appendChild(projectLogo);
        }

        const cardName = document.createElement('span');
        cardName.classList.add('space-lr');
        cardName.textContent = card.heading;

        navElement.appendChild(cardName);
        this.navigationElement.appendChild(navElement);
        navElement.addEventListener('click', (evt) => {
            this.showCard(navElement.dataset.projectHeading);
            this.currentNavElement.classList.remove('current-project');
            navElement.classList.add('current-project');
            this.currentNavElement = navElement;
        })
    }

    renderCard(card) {
        let projectDescription = '';
        for (let desc of card.description) {
            if (desc instanceof Array) {
                projectDescription += `<span class="project-desc ${desc.slice(1).join(' ')}">${desc[0]}</span>`;
            }
            else {
                projectDescription += `<span class="project-desc">${desc}</span>`;
            }
        }

        let projectLinks = '';
        for (let link of card.links) {
            projectLinks += `
        <span class="flexbox-row ajc link ${link.className ? link.className : ''}" ${link.id ? `id=${link.id}` : ''}>
            ${link.svg}
            <span class="space-lr">${link.link}</span>
        </span>
        `;
        }

        let projectLogo = '';
        if (card.logo) {
            projectLogo += `<img src="${card.logo.path}" alt="${card.logo.alt}" width="${card.logo.width}" height="${card.logo.height}">`
        }

        const projectElement = document.createElement('div');
        projectElement.classList.add('flexbox-row', 'pad-50', 'mar-20', 'project');
        projectElement.id = `project-${card.heading}`;

        projectElement.innerHTML = `
        <div class="flexbox-column">
            ${projectLogo}
        </div>
        <div class="flexbox-column project-content">
            <h2 class="big mbt-10">${card.heading}</h2>
            ${projectDescription}
            <span class="flexbox-row pad-10 project-links">${projectLinks}</span>
            <span class="flexbox-row mt-10 flair">${card.flair}</span>
        </div>
        ${card.extraHTML ? card.extraHTML : ''}`;
        this.containerElement.appendChild(projectElement);
        this.cards[card.heading] = projectElement;
    }

    showCard(cardHeading) {
        this.currentCardElement.classList.remove('active-project');
        for (let p in this.cards) {
            let project =  this.cards[p];
            if (p === cardHeading) {
                project.classList.add('active-project');
                this.currentCardElement = project;
                break;
            }
        }
    }

    render() {
        for (let project in this.data) {
            this.addCardToNavigation(this.data[project]);
            this.renderCard(this.data[project]);
        }
        this.navigationElement.firstElementChild.classList.add('current-project');
        this.cards[this.currentCard].classList.add('active-project');
        this.currentCardElement = this.cards[this.currentCard];
        this.currentNavElement = this.navigationElement.firstElementChild;
    }
}

const projectContainer = document.querySelector('#project-card-container');
const projectListNavbar = document.querySelector('#project-navbar');

const projectJSON = document.querySelector('#project-data').src;
fetch(projectJSON)
    .then(response => response.json())
    .then(json => {
        const projectCardRenderer    = new CardRenderer(json, projectContainer, projectListNavbar);
    })
    .then(() => {
        initMJXGUIDemo();
        initTimelineDemo();
    });


const workContainer = document.querySelector('#work-card-container');
const workCardNavbar = document.querySelector('#work-navbar');

const workJSON = document.querySelector('#work-data').src;
fetch(workJSON)
    .then(response => response.json())
    .then(json => {
        const workCardRenderer = new CardRenderer(json, workContainer, workCardNavbar);
    })