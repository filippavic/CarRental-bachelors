//Pocetni zaslon aplikacije

import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from "react-router-dom";

import { Container, Row, Col, Alert, Button } from "reactstrap";
import axios from 'axios';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';

import AuthNavbar from "../components/Navbars/AuthNavbar.js";
import AuthFooter from "../components/Footers/AuthFooter.js";
import CarSearch from "../components/Search/CarSearch.js";
import CarCard from "../components/Search/CarCard.js";

import "./Start.css";

const vehicleArray = 
[
    {
        "nazProizvodac": "Volkswagen",
        "nazModel": "Golf 8",
        "vrstaModel": "hatchback",
        "vrstaMotor": "dizel",
        "vrstaMjenjac": "ručni",
        "potrosnja": "5.2",
        "cijenaPoDanu": "150",
        "iznos": "300" 
    },
    {
        "nazProizvodac": "Mercedes-Benz",
        "nazModel": "C klasa",
        "vrstaModel": "limuzina",
        "vrstaMotor": "benzin",
        "vrstaMjenjac": "automatski",
        "potrosnja": "6.3",
        "cijenaPoDanu": "250",
        "iznos": "600"  
    },
    {
        "nazProizvodac": "Rimac Automobili",
        "nazModel": "C_TWO",
        "vrstaModel": "sportski",
        "vrstaMotor": "električni",
        "vrstaMjenjac": "automatski",
        "potrosnja": "0",
        "cijenaPoDanu": "400",
        "iznos": "950"
    }
]
  

export default function Start() {
    const [vehicleData, setVehicleData] = useState(vehicleArray);
    const [query, setQuery] = useState('redux');
    const [search, setSearch] = useState('redux');
    const [didMount, setDidMount] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [razlika, setRazlika] = useState();
    const [alert, setAlert] = useState(false);
    const [isSortedAscending, setIsSortedAscending] = useState(true);

    const [isReady, setIsReady] = useState(false);

    const LoadingIndicator = props => {
        const { promiseInProgress } = usePromiseTracker();
        return (
            promiseInProgress && <h1>Hey some async call in progress ! </h1>
        );  
    }

    useEffect(() => {
        //postavi pozadinu kad se stranica ucita
        document.body.classList.add("bg-default");
        setDidMount(true);

        fetch(`/api/start_page/2`)
      .then(res => console.log(res.json()));
      
      
        return () => {
            //ukloni pozadinu prilikom izlaska
            document.body.classList.remove("bg-default");
        }
    }, [])

    //Search gumb iz CarSearch triggera pretragu, alert ako nije sve ispunjeno
    const handleClick = (values) => {
        setSearch(values);
        if(!values.startDate || !values.endDate || !values.selectedPickup || !values.selectedDropoff){
            setAlert(true);
        }
        else{
            setAlert(false);
            setRazlika(values.razlika)
        }
        setIsReady(true);
    }

    //zatvori alert
    const onDismiss = () => setAlert(false);

    const toggleSort = () => {
        if (isSortedAscending){
            setVehicleData(vehicleData.sort((a, b) => (b.iznos - a.iznos)));
            setIsSortedAscending(false);
        }
        else{
            setVehicleData(vehicleData.sort((a, b) => (a.iznos - b.iznos)));
            setIsSortedAscending(true);
        }
    }

    

    //pretraga
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //           setVehicleData({vehicles: vehicleData.vehicles, isFetching: true});
    //           const response = await axios.get('./vehicles.json');
    //           setVehicleData({vehicles: response.data, isFetching: false});
    //       } catch (e) {
    //           console.log(e);
    //           setVehicleData({vehicles: vehicleData.vehicles, isFetching: false});
    //       }
    //       };
    //     if (didMount) fetchData();
    //     console.log(vehicleData);
    // }, [search]);


    return (
        <>
        <div className="main-content">
          <AuthNavbar />

          {/* Header stranice */}
          <div className="header bg-gradient-info py-7 py-lg-8">     
            <Container>
              <div className="header-body text-center mb-7">
                <Row className="justify-content-center">
                  <Col lg="5" md="6">
                    <h1 className="text-white">Dobrodošli!</h1>
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
          <LoadingIndicator/>
          <div className="vehicle-list">
              <div className="vehicle-list-menu">
                  <div className="vehicle-list-menu-left">
                    <h3>U ponudi imamo {vehicleArray.length} {vehicleArray===1 ? "vozilo" : "vozila"}:</h3>
                  </div>
                  <div className="vehicle-list-menu-right"> 
                    <Button id="sort-button" color="primary" outline size="sm" type="button" onClick={() => toggleSort()}>
                        Sortiraj {isSortedAscending ? "silazno" : "uzlazno"}
                    </Button>
                  </div>
              </div>
              {vehicleData.map (vehicle => (
                  <CarCard vehicle={vehicle} razlika={razlika}/>
              ))}
          </div>
        </div>
        <AuthFooter />
        </>
    )
}
