
const express = require('express');
const auth = require('./auth');
const mqtt = require('mqtt');

const app = express();
const port = 8080;

app.use(express.json());
// Configura el cliente MQTT para tu servidor Node.js
const mqttServerUrl = 'mqtt://34.125.241.7';  // Reemplaza con la URL de tu servidor MQTT
const mqttClient = mqtt.connect(mqttServerUrl);

// Manejador de ruta para recibir mensajes MQTT y responder con Express
app.post('/user/login/', auth.login);
app.post('/user/signup/', auth.signUp);
app.post('/verificar/', auth.verificar);
app.post('/mqtt', (req, res) => {

    const {topic,payload} = req.body;
    // Publica el mensaje MQTT
    mqttClient.publish(topic, payload, (err) => {
        if (err) {
            console.error('Error al publicar el mensaje MQTT:', err);
            res.status(500).send('Error al publicar el mensaje MQTT');
        } else {
            console.log('Mensaje MQTT publicado correctamente');
            res.status(200).send('Mensaje MQTT publicado correctamente');
        }
    });
});

// Inicia el servidor Express
app.listen(port, () => {
    console.log(`Servidor Node.js escuchando en el puerto ${port}`);
});
