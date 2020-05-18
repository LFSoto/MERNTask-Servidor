//Rutas para autenticar usuarios
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authenticationController = require("../controllers/authenticationController");
const auth = require("../middleware/auth");

//Iniciar sesion. Se definen aca, pero se usan en el controller
//Endpoint: api/authentication
router.post("/", [
  // check("email", "Agrega un email válido").isEmail(),
  // check("password", "La contraseña debe ser mínimo de 6 caracteres").isLength({
  //   min: 6,
  // }),
  authenticationController.autenticarUsuario,
]);

router.get("/", auth, authenticationController.usuarioAutenticado);

module.exports = router;
