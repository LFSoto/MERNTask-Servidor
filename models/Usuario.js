const mongoose = require("mongoose");

//Definicion de la tabla Usuario
const UsuariosSchema = mongoose.Schema({
  nombre: { type: String, require: true, trim: true },
  email: { type: String, require: true, trim: true, unique: true },
  password: { type: String, require: true, trim: true },
  fechaRegistro: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Usuario", UsuariosSchema);
