$(document).ready(function() {
    const apiKey = 'G5GFTUZGVXHG1ZCK';
    const channelId = '2619491';
    const fields = ['field1', 'field2', 'field3'];

    function fetchData(field, chartId, statusId) {
        $.getJSON(`https://api.thingspeak.com/channels/${channelId}/fields/${field}.json?api_key=${apiKey}&results=20`, function(data) {
            const labels = [];
            const values = [];
            data.feeds.forEach(feed => {
                labels.push(new Date(feed.created_at).toLocaleTimeString());
                values.push(feed[`field${field.slice(-1)}`]);
            });

            updateChart(labels, values, chartId);
            updateStatus(values, statusId);
        }).fail(function() {
            console.error(`Error al obtener datos para ${chartId}`);
        });
    }

    function updateChart(labels, values, chartId) {
        const ctx = document.getElementById(chartId).getContext('2d');
        if (window[chartId]) {
            window[chartId].destroy();
        }
        window[chartId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Nivel del Tanque ${chartId.slice(-1)}`,
                    data: values,
                    borderColor: 'rgba(123, 104, 238, 1)',
                    backgroundColor: 'rgba(123, 104, 238, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Hora',
                            color: '#7d5ba6'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nivel',
                            color: '#7d5ba6'
                        }
                    }
                }
            }
        });
    }

    function updateStatus(values, statusId) {
        const latestValue = values[values.length - 1];
        const threshold = 50;

        if (latestValue > threshold) {
            $(`#${statusId}`).text('Estado: Lleno').addClass('green').removeClass('red');
        } else {
            $(`#${statusId}`).text('Estado: Vacío').addClass('red').removeClass('green');
        }
    }

    function fetchDataForAll() {
        fetchData('field1', 'tankLevelChart1', 'status1');
        fetchData('field2', 'tankLevelChart2', 'status2');
        fetchData('field3', 'tankLevelChart3', 'status3');
    }

    setTimeout(function() {
        $('#loading-screen').fadeOut();
        $('#main-content').fadeIn();
        fetchDataForAll();
        setInterval(fetchDataForAll, 15000);
    }, 15000);
});
