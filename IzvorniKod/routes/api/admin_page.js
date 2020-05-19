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


//popis aktivnih podruznica
router.get("/locations", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    db.any('SELECT siflokacija, ulica, kucnibroj, pbrmjesto, nazivmjesto, drzava.koddrzava, nazivdrzava FROM lokacija NATURAL JOIN mjesto NATURAL JOIN drzava WHERE aktivna=TRUE').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//popis neaktivnih podruznica
router.get("/notactivelocations", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    db.any('SELECT siflokacija, ulica, kucnibroj, pbrmjesto, nazivmjesto, drzava.koddrzava, nazivdrzava FROM lokacija NATURAL JOIN mjesto NATURAL JOIN drzava WHERE aktivna=FALSE').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});


//zatvaranje lokacije
router.post("/closelocation", auth, (req, res) => {
    const siflokacija = req.body.siflokacija;

    //provjera podataka
    if(!siflokacija){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.none('UPDATE lokacija SET aktivna=FALSE WHERE siflokacija=${siflokacija}', {
        siflokacija: siflokacija
    }).catch(error => {
        res.status(400).json({ msg: 'Dogodila se pogreška'});
    });
});

//otvaranje lokacije
router.post("/openlocation", auth, (req, res) => {
    const siflokacija = req.body.siflokacija;

    //provjera podataka
    if(!siflokacija){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.none('UPDATE lokacija SET aktivna=TRUE WHERE siflokacija=${siflokacija}', {
        siflokacija: siflokacija
    }).catch(error => {
        res.status(400).json({ msg: 'Dogodila se pogreška'});
    });
});

//otvaranje/zatvaranje lokacije
router.post("/changelocationstatus", auth, (req, res) => {
    const locationData = {
        siflokacija: req.body.siflokacija,
        status: req.body.status
    };

    //provjera podataka
    if(!locationData.siflokacija){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.one('UPDATE lokacija SET aktivna=${status} WHERE siflokacija=${siflokacija} returning "siflokacija"', {
        siflokacija: locationData.siflokacija,
        status: locationData.status
    }).then(data => {
        return res.status(200).json({msg: "Promijenjeno"});
    })
    .catch(error => {
        res.status(400).json({ msg: 'Dogodila se pogreška'});
    });
});

//popis drzava
router.get("/countries", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");

    db.any('SELECT koddrzava AS value, nazivdrzava AS label FROM drzava').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//dodavanje nove podruznice
router.post("/newlocation", auth, (req, res) => {
    const locationData = {
        adresa: req.body.adresa,
        kucnibroj: req.body.kucnibroj,
        postbroj: req.body.postbroj,
        nazivmjesto: req.body.nazivmjesto,
        koddrzava: req.body.koddrzava
    };
    
    //provjera podataka
    if(!locationData.adresa || !locationData.kucnibroj || !locationData.postbroj || !locationData.nazivmjesto || !locationData.koddrzava){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.task(t => {
        return t.any('SELECT nazivmjesto FROM mjesto WHERE pbrmjesto=${postbroj}', {
            postbroj: locationData.postbroj
        }).then(data => {
                if(data.length === 0) {
                    return t.none('INSERT INTO mjesto (pbrmjesto, nazivmjesto, koddrzava) VALUES (${postbroj}, ${nazivmjesto}, ${koddrzava})', {
                        postbroj: locationData.postbroj,
                        nazivmjesto: locationData.nazivmjesto,
                        koddrzava: locationData.koddrzava
                    });
                }
                return [];
        }).then(data => {
            return t.none('INSERT INTO lokacija (ulica, kucnibroj, pbrmjesto) VALUES (${adresa}, ${kucnibroj}, ${postbroj})', {
                adresa: locationData.adresa,
                kucnibroj: locationData.kucnibroj,
                postbroj: locationData.postbroj
            });
        });
        })
        .then(events => {
            return res.status(200).json({msg: "Uspješno"});
        })
        .catch(error => {
            res.status(400).json({ msg: 'Dogodila se pogreška'});
        });
});

//promjena podataka podruznice
router.post("/changelocation", auth, (req, res) => {
    const locationData = {
        siflokacija: req.body.siflokacija,
        adresa: req.body.adresa,
        kucnibroj: req.body.kucnibroj,
        postbroj: req.body.postbroj,
        nazivmjesto: req.body.nazivmjesto,
        koddrzava: req.body.koddrzava
    };
    
    //provjera podataka
    if(!locationData.siflokacija || !locationData.adresa || !locationData.kucnibroj || !locationData.postbroj || !locationData.nazivmjesto || !locationData.koddrzava){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.task(t => {
        return t.any('SELECT nazivmjesto FROM mjesto WHERE pbrmjesto=${postbroj}', {
            postbroj: locationData.postbroj
        }).then(data => {
                if(data.length === 0) {
                    return t.none('INSERT INTO mjesto (pbrmjesto, nazivmjesto, koddrzava) VALUES (${postbroj}, ${nazivmjesto}, ${koddrzava})', {
                        postbroj: locationData.postbroj,
                        nazivmjesto: locationData.nazivmjesto,
                        koddrzava: locationData.koddrzava
                    });
                }
                return [];
        }).then(data => {
            return t.none('UPDATE lokacija SET ulica=${adresa}, kucnibroj=${kucnibroj}, pbrmjesto=${postbroj} WHERE siflokacija=${siflokacija}', {
                adresa: locationData.adresa,
                kucnibroj: locationData.kucnibroj,
                postbroj: locationData.postbroj,
                siflokacija: locationData.siflokacija
            });
        });
        })
        .then(events => {
            return res.status(200).json({msg: "Uspješno"});
        })
        .catch(error => {
            res.status(400).json({ msg: 'Dogodila se pogreška'});
        });
});


//dohvacanje detalja o najmu
router.get('/rentinfo/:sifnajam', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
  
    db.one('SELECT ime, prezime, to_char(datumrod, \'DD.MM.YYYY.\') AS datumrod, mail, to_char(datumvrijemeregistracija, \'DD.MM.YYYY.\') AS korisnikod, nazivproizvodac, nazivmodel, to_char(planiranidatumvrijemeod, \'DD.MM.YYYY. HH24:MI\') AS planiranidatumvrijemeod, to_char(planiranidatumvrijemedo, \'DD.MM.YYYY. HH24:MI\') AS planiranidatumvrijemedo, to_char(datumvrijemeod, \'DD.MM.YYYY. HH24:MI\') AS datumvrijemeod, to_char(datumvrijemedo, \'DD.MM.YYYY. HH24:MI\') AS datumvrijemedo, l1.ulica AS ulicaP, l1.kucnibroj AS kucniP, l1.pbrmjesto AS pbrP, m1.nazivmjesto AS mjestoP, l2.ulica AS ulicaD, l2.kucnibroj AS kucniD, l2.pbrmjesto AS pbrD, m2.nazivmjesto AS mjestoD, registratskaoznaka, iznosnajma FROM najam NATURAL JOIN korisnik NATURAL JOIN vozilo NATURAL JOIN model NATURAL JOIN proizvodac JOIN lokacija l1 ON l1.siflokacija = siflokprikupljanja JOIN mjesto m1 ON l1.pbrmjesto = m1.pbrmjesto JOIN lokacija l2 ON l2.siflokacija = siflokvracanja JOIN mjesto m2 ON l2.pbrmjesto = m2.pbrmjesto WHERE sifnajam=$1',
    [req.params.sifnajam]).then(data => {
        res.send(data);
    });  
});

//popis aktivnih vozila u vlasnistvu
router.get("/vehicles", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    db.any('SELECT sifvozilo, registratskaoznaka, nazivproizvodac, nazivmodel, nazivvrstamodel FROM vozilo NATURAL JOIN model NATURAL JOIN vrsta_model NATURAL JOIN proizvodac WHERE aktivno=TRUE').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//popis neaktivnih vozila u vlasnistvu
router.get("/deactivatedvehicles", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    db.any('SELECT sifvozilo, registratskaoznaka, nazivproizvodac, nazivmodel, nazivvrstamodel FROM vozilo NATURAL JOIN model NATURAL JOIN vrsta_model NATURAL JOIN proizvodac WHERE aktivno=FALSE').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//dohvacanje detalja o vozilu
router.get('/vehicleinfo/:sifvozilo', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
 
    db.one('SELECT vozilo.sifvozilo, registratskaoznaka, nazivproizvodac, nazivmodel, nazivvrstamodel, nazivvrstamotor, nazivvrstamjenjac, potrosnja, urlslika, to_char(lokacija_vozilo.datumvrijeme, \'DD.MM.YYYY. HH24:MI\') AS datumvrijeme, ulica, kucnibroj, nazivmjesto, lokacija_vozilo.sifstatus FROM vozilo JOIN lokacija_vozilo ON vozilo.sifvozilo = lokacija_vozilo.sifvozilo NATURAL JOIN model NATURAL JOIN proizvodac NATURAL JOIN vrsta_model NATURAL JOIN vrsta_mjenjac NATURAL JOIN vrsta_motor NATURAL JOIN lokacija NATURAL JOIN mjesto NATURAL JOIN status WHERE vozilo.sifvozilo=$1 ORDER BY lokacija_vozilo.datumvrijeme DESC LIMIT 1',
    [req.params.sifvozilo]).then(data => {
        res.send(data);
    });  
});

//promjena registracije
router.post("/changeregistration", auth, (req, res) => {
    const registrationData = {
        sifvozilo: req.body.sifvozilo,
        registracija: req.body.registracija
    };

    //provjera podataka
    if(!registrationData.sifvozilo || !registrationData.registracija){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno"});
    }

    db.none('UPDATE vozilo SET registratskaoznaka=${registracija} WHERE sifvozilo=${sifvozilo}', {
        registracija: registrationData.registracija,
        sifvozilo: registrationData.sifvozilo
    })
    .then(data => {
        return res.status(200).json({msg: "Uspješno"});
    })
    .catch(error => {
        return res.status(400).json({msg: 'Registracija već postoji'});
    });
});

//popis proizvodaca
router.get("/manufacturers", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    db.any('SELECT sifproizvodac AS value, nazivproizvodac AS label FROM proizvodac').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//popis opcija
router.get("/vehicleoptions", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.multi('SELECT sifproizvodac AS value, nazivproizvodac AS label FROM proizvodac;SELECT sifvrstamotor AS value, nazivvrstamotor AS label FROM vrsta_motor;SELECT sifvrstamjenjac AS value, nazivvrstamjenjac AS label FROM vrsta_mjenjac;SELECT lokacija.siflokacija AS value, ulica || \' \' || kucnibroj || \', \' || nazivmjesto AS label FROM lokacija NATURAL JOIN mjesto')
    .then(([manuf, engines, transmissions, locations]) => {
        const data = {manuf, engines, transmissions, locations};
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});


//dohvacanje modela odredenog proizvodaca
router.get('/models/:sifproizvodac', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
 
    db.any('SELECT sifmodel AS value, nazivmodel AS label FROM model WHERE sifproizvodac=$1',
    [req.params.sifproizvodac]).then(data => {
        res.send(data);
    });  
});

//dodavanje novog vozila
router.post("/newvehicle", auth, (req, res) => {
    const vehicleData = {
        sifmodel: req.body.sifmodel,
        registracija: req.body.registracija,
        siflokacija: req.body.siflokacija,
        datumvrijeme: req.body.datumvrijeme,
        sifmotor: req.body.sifmotor,
        sifmjenjac: req.body.sifmjenjac,
        potrosnja: req.body.potrosnja
    };
    
    //provjera podataka
    if(!vehicleData.sifmodel || !vehicleData.registracija || !vehicleData.siflokacija || !vehicleData.datumvrijeme || !vehicleData.sifmotor || !vehicleData.sifmjenjac || !vehicleData.potrosnja){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.task(t => {
        return t.any('SELECT sifvozilo FROM vozilo WHERE registratskaoznaka=${registracija}', {
            registracija: vehicleData.registracija
        }).then(data => {
                if(data.length === 0) {
                    return t.one('INSERT INTO vozilo (sifmodel, registratskaoznaka, sifvrstamotor, sifvrstamjenjac, potrosnja, kilometraza) VALUES (${sifmodel}, ${registracija}, ${sifmotor}, ${sifmjenjac}, ${potrosnja}, 0) RETURNING "sifvozilo"', {
                        sifmodel: vehicleData.sifmodel,
                        registracija: vehicleData.registracija,
                        sifmotor: vehicleData.sifmotor,
                        sifmjenjac: vehicleData.sifmjenjac,
                        potrosnja: vehicleData.potrosnja
                    });
                }
                return [];
        }).then(data => {
            if(data.length !== 0){
                return t.one('INSERT INTO lokacija_vozilo (sifvozilo, datumvrijeme, siflokacija, sifstatus) VALUES (${sifvozilo}, ${datumvrijeme}, ${siflokacija}, 2) RETURNING "siflokacijavozilo"', {
                    sifvozilo: data.sifvozilo,
                    datumvrijeme: vehicleData.datumvrijeme,
                    siflokacija: vehicleData.siflokacija
                });
            }
            return []; 
        });
        })
        .then(events => {
            if(events.length !== 0) res.status(200).json({msg: "Uspješno"});
            else res.status(400).json({msg: "Registracija već postoji"});
            return
        })
        .catch(error => {
            res.status(400).json({ msg: 'Dogodila se pogreška'});
        });
});

//trenutni cjenik
router.get("/currentpricelist", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");

    db.any('SELECT sifcjenik, sifmodel, nazivproizvodac, nazivmodel, cijenapodanu, period FROM cjenik NATURAL JOIN model NATURAL JOIN proizvodac WHERE period = (SELECT period from cjenik WHERE period @> now()::date ORDER BY period DESC LIMIT 1)').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//neaktivni periodi cjenika
router.get("/notactiveperiods", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");

    db.any('SELECT DISTINCT period FROM cjenik WHERE NOT (period @> now()::date) ORDER BY period DESC').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//cjenik za odredeni period
router.get("/periodpricelist/:period", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");

    db.any('SELECT sifcjenik, sifmodel, nazivproizvodac, nazivmodel, cijenapodanu FROM cjenik NATURAL JOIN model NATURAL JOIN proizvodac WHERE period = $1', [req.params.period]).then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//dohvacanje modela odredenog proizvodaca za koji nije definirana cijena
router.get('/newpricemodels/:sifproizvodac', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
 
    db.any('SELECT sifmodel AS value, nazivmodel AS label FROM model NATURAL JOIN proizvodac WHERE sifmodel NOT IN (SELECT sifmodel from cjenik WHERE period = (SELECT period from cjenik WHERE period @> now()::date ORDER BY period DESC LIMIT 1)) AND sifproizvodac = $1',
    [req.params.sifproizvodac]).then(data => {
        res.send(data);
    });  
});

//dodavanje cijene modela
router.post("/addmodelprice", auth, (req, res) => {
    const priceData = {
        sifmodel: req.body.sifmodel,
        cijenapodanu: req.body.cijenapodanu,
        period: req.body.period
    };
    
    //provjera podataka
    if(!priceData.sifmodel || !priceData.cijenapodanu || !priceData.period){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.none('INSERT INTO cjenik (sifmodel, cijenapodanu, period) VALUES (${sifmodel}, ${cijenapodanu}, ${period})', {
        sifmodel: priceData.sifmodel,
        cijenapodanu: priceData.cijenapodanu,
        period: priceData.period
    })
    .then(data => {
        return res.status(200).json({msg: "Uspješno"});
    })
    .catch(error => {
        return res.status(400).json({msg: 'Dogodila se pogreška'});
    });
});

//promjena cijene modela
router.post("/changemodelprice", auth, (req, res) => {
    const priceData = {
        sifcjenik: req.body.sifcjenik,
        cijenapodanu: req.body.cijenapodanu
    };
    
    //provjera podataka
    if(!priceData.sifcjenik || !priceData.cijenapodanu){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.none('UPDATE cjenik SET cijenapodanu=${cijenapodanu} WHERE sifcjenik=${sifcjenik}', {
        sifcjenik: priceData.sifcjenik,
        cijenapodanu: priceData.cijenapodanu
    })
    .then(data => {
        return res.status(200).json({msg: "Uspješno"});
    })
    .catch(error => {
        return res.status(400).json({msg: 'Dogodila se pogreška'});
    });
});

//dohvati zadnji period za koji je definiran cjenik
router.get("/lastperiod", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");

    db.one('SELECT period from cjenik ORDER BY period DESC LIMIT 1').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

//popis modela vozila u vlasnistvu
router.get("/ownedmodels", auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    db.any('SELECT DISTINCT sifmodel, nazivproizvodac, nazivmodel FROM vozilo NATURAL JOIN model NATURAL JOIN proizvodac').then(data => {
        res.send(data);
    })
    .catch(error => {
        console.log(error);
    });
});

router.post("/addpricelist", auth, (req, res) => {
    const priceData = req.body;
    
    //provjera podataka
    if(!priceData){
        return res.status(400).json({msg: "Došlo je do pogreške, pokušajte ponovno."});
    }

    db.tx(t => {
        var queries = priceData.map(p => {
            return t.none('INSERT INTO cjenik (sifmodel, cijenapodanu, period) VALUES(${sifmodel}, ${cijenapodanu}, ${period})', p);
        });
        return t.batch(queries);
    })
    .then(data => {
        return res.status(200).json({msg: "Uspješno"});
    })
    .catch(error => {
        return res.status(400).json({msg: 'Dogodila se pogreška'});
    });

});

//dohvacanje podataka za graf popularnosti podruznica (prikupljanje)
router.get('/pickuplocationgraph/', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT siflokacija, nazivmjesto, COUNT (sifnajam) AS ukupno FROM lokacija LEFT JOIN najam on lokacija.siflokacija = najam.siflokprikupljanja NATURAL JOIN mjesto GROUP BY lokacija.siflokacija, nazivmjesto ORDER BY siflokacija',
    []).then(data => {
        res.send(data);
    });
});

//dohvacanje podataka za graf popularnosti podruznica (vracanje)
router.get('/dropofflocationgraph/', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT siflokacija, nazivmjesto, COUNT (sifnajam) AS ukupno FROM lokacija LEFT JOIN najam on lokacija.siflokacija = najam.siflokvracanja NATURAL JOIN mjesto GROUP BY lokacija.siflokacija, nazivmjesto ORDER BY siflokacija',
    []).then(data => {
        res.send(data);
    });
});

//dohvacanje najpopularnijih modela vozila
router.get('/modelgraph/', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT nazivmodel, COUNT (sifnajam) AS ukupno FROM vozilo NATURAL JOIN model LEFT JOIN najam ON najam.sifvozilo = vozilo.sifvozilo GROUP BY vozilo.sifmodel, nazivmodel ORDER BY ukupno DESC LIMIT 6',
    []).then(data => {
        res.send(data);
    });
});

//dohvacanje najpopularnijih vrsta modela
router.get('/modeltypegraph/', auth, (req, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("accept", "application/json");
    
    db.any('SELECT nazivvrstamodel, COUNT (sifnajam) AS ukupno FROM vozilo NATURAL JOIN model RIGHT JOIN vrsta_model on model.sifvrstamodel = vrsta_model.sifvrstamodel LEFT JOIN najam ON najam.sifvozilo = vozilo.sifvozilo GROUP BY nazivvrstamodel ORDER BY ukupno DESC LIMIT 6',
    []).then(data => {
        res.send(data);
    });
});

//deaktiviranje vozila
router.post("/deactivatevehicle/:sifvozilo", auth, (req, res) => {

    db.one('UPDATE vozilo SET aktivno=FALSE WHERE sifvozilo=$1 returning "sifvozilo"',
    [req.params.sifvozilo]).then(data => {
        return res.status(200).json({msg: "Promijenjeno"});
    })
    .catch(error => {
        res.status(400).json({ msg: 'Dogodila se pogreška'});
    });

});

//aktiviranje vozila
router.post("/activatevehicle/:sifvozilo", auth, (req, res) => {

    db.one('UPDATE vozilo SET aktivno=TRUE WHERE sifvozilo=$1 returning "sifvozilo"',
    [req.params.sifvozilo]).then(data => {
        return res.status(200).json({msg: "Promijenjeno"});
    })
    .catch(error => {
        res.status(400).json({ msg: 'Dogodila se pogreška'});
    });

});

module.exports = router;