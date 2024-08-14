$(document).ready(function() {
    const apiKey = 'G5GFTUZGVXHG1ZCK';
    const channelId = '2619491';
    const fieldId = 'field1';

    function fetchData() {
        $.getJSON(`https://api.thingspeak.com/channels/${channelId}/fields/1.json?api_key=${apiKey}&results=20`, function(data) {
            const labels = [];
            const values = [];
            data.feeds.forEach(feed => {
                labels.push(new Date(feed.created_at).toLocaleTimeString());
                values.push(feed[fieldId]);
            });

            updateChart(labels, values);
            updateStatus(values);
        });
    }

    function updateChart(labels, values) {
        const ctx = document.getElementById('tankLevelChart').getContext('2d');
        if (window.tankChart) {
            window.tankChart.destroy();
        }
        window.tankChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nivel del Tanque',
                    data: values,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
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

    function updateStatus(values) {
        const latestValue = values[values.length - 1];
        const threshold = 5; // Modificado a 5 cm o menos para marcar "Lleno"

        if (latestValue <= threshold) {
            $('#status').text('Estado: Lleno');
            $('#status').css('color', 'green');
        } else {
            $('#status').text('Estado: Vacío');
            $('#status').css('color', 'red');
        }
    }

    setTimeout(function() {
        $('#loading-screen').fadeOut();
        $('#main-content').fadeIn();
        fetchData();
        setInterval(fetchData, 15000);
    }, 15000);
});
