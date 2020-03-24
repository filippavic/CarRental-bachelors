var express = require("express");
var router = express.Router();
const db = require("../../database/database.js");

router.get("/:id", async function(req, res, next) {
    // res.setHeader("content-type", "application/json");
    // res.setHeader("accept", "application/json");
    // res.send(rows);
    db.any('SELECT * FROM proizvodac WHERE sifproizvodac = $1', [req.params.id]).then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });
});



module.exports = router;
