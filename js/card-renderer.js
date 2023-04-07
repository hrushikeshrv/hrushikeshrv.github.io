class CardRenderer {
    constructor(data, container) {
        this.data = data;
        this.container = container;
    }

    renderCard(data) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'flexbox-row', 'pad-20', 'mar-20');
        let cardLogo = '';
        if (data.logo) {
            cardLogo += `<img src="${data.logo.path}" alt="${data.logo.alt}" width="${data.logo.width}" height="${data.logo.height}">`
        }
        cardElement.innerHTML = `
            <div class="flexbox-column card-logo">
                ${cardLogo}
            </div>
            <div class="flexbox-column card-content aifs">
                <h1 class="mbt-10">${data.heading}</h1>
            </div>
        `
    }
}

const projectContainer = document.querySelector('#project-card-container');
const projectJSON = document.querySelector('#project-data').src;
fetch(projectJSON)
    .then(response => response.json())
    .then(json => {
        const projectCardRenderer    = new CardRenderer(json, projectContainer);
    })
    .then(() => {
        initMJXGUIDemo();
        initTimelineDemo();
    });


const workContainer = document.querySelector('#work-card-container');
const workJSON = document.querySelector('#work-data').src;
fetch(workJSON)
    .then(response => response.json())
    .then(json => {
        const workCardRenderer = new CardRenderer(json, workContainer);
    })