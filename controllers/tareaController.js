const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
//Crear una nueva tarea

exports.crearTarea = async (req, res) => {
  //Revisar si hay errores en la validacion, usando las validaciones del route
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Extraer el proyecto y comprobar que exsita
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(400).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Crear la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    //Extraer el proyecto
    const { proyecto } = req.query;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return res.status(400).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Obtener las tareas por proyecto
    const tareas = await Tarea.find({ proyecto });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.actualizarTarea = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar que existe
    const { proyecto, nombre, estado } = req.body;

    //Revisar si la tarea existe o no
    let tareaExiste = await Tarea.findById(req.params.id);

    if (!tareaExiste) {
      return res.status(404).json({ msg: "No existe esa tarea" });
    }

    //Extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    //Crear un objeto con la nueva informacion
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    //Guardar la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Eliminar tarea segun id
exports.eliminarTarea = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar que existe
    const { proyecto } = req.query;

    //Revisar si la tarea existe o no
    let tareaExiste = await Tarea.findById(req.params.id);

    if (!tareaExiste) {
      return res.status(404).json({ msg: "No existe esa tarea" });
    }

    //Extraer proyecto para comprobar
    const existeProyecto = await Proyecto.findById(proyecto);

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminar
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
