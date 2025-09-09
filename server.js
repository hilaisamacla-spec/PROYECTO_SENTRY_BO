const express = require('express');
const mongoose = require('mongoose');
const { Vehicle, GPS } = require('./models');  // Importar los modelos
const app = express();
const port = 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/sentry-bo')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.log('Error al conectar a MongoDB:', err));

// Middleware para parsear JSON
app.use(express.json());

// Ruta para registrar un vehículo
app.post('/add-vehicle', async (req, res) => {
  const { vehicle_id, model, gps_device_id } = req.body;

  // Verificar si el GPS Tracker ya está registrado
  const gpsDevice = await GPS.findOne({ device_id: gps_device_id });

  if (!gpsDevice) {
    return res.status(404).send('GPS Tracker no encontrado');
  }

  // Crear el vehículo y asociarlo con el GPS Tracker
  const newVehicle = new Vehicle({
    vehicle_id,
    model,
    gps_device_id: gpsDevice._id  // Asociar el vehículo con el GPS Tracker
  });

  await newVehicle.save();
  res.status(200).send('Vehículo registrado correctamente');
});

// Ruta para registrar la ubicación de un dispositivo GPS
app.post('/update-gps-location', async (req, res) => {
  const { device_id, latitude, longitude } = req.body;

  const gpsDevice = await GPS.findOne({ device_id });

  if (!gpsDevice) {
    return res.status(404).send('Dispositivo GPS no encontrado');
  }

  gpsDevice.latitude = latitude;
  gpsDevice.longitude = longitude;
  gpsDevice.last_updated = new Date();

  await gpsDevice.save();
  res.status(200).send('Ubicación GPS actualizada');
});

// Ruta para obtener los dispositivos GPS
app.get('/get-gps', async (req, res) => {
  const devices = await GPS.find();
  res.status(200).json(devices);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
