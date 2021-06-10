require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const pizzas = require("./controllers/pizzas");
const orders = require("./controllers/orders");

mongoose.connect(process.env.DB_CONNECT);
const app = express();
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once(
  "open",
  console.log.bind(console, "Successfully opened connection to Mongo!")
);
// These lines above are always at the top
//******************************************/

// MIDDLE WARE IS NEXT
//*********************/
const myMiddleware = (request, response, next) => {
  // do something with request and/or response
  console.log(request.method, request.path);
  next(); // tell express to move to the next middleware function
};

// CORS Middleware
const cors = (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

// Convert string json to JS json object
app.use(express.json());
app.use(myMiddleware); // use myMiddleware for every request to the app
app.use(cors);

const logging = (request, response, next) => {
  console.log(`${request.method} ${request.url} ${Date.now()}`);
  next();
};

app.use(logging);

// ROUTS HAVE TO COME AFTER MIDDLEWARE
//************************************/
app
  .route("/")
  .get((request, response) => {
    response.send("HELLO WORLD");
  })
  .post((request, response) => {
    response.json(request.body);
  });

app.route("/message/:message").get((request, response) => {
  // express adds a "params" Object to requests
  const message = request.params.message;
  // we can send a console status along with output
  response.status(418).send(`Your Message was ${message}`);
});

app.route("/somenum/:num").get((request, response) => {
  // express adds a "params" Object to requests
  const num = request.params.num;
  // handle GET request for post with an id of "id"
  // we can send a console status along with output
  response.json({ somenum: num });
});

// HERE IS OUR PIZZA STUFF
//***************************/
app.use("/pizzas", pizzas);
app.use("/orders", orders);

// These following lines are always last
//****************************************/

// Logging Middleware monitoring our responses
app.route("/**").get((request, response) => {
  response.status(404).send("NOT FOUND");
});

const PORT = process.env.PORT || 4040; // use pipe to set a default value
app.listen(PORT, () => console.log(`Mongo listening on port ${PORT}`));
