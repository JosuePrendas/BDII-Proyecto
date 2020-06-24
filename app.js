const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
var firebase = require("firebase/app");

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bdproyecto-9d198.firebaseio.com",
});

/*
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.15.3/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.15.3/firebase-analytics.js"></script>
*/

// Your web app's Firebase configuration
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
var firebaseConfig = {
  apiKey: "AIzaSyDdKJ8L_G-rPt-Jaw5ckE-JH_JxZr1Lj0E",
  authDomain: "bdproyecto-9d198.firebaseapp.com",
  databaseURL: "https://bdproyecto-9d198.firebaseio.com",
  projectId: "bdproyecto-9d198",
  storageBucket: "bdproyecto-9d198.appspot.com",
  messagingSenderId: "684750825916",
  appId: "1:684750825916:web:1be948ed0a038d9f1423b9",
  measurementId: "G-W49NKHCSPC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

var app = Express();

var url = "mongodb://25.76.2.217:27017/productos";
Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true } )
.then(() => {
  console.log("Successfully connected to the database");
})
.catch((err) => {
  console.log(`MongoDB connection error: ${err}`);
  console.log("Error connecting to the database");
  process.exit();
});

// Store the auth codes and access tokens in memory. In a real
// auth server, you would store these in a database.
const authCodes = new Set();
const accessTokens = new Set();

app.use(BodyParser.json());
// Con bodyParser permitimos que pueda parsear JSON
app.use(BodyParser.urlencoded({ extended: true }));

const ProductoModel = Mongoose.model("/Producto", {
  nombreProducto: String,
  nombreProductor: String,
  zona: String,
});

app.post("/agregarProducto", async (request, response, next) => {
  try {
    var person = new ProductoModel(request.body);
    var result = await person.save();
    response.send(result);
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
});

app.get("/login/:email/:password", async (request, response, next) => {
  try {
    var email = request.params.email;
    var password = request.params.password;
    firebase.auth().signInWithEmailAndPassword(email, password);
    response.send(true);
  } catch (error) {
    response.status(500).send(error);
  }
});

firebase.auth().onAuthStateChanged(function(user){
  if(user){
    user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(user.uid);
      console.log(user.email);
      authenthication(idToken);
    });
  }
});

function authenthication(idToken){
  // idToken comes from the client app
  admin.auth().verifyIdToken(idToken).then(function(decodedToken) {
  let uid = decodedToken.uid;
  console.log(true);
  return uid;
}).catch(function(error) {
    // Handle error
    console.log(idToken);
    return false;
  });
}

app.listen(3000, () => {
  console.log("Escuchando desde el puerto 3000...");
});