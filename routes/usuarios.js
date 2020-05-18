//Rutas para crear usuarios
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");

//Crear un usuario y las reglas a la hora de agregar. Se definen aca, pero se usan en el controller
//Endpoint: api/usuario
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email válido").isEmail(),
    check(
      "password",
      "La contraseña debe ser mínimo de 6 caracteres"
    ).isLength({ min: 6 }),
  ],
  usuarioController.crearUsuario
);

module.exports = router;
