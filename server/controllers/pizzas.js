const express = require("express");
const Pizza = require("../models/pizza");

const router = express.Router();

// Setting our Pizza POST = CREATE route
router.post("/", (request, response) => {
  const newPizza = new Pizza.model(request.body);
  newPizza.save((err, data) => {
    return err ? response.sendStatus(500).json(err) : response.json(data);
  });
});

// Reading ALL our Pizzas from Mongo == GET ALL
router.get("/", (request, response) => {
  Pizza.model.find({}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Getting 1 Pizzas from Mongo == GET by ID
router.get("/:id", (request, response) => {
  Pizza.model.findById(request.params.id, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Delete a singe Pizza == DELETE by ID
router.delete("/:id", (request, response) => {
  Pizza.model.findByIdAndRemove(request.params.id, {}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

//Update a Pizza - Find by ID and Update == PUT by ID
router.put("/:id", (request, response) => {
  const body = request.body;
  Pizza.model.findByIdAndUpdate(
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

module.exports = router;
