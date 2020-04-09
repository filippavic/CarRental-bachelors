//Potvrdni modal

import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import axios from 'axios';

import { Button } from "reactstrap";
import { PDFDownloadLink } from '@react-pdf/renderer'

import ConfirmDocument from "./ConfirmDocument.js";

import './ConfirmModal.css';
import * as animationData from '../../assets/success.json';
import * as animationDataError from '../../assets/error.json';

export default function ConfirmModal(props) {

    const [resInfo, setResInfo] = useState({
        ime: null,
        prezime: null,
        datumRod: null,
        mail: null,
        nazivproizvodac: null,
        nazivmodel: null,
        urlslika: null,
        datumVrijemeOd: null,
        datumVrijemeDo: null,
        ulicap: null,
        kucnip: null,
        pbrp: null,
        mjestop: null,
        ulicad: null,
        kucnid: null,
        pbrd: null,
        mjestod: null,
        registracija: null,
        iznosnajma: null
    });
    const [isReady, setIsReady] = useState(false);
    
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

    //dohvat podataka o rezervaciji
    useEffect(() => {
        axios.get(`/api/user_page/rent/${props.sifnajam}`)
        .then(res => {
            setResInfo({ime: res.data.ime, prezime: res.data.prezime, datumrod: res.data.datumrod, mail: res.data.mail, nazivproizvodac: res.data.nazivproizvodac,
            nazivmodel: res.data.nazivmodel, urlslika: res.data.urlslika, datumVrijemeOd: res.data.planiranidatumvrijemeod, datumVrijemeDo: res.data.planiranidatumvrijemedo,
        ulicap: res.data.ulicap, kucnip: res.data.kucnip, pbrp: res.data.pbrp, mjestop: res.data.mjestop,
        ulicad: res.data.ulicad, kucnid: res.data.kucnid, pbrd: res.data.pbrd, mjestod: res.data.mjestod, registracija: res.data.registratskaoznaka, iznosnajma: res.data.iznosnajma});
        setIsReady(true);
        })
        .catch(err => {
            setIsReady(false);
        });
    }, [])

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
                    {props.success ? (<h2>Registracija vozila: {props.reservationInfo.registration}</h2>) : (<h2>Pokušajte ponovno.</h2>)}
                </div>
                <div className="confirm-modal-bottom">
                    <Button color="primary" type="button" onClick={(e) => {handleClose(e)}}>
                            U redu
                    </Button>
                    {props.success && isReady ? (
                        <PDFDownloadLink document={<ConfirmDocument sifnajam={props.sifnajam} resInfo={resInfo} time={props.reservationInfo.time}/>} fileName={props.userInfo.prezime + props.userInfo.ime + "_potvrda.pdf"}>
                        {({ blob, url, loading, error }) => (loading ? 'Generiranje potvrde...' : 'Preuzmi potvrdu')}
                        </PDFDownloadLink>
                    ) : null}
                    
                </div>
            </div>
        </div>
    )
}
