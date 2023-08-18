

// Load the Visualization API and the corechart package.
google.charts.load('current', {
    'packages': ['corechart', 'geochart'],
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(initialize);

function initialize() {
    fetch('http://127.0.0.1:7000/api/data')
        .then(response => response.json())
        .then(data => {
            drawGenderChart(data);
            drawRaceChart(data);
            drawBubbleChart(data);
            drawAreaChart(data);
            drawScatterChart(data);

        })
        .catch(error => console.error('Error fetching data:', error));
}


function drawGenderChart(data) {
    // Initialize counters for each gender
    var genderCounts = {
        Male: 0,
        Female: 0,
    };

    // Loop through the data
    data.forEach(function (record) {
        // Check if the record represents gender information
        if (record.StratificationCategory1 === 'Gender') {
            var gender = record.Stratification1;

            // Increment the count for the corresponding gender
            genderCounts[gender]++;
        }
    });

    // Create the data table for gender chart.
    var genderDataTable = new google.visualization.DataTable();
    genderDataTable.addColumn('string', 'Gender');
    genderDataTable.addColumn('number', 'Count');
    genderDataTable.addRows([
        ['Male', genderCounts['Male']],
        ['Female', genderCounts['Female']],
    ]);

    // Set chart options for gender chart.
    var genderOptions = {
        title: '',
        legend: { position: 'none' },
    };

    // Instantiate and draw the gender chart.
    var genderChart = new google.visualization.PieChart(document.getElementById('genderChart'));
    genderChart.draw(genderDataTable, genderOptions);
}

function drawRaceChart(data) {
    // Initialize counters for each race/ethnicity
    var raceCounts = {};

    // Loop through the data
    data.forEach(function (record) {
        // Check if the record represents race/ethnicity information
        if (record.StratificationCategory1 === 'Race/Ethnicity') {
            var race = record.Stratification1;

            // Increment the count for the corresponding race/ethnicity
            if (raceCounts[race]) {
                raceCounts[race]++;
            } else {
                raceCounts[race] = 1;
            }
        }
    });

    // Create the data table for race chart.
    var raceDataTable = new google.visualization.DataTable();
    raceDataTable.addColumn('string', 'Race/Ethnicity');
    raceDataTable.addColumn('number', 'Count');


    // Convert raceCounts object to array for data table.
    var raceData = Object.entries(raceCounts);
    raceDataTable.addRows(raceData);



    // Set chart options for race chart.
    var raceOptions = {
        title: '',
        colors: ['#1A8763', '#871B47', '#999999'],
        interpolateNulls: false,
        curveType: 'function',
    };

    // Instantiate and draw the race chart.
    var raceChart = new google.visualization.BarChart(document.getElementById('raceChart'));
    raceChart.draw(raceDataTable, raceOptions);
}

function drawBubbleChart(data) {
    // Create an object to store the aggregated data by city
    var cityData = {};

    // Loop through the data
    data.forEach(function (record) {
        if (record.LocationDesc && record.DataValue) {
            var city = record.LocationDesc;
            var prevalence = parseFloat(record.DataValue);

            // If the city already exists in cityData, update the aggregated values
            if (cityData[city]) {
                cityData[city].prevalenceSum += prevalence;
                cityData[city].count++;
            } else {
                // If the city does not exist in cityData, add a new entry
                cityData[city] = {
                    prevalenceSum: prevalence,
                    count: 1
                };
            }
        }
    });

    // Sort the cityData based on prevalence (highest to lowest)
    var sortedData = Object.keys(cityData).sort(function (a, b) {
        return cityData[b].prevalenceSum - cityData[a].prevalenceSum;
    });

    // Get the prevalence slider and bubble count slider elements
    var prevalenceSlider = document.getElementById('prevalenceSlider');
    var bubbleCountSlider = document.getElementById('bubbleCountSlider');
    var prevalenceLabel = document.getElementById('prevalenceLabel');
    var bubbleCountLabel = document.getElementById('bubbleCountLabel');

    // Set the initial values of the sliders and labels
    prevalenceSlider.value = 50;
    bubbleCountSlider.value = 20;
    prevalenceLabel.innerText = '50';
    bubbleCountLabel.innerText = '20';




    // Function to update the bubble chart based on slider values
    function updateBubbleChart() {
        var maxPrevalence = parseFloat(prevalenceSlider.value);
        var maxBubbles = parseInt(bubbleCountSlider.value);

        // Create the data table for the bubble chart.
        var bubbleDataTable = new google.visualization.DataTable();
        bubbleDataTable.addColumn('string', 'City');
        bubbleDataTable.addColumn('number', 'Prevalence');
        bubbleDataTable.addColumn('number', 'Count');
        bubbleDataTable.addColumn({ type: 'string', role: 'style' });

        // Convert the aggregated data into rows for the data table
        var numBubbles = 0;
        var maxPrevalence = parseFloat(prevalenceSlider.value);
        var maxBubbles = parseInt(bubbleCountSlider.value);

        for (var i = 0; i < sortedData.length; i++) {
            var city = sortedData[i];
            var averagePrevalence = cityData[city].prevalenceSum / cityData[city].count;

            if (averagePrevalence <= maxPrevalence && numBubbles < maxBubbles) {
                var color = getRandomColor();
                bubbleDataTable.addRow([
                    city,
                    averagePrevalence,
                    cityData[city].count,
                    'color: ' + color
                ]);
                numBubbles++;
            }
        }

        // Set chart options for the bubble chart.
        var bubbleOptions = {
            title: '',
            hAxis: { title: 'Prevalence' },
            vAxis: { title: 'Count' },
            bubble: { textStyle: { fontSize: 11 } }
        };

        // Instantiate and draw the bubble chart.
        var bubbleChart = new google.visualization.BubbleChart(document.getElementById('bubbleChart'));
        bubbleChart.draw(bubbleDataTable, bubbleOptions);
    }

    // Add event listeners to the sliders to update the chart when the values change
    prevalenceSlider.addEventListener('input', function () {
        prevalenceLabel.innerText = prevalenceSlider.value + '%';
        updateBubbleChart();
    });

    bubbleCountSlider.addEventListener('input', function () {
        bubbleCountLabel.innerText = bubbleCountSlider.value;
        updateBubbleChart();
    });

    // Initial draw of the bubble chart
    updateBubbleChart();
}

// Function to generate a random color (hex code)
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function drawAreaChart(data) {
    // Create a pivot table to count records for each year and topic
    var pivotTable = {};

    // Get unique topics and years
    var uniqueTopics = new Set();
    var uniqueYears = new Set();

    // Loop through the data
    data.forEach(function (record) {
        if (record.YearStart && record.Topic) {
            var year = parseInt(record.YearStart); // Convert to number
            var topic = record.Topic;

            // Check if year is a valid number
            if (!isNaN(year)) {
                uniqueYears.add(year);
                uniqueTopics.add(topic);

                // Increment the count for the corresponding year and topic
                var key = year + '_' + topic;
                if (pivotTable[key]) {
                    pivotTable[key]++;
                } else {
                    pivotTable[key] = 1;
                }
            }
        }
    });

    // Create the data table for the area chart.
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('date', 'Year'); // Use date type for the year column

    // Dynamically add columns for each unique topic
    uniqueTopics.forEach(function (topic) {
        dataTable.addColumn('number', topic);
    });

    // Add rows to the data table
    var years = Array.from(uniqueYears);
    years.sort(function (a, b) {
        return a - b;
    });

    years.forEach(function (year) {
        var rowData = [new Date(year, 0, 1)]; // Use January 1st as the date for the year

        uniqueTopics.forEach(function (topic) {
            var key = year + '_' + topic;
            var count = pivotTable[key] || 0;
            rowData.push(count);
        });

        dataTable.addRow(rowData);
    });

    // Set chart options for the area chart.
    var options = {
        title: '',
        hAxis: { title: 'Year', titleTextStyle: { color: '#333' }, format: 'yyyy' }, // Format the year as a four-digit number
        vAxis: { minValue: 0 },
    };

    // Instantiate and draw the area chart.
    var chart = new google.visualization.AreaChart(document.getElementById('areaChart'));
    chart.draw(dataTable, options);
}

function drawScatterChart(data) {
    // Create the data table for the scatter chart.
    var scatterDataTable = new google.visualization.DataTable();
    scatterDataTable.addColumn('number', 'YearStart');
    scatterDataTable.addColumn('number', 'Prevalence');

    // Filter the data for women with Hispanic ethnicity
    var filteredData = data.filter(function (record) {
        return (
            record.StratificationCategory1 === 'Race/Ethnicity' &&
            record.Stratification1 === 'Hispanic'
        );
    });

    // Add data rows to the scatterDataTable
    filteredData.forEach(function (record) {
        scatterDataTable.addRow([record.YearStart, record.DataValue]);
    });

    // Set chart options for the scatter chart.
    var scatterOptions = {
        title: '',
        hAxis: {
            title: 'Year Start',
            format: ' ',
        },
        vAxis: {
            title: 'Prevalence (%)',
        },
        legend: 'none',
        colors: ['orange'],
    };

    // Instantiate and draw the scatter chart.
    var scatterChart = new google.visualization.ScatterChart(
        document.getElementById('scatterChart')
    );
    scatterChart.draw(scatterDataTable, scatterOptions);
}


