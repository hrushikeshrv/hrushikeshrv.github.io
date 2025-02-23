class CardRenderer {
    constructor(data, container) {
        this.data = data;
        this.container = container;
    }

    renderCard(data) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'flexbox-row', 'no-pad-20');
        let cardLogo = '';
        if (data.logo) {
            cardLogo += `<img src="${data.logo.path}" alt="${data.logo.alt}" width="${data.logo.width}" height="${data.logo.height}" ${data.logo.id ? `id="${data.logo.id}"` : ''} ${data.logo.classList ? `class="${data.logo.classList}"` : ''}>`
        }
        let projectDescription = '';
        for (let desc of data.description) {
            if (desc instanceof Array) {
                projectDescription += `<p class="project-desc ${desc.slice(1).join(' ')}">${desc[0]}</p>`;
            }
            else {
                projectDescription += `<p class="project-desc">${desc}</p>`;
            }
        }

        let projectLinks = '';
        if (data.links) {
            projectLinks = '<span class="flexbox-row pad-10 project-links">';
            for (let link of data.links) {
                projectLinks += `
            <span class="flexbox-row ajc link ${link.className ? link.className : ''}" ${link.id ? `id=${link.id}` : ''}>
                ${link.svg}
                <span class="space-lr">${link.link}</span>
            </span>
            `;
            }
            projectLinks += '</span>';
        }

        let cardTimeline = '';
        if (data.startDate) {
            cardTimeline += `
            <i class="card-timeline mb-10">
                ${data.startDate} - ${data.endDate ? data.endDate : 'Present'}
            </i>
            `;
        }
        let workRole = '';
        if (data.workRole) {
            workRole += `<strong style="margin-bottom: 2px;">${data.workRole}</strong>`;
        }

        cardElement.innerHTML = `
            <div class="flexbox-column card-logo">
                ${cardLogo}
            </div>
            <div class="flexbox-column card-content aifs">
                <h2 class="mbt-10">${data.heading}</h2>
                ${workRole}
                ${cardTimeline}
                ${projectDescription}
                ${projectLinks}
                ${data.extraHTML ? data.extraHTML : ''}
            </div>
        `;
        this.container.appendChild(cardElement);
    }

    render() {
        for (let card in this.data) {
            this.renderCard(this.data[card]);
        }
    }
}
