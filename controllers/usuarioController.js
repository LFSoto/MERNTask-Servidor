const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //Revisar si hay errores en la validacion, usando las validaciones del route
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer email y password
  const { email, password } = req.body;

  try {
    //Revisar que el usuario registrado sea unico
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    //crea el nuevo usuario
    usuario = new Usuario(req.body);

    //Hashear el password. Salt genera hash unico
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //Guardar usuario
    await usuario.save();

    //Crear el JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    //Firmar el JWT
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600, //1 hora
      },
      (error, token) => {
        if (error) throw error;

        //Mensaje de confirmacion
        res.json({ token: token });
      }
    );
  } catch (error) {
    //En caso de error
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
