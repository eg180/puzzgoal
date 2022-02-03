const knex = require("knex");
const config = require("../knexfile");

const environment = process.env.NODE_ENV || "development";

// const environment = process.env.DB_ENVIRONMENT || "development";

// const database = require('knex')(configuration);

module.exports = knex(config[environment]);
