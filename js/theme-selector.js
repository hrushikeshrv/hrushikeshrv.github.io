const sunSVG = `
   <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler light-theme-button icon-tabler-sunset-2" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 13h1" />
      <path d="M20 13h1" />
      <path d="M5.6 6.6l.7 .7" />
      <path d="M18.4 6.6l-.7 .7" />
      <path d="M8 13a4 4 0 1 1 8 0" />
      <path d="M3 17h18" />
      <path d="M7 20h5" />
      <path d="M16 20h1" />
      <path d="M12 5v-1" />
    </svg> 
`;

const moonSVG = `
   <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler dark-theme-button icon-tabler-moon" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </svg> 
`;

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