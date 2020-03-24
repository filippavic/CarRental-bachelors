var express = require("express");
var router = express.Router();
const db = require("../../database/database.js");

//popis dostupnih vozila
router.get("/vehicles/:siflok", async function(req, res, next) {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    db.any('SELECT vozilo.sifvozilo, nazivproizvodac, nazivmodel, nazivvrstamodel, nazivvrstamotor, nazivvrstamjenjac, potrosnja, urlslika FROM vozilo NATURAL JOIN model NATURAL JOIN proizvodac NATURAL JOIN vrsta_model NATURAL JOIN vrsta_mjenjac NATURAL JOIN vrsta_motor NATURAL JOIN lokacija_vozilo WHERE sifstatus = 2 AND siflokacija = $1',
    [req.params.siflok]).then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//popis lokacija poslovnica
router.get("/locations", async function(req, res, next) {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    db.any('SELECT siflokacija AS value, nazivmjesto AS label FROM lokacija NATURAL JOIN mjesto').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});



module.exports = router;
