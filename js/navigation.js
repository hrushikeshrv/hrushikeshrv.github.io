class PageNavigator {
    constructor() {
        this.sectionElements = document.querySelectorAll('section');
        this.sectionNames = [];
        this.sections = {};
        for (const section of this.sectionElements) {
            this.sectionNames.push(section.dataset.name);
            this.sections[section.dataset.name] = section.querySelectorAll('.section-card');
        }

        this.navigationItems = {};

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
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                this.showNextSubsection();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                this.showPreviousSubsection();
            }
        });

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
        this.navigationItems[this.currentSectionName].root.classList.add('active-nav-item');

        const fragment = window.location.hash.substring(1);
        if (fragment) {
            const sectionId = fragment.split('-')[0];
            const sectionName = document.querySelector(`#${sectionId}`).dataset.name;
            const subsectionIdx = parseInt(fragment.split('-')[1]);
            if (this.sectionNames.includes(sectionName)) {
                this.showSection(sectionName);
                if (subsectionIdx && subsectionIdx >= 0 && subsectionIdx < this.sections[sectionName].length) {
                    this.showSubsection(subsectionIdx);
                }
            } else {
                console.warn(`Section "${sectionName}" not found in the document.`);
            }
        }

        const mainNavLinks = document.querySelectorAll('a.section-link');
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

    get currentSectionNavElement() {
        return this.navigationItems[this.currentSectionName].root;
    }

    get currentSubsectionNavContainerElement() {
        return this.navigationItems[this.currentSectionName].subsectionContainer;
    }

    get currentSubsectionNavElement() {
        return this.navigationItems[this.currentSectionName].subsections[this.currentSubsection];
    }

    showNextSubsection() {
        if (
            this.currentSubsection >= this.sections[this.currentSectionName].length - 1
            && this.currentSection >= this.sectionNames.length
        ) return;
        if (this.currentSubsection >= this.sections[this.currentSectionName].length - 1) {
            this.currentSection++;
            this.currentSubsection = 0;
        }
        else this.currentSubsection++;
        this.showSection(this.currentSectionName);
        this.showSubsection(this.currentSubsection);
    }

    showPreviousSubsection() {
        if (this.currentSection === 0 && this.currentSubsection <= 0) return;
        if (this.currentSubsection <= 0) {
            this.currentSection--;
            this.currentSubsection = this.sections[this.sectionNames[this.currentSection]].length - 1;
        }
        else this.currentSubsection--;
        this.showSection(this.currentSectionName);
        this.showSubsection(this.currentSubsection);
    }

    showSection(sectionName) {
        const sectionIndex = this.sectionNames.indexOf(sectionName);
        if (sectionIndex === -1) {
            console.error(`Section "${sectionName}" not found.`);
            return;
        }
        for (const section of this.sectionElements) {
            section.classList.add('hidden');
            for (const subsection of this.sections[section.dataset.name]) {
                subsection.classList.add('hidden');
            }
        }
        for (const navItem in this.navigationItems) {
            this.navigationItems[navItem].root.classList.remove('active-nav-item');
            this.navigationItems[navItem].subsectionContainer?.classList.remove('shown');
            for (const subsectionItem of this.navigationItems[navItem].subsections) {
                subsectionItem.classList.remove('active-nav-item');
            }
        }

        this.currentSection = sectionIndex;
        this.currentSectionNavElement.classList.add('active-nav-item');
        this.currentSectionElement.classList.remove('hidden');
        this.currentSubsectionNavContainerElement?.classList.add('shown');
        this.currentSubsectionElement?.classList.remove('hidden');
        this.currentSubsectionNavElement?.classList.add('active-nav-item');
        window.location.hash = `${this.currentSectionElement.id}`;
    }

    showSubsection(index) {
        if (index < 0 || index >= this.sections[this.currentSectionName].length) return;
        this.currentSubsectionNavElement?.classList.remove('active-nav-item');
        this.currentSubsectionElement.classList.add('hidden');
        this.currentSubsection = index;
        this.currentSubsectionElement.classList.remove('hidden');
        this.currentSubsectionNavElement?.classList.add('active-nav-item');
        window.location.hash = `${this.currentSectionElement.id}-${this.currentSubsection}`;
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
                this.showSubsection(0);
            })
            this.navigationItems[sectionName] = {root: navItem, subsectionContainer: null, subsections: []};
            if (this.sections[sectionName].length > 0) {
                const subNavContainer = document.createElement('div');
                subNavContainer.classList.add('inter-section-sub-nav', 'flexbox-column', 'hide-scrollbar', 'aife');
                this.navigationItems[sectionName].subsectionContainer = subNavContainer;
                navContainer.appendChild(subNavContainer);
                for (let i = 0; i < this.sections[sectionName].length; i++) {
                    const subsection = this.sections[sectionName][i];
                    const subsectionItem = document.createElement('button');
                    subsectionItem.classList.add('inter-section-sub-nav-item');
                    subsectionItem.textContent = subsection.dataset.shortName || subsection.dataset.name;
                    subsectionItem.dataset.sectionName = sectionName;
                    subsectionItem.dataset.subsectionId = subsection.id;
                    subNavContainer.appendChild(subsectionItem);
                    subsectionItem.addEventListener('click', (e) => {
                        this.showSection(sectionName);
                        this.showSubsection(i);
                    });
                    this.navigationItems[sectionName].subsections.push(subsectionItem);
                }
            }
        }
        const showNextSubsectionButton = document.createElement('button');
        showNextSubsectionButton.id = 'show-next-subsection';
        showNextSubsectionButton.classList.add('inter-section-nav-item');
        showNextSubsectionButton.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_down</span>';
        navContainer.appendChild(showNextSubsectionButton);
        showNextSubsectionButton.addEventListener('click', () => {
            this.showNextSubsection();
        });
        const showPreviousSubsectionButton = document.createElement('button');
        showPreviousSubsectionButton.id = 'show-previous-subsection';
        showPreviousSubsectionButton.classList.add('inter-section-nav-item');
        showPreviousSubsectionButton.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_up</span>';
        navContainer.prepend(showPreviousSubsectionButton);
        showPreviousSubsectionButton.addEventListener('click', () => {
            this.showPreviousSubsection();
        });
    }
}
