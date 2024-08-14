$(document).ready(function() {
    // Simula la carga de contenido
    setTimeout(function() {
        $('#loading-screen').fadeOut(500, function() {
            $('#main-content').fadeIn(500);
        });
    }, 2000);

    // Configuración de Chart.js para el monitoreo de nivel de tanque
    var ctx = document.getElementById('tankLevelChart').getContext('2d');
    var tankLevelChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Etiquetas de tiempo
            datasets: [{
                label: 'Nivel del Tanque (cm)',
                data: [], // Datos de nivel de tanque
                borderColor: '#7d5ba6',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    function updateChart(data) {
        tankLevelChart.data.labels.push(new Date().toLocaleTimeString());
        tankLevelChart.data.datasets[0].data.push(data);
        tankLevelChart.update();
    }

    function fetchTankLevel() {
        $.getJSON('https://api.thingspeak.com/channels/CHANNEL_ID/fields/1.json?api_key=API_KEY&results=1', function(response) {
            var tankLevel = parseFloat(response.feeds[0].field1);
            $('#status').text('Nivel del Tanque: ' + tankLevel + ' cm');
            updateChart(tankLevel);
        });
    }

    // Actualiza el nivel del tanque cada 15 segundos
    setInterval(fetchTankLevel, 15000);
});
