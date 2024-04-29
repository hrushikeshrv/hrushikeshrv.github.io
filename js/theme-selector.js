const sunSVG = `<span class="material-symbols-outlined light-theme-button">light_mode</span>`;

const moonSVG = `<span class="material-symbols-outlined dark-theme-button">dark_mode</span>`;

let themePreference;

document.addEventListener('DOMContentLoaded', () => {
    themePreference = localStorage.getItem('themePreference');
    if (themePreference === null || themePreference === 'light') {
        setLightTheme();
        saveThemePreference('light');
    }
    else {
        setDarkTheme();
        saveThemePreference('dark');
    }

    const changeThemeButton = document.querySelector('#change-theme-button');
    if (changeThemeButton) {
        changeThemeButton.addEventListener('click', () => {
            themePreference = localStorage.getItem('themePreference');
            if (themePreference === null || themePreference === 'light') {
                setDarkTheme();
                saveThemePreference('dark');
            }
            else {
                setLightTheme();
                saveThemePreference('light');
            }
        })
    }
})

function saveThemePreference(theme) {
    localStorage.setItem('themePreference', theme);
}

function setLightTheme() {
    const htmlEl = document.querySelector('html');
    htmlEl.classList.remove('dark-theme');
    htmlEl.classList.add('light-theme');
    const changeThemeButton = document.querySelector('#change-theme-button');
    if (changeThemeButton) changeThemeButton.innerHTML = moonSVG;
}

function setDarkTheme() {
    const htmlEl = document.querySelector('html');
    htmlEl.classList.remove('light-theme');
    htmlEl.classList.add('dark-theme');
    const changeThemeButton = document.querySelector('#change-theme-button');
    if (changeThemeButton) changeThemeButton.innerHTML = sunSVG;
}