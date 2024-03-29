const noteCardContainer = document.querySelector('#note-card-container');
let noteCards = document.querySelectorAll('.note-card');
const deleteConfirmationDialog = document.querySelector('#delete-confirm-dialog');
const deleteConfirmationButton = document.querySelector('#delete-confirm-button');


/**
 * @class
 * Represents the timeline the user will see.
 * Has methods to resize, scroll, fetch new notes from the server, filter and sort notes, and render itself
 */
class Timeline {
    constructor(element, notes) {
        this.element = element;
        this.startDate = null;
        this.endDate = null;
        this.notes = notes;

        this.notesDataset = [];
        this.timelineOptions = {
            maxHeight: window.innerHeight - 250,
            minHeight: window.innerHeight - 250,
            zoomKey: 'ctrlKey',
        };
        this.timeline = null;
    }


    // Takes the timeline's notes and renders them onto the timeline
    // Also takes the notes and creates HTML cards for them to show when the notes are clicked
    render() {
        this.notesDataset = [];
        for (let i=0; i < this.notes.length; i++) {
            this.notesDataset.push({
                id: this.notes[i].id,
                start: this.notes[i].date.slice(0, 10),
                content: this.toHTML(this.notes[i]),
                className: 'timeline-note-item-card flexbox-column',
                style: 'padding: 6px',
            })
            // this.notes[i].className = 'timeline-note-item-card flexbox-column';
            // this.notes[i].style = 'padding: 6px';
            // this.notes[i].content = this.toHTML(this.notes[i]);
            // this.notes[i].start = this.notes[i].date || this.notes[i].start;
            // this.notesDataset.push(this.notes[i]);
        }
        if (this.timeline) {this.timeline.destroy();}
        this.timeline = new vis.Timeline(this.element, this.notesDataset, this.timelineOptions);

        const tagData = this.element.querySelectorAll('i');
        tagData.forEach(tag => {
            const colors = tag.innerHTML.split(';');
            tag.parentElement.style.backgroundColor = colors[0];
            tag.parentElement.style.color = colors[1];
        })

        for (let note of this.notes) {
            noteCardContainer.innerHTML += getNoteDetailHTML(note);
        }

        this.addTimelineEventListeners();
    }


    // Adds all event listeners to the timeline and note cards each time the timeline is recreated
    addTimelineEventListeners() {
        noteCards = document.querySelectorAll('.note-card');
        // Show note detail card when the user clicks on the note in the timeline
        this.timeline.on('select', function(props) {
            if (props.items[0]) {
                // If we clicked on a note
                noteCards.forEach(card => {
                    if (card.dataset.noteId === props.items[0].toString()) {
                        card.style.left = '0';
                    }
                    else {
                        card.style.left = '-100%';
                    }
                })
            }
            else {
                // If we clicked out of a note to deselect it
                noteCards.forEach(card => {
                    card.style.left = '-100%';
                })
            }
        })

        // Close note card when users clicks the X
        noteCardContainer.querySelectorAll('.note-close-button').forEach(btn => {
            btn.addEventListener('click', function() {
                noteCards.forEach(card => {
                    card.style.left = '-100%';
                })
            })
        })
    }


    // Takes in a dictionary representing a note as a response from the server and returns
    // HTML content to render on the timeline
    toHTML(noteDict) {
        let noteTags = '';
        for (let tag of noteDict.tags) {
            noteTags += `
            <small>
                ${tag.name}
                <i>${tag.tag_color};${tag.text_color}</i>
            </small>`;
        }

        return `
            <div>
                <strong>${noteDict.title}</strong>
                <div>${noteTags}</div>
            </div>
        `
    }


    // Fetches notes from the server with the given parameters. Limits results to 40.
    // tags is an array containing tag ids. startDate and endDate are values of date inputs.
    // Returns a promise that is resolved when the server responds with search results.
    fetchNotes(tags=[], startDate='', endDate='', title='', nNotes=40, getPrivate=false) {
        if (nNotes > 100) nNotes = 100;

        if (startDate) this.startDate = new Date(startDate);
        if (endDate) this.endDate = new Date(endDate);

        return axios({
            method: 'get',
            url: searchNotesAPIURL + `?tags=${tags.toString()}&startDate=${startDate}&endDate=${endDate}&title=${title}&n-notes=${nNotes}&show_pvt=${getPrivate}`,
        })
    }

    fetchNotesWithTags(tagSet, getPrivate=false) {
        // Fetches notes that have tags given in tagSet and renders them onto the timeline.
        // tagSet is a set() of tag ids

        this.fetchNotes(getSetString(tagSet), '', '', '', 40, getPrivate)
            .then(response => {
                this.notes = response.data;
            })
            .then(() => {
                this.render();
                progressMessage.innerHTML = '';
                progressMessageContainer.classList.add('hidden');
                updateChosenTagsSidebar();
            })
            .catch(error => {
                console.log(error);
                progressMessage.innerHTML = 'We ran into an error :/';
                progressMessageContainer.classList.add('error-container');
            })
    }
}


// Close the delete confirmation dialog box when the X is clicked
deleteConfirmationDialog.querySelector('.note-close-button').addEventListener('click', function() {
    deleteConfirmationDialog.classList.add('hidden');
})

// Add event listeners to delete a note
deleteConfirmationButton.addEventListener('click', function() {
    if (!this.dataset.deleteUrl) return;
    const deletingMessage = deleteConfirmationDialog.querySelector('.error-container');
    deletingMessage.classList.remove('hidden');
    axios({
        method: 'delete',
        url: this.dataset.deleteUrl,
        headers: {
            'X-CSRFToken': csrf,
        }
    })
        .then(response => {
            if (response.status === 200) {
                deletingMessage.classList.add('hidden');
                deleteConfirmationButton.dataset.deleteUrl = '';
                deleteConfirmationDialog.classList.add('hidden');
                // Remove the note from the timeline
                for (let i = 0; i < timeline.notes.length; i++) {
                    let note = timeline.notes[i];
                    if (note.id === response.data[0]) {
                        timeline.notes.splice(i, 1);
                        break;
                    }
                }
                timeline.render();
            }
        })
        .catch(error => {
            console.error(error);
            deletingMessage.classList.add('hidden');
            deleteConfirmationButton.dataset.deleteUrl = '';
            deleteConfirmationDialog.classList.add('hidden');
        })
})

function dateISOToStandard(date) {
    // Converts a date string returned by the server into a readable string.
    // 2021-11-15T18:32:24+05:30 becomes --> "15th November 2021"
    const monthMap = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
    }
    let dateArray = date.split('T')[0].split('-');
    let dateDigit = parseInt(dateArray[2][dateArray[2].length-1]), dateSuffix;

    if (dateDigit === 1) dateSuffix = 'st'
    else if (dateDigit === 2) dateSuffix = 'nd'
    else if (dateDigit === 3) dateSuffix = 'rd'
    else dateSuffix = 'th'

    if ([11, 12, 13].includes(parseInt(dateArray[2]))) dateSuffix = 'th'
    dateArray[2] = parseInt(dateArray[2]);

    return `${dateArray[2]}${dateSuffix} ${monthMap[dateArray[1]]} ${dateArray[0]}`;
}

// Creates HTML for the note cards
function getNoteDetailHTML(noteDict) {
    let noteTags = '';
    for (let tag of noteDict.tags) {
        noteTags += `<small data-tag-id="${tag.id}" class="helper-button clickable-tag-filter" style="background-color:${tag.tag_color};color:${tag.text_color};border-color:transparent;">${tag.name}</small>`;
    }
    return `
        <div class="flexbox-column note-card pad-30 aifs" data-note-id="${noteDict.id}">
            <span class="note-close-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </span>
            <div class="flexbox-column">
                <h1 class="no-margin">${noteDict.title}</h1>
                <code class="mbt-10">${noteDict.date ? dateISOToStandard(noteDict.date) : dateISOToStandard(noteDict.start)}</code>
                <div class="flexbox-row mb-10">${noteTags}</div>
                <div class="note-card-note">${noteDict.note}</div>
                <span class="mbt-10 message-warning mobile-element">
                    View this timeline on a device with a big screen for the best experience :)
                </span>
            </div>
        </div>
    `;
}

const timelineTags = {
    birthday: {
        id: 1,
        name: 'Birthday',
        tag_color: '#FFEB3B',
        text_color: '#000000'
    },
    tennis: {
        id: 2,
        name: 'Tennis',
        tag_color: '#F33245',
        text_color: '#FFFFFF'
    },
    college: {
        id: 3,
        name: 'College',
        tag_color: '#ECBA37',
        text_color: '#000000'
    },
    projects: {
        id: 4,
        name: 'Projects',
        tag_color: '#C737EC',
        text_color: '#FFFFFF',
    }
}

const timelineNotes = [
    {
        date: '2002-01-17T00:30:00Z',
        id: 1,
        note: "<p>Birthday!</p>",
        tags: [timelineTags.birthday],
        title: 'Birthday🥳',
    },
    {
        date: '2006-01-17T00:30:00Z',
        id: 2,
        note: "<p>I stepped on a tennis court for the first time.🎾</p>",
        tags: [timelineTags.tennis],
        title: 'Started Playing Tennis'
    },
    {
        date: '2019-07-24T00:30:00Z',
        id: 3,
        note: "<p>I studied Engineering Physics at National Institute of Technology, Calicut for 3 semesters. In December 2019, I took my first course in Computer Science online, and I discovered that I wanted to study computer science for the rest of my life. </p><p>I decided to leave NIT, Calicut, and took admission at the College of Engineering, Pune, where I could study electronics engineering and computer science at the same time.",
        tags: [timelineTags.college],
        title: 'Engg. Physics at NIT, Calicut'
    },
    {
        date: '2020-12-01T00:30:00Z',
        id: 4,
        note: "<p>Started studying electronics engineering at College of Engineering, Pune.</p>",
        tags: [timelineTags.college],
        title: 'EECS at COEP'
    },
    {
        date: '2020-09-20T00:30:00Z',
        id: 5,
        note: "<p>As I was preparing for the entrance exams I had to give to get admission into COEP, I couldn't find any place where I could practice for the exam and get some analysis of my performance (for free). I decided to start work on <a href='http://classberg.com'>classberg.com</a>, a platform where students could create their own tests from ClassBerg's database and get analytics on their performance. </p><p>ClassBerg went through 2 pivots to turn into the platform it is now, a complete educational suite.</p>",
        tags: [timelineTags.projects],
        title: 'Started Working on ClassBerg'
    }
]

const timelineElement = document.querySelector('#timeline-demo-1');
let timeline;
let timelineInitialized = false;

function initTimelineDemo() {
    const showTimelineButton = document.querySelector('#timeline-demo-button-1');
    const timelineContainer = document.querySelector('#timeline-demo-1');
    showTimelineButton.addEventListener('click', function() {
        if (timelineInitialized) {
            timelineContainer.scrollIntoView();
            return;
        }
        timelineInitialized = true;
        timelineContainer.classList.remove('hidden');
        timelineContainer.scrollIntoView();
        timeline = new Timeline(timelineElement, timelineNotes);
        timeline.render();
        timeline.element.removeAttribute('style');
        timeline.element.scrollIntoView();
    })
}