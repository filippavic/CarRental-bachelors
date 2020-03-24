const pgp = require('pg-promise')(/*options*/);

const cn = {
    host: 'rental.ctgps096pncl.eu-central-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'WYax95fX'
};

const db = pgp(cn);

module.exports = db;
