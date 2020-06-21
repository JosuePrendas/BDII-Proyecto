const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
var firebase = require("firebase/app");
const cors = require('cors');
const OAuth2Server = require('oauth2-server'); // instalen esto npm install oauth2-server

/*
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bdproyecto-9d198.firebaseio.com",
});
*/

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
//firebase.analytics();

var app = Express();

//mongoose.Promise = global.Promise;
var url = "mongodb://25.18.3.25:27017/people";
Mongoose.connect(url, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log("successfully connected to the database");
  })
  .catch((err) => {
    console.log(`MongoDB connection error: ${err}`);
    console.log("error connecting to the database");
    process.exit();
  });

// Store the auth codes and access tokens in memory. In a real
// auth server, you would store these in a database.
const authCodes = new Set();
const accessTokens = new Set();

app.use(BodyParser.json());
// Con bodyParser permitimos que pueda parsear JSON
app.use(BodyParser.urlencoded({ extended: true }));

/* const modelo = {
  // We support returning promises.
  getAccessToken: function() {
    return new Promise('works!');
  },

  // Or, calling a Node-style callback.
  getAuthorizationCode: function(done) {
    done(null, 'works!');
  },

  // Or, using generators.
  getClient: function*() {
    yield somethingAsync();
    return 'works!';
  },

  // Or, async/wait (using Babel).
  getUser: async function() {
    await somethingAsync();
    return 'works!';
  }
};

let oauth = new OAuth2Server({model: modelo}); */

const PersonModel = Mongoose.model("person", {
  nombre: String,
  apellido1: String,
  apellido2: String,
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
    console.log(user.uid);
    console.log(user.email);
  }
});

// Generate an auth code and redirect to your app client's
// domain with the auth code
app.post('/code', (req, res) => {
  // Generate a string of 10 random digits
  const authCode = new Array(10).fill(null).map(() => Math.floor(Math.random() * 10)).join('');

  authCodes.add(authCode);

  // Normally this would be a `redirect_uri` parameter, but for
  // this example it is hard coded.
  res.redirect(`http://localhost:3000/oauth-callback.html?code=${authCode}`);
});

app.options('/token', cors(), (req, res) => res.end());
app.options('/secure', cors(), (req, res) => res.end());

// Verify an auth code and exchange it for an access token
app.post('/token', cors(), (req, res) => {
  if (authCodes.has(req.body.code)) {
    // Generate a string of 50 random digits
    const token = new Array(50).fill(null).map(() => Math.floor(Math.random() * 10)).join('');

    authCodes.delete(req.body.code);
    accessTokens.add(token);
    res.json({ 'access_token': token, 'expires_in': 60 * 60 * 24 });
  } else {
    res.status(400).json({ message: 'Invalid auth token' });
  }
});

// Endpoint secured by auth token
app.get('/secure', cors(), (req, res) => {
  const authorization = req.get('authorization');
  if (!accessTokens.has(authorization)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  return res.json({ answer: 42 });
});

app.listen(3000, () => {
  console.log("Escuchando desde el puerto 3000...");
});

// npm install nodemon --save-dev para autocargar cada vez que se
// hace un cambio
