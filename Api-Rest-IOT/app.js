const mqtt = require('mqtt');

// Configura la conexión MQTT
const brokerUrl = 'mqtt://34.125.241.7';  // Reemplaza con la URL de tu broker MQTT
const client = mqtt.connect(brokerUrl);

// Manejadores de eventos
client.on('connect', () => {
    console.log('Conectado al broker MQTT');

    // Publica un mensaje en un topic específico
    const topic = 'IOTPF';
    const message = 'Hola desde MQTT Node.js';

    client.publish(topic, message, (err) => {
        if (err) {
            console.error('Error al publicar el mensaje:', err);
        } else {
            console.log('Mensaje publicado correctamente');
        }

        // Cierra la conexión después de publicar el mensaje
        client.end();
    });
});

client.on('error', (err) => {
    console.error('Error de conexión al broker MQTT:', err);
});

client.on('close', () => {
    console.log('Conexión cerrada');
});
