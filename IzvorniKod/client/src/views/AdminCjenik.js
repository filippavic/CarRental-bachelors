/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  Button,
  UncontrolledAlert
} from "reactstrap";
// react component for creating dynamic tables

import AdminPriceHeader from "../components/Headers/AdminPriceHeader.js";
import AdminPriceTableRow from "../components/AdminPage/AdminPriceTableRow";
import AdminPastPricesCard from "../components/AdminPage/AdminPastPricesCard.js";
import AddModelPriceModal from "../components/AdminPage/AddModelPriceModal.js";
import AddCjenikModal from "../components/AdminPage/AddCjenikModal.js";
import ChangeModelPriceModal from "../components/AdminPage/ChangeModelPriceModal.js";

import ReactLoading from 'react-loading';

var moment = require('moment');

class AdminCjenik extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            currentPrices: [],
            currentDates: '',
            isFetching: false,
            isSortedAscending: null,
            notActivePeriods: [],
            isNotActivePeriodFetching: false,
            msgWarning: null,
            isAddModalOpen: false,
            period: null,
            isCjenikModalOpen: false,
            changePriceData: null,
            isChangeModalOpen: false
        };
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.setState({ currentPrices: this.state.currentPrices, isFetching: true });
        axios.get(`/api/admin_page/currentpricelist/`).then(res => {
            const prices = res.data;
            let currentDates = "";
            let period;
            if (prices.length !== 0){
                period = prices[0].period;
                const splitDates = (prices[0].period).split(",");
                var periodPocetak = moment(splitDates[0].substr(1)).format("DD.MM.YYYY.");
                var periodKraj = moment(splitDates[1].slice(0, -1)).subtract(1, 'day').format("DD.MM.YYYY.");
                currentDates = periodPocetak + " - " + periodKraj;
                var periodKrajMoment = moment(splitDates[1].slice(0, -1));
                var razlikaPeriod = periodKrajMoment.diff(moment(), 'days');
                if (razlikaPeriod <= 7){
                    this.setState({ msgWarning: "Upozorenje: trenutni cjenik isti??e za " + razlikaPeriod + " dana"})
                }
            }
            else{
                this.setState({ msgWarning: "Trenutno nemate definirane nikakve cijene vozila"});
            }
            let sortedPrices = orderBy(prices, 'cijenapodanu', 'asc');
            this.setState({ currentPrices: sortedPrices, currentDates: currentDates, period: period, isSortedAscending: true, isFetching: false });
        });

        this.setState({ notActivePeriods: this.state.notActivePeriods, isNotActivePeriodFetching: true });
        axios.get(`/api/admin_page/notactiveperiods/`).then(res => {
            const periods = res.data;
            this.setState({ notActivePeriods: periods, isNotActivePeriodFetching: false });
        });
    }

    collapsesToggle = collapse => {
        let openedCollapses = this.state.openedCollapses;
        if (openedCollapses.includes(collapse)) {
          this.setState({
            openedCollapses: []
          });
        } else {
          this.setState({
            openedCollapses: [collapse]
          });
        }
    }

    //sortiranje
    sorting = (e) => {
        e.preventDefault();
        let sortby = e.target.getAttribute('sortby');
        let order = this.state.isSortedAscending ? 'desc' : 'asc';
        let sortedPrices = orderBy(this.state.currentPrices, sortby, order);
        this.setState({ currentPrices: sortedPrices, isSortedAscending: !this.state.isSortedAscending});  
    }

    //otvaranje/zatvaranje prozora za dodavanje cijene modela
    toggleAddModal = (e) => {
        e.preventDefault();
        this.setState({isAddModalOpen: !this.state.isAddModalOpen});
    };
  
    //dodavanje cijene modela
    addNewPrice = (newPrice) => {
        //headers
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const priceData = {
            sifmodel: newPrice.sifmodel,
            cijenapodanu: newPrice.cijena,
            period: this.state.period
        }

        const body = JSON.stringify(priceData);

        axios.post('/api/admin_page/addmodelprice', body, config)
        .then(res => {
            if(res.status === 200){
            this.setState({msgSuccess: "Cijena uspje??no dodana"});

            //ponovno dohvacanje cijena
            this.setState({ currentPrices: this.state.currentPrices, isFetching: true });
            axios.get(`/api/admin_page/currentpricelist/`).then(res => {
                const prices = res.data;
                let sortedPrices = orderBy(prices, 'cijenapodanu', 'asc');
                this.setState({ currentPrices: sortedPrices, isSortedAscending: true, isFetching: false });
            });
            }
            else{
            throw Error;
            }       
        })
        .catch(err => {
            this.setState({msgFail: "Dogodila se gre??ka. Poku??ajte ponovno"})
        });

        this.setState({isAddModalOpen: false});
    };

    //otvaranje/zatvaranje prozora za dodavanje novog cjenika
    toggleCjenikModal = (e) => {
        e.preventDefault();
        this.setState({isCjenikModalOpen: !this.state.isCjenikModalOpen});
    }

    //dodavanje cjenika
    addCjenik = (priceData) => {
        //headers
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify(priceData);

        axios.post('/api/admin_page/addpricelist', body, config)
        .then(res => {
            if(res.status === 200){
            this.setState({msgSuccess: "Cjenik uspje??no spremljen"});

            //ponovno dohvacanje cijena
            this.setState({ currentPrices: this.state.currentPrices, isFetching: true });
            axios.get(`/api/admin_page/currentpricelist/`).then(res => {
                const prices = res.data;
                let sortedPrices = orderBy(prices, 'cijenapodanu', 'asc');
                this.setState({ currentPrices: sortedPrices, isSortedAscending: true, isFetching: false });
            });
            }
            else{
            throw Error;
            }       
        })
        .catch(err => {
            this.setState({msgFail: "Dogodila se gre??ka. Poku??ajte ponovno"})
        });

        this.setState({isCjenikModalOpen: false});
    }

    //otvaranje prozora za promjenu cijene modela
    openChangePrice = (priceData) => {
        this.setState({changePriceData: priceData}, function () {this.setState({isChangeModalOpen: true})})
    };

    //otvaranje/zatvaranje prozora za promjenu cijene
    toggleChangeModal = (e) => {
        e.preventDefault();
        this.setState({isChangeModalOpen: !this.state.isChangeModalOpen});
    }

    //promjena cijene modela
    changePrice = (changedPrice) => {
        //headers
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify(changedPrice);

        axios.post('/api/admin_page/changemodelprice', body, config)
        .then(res => {
            if(res.status === 200){
            this.setState({msgSuccess: "Cijena uspje??no promijenjena"});

            //ponovno dohvacanje cijena
            this.setState({ currentPrices: this.state.currentPrices, isFetching: true });
            axios.get(`/api/admin_page/currentpricelist/`).then(res => {
                const prices = res.data;
                let sortedPrices = orderBy(prices, 'cijenapodanu', 'asc');
                this.setState({ currentPrices: sortedPrices, isSortedAscending: true, isFetching: false });
            });
            }
            else{
            throw Error;
            }       
        })
        .catch(err => {
            this.setState({msgFail: "Dogodila se gre??ka. Poku??ajte ponovno"})
        });

        this.setState({isChangeModalOpen: false});
    };

    componentWillUnmount() {
        // ispravlja gresku "Can't perform a React state update on an unmounted component"
        this.setState = (state,callback)=>{
            return;
        };
    }

  
    render() {
        return (
        <>
            {this.state.isChangeModalOpen ? (
            <ChangeModelPriceModal isModalOpen={this.state.isChangeModalOpen} toggleModal={this.toggleChangeModal}
            changePriceData={this.state.changePriceData} changePrice={(changedPrice) => this.changePrice(changedPrice)}/>
            ) : null}
            {this.state.isAddModalOpen ? (
            <AddModelPriceModal isModalOpen={this.state.isAddModalOpen} toggleModal={this.toggleAddModal} addNewPrice={(newPrice) => this.addNewPrice(newPrice)}/>
            ) : null}
            {this.state.isCjenikModalOpen ? (
            <AddCjenikModal isModalOpen={this.state.isCjenikModalOpen} toggleModal={this.toggleCjenikModal} addCjenik={(priceData) => this.addCjenik(priceData)}/>
            ) : null}
            <AdminPriceHeader />
            {/* Page content */}
            <Container className="mt--7" fluid>
            { this.state.msgFail ? (<UncontrolledAlert color="danger">{this.state.msgFail}</UncontrolledAlert>) : null }
            { this.state.msgSuccess ? (<UncontrolledAlert color="success">{this.state.msgSuccess}</UncontrolledAlert>) : null }
            { this.state.msgWarning ? (<UncontrolledAlert color="warning">{this.state.msgWarning}</UncontrolledAlert>) : null }
            {/* Table - trenutni */}
            <div className="col">
                <Card className="shadow">
                    <CardHeader className="border-0">
                    <Row className="align-items-center">
                            <Col xs="8">
                            <h3 className="mb-0">Trenutni cjenik ({this.state.currentDates})</h3>
                            </Col>
                            <Col className="text-right" xs="4">
                            <Button color="primary" onClick={e => this.toggleAddModal(e)} size="sm" disabled={this.state.period ? false : true}>
                            Nova cijena
                            </Button>
                            <Button color="default" onClick={e => this.toggleCjenikModal(e)} size="sm">
                            Donesi novi cjenik
                            </Button>
                            </Col>
                        </Row>             
                    </CardHeader>
                    <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                        <tr>
                            <th sortby="sifmodel" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                            <span sortby="sifmodel">??ifra modela</span>
                            <i sortby="sifmodel" className="fas fa-sort" />
                            </th>
                            <th sortby="nazivproizvodac" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                                <span sortby="nazivproizvodac">Proizvo??a??</span>
                                <i sortby="nazivproizvodac" className="fas fa-sort" />
                            </th>
                            <th sortby="nazivmodel" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                                <span sortby="nazivmodel">Model</span>
                                <i sortby="nazivmodel" className="fas fa-sort" />
                            </th>
                            <th sortby="cijenapodanu" style={{cursor: 'pointer'}} onClick={e => this.sorting(e)} scope="col">
                                <span sortby="cijenapodanu">Cijena po danu</span>
                                <i sortby="cijenapodanu" className="fas fa-sort" />
                            </th>
                        <th scope="col" />
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.isFetching ? (<><tr><td><ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} /></td></tr></>) : null}
                    {this.state.currentPrices && this.state.currentPrices.map(price => (
                    <AdminPriceTableRow key={price.sifcjenik} price={price} openChangePrice={(priceData) => this.openChangePrice(priceData)}/>))}
                    </tbody>
                    </Table>
                </Card>
            </div>

            {/* Tables - neaktivni */}
            <div className="col">
                {this.state.isNotActivePeriodFetching ? (<><ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} /></>) : null}
                {this.state.notActivePeriods && this.state.notActivePeriods.map(period => (
                    <AdminPastPricesCard key={period.period} period={period}/>))}
            </div>
  
            </Container>
        </>
        );
    }
    }

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(AdminCjenik);
