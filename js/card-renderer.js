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
        let projectDescription = '';
        for (let desc of data.description) {
            if (desc instanceof Array) {
                projectDescription += `<span class="project-desc ${desc.slice(1).join(' ')}">${desc[0]}</span>`;
            }
            else {
                projectDescription += `<span class="project-desc">${desc}</span>`;
            }
        }

        let projectLinks = '';
        for (let link of data.links) {
            projectLinks += `
            <span class="flexbox-row ajc link ${link.className ? link.className : ''}" ${link.id ? `id=${link.id}` : ''}>
                ${link.svg}
                <span class="space-lr">${link.link}</span>
            </span>
            `;
        }
        cardElement.innerHTML = `
            <div class="flexbox-column card-logo">
                ${cardLogo}
            </div>
            <div class="flexbox-column card-content aifs">
                <h2 class="mbt-10">${data.heading}</h2>
                ${projectDescription}
                <span class="flexbox-row pad-10 project-links">${projectLinks}</span>
                ${data.extraHTML ? data.extraHTML : ''}
            </div>
        `;
        this.container.appendChild(cardElement);
    }
}



const workContainer = document.querySelector('#work-card-container');
const workJSON = document.querySelector('#work-data').src;
fetch(workJSON)
    .then(response => response.json())
    .then(json => {
        const workCardRenderer = new CardRenderer(json, workContainer);
    })