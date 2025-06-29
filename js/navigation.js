class PageNavigator {
    constructor() {
        this.sectionElements = document.querySelectorAll('section');
        this.sectionNames = [];
        this.sections = {};
        for (const section of this.sectionElements) {
            this.sectionNames.push(section.dataset.name);
            this.sections[section.dataset.name] = section.querySelectorAll('.section-card');
        }
        for (const sectionName in this.sections) {
            if (this.sections[sectionName].length > 0) {
                this.sections[sectionName][0].classList.remove('hidden');
            }
        }

        // An index into this.sectionNames
        this.currentSection = 0;
        // An index into this.sections[this.sectionNames[this.currentSection]]
        this.currentSubsection = 0;

        this.isThrottled = false;
        window.addEventListener('wheel', (e) => {
            if (this.isThrottled) return;
            this.isThrottled = true;

            if (e.deltaY > 0) this.showNextSubsection();
            else if (e.deltaY < 0) this.showPreviousSubsection();
            setTimeout(() => {
                this.isThrottled = false;
            }, 500); // Throttle for 500 ms
        }, { passive: true });

        this.touchStartY = 0;
        this.touchEndY = 0;
        window.addEventListener('touchstart', (e) => {
            this.touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });
        window.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            if (this.touchEndY < this.touchStartY) {
                this.showNextSubsection();
            } else if (this.touchEndY > this.touchStartY) {
                this.showPreviousSubsection();
            }
        });

        this.renderNavigation();
    }

    get currentSectionName() {
        return this.sectionNames[this.currentSection];
    }

    get currentSectionElement() {
        return this.sectionElements[this.currentSection];
    }

    get currentSubsectionElement() {
        return this.sections[this.currentSectionName][this.currentSubsection];
    }

    showNextSubsection() {
        // If we are at the last subsection of the current section, move to the next section
        if (this.currentSubsection >= this.sections[this.currentSectionName].length - 1) {
            // If no more sections, return
            if (this.currentSection >= this.sectionNames.length - 1) return;
            this.currentSectionElement.classList.add('hidden');
            this.currentSection++;
            this.currentSectionElement.classList.remove('hidden');
            this.currentSubsection = 0;
        }
        else {
            if (this.currentSubsectionElement === undefined) {
                console.error("Current subsection element is undefined. This may be due to an incorrect section or subsection index.");
                return;
            }
            this.currentSubsectionElement.classList.add('hidden');
            this.currentSubsection++;
            this.currentSubsectionElement.classList.remove('hidden');
        }
    }

    showPreviousSubsection() {
        // If we are at the first subsection of the current section, move to the previous section
        if (this.currentSubsection === 0) {
            // If no more sections, return
            if (this.currentSection <= 0) return;
            this.currentSectionElement.classList.add('hidden');
            this.currentSection--;
            this.currentSectionElement.classList.remove('hidden');
            this.currentSubsection = Math.max(0, this.sections[this.sectionNames[this.currentSection]].length - 1);
        }
        else {
            if (this.currentSubsectionElement === undefined) {
                console.error("Current subsection element is undefined. This may be due to an incorrect section or subsection index.");
                return;
            }
            this.currentSubsectionElement.classList.add('hidden');
            this.currentSubsection--;
            this.currentSubsectionElement.classList.remove('hidden');
        }
    }

    showSection(sectionName) {
        const sectionIndex = this.sectionNames.indexOf(sectionName);
        if (sectionIndex === -1) {
            console.error(`Section "${sectionName}" not found.`);
            return;
        }
        this.currentSectionElement.classList.add('hidden');
        this.currentSection = sectionIndex;
        this.currentSectionElement.classList.remove('hidden');
        this.currentSubsection = 0;
        if (this.sections[sectionName].length > 0)
            this.sections[sectionName][0].classList.remove('hidden');
    }

    renderNavigation() {
        const navContainer = document.querySelector('#inter-section-nav');
        if (!navContainer) {
            console.error("Navigation container not found. Ensure there is an element with id 'inter-section-nav'.");
            return;
        }
        for (const sectionName of this.sectionNames) {
            const navItem = document.createElement('button');
            navItem.classList.add('inter-section-nav-item');
            navItem.dataset.sectionName = sectionName;
            navItem.textContent = sectionName;
            navContainer.appendChild(navItem);
            navItem.addEventListener('click', (e) => {
                this.showSection(navItem.dataset.sectionName);
            })
        }
        const showNextSubsectionButton = document.createElement('button');
        showNextSubsectionButton.id = 'show-next-subsection';
        showNextSubsectionButton.classList.add('inter-section-nav-item');
        showNextSubsectionButton.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_down</span>';
        navContainer.appendChild(showNextSubsectionButton);
    }
}
