const mongoose = require('mongoose');

// Esquema para los vehículos
const vehicleSchema = new mongoose.Schema({
  vehicle_id: { type: String, required: true, unique: true },  // ID único del vehículo
  model: String,  // Modelo del vehículo
  gps_device_id: { type: String, ref: 'GPS' },  // Relación con el dispositivo GPS
  assigned_date: { type: Date, default: Date.now },  // Fecha de asignación
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Esquema para los dispositivos GPS
const gpsTrackerSchema = new mongoose.Schema({
  device_id: { type: String, required: true, unique: true },  // ID único del dispositivo GPS
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },  // Relación con el vehículo
  latitude: Number,  // Latitud
  longitude: Number,  // Longitud
  status: { type: String, default: 'active' },  // Estado del dispositivo (activo/inactivo)
  last_updated: { type: Date, default: Date.now },  // Última actualización de las coordenadas
});

const GPS = mongoose.model('GPS', gpsTrackerSchema);

module.exports = { Vehicle, GPS };
