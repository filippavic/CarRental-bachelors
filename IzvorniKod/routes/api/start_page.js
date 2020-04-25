var express = require("express");
var router = express.Router();
const db = require("../../database/database.js");

//popis dostupnih vozila
router.get("/vehicles/:datumOd/:datumDo/:siflok", async function(req, res, next) {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    const range = '[' + req.params.datumOd + ', ' + req.params.datumDo + ']';
    db.any("SELECT DISTINCT vozilo.sifvozilo, registratskaoznaka, nazivproizvodac, nazivmodel, nazivvrstamodel, nazivvrstamotor, nazivvrstamjenjac, potrosnja, urlslika, cijenapodanu FROM najam RIGHT JOIN vozilo ON vozilo.sifvozilo = najam.sifvozilo JOIN lokacija_vozilo ON vozilo.sifvozilo = lokacija_vozilo.sifvozilo NATURAL JOIN model NATURAL JOIN proizvodac NATURAL JOIN vrsta_model NATURAL JOIN vrsta_mjenjac NATURAL JOIN vrsta_motor NATURAL JOIN cjenik WHERE vozilo.sifvozilo NOT IN (SELECT sifvozilo FROM najam WHERE planiranidatumvrijemeod < $1 AND planiranidatumvrijemedo > $1) AND vozilo.sifvozilo NOT IN (SELECT sifvozilo FROM najam WHERE planiranidatumvrijemeod > $1 AND planiranidatumvrijemedo < $2) AND vozilo.sifvozilo NOT IN (SELECT sifvozilo FROM najam WHERE planiranidatumvrijemeod < $2 AND planiranidatumvrijemedo > $2) AND (CASE WHEN vozilo.sifvozilo IN (SELECT DISTINCT najam.sifvozilo FROM najam) THEN siflokvracanja = $3 ELSE lokacija_vozilo.siflokacija = $3 AND sifstatus = 2 END) AND ($4::daterange <@ period)",
    [req.params.datumOd, req.params.datumDo, req.params.siflok, range]).then(data => {
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


//rezerevacija automobila
router.post("/reservation", async function(req, res, next) {
    const reservationData = {
        sifkorisnik: req.body.sifkorisnik,
        sifvozilo: req.body.sifvozilo,
        planiranidatumvrijemeod: req.body.datumVrijemeOd,
        planiranidatumvrijemedo: req.body.datumVrijemeDo,
        siflokprikupljanja: req.body.sifLokPrikupljanja,
        siflokvracanja: req.body.sifLokVracanja,
        iznosnajma: req.body.iznosnajma,
        vrijeme: req.body.vrijemeRezervacije,
        zavrsen: 'false'
    };
    
    //provjera podataka
    if(!reservationData.sifkorisnik || !reservationData.sifvozilo || !reservationData.planiranidatumvrijemeod || !reservationData.planiranidatumvrijemedo || !reservationData.siflokprikupljanja || !reservationData.siflokvracanja || !reservationData.iznosnajma || !reservationData.vrijeme){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.one('INSERT INTO najam(sifkorisnik, sifvozilo, planiranidatumvrijemeod, planiranidatumvrijemedo, siflokprikupljanja, siflokvracanja, iznosnajma, zavrsen, datumvrijemenajam) VALUES(${sifkorisnik}, ${sifvozilo}, ${datumVrijemeOd}, ${datumVrijemeDo}, ${sifLokPrikupljanja}, ${sifLokVracanja}, ${iznosnajma}, ${zavrsen}, ${vrijeme}) returning "sifnajam"', {
        sifkorisnik: reservationData.sifkorisnik,
        sifvozilo: reservationData.sifvozilo,
        datumVrijemeOd: reservationData.planiranidatumvrijemeod,
        datumVrijemeDo: reservationData.planiranidatumvrijemedo,
        sifLokPrikupljanja: reservationData.siflokprikupljanja,
        sifLokVracanja: reservationData.siflokvracanja,
        iznosnajma: reservationData.iznosnajma,
        vrijeme: reservationData.vrijeme,
        zavrsen: reservationData.zavrsen
    }).then(data => {
        res.send(data);
    })
    .catch(error => {
        return res.status(400).json({ msg: 'Dogodila se pogreška'});
    });

    // return res.status(200).json({ msg: 'Uspješno rezervirano'});
});



module.exports = router;
