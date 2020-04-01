const jwt = require('jsonwebtoken');

//! security problem, treba premjestiti !
const key = "if9ubsh7d";

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    //provjeri postoji li token
    //if(!token) return res.status(401).json({ msg: 'Neuspjela autorizacija'});
    if(!token) return;

    try{
        //verifikacija tokena
        const decoded = jwt.verify(token, key);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token nije validan'});
    }
}

module.exports = auth;