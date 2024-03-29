const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  //Revisar si hay errores en la validacion, usando las validaciones del route
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Crear un nuevo proyeto
    const proyecto = new Proyecto(req.body);

    //Guardar el creador via JWT
    proyecto.creador = req.usuario.id;
    //Guardar el proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
  //Revisar si hay errores en la validacion, usando las validaciones del route
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer la informacion del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    //Revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);

    //Revisar que existe un proyecto
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

//Elimina un proyecto mediante su id
exports.eliminarProyecto = async (req, res) => {
  try {
    //Revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);

    //Revisar que existe un proyecto
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminar el proyecto
    await Tarea.deleteMany({ proyecto: req.params.id });
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyeto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
