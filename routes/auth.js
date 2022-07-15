/*
  Rutas de Usuarios / Auth
  host + /api/auth
*/

const {Router} = require('express');
const { check } = require('express-validator');
const router = Router();

const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
  '/new', 
  [ // Middlewares
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','Debe ingresar un email valido').isEmail(),
    check('password','La password debe tener mas de 5 caracteres').isLength({min: 6}),
    validarCampos,
  ],
  crearUsuario);

router.post(
  '/', 
  [ // Middlewares
    check('email','Debe ingresar un email valido').isEmail(),
    check('password','La password es obligatoria').isLength({min: 1}),
    validarCampos,
  ],
  loginUsuario);

router.get('/renew', [validarJWT],revalidarToken);

module.exports = router;