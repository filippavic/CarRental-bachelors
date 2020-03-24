import React from 'react'

import { Button } from "reactstrap";

import './CarCard.css';

export default function CarCard(props) {
    return (
        <div className="car-card-cont">
            <div className="car-card-left">
                <img className="car-img" draggable="false" src={require("../../assets/img/golf.png")}/>
            </div>
            <div className="car-card-middle">
                <div className="car-card-middle-top">
                    <h2>{props.vehicle.nazProizvodac} {props.vehicle.nazModel}</h2>
                </div>
                <div className="car-card-middle-bottom">
                    <table>
                        <tbody>
                            <tr>
                                <td><i className="fas fa-car" id="middle-icon"></i> {props.vehicle.vrstaModel}</td>
                                <td id="table-text-right"><i className="fas fa-gas-pump" id="middle-icon"></i> {props.vehicle.vrstaMotor}</td>
                            </tr>
                            <tr>
                                <td><i className="fas fa-cog" id="middle-icon"></i> {props.vehicle.vrstaMjenjac}</td>
                                <td id="table-text-right"><i className="fas fa-tachometer-alt" id="middle-icon"></i> {props.vehicle.potrosnja} l/100 km</td>
                            </tr>
                        </tbody> 
                    </table>
                </div>
            </div>
            <div className="car-card-right">
                <div className="car-card-right-price">
                    <div className="car-card-right-price-day">
                        <h5 id="price-title">Cijena po danu</h5>
                        <h1 id="price-day">{props.vehicle.cijenaPoDanu} kn</h1>
                    </div>
                    <div className="car-card-right-price-total">
                        <h5 id="price-title">Ukupna cijena</h5>
                        <h1 id="price-total">{props.vehicle.iznos} kn</h1>
                    </div>
                </div>
                <div className="car-card-right-button">
                    <Button color="primary" type="button">
                        Rezerviraj
                    </Button>
                </div>
                
            </div>
        </div>
    )
}
