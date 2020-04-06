//Potvrdni modal

import React from 'react'
import Lottie from 'react-lottie';

import { Button } from "reactstrap";

import './ConfirmModal.css';
import * as animationData from '../../assets/success.json';
import * as animationDataError from '../../assets/error.json';

export default function ConfirmModal(props) {
    
    //opcije za Lottie success animaciju
    const defaultSuccessOptions = {
        loop: false,
        autoplay: true, 
        animationData: animationData.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet'
        }
    };

    //opcije za Lottie error animaciju
    const defaultSuccessOptionsError = {
        loop: false,
        autoplay: true, 
        animationData: animationDataError.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet'
        }
    };

    //zatvaranje modala
    const handleClose = (e) => {
        e.preventDefault();
        props.handleClose();
    }

    return (
        <div className="confirm-modal-cont">
            <div className="confirm-modal-card">
                <div className="confirm-modal-top">
                    <div className="success-animation">
                        {props.success ? (<Lottie options={defaultSuccessOptions} height={100}/>) : (<Lottie options={defaultSuccessOptionsError} height={100}/>)}
                    </div> 
                </div>
                <div className="confirm-modal-middle">
                    {props.success ? (<h1>Rezervacija uspješna!</h1>) : (<h1>Dogodila se pogreška.</h1>)}
                    {props.success ? (<h2>Registracija vozila: {props.registracija}</h2>) : (<h2>Pokušajte ponovno.</h2>)}
                </div>
                <div className="confirm-modal-bottom">
                    <Button color="primary" type="button" onClick={(e) => {handleClose(e)}}>
                            U redu
                    </Button>
                </div>
            </div>
        </div>
    )
}
