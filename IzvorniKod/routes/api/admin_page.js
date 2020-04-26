var express = require("express");
var router = express.Router();
const db = require("../../database/database.js");

const auth = require('../../middleware/auth');

process.env.SECRET_KEY = "if9ubsh7d";

//dohvacanje statistike za dashboard
router.get('/dashboardstats/', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.one('SELECT COUNT (najam1.sifnajam) AS brnajmovathis, (SELECT COUNT (najam2.sifnajam) AS brnajmovalast FROM najam najam2 WHERE najam2.datumvrijemenajam BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER) AS brnajmovalast, (SELECT SUM (najam3.iznosnajma) AS ukupnothis FROM najam najam3 WHERE najam3.zavrsen=TRUE AND najam3.datumvrijemedo >= date_trunc(\'week\',current_date)) AS ukupnothis, (SELECT SUM (najam4.iznosnajma) AS ukupnolast FROM najam najam4 WHERE najam4.zavrsen=TRUE AND najam4.datumvrijemedo BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER) AS ukupnolast, (SELECT COUNT (korisnik1.sifkorisnik) AS korisnicilast FROM korisnik korisnik1 WHERE korisnik1.datumvrijemeregistracija >= date_trunc(\'month\', current_date)) AS korisnicithis, (SELECT COUNT (korisnik2.sifkorisnik) AS korisnicilast FROM korisnik korisnik2 WHERE korisnik2.datumvrijemeregistracija >= date_trunc(\'month\', current_date - interval \'1 month\') and korisnik2.datumvrijemeregistracija < date_trunc(\'month\', current_date)) AS korisnicilast FROM najam najam1 WHERE najam1.datumvrijemenajam >= date_trunc(\'week\',current_date)',
    []).then(data => {
        res.send(data);
    });
});

//dohvacanje podataka za graf prihoda
router.get('/revenuegraph/', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT EXTRACT (MONTH FROM datumvrijemedo) AS mjesec, EXTRACT(YEAR FROM datumvrijemedo) AS godina, SUM(iznosnajma) AS ukupno FROM najam WHERE zavrsen=TRUE GROUP BY mjesec, godina ORDER by godina, mjesec LIMIT 8',
    []).then(data => {
        res.send(data);
    });
});

//dohvacanje podataka za graf rezervacija
router.get('/reservationgraph/', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT EXTRACT (MONTH FROM datumvrijemenajam) AS mjesec, EXTRACT(YEAR FROM datumvrijemenajam) AS godina, COUNT(sifnajam) AS ukupno FROM najam GROUP BY mjesec, godina ORDER by godina, mjesec LIMIT 6',
    []).then(data => {
        res.send(data);
    });
});

module.exports = router;