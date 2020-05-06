//Modal za dodavanje podruznice

import React from 'react'
import axios from 'axios';

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Form,
    Modal,
    Row,
    Col,
    Collapse
  } from "reactstrap";


import ReactLoading from 'react-loading';
var moment = require('moment');

class RentModal extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            information: [],
            isFetching: false,
            openedCollapses: [],
            late: false,
            status : ''
        };
        this.options = [];
    }


    //ucitavanje detalja o najmu
    componentDidMount(){
        this.setState({isFetching: true})
        axios.get(`/api/admin_page/rentinfo/${this.props.sifNajam}`).then(res => {
            const data = res.data;
            var now = moment();
            var planirano = moment(data.planiranidatumvrijemedo, 'DD.MM.YYYY. HH:mm');

            if(!data.datumvrijemedo && now.isAfter(planirano)){
                this.setState({late: true, status: 'Kasni'});
            }
            else if (!data.datumvrijemedo && data.datumvrijemeod){
                this.setState({late: false, status: 'Prikupljeno'});
            }
            else{
                this.setState({late: false, status: 'Nije prikupljeno'});
            }
            this.setState({ information: data, isFetching: false });
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
      };

 
    render() {
        return (
            <Modal
              className="modal-dialog-centered"
              size="lg"
              isOpen={this.props.isModalOpen}
              toggle={(e) => this.props.toggleModal(e)}
            >
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                        <h3 className="mb-0">Detalji najma br. {this.props.sifNajam}</h3>
                        </Col>
                        <Col className="text-right" xs="4">
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={(e) => this.props.toggleModal(e)}
                            >
                            <span aria-hidden={true}>×</span>
                            </button>
                        </Col>
                    </Row>
                    </CardHeader>
                  <CardBody>
                    <Form role="form">
                    <h6 className="heading-small text-muted mb-4">
                        Osnovno
                    </h6>
                    <div className="pl-lg-4">
                        <Row>
                            <Col lg="5">
                                <label
                                className="form-control-label"
                                >
                                Vozilo
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : 
                                (<h2>{this.state.information.nazivproizvodac} {this.state.information.nazivmodel}</h2>)}      
                            </Col>
                            <Col lg="3">
                                <label
                                className="form-control-label"
                                >
                                Registracija
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : 
                                (<h2>{this.state.information.registratskaoznaka}</h2>)}
                            </Col>
                            <Col lg="4">
                                <label
                                className="form-control-label"
                                >
                                Status
                                </label>
                                {this.state.isFetching ? (
                                    <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                ) : 
                                (<h2 style={this.state.late ? {color: "#ff6961"} : {}}>{this.state.status}</h2>)}
                            </Col>
                        </Row>
                        </div>

                        <Card className="card-plain" style={{marginTop: '10px'}}>
                            <CardHeader
                            role="tab"
                            onClick={() => this.collapsesToggle("collapseOne")}
                            aria-expanded={this.state.openedCollapses.includes(
                                "collapseOne"
                            )}
                            >
                            <h5 className="mb-0">O korisniku...</h5>
                            </CardHeader>
                            <Collapse
                            role="tabpanel"
                            isOpen={this.state.openedCollapses.includes("collapseOne")}
                            >
                            <CardBody>
                                <Row>
                                <Col lg="4">
                                    <label
                                    className="form-control-label"
                                    >
                                    Korisnik
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h3>{this.state.information.ime} {this.state.information.prezime}</h3>)}      
                                </Col>
                                <Col lg="5">
                                    <label
                                    className="form-control-label"
                                    >
                                    E-mail adresa
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h3>{this.state.information.mail}</h3>)}
                                </Col>
                                <Col lg="3">
                                    <label
                                    className="form-control-label"
                                    >
                                    Datum rođenja
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h3>{this.state.information.datumrod}</h3>)}
                                </Col>
                                </Row>
                            </CardBody>
                            </Collapse>
                        </Card>

                        <hr className="my-4" />
                        <h6 className="heading-small text-muted mb-4">
                        Vremena i lokacije
                        </h6>
                        <div className="pl-lg-4">
                            <Row style={{marginBottom:"20px"}}>
                                <Col lg="6">
                                    <label
                                    className="form-control-label"
                                    >
                                    Planirano vrijeme prikupljanja
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h2>{this.state.information.planiranidatumvrijemeod}</h2>)}      
                                </Col>
                                <Col lg="6">
                                    <label
                                    className="form-control-label"
                                    >
                                    Planirana lokacija prikupljanja
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h2>{this.state.information.ulicap} {this.state.information.kucnip}, {this.state.information.mjestop}</h2>)}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6">
                                    <label
                                    className="form-control-label"
                                    >
                                    Planirano vrijeme vraćanja
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h2>{this.state.information.planiranidatumvrijemedo}</h2>)}      
                                </Col>
                                <Col lg="6">
                                    <label
                                    className="form-control-label"
                                    >
                                    Planirana lokacija vraćanja
                                    </label>
                                    {this.state.isFetching ? (
                                        <ReactLoading type="bubbles" color="#8E8E93" height={'10%'} width={'10%'} />
                                    ) : 
                                    (<h2>{this.state.information.ulicad} {this.state.information.kucnid}, {this.state.information.mjestod}</h2>)}
                                </Col>
                            </Row>
                            </div>
                      <div className="text-center">
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>
        )
    }
}

export default RentModal;
