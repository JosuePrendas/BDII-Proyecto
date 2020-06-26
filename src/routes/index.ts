import { Router } from 'express';
const router = Router();

import { agregar, listar, eliminar } from '../controllers/producto.controller'

router.route('/agregarProducto')
    .post(agregar)

router.route('/listarProductos')
    .get(listar)

router.route('/producto/:id')
    .delete(eliminar)

export default router;