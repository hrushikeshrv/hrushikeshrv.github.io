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
        let workListItems = '';
        if (this.cardType === 'work' && data.responsibilities) {
            for (const responsibility of data.responsibilities) {
                workListItems += `<li>${responsibility}</li>`;
            }
        }
        let workStoryParagraphs = '';
        if (this.cardType === 'work' && data.story) {
            for (const paragraph of data.story) {
                workStoryParagraphs += `<p>${paragraph}</p>`;
            }
        }

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
            <div class="flexbox-row column-full section-content">
                <div class="flexbox-column column-half section-content-container pageload-fade-in" style="padding-left: 0;">
                    <strong class="work-role">${data.workRole}</strong>
                    <span class="work-location-dates">${data.location ? data.location + '<span class="space-lr"></span> &centerdot; <span class="space-lr"></span>' : ''}  ${data.startDate} - ${data.endDate}</span>
                    ${
                    this.cardType === 'work'
                        ? `<ul>${workListItems}</ul>`
                        : ''
                    }
                </div>
                <div class="flexbox-column column-half section-content-container pageload-fade-in">
                    ${
                    this.cardType === 'work'
                        ? workStoryParagraphs 
                        : ''
                    }
                </div>
            </div>
        `;
        this.container.appendChild(container);
    }

    render() {
        for (const name in this.data) {
            if (!this.hiddenKeys.includes(name))
                this.renderCard(name);
        }
    }
}
