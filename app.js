const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();

Mongoose.connect("mongodb://localhost/thepolyglotdeveloper");

app.use(BodyParser.json());
// Con bodyParser permitimos que pueda parsear JSON
app.use(BodyParser.urlencoded({ extended: true }));

const PersonModel = Mongoose.model("person", {
    nombre: String,
    apellido1: String,
    apellido2: String
});

app.post("/person", async (request, response, next) => {
    try {
        var person = new PersonModel(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/people", async (request, response, next) => {
    try {
        var result = await PersonModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/person/:id", async (request, response, next) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        response.send(person);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.put("/person/:id", async (request, response, next) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        person.set(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.delete("/person/:id", async (request, response, next) => {
    try {
        var result = await PersonModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log("Escuchando desde el puerto 3000...");
});

// npm install nodemon --save-dev para autocargar cada vez que se
// hace un cambio