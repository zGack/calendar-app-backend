const { Router } = require("express")
const router = Router()

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require("express-validator");

const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/events');
const { isDate } = require("../helpers/isDate");

router.use(validarJWT);

// Obtener eventos
router.get(
  '/', getEventos)

// Crear evento
router.post(
  '/',
  [
    check('title', 'El evento debe tener un titulo').not().isEmpty(),
    check('start', 'El evento debe tener una fecha de inicio').custom(isDate),
    check('end', 'El evento debe tener una fecha de finalizacion').custom(isDate),
    validarCampos
  ],
  crearEvento)

// Actualizar evento
router.put('/:id', actualizarEvento)

// Borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router;