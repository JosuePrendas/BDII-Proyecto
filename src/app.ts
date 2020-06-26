import express from 'express'
import morgan from 'morgan'

const app = express();

import indexRoutes from './routes/index'

// settings
app.set('port', process.env.PORT || 4000);

// middlewares
app.use(morgan('dev'));
app.use(express.json());

// routes
app.use('/api', indexRoutes);
app.post('/agregarProducto', indexRoutes);
app.get('/listarProductos', indexRoutes);
app.delete('/producto/:id', indexRoutes);

export default app;