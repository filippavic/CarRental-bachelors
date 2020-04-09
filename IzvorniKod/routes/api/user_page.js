var express = require("express");
var router = express.Router();
const db = require("../../database/database.js");

const auth = require('../../middleware/auth');

process.env.SECRET_KEY = "if9ubsh7d";


//dohvacanje podataka o najmu
router.get('/rent/:sifnajam', async function(req, res) {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.one('SELECT ime, prezime, to_char(datumrod, \'DD.MM.YYYY.\') AS datumrod, mail, nazivproizvodac, nazivmodel, urlslika, to_char(planiranidatumvrijemeod, \'DD.MM.YYYY. HH24:MI\') AS planiranidatumvrijemeod, to_char(planiranidatumvrijemedo, \'DD.MM.YYYY. HH24:MI\') AS planiranidatumvrijemedo, l1.ulica AS ulicaP, l1.kucnibroj AS kucniP, l1.pbrmjesto AS pbrP, m1.nazivmjesto AS mjestoP, l2.ulica AS ulicaD, l2.kucnibroj AS kucniD, l2.pbrmjesto AS pbrD, m2.nazivmjesto AS mjestoD, registratskaoznaka, iznosnajma FROM najam NATURAL JOIN korisnik NATURAL JOIN vozilo NATURAL JOIN model NATURAL JOIN proizvodac JOIN lokacija l1 ON l1.siflokacija = siflokprikupljanja JOIN mjesto m1 ON l1.pbrmjesto = m1.pbrmjesto JOIN lokacija l2 ON l2.siflokacija = siflokvracanja JOIN mjesto m2 ON l2.pbrmjesto = m2.pbrmjesto WHERE sifnajam=$1',
    [req.params.sifnajam]).then(data => {
        res.send(data);
    });
})


module.exports = router;