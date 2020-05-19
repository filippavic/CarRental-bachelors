//Modal za promjenu podataka podruznice

import React from 'react'
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
    Col
  } from "reactstrap";


class ChangeLocationModal extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            adresa: null,
            kucnibroj: null,
            postbroj: null,
            nazivmjesto: null,
            koddrzava: null
        };
    }

    componentDidMount(){
        this.setState({
            siflokacija: this.props.locationData.siflokacija,
            adresa: this.props.locationData.ulica,
            kucnibroj: this.props.locationData.kucnibroj,
            postbroj: this.props.locationData.pbrmjesto,
            nazivmjesto: this.props.locationData.nazivmjesto,
            koddrzava: this.props.locationData.koddrzava
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    }

    onSubmit = e => {
        e.preventDefault();
    
        //slanje podataka za promjenu podataka
        const { siflokacija, adresa, kucnibroj, postbroj, koddrzava } = this.state;
       
        var nazivmjesto = null;
        if (this.state.nazivmjesto){
            nazivmjesto = this.state.nazivmjesto.charAt(0).toUpperCase() + this.state.nazivmjesto.slice(1);
        }

        //podruznica object
        const changedLocation = {
          siflokacija,
          adresa,
          kucnibroj,
          postbroj,
          nazivmjesto,
          koddrzava
        };
    
        this.props.changeLocation(changedLocation);
      }

      componentWillUnmount() {
        // ispravlja gresku "Can't perform a React state update on an unmounted component"
        this.setState = (state,callback)=>{
            return;
        };
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
                        <h3 className="mb-0">Promjena podataka podružnice</h3>
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
                    <div className="pl-lg-4">
                        <Row>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                >
                                Ulica
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-adresa"
                                placeholder="Ulica"
                                type="text"
                                name="adresa"
                                defaultValue={this.state.adresa}
                                onChange={this.onChange}
                                />
                            </FormGroup>
                            </Col>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                >
                                Kućni broj
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-kucnibroj"
                                placeholder="Kućni broj"
                                type="number"
                                name="kucnibroj"
                                defaultValue={this.state.kucnibroj}
                                onChange={this.onChange}
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                >
                                Poštanski broj mjesta
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-postbroj"
                                placeholder="Poštanski broj mjesta"
                                type="number"
                                name="postbroj"
                                defaultValue={this.state.postbroj}
                                onChange={this.onChange}
                                />
                            </FormGroup>
                            </Col>
                            <Col lg="6">
                            <FormGroup>
                                <label
                                className="form-control-label"
                                >
                                Naziv mjesta
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-nazivmjesto"
                                placeholder="Naziv mjesta"
                                type="text"
                                name="nazivmjesto"
                                defaultValue={this.state.nazivmjesto}
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
                          Spremi promjene
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

export default ChangeLocationModal;
