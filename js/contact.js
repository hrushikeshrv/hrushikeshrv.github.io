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
const contactLinks = document.querySelectorAll('#contact-link');
const contactFormContainer = document.querySelector('#contact-form-popup-container');
const contactFormCloseButton = document.querySelector('#contact-form-popup-container .close-popup-button');
const submitButton = document.querySelector('#submit');
const contactAPI = 'https://pzxpy62e3k.execute-api.ap-south-1.amazonaws.com/default/anonymous-share';
const sendMessageSpinner = document.querySelector('#send-message-spinner');
const messageSendSuccessMessage = document.querySelector('#message-sent-successfully');
const messageSendErrorMessage = document.querySelector('#message-send-error');

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    messageSendErrorMessage.classList.add('hidden');
    messageSendSuccessMessage.classList.add('hidden');
    sendMessageSpinner.classList.add('hidden');
    contactForm.classList.remove('hidden');

    const messageInput = document.querySelector('#id_message');
    const nameInput = document.querySelector('#id_name');
    const emailInput = document.querySelector('#id_email');
    const subjectInput = document.querySelector('#id_subject');
    messageInput.value = messageEditor.getData();
    contactForm.reportValidity();
    if (contactForm.checkValidity()) {
        sendMessageSpinner.classList.remove('hidden');
        contactForm.classList.add('hidden');
        const requestData = {
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            message: messageInput.value,
        };
        const request = new Request(
            contactAPI,
            {
                method: 'POST',
                body: JSON.stringify(requestData),
            }
        );
        fetch(request)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                nameInput.value = '';
                emailInput.value = '';
                subjectInput.value = '';
                messageEditor.setData('');
                messageSendSuccessMessage.classList.remove('hidden');
                messageSendSuccessMessage.scrollIntoView(true);
            })
            .catch(error => {
                console.error(error);
                messageSendErrorMessage.classList.remove('hidden');
                messageSendErrorMessage.scrollIntoView(true);
            })
            .finally(() => {
                sendMessageSpinner.classList.add('hidden');
                contactForm.classList.remove('hidden');
            })
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