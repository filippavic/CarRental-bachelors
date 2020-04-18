var express = require("express");
var router = express.Router();
const db = require("../../database/database.js");

const auth = require('../../middleware/auth');

process.env.SECRET_KEY = "if9ubsh7d";

//dohvacanje aktivnih najmova
router.get('/activerents/:sifkorisnik', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT sifnajam, nazivproizvodac, nazivmodel, urlslika, to_char(planiranidatumvrijemeod, \'DD.MM.YYYY. HH24:MI\') AS datumvrijemeod, to_char(planiranidatumvrijemedo, \'DD.MM.YYYY. HH24:MI\') AS datumvrijemedo, l1.ulica AS ulicaP, l1.kucnibroj AS kucniP, l1.pbrmjesto AS pbrP, m1.nazivmjesto AS mjestoP, l2.ulica AS ulicaD, l2.kucnibroj AS kucniD, l2.pbrmjesto AS pbrD, m2.nazivmjesto AS mjestoD, registratskaoznaka, iznosnajma FROM najam NATURAL JOIN korisnik NATURAL JOIN vozilo NATURAL JOIN model NATURAL JOIN proizvodac JOIN lokacija l1 ON l1.siflokacija = siflokprikupljanja JOIN mjesto m1 ON l1.pbrmjesto = m1.pbrmjesto JOIN lokacija l2 ON l2.siflokacija = siflokvracanja JOIN mjesto m2 ON l2.pbrmjesto = m2.pbrmjesto WHERE sifkorisnik=$1 AND zavrsen=false',
    [req.params.sifkorisnik]).then(data => {
        res.send(data);
    });
});

//dohvacanje proslih najmova
router.get('/pastrents/:sifkorisnik', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT sifnajam, nazivproizvodac, nazivmodel, urlslika, to_char(datumvrijemeod, \'DD.MM.YYYY. HH24:MI\') AS datumvrijemeod, to_char(datumvrijemedo, \'DD.MM.YYYY. HH24:MI\') AS datumvrijemedo, l1.ulica AS ulicaP, l1.kucnibroj AS kucniP, l1.pbrmjesto AS pbrP, m1.nazivmjesto AS mjestoP, l2.ulica AS ulicaD, l2.kucnibroj AS kucniD, l2.pbrmjesto AS pbrD, m2.nazivmjesto AS mjestoD, registratskaoznaka, iznosnajma FROM najam NATURAL JOIN korisnik NATURAL JOIN vozilo NATURAL JOIN model NATURAL JOIN proizvodac JOIN lokacija l1 ON l1.siflokacija = siflokprikupljanja JOIN mjesto m1 ON l1.pbrmjesto = m1.pbrmjesto JOIN lokacija l2 ON l2.siflokacija = siflokvracanja JOIN mjesto m2 ON l2.pbrmjesto = m2.pbrmjesto WHERE sifkorisnik=$1 AND zavrsen=true',
    [req.params.sifkorisnik]).then(data => {
        res.send(data);
    });
});

//dohvacanje statistike za prosle najmove
router.get('/paststats/:sifkorisnik', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.one('SELECT count(*) AS brnajmova, SUM(iznosnajma) AS sumaiznos FROM najam WHERE sifkorisnik=$1 AND zavrsen=true',
    [req.params.sifkorisnik]).then(data => {
        res.send(data);
    });
});

//dohvacanje podataka o najmu
router.get('/rent/:sifnajam', async function(req, res) {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.one('SELECT ime, prezime, to_char(datumrod, \'DD.MM.YYYY.\') AS datumrod, mail, nazivproizvodac, nazivmodel, urlslika, to_char(planiranidatumvrijemeod, \'DD.MM.YYYY. HH24:MI\') AS planiranidatumvrijemeod, to_char(planiranidatumvrijemedo, \'DD.MM.YYYY. HH24:MI\') AS planiranidatumvrijemedo, l1.ulica AS ulicaP, l1.kucnibroj AS kucniP, l1.pbrmjesto AS pbrP, m1.nazivmjesto AS mjestoP, l2.ulica AS ulicaD, l2.kucnibroj AS kucniD, l2.pbrmjesto AS pbrD, m2.nazivmjesto AS mjestoD, registratskaoznaka, iznosnajma FROM najam NATURAL JOIN korisnik NATURAL JOIN vozilo NATURAL JOIN model NATURAL JOIN proizvodac JOIN lokacija l1 ON l1.siflokacija = siflokprikupljanja JOIN mjesto m1 ON l1.pbrmjesto = m1.pbrmjesto JOIN lokacija l2 ON l2.siflokacija = siflokvracanja JOIN mjesto m2 ON l2.pbrmjesto = m2.pbrmjesto WHERE sifnajam=$1',
    [req.params.sifnajam]).then(data => {
        res.send(data);
    });
});

//brisanje najma
router.delete("/:sifnajam", auth, async (req, res) => {
    db.none('DELETE FROM najam WHERE sifnajam=$1',[req.params.sifnajam])
    .then(res => {
        res.status(200).send("Obrisano");
    })
    .catch(err => {
        res.status(500).send("Pogreska");
    });
});

module.exports = router;