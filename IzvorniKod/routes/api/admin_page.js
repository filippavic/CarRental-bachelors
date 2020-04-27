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

//dohvacanje podataka o najmovima
router.get('/rents/', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT sifnajam, sifvozilo, registratskaoznaka, ime, prezime, to_char(planiranidatumvrijemeod, \'DD.MM.YYYY. HH24:MI\') AS planiranidatumvrijemeod, to_char(planiranidatumvrijemedo, \'DD.MM.YYYY. HH24:MI\') AS planiranidatumvrijemedo, to_char(datumvrijemeod, \'DD.MM.YYYY. HH24:MI\') AS datumvrijemeod, to_char(datumvrijemedo, \'DD.MM.YYYY. HH24:MI\') AS datumvrijemedo, siflokprikupljanja, siflokvracanja, iznosnajma FROM najam NATURAL JOIN vozilo NATURAL JOIN korisnik WHERE zavrsen=FALSE',
    []).then(data => {
        res.send(data);
    });
});

//prikupljanje vozila
router.post("/pickup", auth, (req, res) => {
    const pickupData = {
        sifnajam: req.body.sifnajam,
        sifvozilo: req.body.sifvozilo,
        siflokprikupljanja: req.body.siflokprikupljanja,
        vrijeme: req.body.vrijeme
    };
  
    //provjera podataka
    if(!pickupData.sifnajam || !pickupData.sifvozilo || !pickupData.siflokprikupljanja || !pickupData.vrijeme){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.task(t => {
        return t.one('UPDATE najam SET datumvrijemeod = ${vrijeme} WHERE sifnajam=${sifnajam} returning "sifnajam"', {
            sifnajam: pickupData.sifnajam,
            vrijeme: pickupData.vrijeme
        }).then(data => {
                if(data) {
                    return t.none('INSERT INTO lokacija_vozilo (sifvozilo, datumvrijeme, siflokacija, sifstatus) VALUES (${sifvozilo}, ${vrijeme}, ${siflokprikupljanja}, 2)', {
                        sifvozilo: pickupData.sifvozilo,
                        vrijeme: pickupData.vrijeme,
                        siflokprikupljanja: pickupData.siflokprikupljanja
                    });
                }
                return [];
            });
    })
        .then(events => {
            return res.status(200).json({msg: "Uspješno"});
        })
        .catch(error => {
            res.status(400).json({ msg: 'Dogodila se pogreška'});
        });
});

//vracanje vozila - zavrsetak najma
router.post("/finish", auth, (req, res) => {
    const finishData = {
        sifnajam: req.body.sifnajam,
        sifvozilo: req.body.sifvozilo,
        siflokvracanja: req.body.siflokvracanja,
        vrijeme: req.body.vrijeme
    };
  
    //provjera podataka
    if(!finishData.sifnajam || !finishData.sifvozilo || !finishData.siflokvracanja || !finishData.vrijeme){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.task(t => {
        return t.one('UPDATE najam SET datumvrijemedo = ${vrijeme}, zavrsen = TRUE WHERE sifnajam=${sifnajam} returning "sifnajam"', {
            sifnajam: finishData.sifnajam,
            vrijeme: finishData.vrijeme
        }).then(data => {
                if(data) {
                    return t.none('INSERT INTO lokacija_vozilo (sifvozilo, datumvrijeme, siflokacija, sifstatus) VALUES (${sifvozilo}, ${vrijeme}, ${siflokvracanja}, 1)', {
                        sifvozilo: finishData.sifvozilo,
                        vrijeme: finishData.vrijeme,
                        siflokvracanja: finishData.siflokvracanja
                    });
                }
                return [];
            });
    })
        .then(events => {
            return res.status(200).json({msg: "Uspješno"});
        })
        .catch(error => {
            res.status(400).json({ msg: 'Dogodila se pogreška'});
        });
});

module.exports = router;