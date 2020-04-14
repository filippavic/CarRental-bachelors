//Kartica rezervacije (korisnicka stranica)

import React from 'react'

import { Button } from "reactstrap";

import './RentCard.css';

var moment = require('moment');

export default function RentCard(props) {
    //izracun datuma
    var resDate = moment(props.reservation.datumvrijemeod, 'DD.MM.YYYY. HH:mm');
    var week = moment().add(7, 'days');
    var canCancel = (week.isBefore(resDate)) ? true : false;

    //slanje odabranih opcija parent komponenti
    const cancelReserve = (e) => {
        e.preventDefault()
        props.cancelReserve(props.reservation.sifnajam);
    }

    return (
        <div className="rent-card-cont">
            <div className="rent-card-left">
                <img className="car-img" draggable="false" alt={props.reservation.nazivmodel} src={props.reservation.urlslika}/>
            </div>
            <div className="rent-card-middle">
                <div className="rent-card-middle-top">
                    <h2>{props.reservation.nazivproizvodac} {props.reservation.nazivmodel}</h2>
                </div>
                <div className="rent-card-middle-bottom">
                    <table>
                        <tbody>
                            <tr>
                                <td><i className="ni ni-tag" id="middle-icon"></i> {props.reservation.registratskaoznaka}</td>
                            </tr>
                            <tr>
                                <td><i className="ni ni-calendar-grid-58" id="middle-icon"></i> {props.reservation.datumvrijemeod} - {props.reservation.datumvrijemedo}</td>
                            </tr>
                            <tr>
                                <td><i className="ni ni-square-pin" id="middle-icon"></i> {props.reservation.ulicap} {props.reservation.kucnip}, {props.reservation.pbrp} {props.reservation.mjestop} - {props.reservation.ulicad} {props.reservation.kucnid}, {props.reservation.pbrd} {props.reservation.mjestod}</td>
                            </tr>
                        </tbody> 
                    </table>
                </div>
            </div>
            <div className="rent-card-right">
                <div className="rent-card-right-price">
                    <div className="rent-card-right-price-total">
                        <h5 id="price-title">Ukupna cijena</h5>
                        <h1 id="price-total">{props.reservation.iznosnajma} kn</h1>
                    </div>
                </div>
                <div className="rent-card-right-button">
                    {canCancel ? (
                        <Button color="primary" type="button" onClick={(e) => {cancelReserve(e)}}>
                            Poništi rezervaciju
                        </Button>
                    ) : (
                        <Button color="primary" disabled type="button">
                            Poništvanje nije moguće
                        </Button>
                    )}
                    
                </div>
                
            </div>
        </div>
    )
}
