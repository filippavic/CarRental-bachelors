var express = require("express");
var router = express.Router();
const db = require("../../database/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

process.env.SECRET_KEY = "if9ubsh7d";

//registracija novog korisnika
router.post("/register", async function(req, res, next) {
    const userData = {
        ime: req.body.ime,
        prezime: req.body.prezime,
        datumRod: req.body.datumRod,
        mail: req.body.mail,
		korisnickoIme: req.body.korisnickoIme,
        lozinka: req.body.lozinka,
        vrijeme: req.body.vrijeme
    };
    
    if(!userData.ime || !userData.prezime || !userData.datumRod || !userData.mail || !userData.korisnickoIme || !userData.lozinka){
        return res.status(400).json({msg: "Unesite sve podatke"});
    }

    //provjeri postoji li vec korisnik
    db.any('SELECT sifkorisnik, lozinka FROM korisnik WHERE korisnickoime=$1 OR mail=$2',
    [userData.korisnickoIme, userData.mail]).then(data => {
        if(data.length !== 0) return res.status(400).json({msg: "Korisnik već postoji"});

        //salt & hash, spremanje u bazu
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userData.lozinka, salt, (err, hash) => {
                if(err) throw err;

                db.none('INSERT INTO korisnik(ime, prezime, datumrod, korisnickoime, lozinka, mail, sifvrstakorisnik, datumvrijemeregistracija) VALUES(${ime}, ${prezime}, ${datumRod}, ${korisnickoIme}, ${lozinka}, ${mail}, 1, ${vrijeme})', {
                    ime: userData.ime,
                    prezime: userData.prezime,
                    datumRod: userData.datumRod,
                    korisnickoIme: userData.korisnickoIme,
                    lozinka: hash,
                    mail: userData.mail,
                    vrijeme: userData.vrijeme
                });

                var sifkorisnik;

                db.one('SELECT sifkorisnik FROM korisnik WHERE korisnickoime=$1',
                [userData.korisnickoIme]).then(data => {
                    sifkorisnik = data.sifkorisnik;
                });

                jwt.sign({korisnickoIme: userData.korisnickoIme}, process.env.SECRET_KEY, {expiresIn: 3600},
                    (err, token) => {
                        if(err) throw err;
                        res.json({
                            token,
                            user: {
                                ime: userData.ime,
                                prezime: userData.prezime,
                                datumRod: userData.datumRod,
                                korisnickoIme: userData.korisnickoIme,
                                mail: userData.mail,
                                sifvrstakorisnik: "1",
                                sifkorisnik: sifkorisnik
                            }
                        })
                })
            })
        })        
    }).catch(error => {
        console.log(error);
    });
});

//login postojeceg korisnika
router.post("/login", async function(req, res, next) {
    const userData = {
		korisnickoIme: req.body.korisnickoIme,
		lozinka: req.body.lozinka
    };
    
    if(!userData.korisnickoIme || !userData.lozinka){
        return res.status(400).json({msg: "Unesite sve podatke"});
    }

    //provjeri postoji li korisnik
    db.one('SELECT sifkorisnik, ime, prezime, datumrod, mail, lozinka, sifvrstakorisnik, sifkorisnik FROM korisnik WHERE korisnickoime=$1',
    [userData.korisnickoIme]).then(data => {

        //salt & hash, spremanje u bazu
        bcrypt.compare(userData.lozinka, data.lozinka)
        .then(isMatch => {
            if(!isMatch) return res.status(400).json({ msg: 'Netočna lozinka'});

            jwt.sign({korisnickoIme: userData.korisnickoIme}, process.env.SECRET_KEY, {expiresIn: 3600},
                (err, token) => {
                    if(err) throw err;
                    res.json({
                        token,
                        user: {
                            ime: data.ime,
                            prezime: data.prezime,
                            datumRod: data.datumrod,
                            korisnickoIme: userData.korisnickoIme,
                            mail: data.mail,
                            sifvrstakorisnik: data.sifvrstakorisnik,
                            sifkorisnik: data.sifkorisnik
                        }
                    })
            })
        })

    }).catch(error => {
        return res.status(400).json({msg: "Korisnik ne postoji"});
    });
});

//dohvacanje korisnika
router.get('/user', auth, (req, res) => {
    db.one('SELECT ime, prezime, datumrod, korisnickoime, mail, sifvrstakorisnik, sifkorisnik FROM korisnik WHERE korisnickoime=$1',
    [req.user.korisnickoIme]).then(data => {
        res.send(data);
    });
})


//promjena podataka korisnika
router.post("/changeuserinfo", async function(req, res, next) {
    const userData = {
        ime: req.body.ime,
        prezime: req.body.prezime,
        datumRod: req.body.datumRod,
        mail: req.body.mail,
		korisnickoIme: req.body.korisnickoIme,
        lozinka: req.body.lozinka,
        sifKorisnik: req.body.sifKorisnik
    };
    
    if(!userData.ime || !userData.prezime || !userData.datumRod || !userData.mail || !userData.korisnickoIme || !userData.lozinka){
        return res.status(400).json({msg: "Unesite sve podatke"});
    }

    //provjeri postoji li vec korisnicko ime
    db.any('SELECT sifkorisnik, lozinka FROM korisnik WHERE korisnickoime=$1 AND NOT sifkorisnik=$2',
    [userData.korisnickoIme, userData.sifKorisnik]).then(data => {
        if(data.length !== 0) return res.status(400).json({msg: "Korisničko ime već postoji"});

        //salt & hash, spremanje u bazu
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userData.lozinka, salt, (err, hash) => {
                if(err) throw err;

                db.none('UPDATE korisnik SET ime=${ime}, prezime=${prezime}, korisnickoime=${korisnickoIme}, lozinka=${lozinka} WHERE sifkorisnik=${sifkorisnik}', {
                    ime: userData.ime,
                    prezime: userData.prezime,
                    korisnickoIme: userData.korisnickoIme,
                    lozinka: hash,
                    sifkorisnik: userData.sifKorisnik
                });


                jwt.sign({korisnickoIme: userData.korisnickoIme}, process.env.SECRET_KEY, {expiresIn: 3600},
                    (err, token) => {
                        if(err) throw err;
                        res.json({
                            token,
                            user: {
                                ime: userData.ime,
                                prezime: userData.prezime,
                                datumRod: userData.datumRod,
                                korisnickoIme: userData.korisnickoIme,
                                mail: userData.mail,
                                sifvrstakorisnik: "1",
                                sifkorisnik: userData.sifKorisnik
                            }
                        })
                })
            })
        })        
    }).catch(error => {
        console.log(error);
    });
});


//promjena podataka korisnika (bez lozinke)
router.post("/changeusername", async function(req, res, next) {
    const userData = {
        ime: req.body.ime,
        prezime: req.body.prezime,
        datumRod: req.body.datumRod,
        mail: req.body.mail,
		korisnickoIme: req.body.korisnickoIme,
        sifKorisnik: req.body.sifKorisnik
    };
    
    if(!userData.ime || !userData.prezime || !userData.datumRod || !userData.mail || !userData.korisnickoIme){
        return res.status(400).json({msg: "Unesite sve podatke"});
    }

    //provjeri postoji li vec korisnicko ime
    db.any('SELECT sifkorisnik FROM korisnik WHERE korisnickoime=$1 AND NOT sifkorisnik=$2',
    [userData.korisnickoIme, userData.sifKorisnik]).then(data => {
        if(data.length !== 0) return res.status(400).json({msg: "Korisničko ime već postoji"});

        db.none('UPDATE korisnik SET ime=${ime}, prezime=${prezime}, korisnickoime=${korisnickoIme} WHERE sifkorisnik=${sifkorisnik}', {
            ime: userData.ime,
            prezime: userData.prezime,
            korisnickoIme: userData.korisnickoIme,
            sifkorisnik: userData.sifKorisnik
        });

        jwt.sign({korisnickoIme: userData.korisnickoIme}, process.env.SECRET_KEY, {expiresIn: 3600},
            (err, token) => {
                if(err) throw err;
                res.json({
                    token,
                    user: {
                        ime: userData.ime,
                        prezime: userData.prezime,
                        datumRod: userData.datumRod,
                        korisnickoIme: userData.korisnickoIme,
                        mail: userData.mail,
                        sifvrstakorisnik: "1",
                        sifkorisnik: userData.sifKorisnik
                        }
            })
        })      
    }).catch(error => {
        console.log(error);
    });
});

module.exports = router;