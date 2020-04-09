//Pocetni zaslon aplikacije

import React, { useEffect, useState, useRef } from 'react'

import { Container, Row, Col, Alert, Button } from "reactstrap";
import axios from 'axios';
import Lottie from 'react-lottie';
import { useSelector } from 'react-redux';

import AuthNavbar from "../components/Navbars/AuthNavbar.js";
import AuthFooter from "../components/Footers/AuthFooter.js";
import CarSearch from "../components/Search/CarSearch.js";
import CarCard from "../components/Search/CarCard.js";
import ConfirmModal from "../components/Search/ConfirmModal.js";

import { loadUser } from '../actions/authActions';

import "./Start.css";
import * as animationData from '../assets/loading.json';
import store from '../store.js';

//za scroll na popis vozila
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

var moment = require('moment');

export default function Start() {
    const [vehicleData, setVehicleData] = useState({
      vehicles: [],
      isFetching: false
    });
    const [didMount, setDidMount] = useState(false);
    const [razlika, setRazlika] = useState();
    const [alert, setAlert] = useState(false);
    const [isSortedAscending, setIsSortedAscending] = useState(true);
    const [options, setOptions] = useState({
      sifLokPrikupljanja: null,
      sifLokVracanja: null,
      datumVrijemeOd: null,
      datumVrijemeDo: null
    })

    const [isReady, setIsReady] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [resSuccess, setResSuccess] = useState(true);
    const [reservationInfo, setReservationInfo] = useState({
      registration: null,
      puninaziv: null,
      urlslika: null,
      iznos: null,
      time: null
    });
    const [sifNajam, setSifNajam] = useState("");

    const userInfo = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    //opcije za Lottie animaciju
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    const vehicleRef = useRef(null)

    useEffect(() => {
        store.dispatch(loadUser());

        //postavi pozadinu kad se stranica ucita
        document.body.classList.add("bg-default");
        setDidMount(true);
        return () => {
            //ukloni pozadinu prilikom izlaska
            document.body.classList.remove("bg-default");
        }
    }, [])

    //Search gumb iz CarSearch triggera pretragu, alert ako nije sve ispunjeno
    const handleClick = (values) => {
        if(!values.startDate || !values.endDate || !values.selectedPickup || !values.selectedDropoff){
            setAlert(true);
        }
        else{
            //spremaju se odabrane opcije, pokrece se pretraga, omogucuje se menu
            setOptions({sifLokPrikupljanja: values.selectedPickup.value,
                        sifLokVracanja: values.selectedDropoff.value,
                        datumVrijemeOd: moment(values.startDate).format("YYYY-MM-DD HH:mm:ss"),
                        datumVrijemeDo: moment(values.endDate).format("YYYY-MM-DD HH:mm:ss")
            });
            setAlert(false);
            var razlika = (values.endDate).diff((values.startDate), "days")+1;
            setRazlika(razlika);
            setIsReady(true);
        }
    }

    //zatvori alert
    const onDismiss = () => setAlert(false);

    //sortiranje
    const toggleSort = () => {
        if (isSortedAscending){
            let sortedVehicles = vehicleData.vehicles.sort((a, b) => (b.cijenapodanu - a.cijenapodanu));
            setVehicleData({vehicles: sortedVehicles});
            setIsSortedAscending(false);
        }
        else{
            let sortedVehicles = vehicleData.vehicles.sort((a, b) => (a.cijenapodanu - b.cijenapodanu));
            setVehicleData({vehicles: sortedVehicles});
            setIsSortedAscending(true);
        }
    }
  
    //pretraga
    useEffect(() => {
        const fetchData = async () => {
            try {
              setVehicleData({vehicles: vehicleData.vehicles, isFetching: true});
              const response = await axios.get(`/api/start_page/vehicles/${options.datumVrijemeOd}/${options.datumVrijemeDo}/${options.sifLokPrikupljanja}`);
              setVehicleData({vehicles: response.data, isFetching: false});
              setIsReady(true);
              scrollToRef(vehicleRef);
          } catch (e) {
              console.log(e);
              setVehicleData({vehicles: vehicleData.vehicles, isFetching: false});
          }
          };
        if (didMount) fetchData();
    }, [options]);

    //rezervacija
    const reserveCar = (values) => {
      //headers
      const config = {
        headers: {
            'Content-Type': 'application/json'
        }
      }

      let reservationData = {
        sifkorisnik: userInfo.sifkorisnik,
        sifvozilo: values.sifvozilo,
        datumVrijemeOd: options.datumVrijemeOd,
        datumVrijemeDo: options.datumVrijemeDo,
        sifLokPrikupljanja: options.sifLokPrikupljanja,
        sifLokVracanja: options.sifLokVracanja,
        iznosnajma: values.iznosnajma
      };

      setReservationInfo({registration: values.registracija, puninaziv: values.puninaziv, urlslika: values.urlslika, iznos: values.iznosnajma, time: moment().format('DD.MM.YYYY. HH:mm:ss')});

      const body = JSON.stringify(reservationData);

      axios.post('/api/start_page/reservation', body, config)
      .then(res => {
        setSifNajam(res.data.sifnajam);
        setResSuccess(true);
        setModalOpen(true);
      })
      .catch(err => {
          setResSuccess(false);
          setModalOpen(true);
      });
    }

    //zatvori modal
    const handleCloseModal = () => {
      setModalOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(function() {
        setIsReady(false);
      }, 700);     
  }


    return (
        <>
        {modalOpen ? (<ConfirmModal success={resSuccess} reservationInfo={reservationInfo} userInfo={userInfo} sifnajam={sifNajam}
        handleClose={() => handleCloseModal()}/>) : null}
        <div className="main-content">
          {didMount ? (<AuthNavbar />) : null}

          {/* Header stranice */}
          <div className="header bg-gradient-info py-7 py-lg-8">     
            <Container>
              <div className="header-body text-center mb-7">
                <Row className="justify-content-center">
                  <Col lg="5" md="6">
                    {didMount && isAuthenticated ? 
                    (<h1 className="text-white">Dobrodošli, {userInfo.ime} {userInfo.prezime}!</h1>) : 
                    (<h1 className="text-white">Dobrodošli!</h1>)}                   
                    <p className="text-lead text-light">
                      Izaberite željeni period iznajmljivanja te lokacije prikupljanja i vraćanja vozila
                      kako bi dobili prikaz dostupnih vozila.
                    </p>
                  </Col>
                </Row>
              </div>
            </Container>
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-default"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </div>

          {/* Sadrzaj stranice */}

          <Container className="mt--8 pb-5">
            <Row className="justify-content-center">
                {alert &&
                    <Alert color="danger" fade={true} isOpen={alert} toggle={onDismiss}> 
                    <span className="alert-inner--text">
                        <strong>Upozorenje!</strong> Sva polja moraju biti ispunjena.
                    </span>
                    </Alert>
                }              
                <CarSearch handleClick={(values) => handleClick(values)}/>
            </Row>
          </Container>

          {/* Popis vozila */}
          <div ref={vehicleRef} className="vehicle-list">
            {/* Animacija prilikom ucitavanja */}
            {vehicleData.isFetching &&
              <div className="loading-animation">
                <Lottie options={defaultOptions}
                height={100}/>
              </div>  
            }
            {isReady && !vehicleData.isFetching &&
              <div className="vehicle-list-menu">
                <div className="vehicle-list-menu-left">
                  
                  <h3>U ponudi imamo {vehicleData.vehicles ? vehicleData.vehicles.length : ''} {vehicleData.vehicles && vehicleData.vehicles.length===1 ? "vozilo" : "vozila"}:</h3>
                </div>
                <div className="vehicle-list-menu-right"> 
                  <Button id="sort-button" color="primary" outline size="sm" type="button" onClick={() => toggleSort()}>
                      Sortiraj {isSortedAscending ? "silazno" : "uzlazno"}
                  </Button>
                </div>
              </div>
            }            
            {isReady && vehicleData.vehicles && vehicleData.vehicles.map (vehicle => (
              <CarCard key={vehicle.sifvozilo} vehicle={vehicle} razlika={razlika} reserve={(values) => reserveCar(values)}/>
            ))}
          </div>
        </div>
        <AuthFooter />
        </>
    )
}
