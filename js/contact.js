function findGetParameter(parameterName) {
    let result = null, tmp = [];
    location.search
        .slice(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

const contactForm = document.querySelector('#contact-form');
const contactLinks = document.querySelectorAll('.contact-link');
const contactFormContainer = document.querySelector('#contact-form-popup-container');
const contactFormCloseButton = document.querySelector('#contact-form-popup-container .close-popup-button');
const submitButton = document.querySelector('#submit');

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    contactForm.reportValidity();
    if (contactForm.checkValidity()) {

    }
})

contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        contactFormContainer.classList.remove('hidden');
    })
})

document.addEventListener('DOMContentLoaded', (e) => {
    const contact = findGetParameter('mail');
    if (contact !== null) contactLinks[0].click();
})

contactFormCloseButton.addEventListener('click', (e) => {
    contactFormContainer.classList.add('hidden');
})