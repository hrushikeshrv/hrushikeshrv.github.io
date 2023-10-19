const calculateButton = document.querySelector('#calculate-button');
const sgpaInputs = document.querySelectorAll('.sgpa-input');
const creditInputs = document.querySelectorAll('.credit-input');
const cgpaDisplay = document.querySelector('#cgpa-result');
const name = document.querySelector('#name');
const getSavedButton = document.querySelector('#get-saved-sgpas');

function calculateCGPA() {
    let gpa = 0;
    let credits = 0;
    for (let i = 0; i < 8; i++) {
        if (sgpaInputs[i].value && creditInputs[i].value) {
            gpa += parseFloat(sgpaInputs[i].value) * parseFloat(creditInputs[i].value);
            credits += parseInt(creditInputs[i].value);
        }
    }
    cgpaDisplay.textContent = (gpa/credits).toFixed(3).toString();
    saveValues();
}

// Fetch saved SGPA values from Local Storage and populate inputs
function populateInputs() {
    if (name.value.length === 0) {
        let prevName = localStorage.getItem('lastUsedName');
        if (prevName) {
            name.value = prevName;
            populateInputs();
            return;
        }
        alert('Enter a name to get SGPAs for');
        return;
    }
    const sgpas = JSON.parse(localStorage.getItem(name.value));
    if (sgpas) {
        for (let i = 0; i < sgpas.length; i++) {
            console.log(sgpas[i][0], sgpas[i][1]);
            sgpaInputs[i].value = sgpas[i][0];
            creditInputs[i].value = sgpas[i][1];
        }
    }
    else {
        alert(`No saved SGPAs found for ${name.value}. Enter your SGPAs now and they will be saved for next time.`);
    }
}

// Save the current values of the SGPA and credit inputs under the name entered
function saveValues() {
    if (name.value.length === 0) return;
    let values = [];
    for (let i = 0; i < 8; i++) {
        if (sgpaInputs[i].value.length && creditInputs[i].value.length) {
            values.push([sgpaInputs[i].value, creditInputs[i].value]);
        }
        else {
            values.push([0, 0]);
        }
    }
    if (values.length === 0) return;
    localStorage.setItem(name.value, JSON.stringify(values));
    localStorage.setItem('lastUsedName', name.value);
}

calculateButton.addEventListener('click', calculateCGPA);
getSavedButton.addEventListener('click', populateInputs);