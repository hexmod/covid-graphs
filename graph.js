let areas;
let areaForm;
let myChart;

async function handlePageLoad(chartArea, form) {
    areas = await getAreaData();
    areaForm = form;

    populateAreaList('utla');
    areaForm.areaTypeInput.addEventListener('change', handleAreaTypeChange);
    areaForm.areaInput.addEventListener('change', handleAreaChange);
    createChart(chartArea);
}

function createChart(chartArea) {
    const ctx = chartArea.getContext('2d');
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1,
                lineTension: 0
            },
            {
                label: '',
                data: [],
                backgroundColor: 'rgba(149, 15, 15, 0.2)',
                borderColor: 'rgba(149, 15, 15, 1)',
                borderWidth: 1,
                lineTension: 0
            }]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
            title: {
                display: true,
                text: 'UK Covid Data'
            },
            responsive: true,
            maintainAspectRatio: false
        },
    });
}

function updateChart(covidData, mainDataKey, mainDataLabel, chartTitle) {
    let weeksData = [];
    myChart.data.datasets[0].data = [];
    myChart.data.datasets[1].data = [];
    myChart.data.labels = [];

    covidData.reverse().forEach(function (dataPoint, index) {
        if (index > 6) {
            weeksData.shift();
        }
        weeksData.push(dataPoint[mainDataKey]);
        myChart.data.labels.push(dataPoint.date);
        myChart.data.datasets[0].data.push(dataPoint[mainDataKey]);
        myChart.data.datasets[1].data.push(calculateWeekAverage(weeksData));
    })

    myChart.data.datasets[0].label = mainDataLabel;
    myChart.data.datasets[1].label = '7 Day Average';
    myChart.options.title.text = chartTitle;

    myChart.update();
}

function calculateWeekAverage(weeksData) {
    let total = 0;
    weeksData.forEach(element => {
        total += element;
    });
    return Math.round(total / weeksData.length);
}

async function getAreaData() {
    let areasResponse = await fetch('./areaTypes.json');
    return areasResponse.json();
}

function handleFormSubmit(event) {
    // Prevent form navigating to a new page
    event.preventDefault();
}

function handleAreaTypeChange() {
    populateAreaList(this.value)
}

function populateAreaList(areaType) {
    let options = '';
    areas[areaType].forEach(element => {
        options += `<option value="${element}">${element}</option>`;
    });
    areaForm.areaInput.innerHTML = options;
}

async function handleAreaChange(event) {
    const covidData = await getNewCasesByPublishDate(areaForm.areaTypeInput.value, this.value)
    updateChart(covidData, 'newCases', 'New Cases By Specimen Date', `New Cases By Specimen Date in ${this.value}`);
}

async function getNewCasesByPublishDate(areaType, areaName) {
    let dataResponse = await fetch(`https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=${areaType};areaName=${areaName}&structure={"date":"date","newCases":"newCasesBySpecimenDate"}&format=json`);
    parsedData = await dataResponse.json();
    return parsedData.data;
}