import { connect } from 'mongoose'

export async function startConnection() {
    const db = await connect('mongodb://25.18.3.25:27037/producto', {
        useNewUrlParser : true,
        useUnifiedTopology: true
    });
    console.log('Database is connected');
}

// mongodb://25.18.3.25:27037/producto      Router
// mongodb://25.76.2.217:27017/productos    mongo-api