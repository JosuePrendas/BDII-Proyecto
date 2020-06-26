import {Request, Response} from 'express'
import Producto from '../models/Producto'

export async function agregar(req: Request, res: Response) {
  try {
    var producto = new Producto(req.body);
    var resultado = await producto.save();
    res.send(resultado);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function listar(req: Request, res: Response) {
  try {
    var result = await Producto.find().exec();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function eliminar(req: Request, res: Response) {
  try {
    var result = await Producto.deleteOne({ _id: req.params.id }).exec();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

/* export const agregarProducto = (req: Request, res: Response) => {
    try {
        var producto = new ProductoModel(req.body);
        var resultado = await producto.save();
        res.send(resultado);
    } catch (error) {
        res.status(500).send(error);
    }
} */

/* app.post("/agregarProducto", async (request, response, next) => {
    try {
      var producto = new ProductoModel(request.body);
      var resultado = await producto.save();
      response.send(resultado);
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
  app.get("/listarProductos", async (request, response, next) => {
    try {
      var result = await ProductoModel.find().exec();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
  app.get("/listarProductos/:lat/:long", async (request, response, next) => {
    try {
      var lat = await ProductoModel.findById(request.params.lat).exec();
      var long = await ProductoModel.findById(request.params.long).exec();
      response.send(lat);
      response.send(long);
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
  app.put("/producto/:id", async (request, response, next) => {
    try {
      var person = await ProductoModel.findById(request.params.id).exec();
      person.set(request.body);
      var result = await person.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
  app.delete("/producto/:id", async (request, response, next) => {
    try {
      var result = await ProductoModel.deleteOne({ _id: request.params.id }).exec();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  }); */