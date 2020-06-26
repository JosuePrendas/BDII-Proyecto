import { Schema, model, Document } from 'mongoose'

const schema = new Schema({                 // Aqui se trabaja con mongoose
    nombreProducto  : String,
    nombreProductor : String,
    zona            : String
});

interface IProducto extends Document {     // Aqui se trabaja con typescript
    nombreProducto  : string;
    nombreProductor : string;
    zona            : string;
}

export default model<IProducto>('Producto', schema);