import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const template = fs.readFileSync('index.template.html', 'utf8');
const dom = new JSDOM(template);
const document = dom.window.document;

const IGNORED_WORK_CARDS = new Set(['tugoz-co-op', 'coepidealabs', 'coepweb']);
const IGNORED_PROJECT_CARDS = new Set(['trak', 'classberg', 'classberg-exed', 'chainrxn']);
const IGNORED_CO_CURRICULAR_CARDS = new Set(['deeplearning']);

function renderWorkData() {
    const workData = JSON.parse(fs.readFileSync('data/work-data.json', 'utf8'));
    const workContainer = document.querySelector('#work-container');
    const workTemplate = document.querySelector('#work-card-template');
    for (let key in workData) {
        if (IGNORED_WORK_CARDS.has(key)) continue;
        console.log(`Rendering work card: ${key}`);

        const data = workData[key];
        const clone = workTemplate.content.cloneNode(true);
        clone.querySelector('.work-logo').src = data.logo.path;
        clone.querySelector('.work-logo').style.width = data.logo.width.toString() + 'px';
        clone.querySelector('.work-logo').style.height = data.logo.height.toString() + 'px';
        if (data.logo.classList) {
            clone.querySelector('.work-logo').classList.add(data.logo.classList);
        }
        clone.querySelector('.work-company').textContent = data.heading;
        clone.querySelector('.work-job-title').textContent = data.workRole;
        clone.querySelector('.work-location').textContent = data.location;
        clone.querySelector('.work-date').textContent = `${data.startDate} - ${data.endDate != null ? data.endDate : "Present"}`;

        for (let item of data.description) {
            const li = document.createElement('li');
            li.textContent = item;
            clone.querySelector('.work-description').appendChild(li);
        }

        workContainer.appendChild(clone);
    }
}

function renderProjectData() {
    const projectData = JSON.parse(fs.readFileSync('data/project-data.json', 'utf8'));
    const projectContainer = document.querySelector('#project-container');
    const projectTemplate = document.querySelector('#project-template');
    for (let key in projectData) {
        if (IGNORED_PROJECT_CARDS.has(key)) continue;
        console.log(`Rendering project: ${key}`);

        const data = projectData[key];
        const clone = projectTemplate.content.cloneNode(true);
        clone.querySelector('.project-logo').src = data.logo.path;
        clone.querySelector('.project-logo').style.width = data.logo.width.toString() + 'px';
        clone.querySelector('.project-logo').style.height = data.logo.height.toString() + 'px';
        if (data.logo.classList) {
            clone.querySelector('.project-logo').classList.add(data.logo.classList);
        }
        clone.querySelector('.project-title').textContent = data.heading;

        for (let item of data.description) {
            const li = document.createElement('li');
            if (Array.isArray(item)) {
                li.textContent = item[0];
                li.classList.add(...item.splice(1));
            }
            else {
                li.textContent = item;
            }
            clone.querySelector('.project-description').appendChild(li);
        }
        if (data.links) {
            for (let item of data.links) {
                const a = document.createElement('a');
                a.classList.add('pill-link')
                if (item.link) {
                    a.href = item.link;
                    a.target = '_blank';
                }
                if (item.svg) {
                    a.innerHTML += item.svg;
                }
                if (item.text) {
                    a.innerHTML += item.text;
                }
                clone.querySelector('.project-links').appendChild(a);
            }
        }
        if (data.extraHTML) {
            clone.querySelector('.project-card').innerHTML += data.extraHTML;
        }

        projectContainer.appendChild(clone);
    }
}

function renderCoCurricularData() {
    const coCurricularData = JSON.parse(fs.readFileSync('data/co-curricular-data.json', 'utf8'));
    const coCurricularContainer = document.querySelector('#co-curricular-container');
    const coCurricularTemplate = document.querySelector('#co-curricular-template');
    for (let key in coCurricularData) {
        if (IGNORED_CO_CURRICULAR_CARDS.has(key)) continue;
        console.log(`Rendering coCurricular: ${key}`);

        const data = coCurricularData[key];
        const clone = coCurricularTemplate.content.cloneNode(true);
        clone.querySelector('.co-curricular-logo').src = data.logo.path;
        clone.querySelector('.co-curricular-logo').style.width = data.logo.width.toString() + 'px';
        clone.querySelector('.co-curricular-logo').style.height = data.logo.height.toString() + 'px';
        if (data.logo.classList) {
            clone.querySelector('.co-curricular-logo').classList.add(data.logo.classList);
        }
        clone.querySelector('.co-curricular-title').textContent = data.heading;

        for (let item of data.description) {
            const li = document.createElement('li');
            if (Array.isArray(item)) {
                li.innerHTML = item[0];
                li.classList.add(...item.splice(1));
            }
            else {
                li.innerHTML = item;
            }
            clone.querySelector('.co-curricular-description').appendChild(li);
        }
        if (data.links) {
            for (let item of data.links) {
                const a = document.createElement('a');
                a.classList.add('pill-link')
                if (item.link) {
                    a.href = item.link;
                    a.target = '_blank';
                }
                if (item.svg) {
                    a.innerHTML += item.svg;
                }
                if (item.text) {
                    a.innerHTML += item.text;
                }
                clone.querySelector('.co-curricular-links').appendChild(a);
            }
        }

        coCurricularContainer.appendChild(clone);
    }
}

renderWorkData();
renderProjectData();
renderCoCurricularData();

fs.writeFileSync(path.join(process.cwd(), "index.html"), dom.serialize());