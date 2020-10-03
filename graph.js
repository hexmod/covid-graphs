let areas;
let areaForm;

async function handlePageLoad(chartArea, form) {
    let areasResponse = await fetch('./AreaTypes.json');
    areas = await areasResponse.json();

    areaForm = form;
    populateAreaList('utla');
    areaForm.areaTypeInput.addEventListener("change", handleAreaTypeChange);

    var ctx = chartArea.getContext("2d");
    var myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [
                {
                    label: "# of Votes",
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
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
        },
    });
}

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form navigating to a new page
}

function handleAreaTypeChange(event) {
    populateAreaList(this.value)
}

function populateAreaList(areaType) {
    let options = '';
    areas[areaType].forEach(element => {
        options += `<option value="${element}">${element}</option>`;
    });
    console.log(areaForm.areaInput.list);
    areaForm.areaInput.list.innerHTML = options;
}