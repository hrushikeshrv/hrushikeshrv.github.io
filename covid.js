// fetch('https://api.covid19tracker.in/data/static/data.min.json');

const lastUpdatedContainers = document.querySelectorAll('.updated-on');
const activeCasesContainer = document.querySelector('#active-cases');
const deltaCasesToday = document.querySelector('#delta-cases-today');
const newCasesToday = document.querySelector('#new-cases-today');
const pandemicStatusContainer = document.querySelector('#pandemic-status');

const ajaxError = document.querySelector('#ajax-error');

const casesDownSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-caret-down svg-success" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round" style="position: relative; top: 7px; right: -7px;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M18 15l-6 -6l-6 6h12" transform="rotate(180 12 12)" />
    </svg>
`;

const casesUpSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-caret-up svg-red" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round" style="position: relative; top: 7px; right: -7px;">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M18 15l-6 -6l-6 6h12" />
    </svg>
`;
const deltaIndicator = document.querySelector('#delta-indicator-svg');

const labels = [];
let cases = {
    newCases: [],
    newRecoveries: [],
    totalCases: [],
    totalRecoveries: [],
    totalDeaths: []
}
let lastUpdated = '';

axios({
    method: 'get',
    url: 'https://api.covid19tracker.in/data/static/timeseries.min.json',
})
.then(response => {
    const data = response.data;
    console.log(response.data);

    for (let day in data['MH']['dates']) {
        cases.newCases.push(data['MH']['dates'][day]['delta']['confirmed']);
        cases.newRecoveries.push(data['MH']['dates'][day]['delta']['recovered']);
        cases.totalCases.push(data['MH']['dates'][day]['total']['confirmed']);
        cases.totalRecoveries.push(data['MH']['dates'][day]['total']['recovered']);
        cases.totalDeaths.push(data['MH']['dates'][day]['total']['deceased'])

        labels.push(day);
        lastUpdated = day;
    }

    lastUpdatedContainers.forEach(container => {
        container.textContent = lastUpdated;
    })
    const newCases = cases.newCases;
    const newRecoveries = cases.newRecoveries;
    const totalCases = cases.totalCases;
    const totalRecoveries = cases.totalRecoveries;
    const totalDeaths = cases.totalDeaths;

    newCasesToday.textContent = newCases[newCases.length-1].toLocaleString();
    deltaCasesToday.textContent = parseInt(newCases[newCases.length-1] - newRecoveries[newCases.length-1]).toLocaleString();
    if (newCases[newCases.length-1] - newRecoveries[newRecoveries.length-1] > 0) {
        deltaIndicator.innerHTML = casesUpSVG;
    }
    else if (newCases[newCases.length-1] - newRecoveries[newRecoveries.length-1] < 0) {
        deltaIndicator.innerHTML = casesDownSVG;
    }

    pandemicStatusContainer.textContent = getPandemicStatus(newCases.slice(newCases.length - 21));
    
    const activeCases = totalCases[totalCases.length-1] - totalRecoveries[totalRecoveries.length-1] - totalDeaths[totalDeaths.length-1];
    activeCasesContainer.textContent = activeCases.toLocaleString();
    
    console.log(newCases);
    plotLineGraph(newCases, labels, 'Daily New Cases', 'rgb(255, 90, 90)', '#daily-cases-start-present-container');
    plotLineGraph(newCases.slice(newCases.length-30), labels.slice(labels.length-30), 'Daily New Cases', 'rgb(255, 90, 90)', '#daily-cases-30-days-container');
    plotLineGraph(newCases.slice(newCases.length-7), labels.slice(labels.length-7), 'Daily New Cases', 'rgb(255, 90, 90)', '#daily-cases-7-days-container');

    plotLineGraph(newRecoveries, labels, 'Daily New Cases', 'rgb(42, 190, 42)', '#daily-recoveries-start-present-container');
    plotLineGraph(newRecoveries.slice(newRecoveries.length-30), labels.slice(labels.length-30), 'Daily New Recoveries', 'rgb(42, 190, 42)', '#daily-recoveries-30-days-container');
    plotLineGraph(newRecoveries.slice(newRecoveries.length-7), labels.slice(labels.length-7), 'Daily New Recoveries', 'rgb(42, 190, 42)', '#daily-recoveries-7-days-container');
})
.catch(error => {
    console.error(error);
    ajaxError.style.display = 'block';
})


function plotLineGraph(data, labels, title, color, id) {
    const container = document.querySelector(id);
    const plotData = [{
        x: labels,
        y: data,
        mode: 'lines+markers',
        name: title,
        line: {
            color: color,
            width: 1,
        }
    }];
    const layout = {
        hovermode: 'x',
        paper_bgcolor: 'rgb(241, 241, 241)',
        plot_bgcolor: 'rgb(241, 241, 241)',
        xaxis: {
            visible: false,
            showspikes: true,
            spikemode: 'across',
            spikethickness: 2,
            spikedash: 'solid',
        },
        yaxis: {
            showspikes: true,
            spikemode: 'across',
            spikethickness: 2,
            spikedash: 'solid',
        },
        margin: {
            l: 40,
            r: 20,
            t: 20,
            b: 30,
        }
    };
    const config = {
        displayModeBar: false,
    }
    Plotly.newPlot(container,plotData, layout, config);
}

function getPandemicStatus(newCases) {
    const diff = [];
    for (let i = 0; i < newCases.length-1; i++) {
        diff.push(newCases[i+1]-newCases[i]);
    }
    let aggregate = diff.reduce((a,b) => a+b, 0);
    if (-1000 < aggregate && aggregate < 1000) return 'Stable';
    else if (aggregate < -1000) return 'Improving';
    else if (aggregate > 1000) return 'Worsening';
}