const lastUpdatedContainer = document.querySelector('#last-updated');
const activeCasesContainer = document.querySelector('#active-cases');
const newCasesContainer = document.querySelector('#new-cases-date');
const newCasesToday = document.querySelector('#new-cases-today');
const pandemicStatusContainer = document.querySelector('#pandemic-status');

axios({
    method: 'get',
    url: 'https://api.covid19india.org/data.json',
})
.then(response => {
    const data = response.data['cases_time_series'];
    const labels = [];
    const newCases = [];
    const newRecoveries = [];

    let totalCases = 0;
    let totalRecoveries = 0;
    let lastUpdated = '';

    for (let day of data) {
        labels.push(day.date);
        newCases.push(day.dailyconfirmed);
        newRecoveries.push(day.dailyrecovered);

        totalCases = day.totalconfirmed;
        totalRecoveries = day.totalrecovered;
        lastUpdated = day.date;
    }
    
    lastUpdatedContainer.textContent = lastUpdated;
    newCasesContainer.textContent = lastUpdated;
    newCasesToday.textContent = parseInt(newCases[newCases.length-1]).toLocaleString();

    pandemicStatusContainer.textContent = getPandemicStatus(newCases.slice(newCases.length - 20));
    
    const activeCases = totalCases - totalRecoveries;
    activeCasesContainer.textContent = activeCases.toLocaleString();
    

    plotLineGraph(newCases, labels, 'Daily New Cases', 'rgb(255, 90, 90)', '#daily-cases-start-present-container');
    plotLineGraph(newCases.slice(newCases.length-30), labels.slice(labels.length-30), 'Daily New Cases', 'rgb(255, 90, 90)', '#daily-cases-30-days-container');
    plotLineGraph(newCases.slice(newCases.length-7), labels.slice(labels.length-7), 'Daily New Cases', 'rgb(255, 90, 90)', '#daily-cases-7-days-container');

    plotLineGraph(newRecoveries, labels, 'Daily New Cases', 'rgb(42, 190, 42)', '#daily-recoveries-start-present-container');
    plotLineGraph(newRecoveries.slice(newRecoveries.length-30), labels.slice(labels.length-30), 'Daily New Recoveries', 'rgb(42, 190, 42)', '#daily-recoveries-30-days-container');
    plotLineGraph(newRecoveries.slice(newRecoveries.length-7), labels.slice(labels.length-7), 'Daily New Recoveries', 'rgb(42, 190, 42)', '#daily-recoveries-7-days-container');
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