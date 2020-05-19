//Modal za promjenu cijene modela

import React from 'react'
import axios from 'axios';
import Select from 'react-select';

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Modal,
    Row,
    Col,
    Alert
  } from "reactstrap";


class ChangeModelPriceModal extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            cijena: null,
            msg: null
        };
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    }

    onSubmit = e => {
        e.preventDefault();
    
        //slanje podataka za promjenu cijene modela
        const { cijena } = this.state;
       
        if (!cijena){
            this.setState({msg: 'Potrebno je unijeti cijenu'});
        }
        else{
            this.setState({msg: null});

            //price object
            const changedPrice = {
            sifcjenik: this.props.changePriceData.sifcjenik,
            cijenapodanu: cijena
            };
        
            this.props.changePrice(changedPrice);
        }

      }

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
                        <h3 className="mb-0">Promjena cijene modela</h3>
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
                    { this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null }
                    <Form role="form">
                    <div className="pl-lg-4">
                        <Row>
                            <Col lg="4">
                            <FormGroup>
                                <label className="form-control-label">Proizvođač</label>
                                <h3>{this.props.changePriceData.nazivproizvodac}</h3>
                            </FormGroup>
                            </Col>
                            <Col lg="5">
                            <FormGroup>
                                <label className="form-control-label">Model</label>
                                <h3>{this.props.changePriceData.nazivmodel}</h3>
                            </FormGroup>
                            </Col>
                            <Col lg="3">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                >
                                Cijena
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-cijena"
                                placeholder={this.props.changePriceData.cijenapodanu}
                                type="number"
                                name="cijena"
                                value={this.props.changePriceData.cijenapodanu}
                                onChange={this.onChange}
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                        </div>
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="button"
                          onClick={this.onSubmit}
                        >
                          Promijeni cijenu
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>
        )
    }
}

export default ChangeModelPriceModal;
