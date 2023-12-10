const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const port = 1883;  // Puedes cambiar el puerto según tus necesidades

server.listen(port, function () {
    console.log('Broker MQTT escuchando en el puerto', port);
});
