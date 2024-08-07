$(document).ready(function() {
    const apiKey = 'G5GFTUZGVXHG1ZCK'; // Clave API de lectura de ThingSpeak
    const channelId = '2619491'; // ID del Canal de ThingSpeak
    const fieldId = 'field1'; // Reemplaza con el campo que estés usando

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
                    label: 'Tank Level',
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
                            text: 'Time',
                            color: '#7d5ba6'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Level',
                            color: '#7d5ba6'
                        }
                    }
                }
            }
        });
    }

    function updateStatus(values) {
        const latestValue = values[values.length - 1];
        const threshold = 50; // Define el umbral para "lleno" o "vacío"

        if (latestValue > threshold) {
            $('#status').text('Status: Full');
            $('#status').css('color', '#32cd32');
        } else {
            $('#status').text('Status: Empty');
            $('#status').css('color', '#ff6347');
        }
    }

    fetchData();
    setInterval(fetchData, 15000); // Actualiza cada 15 segundos
});
