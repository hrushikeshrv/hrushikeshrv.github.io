class CardRenderer {
    /**
     * A rendering class for creating section cards.
     * @param data - The JSON data containing all entries for a particular section.
     * @param container - The DOM element where all cards will be rendered.
     * @param cardType - The type of card to be rendered. Should be one of `'work'`, `'education'`, `'projects'`, or `'co-curricular'`.
     * @param hiddenKeys - An array of keys that should not be rendered when rendering all cards. Defaults to an empty array.
     */
    constructor(data, container, cardType, hiddenKeys = []) {
        this.data = data;
        this.container = container;
        this.cardType = cardType;
        this.hiddenKeys = hiddenKeys;
    }

    renderCard(name) {
        const data = this.data[name];
        const container = document.createElement('div');
        container.classList.add('section-card');
        container.dataset.name = data.heading;
        container.dataset.shortName = data.shortName || data.heading;
        container.id = name;
        container.innerHTML = `
            <h2 class="section-title flexbox-row aic pageload-slide-up">
                ${data.logo ? `<img src="${data.logo.path}" alt="${name} logo" height="${data.logo.height}" width="${data.logo.width}" class="${data.logo.classList || ''}">` : ''}
                <span>${data.heading}</span>
            </h2>
        `;

        if (this.cardType === 'work') {
            let workListItems = '';
            if (data.responsibilities) {
                for (const responsibility of data.responsibilities) {
                    workListItems += `<li>${responsibility}</li>`;
                }
            }
            let workStoryParagraphs = '';
            if (data.story) {
                for (const paragraph of data.story) {
                    workStoryParagraphs += `<p>${paragraph}</p>`;
                }
            }
            container.innerHTML += `
            <div class="flexbox-row column-full section-content"> 
                <div class="flexbox-column column-half section-content-container pageload-fade-in" style="padding-left: 0;">
                    ${data.workRole ? `<strong class="work-role">${data.workRole}</strong>` : ''} 
                    <span class="work-location-dates">
                        ${data.location ? data.location + '<span class="space-lr"></span> &centerdot; <span class="space-lr"></span>' : ''}  
                        ${data.startDate ? data.startDate + ' - ' : ''} ${data.endDate ? data.endDate : data.startDate ? 'Present' : ''}
                    </span>
                     <ul>${workListItems}</ul>
                </div>
                <div class="flexbox-column column-half section-content-container pageload-fade-in">
                    ${workStoryParagraphs}
                </div>
            </div>
            `;
        }
        else if (this.cardType === 'projects') {
            let projectStoryParagraphs = '';
            if (data.description) {
                for (const description of data.description) {
                    if (Array.isArray(description))
                        projectStoryParagraphs += `<p class="${description.splice(1).join(' ')}">${description[0]}</p>`;
                    else
                        projectStoryParagraphs += `<p>${description}</p>`;
                }
            }
            if (data.links) {
                for (const link of data.links) {

                }
            }

            container.innerHTML += `
            <div class="flexbox-row column-full section-content"> 
                <div class="flexbox-column column-full section-content-container pageload-fade-in" style="padding-left: 0;">
                    ${projectStoryParagraphs}
                </div>
            </div>
            
            <div class="flexbox-row column-full section-content">
                
            </div>
            `;
        }
        this.container.appendChild(container);
    }

    render() {
        for (const name in this.data) {
            if (!this.hiddenKeys.includes(name))
                this.renderCard(name);
        }
    }
}
