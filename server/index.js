require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

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
//***********************/
const myMiddleware = (request, response, next) => {
  // do something with request and/or response
  console.log(request.method, request.path);
  next(); // tell express to move to the next middleware function
};

// convert string json to JS json object
app.use(express.json());
app.use(myMiddleware); // use myMiddleware for every request to the app

const logging = (request, response, next) => {
  console.log(`${request.method} ${request.url} ${Date.now()}`);
  next();
};
app.use(logging);

// ROUTS HAVE TO COME AFTER MIDDLEWARE
//**************************************/
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

// Defining Pizza Schema -- data contract
const pizzaSchema = new mongoose.Schema({
  size: String,
  crust: String,
  cheese: String,
  sauce: String,
  toppings: [String],
});

// Defining the Pizza model
const Pizza = mongoose.model("Pizza", pizzaSchema);

// Setting our Pizza POST = CREATE route
app.post("/pizzas", (request, response) => {
  const newPizza = new Pizza(request.body);
  newPizza.save((err, pizza) => {
    return err ? response.sendStatus(500).json(err) : response.json(pizza);
  });
});

// Reading all our Pizzas from Mongo == GET ALL
app.get("/pizzas", (request, response) => {
  Pizza.find({}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Getting 1 Pizzas from Mongo == GET by ID
app.get("/pizzas/:id", (request, response) => {
  Pizza.findById(request.params.id, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Delete a singe Pizza == DELETE by ID
app.delete("/pizzas/:id", (request, response) => {
  Pizza.findByIdAndRemove(request.params.id, {}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

//Update a Pizza - Find by ID and Update == PUT by ID
app.put("/pizzas/:id", (request, response) => {
  const body = request.body;
  Pizza.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        size: body.size,
        crust: body.crust,
        cheese: body.cheese,
        sauce: body.sauce,
        toppings: body.toppings,
      },
    },
    (error, data) => {
      if (error) return response.sendStatus(500).json(error);
      return response.json(request.body);
    }
  );
});

// These lines are always last
//*******************************/

// This is our logging Middleware monitoring our responses
app.route("/**").get((request, response) => {
  response.status(404).send("NOT FOUND");
});

const PORT = process.env.PORT || 4040; // use pipe to set a default value
app.listen(PORT, () => console.log("Mongo listening on port 4040"));
