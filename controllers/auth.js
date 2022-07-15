const { response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generateJWT} = require('../helpers/JWT');


const crearUsuario = async(req, res = response) => {

  const {email, password} = req.body;


  try {

    let usuario = await Usuario.findOne({email})
    
    if ( usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya existe'
      })
    }

    usuario = new Usuario(req.body);

    // Encriptar password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);


    await usuario.save();

    // JWT
    const token = await generateJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    }) 
  } catch (error) {
    console.log(error);    
    res.status(500).json({
      ok: false,
      msg: 'Error interno del servidor',
    })
  }

}

const loginUsuario = async(req, res = response) => {
  
  const {email, password} = req.body;

  try {

    let usuario = await Usuario.findOne({email})
    
    if ( !usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe'
      })
    }

    // Confirmar password
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if(!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      });
    }

    // JWT
    const token = await generateJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    }) 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error interno del servidor',
    })
  }
}

const revalidarToken = async(req, res = response) => {

  const {uid, name} = req;

  // generar un JWT y retornarlo
  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    token
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
}