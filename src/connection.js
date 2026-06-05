const { Model } = require("objection");
const Knex = require("knex");
const config = require("./knexfile");

function bootstrap() {
  console.log("Initializing...");
  const knex = Knex(config.development);
  Model.knex(knex);
  console.log("application started");
}

module.exports = { Model, bootstrap };
