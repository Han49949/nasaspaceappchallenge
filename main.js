// Sample GHG Data (this could be fetched from an API)
const ghgData = {
    "North America": [15, 12, 9, 13, 14],
    "Europe": [8, 7, 6, 5, 5],
    "Asia": [20, 18, 16, 19, 21],
    "Africa": [2, 3, 4, 3, 2],
    "South America": [5, 6, 7, 6, 5],
    "Australia": [4, 4, 5, 4, 5]
};

const years = [2015, 2016, 2017, 2018, 2019];

// Region coordinates (latitude, longitude)
const regionCoordinates = {
    "North America": [54.5260, -105.2551],
    "Europe": [54.5260, 15.2551],
    "Asia": [34.0479, 100.6197],
    "Africa": [-8.7832, 34.5085],
    "South America": [-14.2350, -51.9253],
    "Australia": [-25.2744, 133.7751]
};

function initializeMap() {
    const map = L.map('world-map').setView([20, 0], 2); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    for (const region in ghgData) {
        const avgEmission = ghgData[region].reduce((a, b) => a + b) / ghgData[region].length;
        const coords = regionCoordinates[region];


        L.circle(coords, {
            color: 'green',
            fillColor: '#4CAF50',
            fillOpacity: 0.5,
            radius: avgEmission * 100000 
        }).addTo(map)
        .bindPopup(`<b>${region}</b><br>Avg Emission: ${avgEmission} GtCO2`);
    }
}

function createChart(region) {
    const ctx = document.getElementById('ghg-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: `${region} GHG Emissions`,
                data: ghgData[region],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeMap();  
    const regSelect = document.querySelector("#region-select");
    createChart(regSelect.value);
});

document.getElementById('region-select').addEventListener('change', function(event) {
    const container = document.querySelector('#chart-container');
    const chart = container.querySelector("#ghg-chart");
    container.removeChild(chart);

    const chartNew = document.createElement("canvas");
    chartNew.id='ghg-chart';
    container.appendChild(chartNew);
    const selectedRegion = this.value;
    createChart(selectedRegion);
});
