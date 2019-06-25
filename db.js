require('dotenv').config();
const pgp = require('pg-promise')(/*options*/);

const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;

