const sunSVG = `<span class="material-symbols-outlined light-theme-button" style="color: var(--warning-dark-1);">light_mode</span>`;
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

    themeToggleHook('light');
}

function setDarkTheme() {
    const htmlEl = document.querySelector('html');
    htmlEl.classList.remove('light-theme');
    htmlEl.classList.add('dark-theme');
    const changeThemeButton = document.querySelector('#change-theme-button');
    if (changeThemeButton) changeThemeButton.innerHTML = sunSVG;

    themeToggleHook('dark');
}

function waitForElement(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) return resolve(document.querySelector(selector));
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        })
    })
}

function themeToggleHook(theme) {
    console.log('Calling theme toggle hook');
    waitForElement('#usc-logo').then(uscLogo => {
        if (theme === 'dark') uscLogo.style.filter = 'invert(1)';
        else uscLogo.style.filter = 'invert(0)';
    })
    waitForElement('#wide-wings-logo').then(wideWingsLogo => {
        if (theme === 'dark') wideWingsLogo.style.filter = 'invert(1)';
        else wideWingsLogo.style.filter = 'invert(0)';
    })
    waitForElement('#mjxgui-logo').then(mjxguiLogo => {
        if (theme === 'dark') mjxguiLogo.style.filter = 'invert(0)';
        else mjxguiLogo.style.filter = 'invert(1)';
    })

    // Change the profile photo path on light and dark theme
    const profilePhoto = document.querySelector('#profile-photo');
    console.log(profilePhoto, theme);
    if (theme === 'dark') profilePhoto.src = '/images/profile-photo-dark.jpg';
    else profilePhoto.src = '/images/profile-photo-light.jpg';
}