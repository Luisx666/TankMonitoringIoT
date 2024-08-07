$(document).ready(function() {
    const apiKey = 'G5GFTUZGVXHG1ZCK';
    const channelId = '2619491';

    function fetchData(field, chartId, statusId) {
        $.getJSON(`https://api.thingspeak.com/channels/${channelId}/fields/${field}.json?api_key=${apiKey}&results=20`, function(data) {
            const labels = [];
            const values = [];
            data.feeds.forEach(feed => {
                labels.push(new Date(feed.created_at).toLocaleTimeString());
                values.push(feed[field]);
            });

            updateChart(labels, values, chartId);
            updateStatus(values, statusId);
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
                    label: 'Nivel del Tanque',
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
            $(`#${statusId}`).text('Estado: Lleno');
            $(`#${statusId}`).css('color', 'green');
        } else {
            $(`#${statusId}`).text('Estado: Vacío');
            $(`#${statusId}`).css('color', 'red');
        }
    }

    setTimeout(function() {
        $('#loading-screen').fadeOut();
        $('#main-content').fadeIn();
        fetchData('Monitor de tanque 1', 'tankLevelChart1', 'status1');
        fetchData('Monitor de tanque 2', 'tankLevelChart2', 'status2');
        fetchData('Monitor de tanque 3', 'tankLevelChart3', 'status3');
        setInterval(function() {
            fetchData('Monitor de tanque 1', 'tankLevelChart1', 'status1');
            fetchData('Monitor de tanque 2', 'tankLevelChart2', 'status2');
            fetchData('Monitor de tanque 3', 'tankLevelChart3', 'status3');
        }, 15000);
    }, 15000);
});
