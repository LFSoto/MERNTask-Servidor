const mongoose = require("mongoose");

const TareaSchema = mongoose.Schema({
  nombre: {
    type: String,
    require: true,
    trim: true,
  },
  estado: {
    type: Boolean,
    default: false,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now(),
  },
  proyecto: {
    //Es una referencia a proyecto
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto",
  },
});

module.exports = mongoose.model("Tarea", TareaSchema);
